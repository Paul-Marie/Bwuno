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
    const argument: string = line[0].toLowerCase();
    const base_url: string = `${settings.encyclopedia.base_url}/${settings.encyclopedia.player_url[config.lang]}`;
    const query_string: string = `?text=${argument}&character_level_min=1&character_level_max=200`;
    console.log(`${base_url}${query_string}`);
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
                const data: any = {};
                try {
                    const soup: JSSoup = new JSSoup(answer.body);
                    const presentation: any = soup.find('div', 'ak-character-presentation');
                    const main_info: any = soup.find('div', 'ak-directories-main-infos');
                    const layers_info: any = soup.findAll('div', 'ak-panel-content');
                    data.image = `${soup.find('div', 'ak-entitylook').attrs.style.replace(/.*\(|\).*/g, '').replace(/[^/]*$/g, '')}200_350-0.png`;
                    data.name = soup.find('h1', 'ak-return-link').contents[1]._text.trim();
                    data.level = main_info.nextElement.nextElement.nextElement._text.trim().replace(/(.*)\s/g, '');
                    data.race = main_info.contents[1].previousElement._text.trim();
                    try {
                        data.title = main_info.contents[2].previousElement._text.trim();
                    } catch { };
                    data.server = server_name[config.server_id];
                    try {
                        data.presentation = presentation.contents[1].nextElement._text;
                        data.presentation_date = presentation.contents[1].previousElement._text.replace(/(.*)\s/g, '');
                    } catch {  };
                    try {
                        data.guild_name = layers_info[4].contents[1].nextElement._text.trim();
                        data.guild_link = layers_info[4].contents[1].attrs.href;
                        data.guild_image = `${layers_info[4].contents[1].previousElement.attrs.style.replace(/.*\(|\).*/g, '').replace(/[^/]*$/g, '')}128_128-0.png`;
                        data.guild_level = layers_info[4].contents[3].nextElement._text.trim().replace(/(.*)\s/g, '');
                        data.guild_members = layers_info[4].contents[5].nextElement._text.trim().replace(/\s(.*)/g, '');
                    } catch { };
                    try {
                        data.alliance_image = layers_info[5].contents[1].previousElement.attrs.style.replace(/.*\(|\).*/g, '');
                        data.alliance_link = layers_info[5].contents[1].attrs.href;
                        data.alliance_name = layers_info[5].contents[1].nextElement._text.trim();
                        data.alliance_guilds_number = layers_info[5].contents[3].nextElement._text.trim().replace(/\s(.*)/g, '');
                        data.alliance_members = layers_info[5].contents[4].nextElement._text.trim().replace(/\s(.*)/g, '');
                    } catch { };
                    try {
                        data.success = layers_info[6].contents[0].contents[1].contents[0].nextElement.contents[0].nextElement.nextElement.nextElement._text.trim();
                        data.success_last_time = layers_info[6].contents[1].contents[1].nextElement._text.trim().replace(/(.*)il y a/g, '').replace(/:/g, '').replace(/ago/g, '').trim();
                        data.success_last_name = layers_info[6].contents[1].contents[3]._text.trim();
                    } catch { };
                    try {
                        data.marry_name = layers_info[7].contents[2].nextElement._text.trim();
                        data.marry_link = `${base_url}/${layers_info[7].contents[2].attrs.href}`;
                    } catch { };
                    try {
                        data.jobs = layers_info[8].nextElement.contents.map((element: any) => {
                            return {
                                level: element.contents[0].contents[0].contents[1].contents[1].nextElement._text.trim(),
                                name: element.contents[0].contents[0].contents[1].contents[0].nextElement.nextElement._text.trim()
                            }
                        });
                    } catch { };
                    data.link = link;
                    console.log(data)
                    //message.channel.send(await createGuildEmbed(data, config.lang));
                } catch (err) {
                    console.log(err)
                }
            } else
                message.channel.send(await createGuildErrorEmbed(config.lang, argument, `${base_url}${query_string}`, 0));
        } catch (err) {
            message.channel.send(await createGuildErrorEmbed(config.lang, argument, `${base_url}${query_string}`, 0));
        }
    }
}
