import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
import { createPlayerEmbed, createErrorEmbed } from "../utils/embed";
import { Message } from 'discord.js';
import { format } from 'format';
import JSSoup from 'jssoup'; 
import * as request from 'async-request';

const server_name: string[] = [undefined, "Oshimo", "Terra Cogita", "Herdegrize"]

// TODO To optimize / rework entirely
// Display all player informations
export const whois = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length < 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}whois [pseudo]`));
    line.shift();
    const argument: string = line[0].toLowerCase();
    const base_url: string = `${settings.encyclopedia.base_url}/${settings.encyclopedia.player_url[config.lang]}`;
    const query_string: string = `?text=${argument}&character_level_min=1&character_level_max=200`;
    const response: any = await request(`${base_url}${query_string}`);
    if (response.statusCode === 200) {
        try {
            const search: JSSoup = new JSSoup(response.body);
            const search_result: any = search.findAll('tr');
            search_result.shift();
            let filtered_result = await search_result.filter((result: any) => {
                return result.contents[1].nextElement.nextElement._text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                    == argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                    && result.contents[5].nextElement._text === server_name[config.server_id]
            });
            if (!filtered_result.length)
                filtered_result = await search_result.filter((result: any) => {
                    return argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") ===
                        result.contents[1].nextElement.nextElement._text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                });
            const link: string = `${settings.encyclopedia.base_url}${filtered_result[0].contents[1].nextElement.attrs.href}`;
            const answer: any = await request(link);
            if (answer.statusCode === 200) {
                const data = await formateData(answer, base_url, link, config.lang);
                message.channel.send(await createPlayerEmbed(data, config.lang));
            } else if (answer.statusCode === 410) {
                filtered_result = await search_result.filter((result: any) => {
                    return argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") ===
                        result.contents[1].nextElement.nextElement._text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                });
                const link: string = `${settings.encyclopedia.base_url}${filtered_result[0].contents[1].nextElement.attrs.href}`;
                const answer: any = await request(link);
                const data = await formateData(answer, base_url, link, config.lang);
                message.channel.send(await createPlayerEmbed(data, config.lang));
            } else
                message.channel.send(await createErrorEmbed(config.lang, `${base_url}${query_string}`, 2));
        } catch (err) {
            message.channel.send(await createErrorEmbed(config.lang, `${base_url}${query_string}`, 2));
        }
    }
}

// Parse all page informations and return an epured object
const formateData = async (answer: any, base_url: string, link: string, lang: number) => {
    const data: any = {};
    const soup: JSSoup = new JSSoup(answer.body);
    const main_info: any = soup.find('div', 'ak-directories-main-infos');
    // TODO may change image's orientation ?
    data.image = `${soup.find('div', 'ak-entitylook').attrs.style.replace(/.*\(|\).*/g, '').replace(/[^/]*$/g, '')}200_350-0.png`;
    data.name = soup.find('h1', 'ak-return-link').contents[1]._text.trim();
    data.level = main_info.nextElement.nextElement.nextElement._text.trim().replace(/(.*)\s/g, '');
    data.race = main_info.contents[1].previousElement._text.trim();
    data.server = soup.find('span', 'ak-directories-server-name').nextElement._text.trim();
    try {
        data.title = soup.find('span', 'ak-directories-grade').nextElement._text.trim();
    } catch { };
    try {
        data.presentation = soup.find('div', 'ak-character-presentation').contents[1].nextElement._text.trim();
    } catch { };
    try {
        data.guild_emblem = `${soup.find('div', 'ak-character-illu').contents[0].attrs.style.replace(/.*\(|\).*/g, '').replace(/[^/]*$/g, '')}128_128-0.png`;
        data.guild_link = `${settings.encyclopedia.base_url}${soup.find('a', 'ak-infos-guildname').attrs.href}`;
        data.guild_name = soup.find('a', 'ak-infos-guildname').nextElement._text.trim();
        data.guild_level = soup.find('span', 'ak-infos-guildlevel').nextElement._text.trim().replace(/(.*)\s/g, '');
        data.guild_members = soup.find('span', 'ak-infos-guildmembers').nextElement._text.trim().replace(/\s(.*)/g, '');
        data.guild_role = await getGuildRole(data.guild_link, data.name, lang);
    } catch { };
    try {
        data.alliance_emblem = soup.find('div', 'ak-infos-alliance-illu').contents[0].attrs.style.replace(/.*\(|\).*/g, '');
        data.alliance_link = `${settings.encyclopedia.base_url}${soup.find('a', 'ak-infos-alliancename').attrs.href}`;
        data.alliance_name = soup.find('a', 'ak-infos-alliancename').nextElement._text.trim();
        data.alliance_guilds_number = soup.find('span', 'ak-infos-allianceguild').nextElement._text.trim().replace(/\s(.*)/g, '');
        data.alliance_members = soup.find('span', 'ak-infos-allianceguild').nextElement.nextElement.nextElement._text.trim().replace(/\s(.*)/g, '');
    } catch { };
    try {
        data.success_percent = soup.find('div', 'ak-progress-bar-text').nextElement._text.trim();
        // TODO erase `as unlocked`
        data.success_last_name = soup.find('div', 'ak-last-achievement').contents[3]._text.trim();//.nextElement._text.trim();
        data.success_last_time = soup.find('div', 'ak-last-achievement').contents[1].nextElement._text.trim().replace(/(.*)il y a/g, '').replace(/:/g, '').replace(/ago/g, '').trim();
    } catch { };
    try {
        data.marry_name = soup.find('a', 'ak-infos-spousename').nextElement._text.trim();
        data.marry_link = `${base_url}/${soup.find('a', 'ak-infos-spousename').attrs.href}`;
    } catch { };
    try {
        const jobs: JSSoup = soup.findAll('div', 'ak-title');
        jobs.pop()
        data.jobs = jobs.map((element: any) => {
            return {
                level: element.nextElement.contents[0].nextElement.nextElement._text.trim(),
                name: element.nextElement.nextElement._text.trim()
            }
        });
    } catch { };
    try {
        data.alignment_name = soup.find('span', 'ak-alignment-name').nextElement._text.trim();
        data.alignment_level = soup.find('span', 'ak-alignment-level').nextElement._text.trim();
    } catch { };
    try {
        data.characteristics_link = `https://www.dofus-touch.com/fr/mmorpg/communaute/annuaires/pages-persos/${link.replace(/(.*\/)*/, '')}/caracteristiques`;
        const ack: any = await request(data.characteristics_link);
        if (ack.statusCode === 200) {
            const search: JSSoup = new JSSoup(ack.body);
            data.characteristics_element = search.findAll('tr', "ak-bg-odd").concat(search.findAll('tr', "ak-bg-even")).map((elem: any) => {
                if (elem.contents[3])
                    return {
                        name: elem.contents[1].nextElement.contents[0]._text,
                        base: elem.contents[3].contents[0]._text,
                        total: elem.contents[4].contents[0]._text
                    };
            }).filter((elem: any) => elem);
        }
    } catch { };
    try {
        data.success = soup.find('span', 'ak-score-text').contents[0]._text.trim();
        data.ladder = soup.find('tbody').contents.map((element: any) => {
            return {
                text: element.contents[0].contents[0]._text.trim(),
                xp: element.contents[1].contents[0]._text,
                koli: element.contents[2].contents[0]._text,
                success: element.contents[3].contents[0]._text
            };
        });
        data.xp = soup.find('div', 'ak-total-xp').contents[1].nextElement._text.trim() || '-';
        data.koli = soup.find('div', 'ak-total-kolizeum').contents[1].nextElement._text.trim() || '-';
    } catch { };
    data.link = link;
    return data;
}

// Parse each guild member's page until find the required player and return his role
const getGuildRole = async (link: string, name: string, lang: number, page: number = 1) => {
    const guild_answer: any = await request(`${link}/memb${["res", "ers"][lang]}?page=${page}`);
    const guild_page: JSSoup = new JSSoup(guild_answer.body);
    const guild_content = guild_page.findAll('tr', 'tr_class');
    const guild_role = guild_content.map((element: any) => {
        return {
            name: element.contents[0].contents[1].contents[0]._text,
            grade: element.contents[3].contents[0]._text
        }
    }).filter((elem: any) => elem.name === name)[0];
    if (!guild_role)
        return await getGuildRole(link, name, lang, page + 1);
    return guild_role.grade;
}
