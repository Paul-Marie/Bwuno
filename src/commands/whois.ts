import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
//import fetch from 'node-fetch';
import axios, { AxiosResponse } from 'axios';
import { createPlayerEmbed, createErrorEmbed } from "../utils/embed";
import { Message } from 'discord.js';
import { format } from 'format';
import JSSoup from 'jssoup'; 
import * as request from 'async-request';

const fetch = require('node-fetch');
const https = require('https');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const server_id: any = { "o": 403, "t": 404, "h": 405 };

// TODO To optimize / rework entirely
// Display all player informations
export const whois = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length < 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}whois [pseudo]`));
    line.shift();
    const argument: string = line[0].toLowerCase();
    const server: string = server_id[line[1]?.toLowerCase()[0]] || config.server_id + 402;
    const base_url: string = `${settings.encyclopedia.base_url}/${settings.encyclopedia.player_url[config.lang]}`;
    const query_string: string = `?text=${argument}&character_homeserv[]=${server}&character_level_min=1&character_level_max=200`;
    //const response: any = await request(`${base_url}${query_string}`);
    /*const response: any = await axios.get(`${base_url}${query_string}`, {
        headers: {
            'origin': 'file://',
            'accept': '*\/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US',
            'content-type': 'application/json',
            'authority': 'earlyproxy.touch.dofus.com',
            'user-agent': 'Mozilla/5.0 (Linux; Android 7.0; Nexus 5X Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.106 Mobile Safari/537.36'
        }
    });*/

    /*const responseS: any = await fetch(`${base_url}${query_string}`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*\/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "0",
            "Pragma": "no-cache",
            "Cookie": 'LANG=fr; ALREADY_VISITED=1; PRIV={"v1":{"fbtr":{"c":"y","ttl":19063},"ggan":{"c":"y","ttl":19063},"otad":{"c":"y","ttl":19063},"fbok":{"c":"y","ttl":19063},"ggpl":{"c":"y","ttl":19063},"twtr":{"c":"y","ttl":19063},"dsrd":{"c":"y","ttl":19063},"pwro":{"c":"y","ttl":19063},"ytbe":{"c":"y","ttl":19063},"twch":{"c":"y","ttl":19063},"gphy":{"c":"y","ttl":19063},"ggmp":{"c":"y","ttl":19063}}}; CNIL=1; _ga=GA1.1.964384916.1612526760; _gid=GA1.1.889149667.1614210961; SID=CBB73A2287BDBDAC91C2B5C8FC360000; _gat=1',
            "Cache-Control": "no-cache"
        },
        "agent": httpsAgent,
        "method": "GET",
        "mode": "cors",
    });*/

    /*const response = await fetch(`${base_url}${query_string}`, {
        "credentials": "include",
        "headers": {
            Host: "www.dofus-touch.com",
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*\/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            Cookie: 'zbot0=1598348356466; PRH=2; announce=MzU1; LANG=fr; PRIV={"v1":{"ytbe":{"c":"y","ttl":18889},"fbtr":{"c":"y","ttl":18889},"ggan":{"c":"y","ttl":18889},"otad":{"c":"y","ttl":18889},"fbok":{"c":"y","ttl":18889},"ggpl":{"c":"y","ttl":18889},"twtr":{"c":"y","ttl":18889},"dsrd":{"c":"y","ttl":18889},"pwro":{"c":"y","ttl":18889},"twch":{"c":"y","ttl":18889},"gphy":{"c":"y","ttl":18889},"ggmp":{"c":"y","ttl":18889}}}; CNIL=1; _ga=GA1.1.1441471276.1597520844; _fbp=fb.1.1597520844332.440417564; __cfduid=d8a0d850a111f17dcc87174cafc9718a41613413619; DFSTCHAPP=1; _gid=GA1.1.1942105426.1614206345; SID=CBB73A2287BDBDAC91C2B5C8FC360000; size=96; display=table; __cf_bm=83427ab9b57cc69a2c5392ebae2cd332c649afe2-1614294846-1800-AeBys95tua25BHlgvSKtaESZR1o9gsvyWOEh3YrSibCOwgY2+KJyeIz7FdK0Gi/IjQXzZKbrRwqWMv5A19w5nQg=; _gat=1',
            "Upgrade-Insecure-Requests": 1,
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "method": "GET",
        "agent": httpsAgent,
        "mode": "cors"
    });*/


    /*const response = await fetch("https://www.dofus-touch.com/fr/mmorpg/communaute/annuaires/pages-persos?text=lethargi&character_level_min=20&character_level_max=200&_pjax=div.ak-main-page", {
        "credentials": "include",
        "headers": {
            "Host": "www.dofus-touch.com",
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
            "Accept": "text/html, *\/*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-PJAX": "true",
            "X-PJAX-Container": "div.ak-main-page",
            "X-Requested-With": "XMLHttpRequest",
            "Pragma": "no-cache",
            "Cookie": 'zbot0=1598348356466; PRH=2; announce=MzU1; LANG=fr; PRIV={"v1":{"ytbe":{"c":"y","ttl":18889},"fbtr":{"c":"y","ttl":18889},"ggan":{"c":"y","ttl":18889},"otad":{"c":"y","ttl":18889},"fbok":{"c":"y","ttl":18889},"ggpl":{"c":"y","ttl":18889},"twtr":{"c":"y","ttl":18889},"dsrd":{"c":"y","ttl":18889},"pwro":{"c":"y","ttl":18889},"twch":{"c":"y","ttl":18889},"gphy":{"c":"y","ttl":18889},"ggmp":{"c":"y","ttl":18889}}}; CNIL=1; _ga=GA1.1.1441471276.1597520844; _fbp=fb.1.1597520844332.440417564; __cfduid=d8a0d850a111f17dcc87174cafc9718a41613413619; DFSTCHAPP=1; _gid=GA1.1.1942105426.1614206345; SID=CBB73A2287BDBDAC91C2B5C8FC360000; size=96; display=table; __cf_bm=7c7dfcd2cf052df6d75891c85cc4fb488067b114-1614296647-1800-AZqv+x9ePXvZc0D1ZvTaWloP2umXmzbG9Ede2AFv5peJmTAsoLwfKz4fJXQsDPjs4Nulv3zEz4IWUSvvpurGA04=; _gat=1; _gali=text_0',
            "Cache-Control": "no-cache"
        },
        "referrer": "https://www.dofus-touch.com/fr/mmorpg/communaute/annuaires/pages-persos",
        "method": "GET",
        "agent": httpsAgent,
        "mode": "cors"
    });*/

    const response = await axios({
        "url": "https://www.dofus-touch.com/fr/mmorpg/communaute/annuaires/pages-persos?text=lethargi&character_level_min=20&character_level_max=200",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Upgrade-Insecure-Requests": "1",
            "Pragma": "no-cache",
            "TE": "Trailers",
            "Connection": "keep-alive",
            "Cookie": 'zbot0=1598348356466; PRH=2; announce=MzU1; LANG=fr; PRIV={"v1":{"ytbe":{"c":"y","ttl":18889},"fbtr":{"c":"y","ttl":18889},"ggan":{"c":"y","ttl":18889},"otad":{"c":"y","ttl":18889},"fbok":{"c":"y","ttl":18889},"ggpl":{"c":"y","ttl":18889},"twtr":{"c":"y","ttl":18889},"dsrd":{"c":"y","ttl":18889},"pwro":{"c":"y","ttl":18889},"twch":{"c":"y","ttl":18889},"gphy":{"c":"y","ttl":18889},"ggmp":{"c":"y","ttl":18889}}}; CNIL=1; _ga=GA1.1.1441471276.1597520844; _fbp=fb.1.1597520844332.440417564; __cfduid=d8a0d850a111f17dcc87174cafc9718a41613413619; DFSTCHAPP=1; _gid=GA1.1.1942105426.1614206345; SID=CBB73A2287BDBDAC91C2B5C8FC360000; size=96; display=table; __cf_bm=b66b6fc2cadd6bfa54ecc8ec3507a411f60a85a1-1614297547-1800-AURRZEx+DK5mTfVvPFK1JbZp7/N0e6PyoaLc4OrTW6oovdyNsxHEy1i5B5zL0TDleGUQGNtJB5Rhar0+e4G0C4g=',
            "Host": "www.dofus-touch.com",
            "Cache-Control": "no-cache"
        },
        "method": "GET",
    });
    
    console.log(response.status);
    if (response.status === 200) {
        try {
            const link = await getPlayerPage(`${base_url}${query_string}`, argument, 1);
            const answer: any = await request(link);
            if (answer.statusCode === 200) {
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

// Parse each player's page until find the required player and return his page
const getPlayerPage = async (link: string, name: string, page: number = 1): Promise<string> => {
    const answer: any = await request(`${link}?page=${page}`);
    const list: JSSoup = new JSSoup(answer.body);
    const content = list.findAll('tr');
    content.shift();
    const filtered_result = await content.filter((result: any) => {
        return result.contents[1].nextElement.nextElement._text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            == name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    });
    if (!filtered_result.length && page < 10)
        return await getPlayerPage(link, name, page + 1);
    return `${settings.encyclopedia.base_url}${filtered_result[0].contents[1].nextElement.attrs.href}`;
}
