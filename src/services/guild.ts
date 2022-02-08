import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
import { createGuildEmbed, createErrorEmbed } from "../utils/embed";
import { Message, MessageOptions } from 'discord.js';
import { format } from 'format';
import JSSoup from 'jssoup';
import * as request from 'async-request';

// Send an Embed containing all guild's information
export const guild = async (message: Message, line: string[], config: any): Promise<string | MessageOptions> => {
  if (line.length < 2)
    return format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}guild [name]`);
  line.shift();
  const argument:     string = line.join('+').toLowerCase();
  const base_url:     string = `${settings.encyclopedia.base_url}/${settings.encyclopedia.guild_url[config.lang]}`;
  const query_string: string = `?text=${argument}&guild_server_id%5B%5D=${config.server_id + 402}&guild_level_min=1&guild_level_max=200`
  const response:        any = await request(`${base_url}${query_string}`);
  if (response.statusCode === 200) {
    try {
      // TODO: get rid of the try/catch forest with ? operator
      const search: JSSoup = new JSSoup(response.body);
      const link:   string = `${settings.encyclopedia.base_url}${search.find('td').nextElement.attrs.href}`;
      const answer:    any = await request(link);
      if (answer.statusCode === 200) {
        const soup:    JSSoup = new JSSoup(answer.body);
        const data:       any = { link };
        const alliance:   any = soup.find('div', 'ak-character-alliances');
        const main_info:  any = soup.find('div', 'ak-directories-main-infos');
        const members:    any = soup.findAll('div', 'ak-cell');
        const history:    any = soup.findAll('div', 'ak-title');
        data.guild_name       = soup.find('h1').contents[1]._text.trim();
        data.icon             = soup.find('div', 'ak-emblem').attrs.style.replace(/.*\(|\).*/g, '').replace(/[^/]*$/g, '') + "128_128-0.png";
        data.level            = main_info.nextElement.nextElement.nextElement._text.trim().replace(/(.*)\s/g, '');
        data.member_number    = main_info.contents[1].previousElement._text.trim().replace(/\s(.*)/g, '');
        data.server           = soup.find('span', 'server').nextElement.nextElement.contents[0]._text.trim();
        data.created_at       = soup.find('span', 'ak-directories-creation-date').contents[0]._text.trim().replace(/(.*)\s/g, '')
        try {
          data.alliance_emblem        = alliance.contents[0].nextElement.attrs.style.replace(/.*\(|\).*/g, '');
          data.alliance_name          = alliance.contents[1].nextElement.contents[0]._text.trim();
          data.alliance_guilds_number = alliance.contents[1].contents[2].nextElement._text.trim().replace(/\s(.*)/g, '');
          data.alliance_members       = alliance.contents[1].contents[4].nextElement._text.trim().replace(/\s(.*)/g, '');
        } catch { };
        data.pillars = members.map((element: any) => ({
          name: element.contents[0].contents[0]._text.trim(),
          role: element.contents[1].contents[0]._text.trim(),
          lvl:  element.contents[2].contents[0]._text.trim().replace(/(.*)\s/g, '')
        }));
        data.activities = history.map((element: any) => {
          try {
            return {
              time:   element.contents[0].contents[0]._text.replace(/(.*)il y a/g, '').replace(/:/g, '').replace(/ago/g, '').trim(),
              name:   element.contents[1].nextElement._text.trim(),
              action: element.contents[1].nextElement.nextElement._text.trim()
            };
          } catch (err) {
            return {
              time:   element.contents[0].contents[0]._text.replace(/(.*)il y a/g, '').replace(/:/g, '').replace(/ago/g, '').trim(),
              action: element.contents[0].nextElement.nextElement._text.replace(/\s*([.])/g, '').trim() + '.'
            };
          }
        }).slice(0, 15);
        return { embeds: [await createGuildEmbed(data, config.lang)] };
      } else
        return { embeds: [await createErrorEmbed(config.lang, `${base_url}${query_string}`, 0)] };
    } catch (err) {
      console.log(err);
      return { embeds: [await createErrorEmbed(config.lang, `${base_url}${query_string}`, 0)] };
    }
  } else
    return format(sentences[config.lang].ERROR_FORBIDEN);
}
