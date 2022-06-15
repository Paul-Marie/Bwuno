import * as sentences                         from "../../resources/language.json";
import * as settings                          from "../../resources/config.json";
import { createGuildEmbed, createErrorEmbed } from "../utils/embed";
import { CommandInteraction                 } from 'discord.js';
import { format                             } from 'format';
import JSSoup                                 from 'jssoup';

// Send an Embed containing all guild's information
export const guild = async (command: CommandInteraction, config: any): Promise<void> => {
  await command.deferReply();
  const name:          string = command.options.getString("name")?.toLowerCase();
  const server:        number = command.options.getInteger("serveur");
  const level:         number = command.options.getInteger("level");
  const base_url:      string = `${settings.encyclopedia.base_url}/${settings.encyclopedia.guild_url[config.lang]}`;
  const query_string:  string = `?text=${name}&guild_server_id%5B%5D=${server ?? ''}&guild_level_min=${level ?? '1'}&guild_level_max=${level ?? "200"}`
  const response:    Response = await fetch(`${base_url}${query_string}`);
  if (response.status === 200) {
    try {
      const search:    JSSoup = new JSSoup(await response.text());
      const link:      string = `${settings.encyclopedia.base_url}${search.find('td')?.nextElement?.attrs?.href}`;
      const answer:  Response = await fetch(link);
      if (answer.status === 200) {
        const soup:    JSSoup = new JSSoup(await answer.text());
        const data:       any = { link };
        const alliance:   any = soup.find('div', 'ak-character-alliances');
        const main_info:  any = soup.find('div', 'ak-directories-main-infos');
        const members:    any = soup.findAll('a', 'ak-guild-member');
        const history:    any = soup.findAll('div', 'ak-title');
        data.guild_name       = soup.find('h1')?.contents?.[1]?._text?.trim();
        data.icon             = soup.find('div', 'ak-emblem')?.attrs?.style?.replace(/.*\(|\).*/g, '')?.replace(/[^/]*$/g, '') + "128_128-0.png";
        data.level            = main_info?.nextElement?.nextElement?.nextElement?._text?.trim()?.replace(/(.*)\s/g, '');
        data.member_number    = main_info?.contents?.[1]?.previousElement?._text?.trim()?.replace(/\s(.*)/g, '');
        data.server           = soup.find('span', 'server')?.nextElement?.nextElement?.contents?.[0]?._text?.trim();
        data.created_at       = soup.find('span', 'ak-directories-creation-date')?.contents?.[0]?._text?.trim()?.replace(/(.*)\s/g, '')
        data.alliance_emblem  = alliance?.contents?.[0]?.nextElement?.attrs?.style?.replace(/.*\(|\).*/g, '');
        data.alliance_name    = alliance?.contents?.[1]?.nextElement?.contents?.[0]?._text?.trim();
        data.alliance_number  = alliance?.contents?.[1]?.contents?.[2]?.nextElement?._text?.trim()?.replace(/\s(.*)/g, '');
        data.alliance_members = alliance?.contents?.[1]?.contents?.[4]?.nextElement?._text?.trim()?.replace(/\s(.*)/g, '');
        data.pillars = members.map(({ contents, previousElement }) => ({
          link: previousElement.nextElement.attrs.href,
          name: contents?.[3]?.contents?.[0]?.contents?.[1]?.contents?.[0]?.contents?.[0]?._text?.trim(),
          role: contents?.[3]?.contents?.[0]?.contents?.[1]?.contents?.[1]?.contents?.[0]?._text?.trim(),
          lvl:  contents?.[3]?.contents?.[0]?.contents?.[1]?.contents?.[2]?.contents?.[0]?._text?.trim()?.replace(/(.*)\s/g, '')
        }));
        data.activities = history.map(({ contents }) => ({
          name:   contents?.[1]?.nextElement?._text?.trim(),
          time:   contents?.[0]?.contents?.[0]._text?.replace(/(.*)il y a/g, '')?.replace(/:/g, '')?.replace(/ago/g, '')?.trim()
                  ?? contents?.[0]?.contents?.[0]?._text?.replace(/(.*)il y a/g, '')?.replace(/:/g, '')?.replace(/ago/g, '')?.trim(),
          action: contents?.[1]?.nextElement?.nextElement?._text?.trim()
                  ?? contents?.[0]?.nextElement?.nextElement?._text?.replace(/\s*([.])/g, '')?.trim() + '.'
        })).slice(0, 15);
        await command.editReply({ embeds: [await createGuildEmbed(data, config.lang)] });
      } else
      await command.editReply({ embeds: [await createErrorEmbed(config.lang, `${base_url}${query_string}`, 0)] });
    } catch {
      await command.editReply({ embeds: [await createErrorEmbed(config.lang, `${base_url}${query_string}`, 0)] });
    }
  } else
    return format(sentences[config.lang].ERROR_FORBIDEN);
}
