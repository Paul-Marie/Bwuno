import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
import { createGuildEmbed, createGuildErrorEmbed } from "../utils";
import { Message } from 'discord.js';
import { format } from 'format';
import JSSoup from 'jssoup'; 
import * as request from 'async-request';

const server_name: string[] = [undefined, "Oshimo", "Terra Cogita", "Herdegrize"]

// TODO To optimize / rework entirely
export const whois = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length < 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}whois [pseudo]`));
    line.shift();
    const argument: string = line.join('+').toLowerCase();
    const base_url: string = `${settings.encyclopedia.base_url}/${settings.encyclopedia.player_url[config.lang]}`;
    const query_string: string = `?text=${argument}&character_level_min=1&character_level_max=200`;
    console.log(`${base_url}${query_string}`);
    const response: any = await request(`${base_url}${query_string}`);
    if (response.statusCode === 200) {
        try {
            const search: JSSoup = new JSSoup(response.body);
            const search_result: any = search.findAll('tr');//.nextElement.attrs.href}`;
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
                const data: any = {};
                const soup: JSSoup = new JSSoup(answer.body);
                const presentation: any = soup.find('div', 'ak-character-presentation');
                const main_info: any = soup.find('div', 'ak-directories-main-infos');
                data.name = soup.find('h1', 'ak-return-link').contents[1]._text.trim();
                data.level = main_info.nextElement.nextElement.nextElement._text.trim();
                data.race = main_info.contents[1].previousElement._text.trim();
                data.title = main_info.contents[2].previousElement._text.trim();
                data.server = server_name[config.server_id];
                data.presentation = presentation.contents[1].nextElement._text;
                data.presentation_date = presentation.contents[1].previousElement._text.replace(/(.*)\s/g, '');
                data.link = link;
                console.log(data)
                return
                /*const members: any = soup.findAll('div', 'ak-cell');
                const history: any = soup.findAll('div', 'ak-title');
                data.link = link;
                data.guild_name = soup.find('h1').contents[1]._text.trim();
                //data.icon = soup.find('div', 'ak-emblem').attrs.style.replace(/.*\(|\).*///g, '').replace(/[^/]*$/g, '') + "128_128-0.png";
                //data.level = main_info.nextElement.nextElement.nextElement._text.trim().replace(/(.*)\s/g, '');
                //data.member_number = main_info.contents[1].previousElement._text.trim().replace(/\s(.*)/g, '');
                //data.server = soup.find('span', 'server').nextElement.nextElement.contents[0]._text.trim();
                //data.created_at = soup.find('span', 'ak-directories-creation-date').contents[0]._text.trim().replace(/(.*)\s/g, '')
                //data.alliance_emblem = alliance.contents[0].nextElement.attrs.style.replace(/.*\(|\).*/g, '');
                /*data.alliance_name = alliance.contents[1].nextElement.contents[0]._text.trim();
                data.alliance_guilds_number = alliance.contents[1].contents[2].nextElement._text.trim().replace(/\s(.*)/g, '');
                data.alliance_members = alliance.contents[1].contents[4].nextElement._text.trim().replace(/\s(.*)/g, '');
                data.pillars = members.map((element: any) => {
                    return {
                        name: element.contents[0].contents[0]._text.trim(),
                        role: element.contents[1].contents[0]._text.trim(),
                        lvl:  element.contents[2].contents[0]._text.trim().replace(/(.*)\s/g, '')
                    };
                });
                data.activities = history.map((element: any) => {
                    try {
                        return {
                            time: element.contents[0].contents[0]._text.replace(/(.*)il y a/g, '').replace(/:/g, '').replace(/ago/g, '').trim(),
                            name: element.contents[1].nextElement._text.trim(),
                            action: element.contents[1].nextElement.nextElement._text.trim()
                        };
                    } catch (err) {
                        return {
                            time: element.contents[0].contents[0]._text.replace(/(.*)il y a/g, '').replace(/:/g, '').replace(/ago/g, '').trim(),
                            action: element.contents[0].nextElement.nextElement._text.replace(/\s*([.])/g, '').trim() + '.'
                        };
                    }
                }).slice(0, 15);*/
                console.log(data);
                message.channel.send(await createGuildEmbed(data, config.lang));
            } else
                message.channel.send(await createGuildErrorEmbed(config.lang, argument, `${base_url}${query_string}`, 0));
        } catch (err) {
            message.channel.send(await createGuildErrorEmbed(config.lang, argument, `${base_url}${query_string}`, 0));
        }
    }
}
