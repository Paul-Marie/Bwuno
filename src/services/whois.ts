import * as sentences                          from "../../resources/language.json";
import * as settings                           from "../../resources/config.json";
import { createPlayerEmbed, createErrorEmbed } from "../utils/embed";
import { CommandInteraction                  } from 'discord.js';
import { format                              } from 'format';
import JSSoup                                  from 'jssoup';

// Display all player informations
export const whois = async (command: CommandInteraction, config: any): Promise<void> => {
  await command.deferReply();
  const pseudo:       string = command.options.getString("pseudo")?.toLowerCase();
  const level:        number = command.options.getInteger("level");
  const server:       number = command.options.getInteger("serveur");
  const base_url:     string = `${settings.encyclopedia.base_url}/${settings.encyclopedia.player_url[config.lang]}`;
  const query_string: string = `?text=${pseudo}&character_homeserv[]=${server ?? ''}&character_level_min=${level ?? "1"}&character_level_max=${level ?? "200"}`;
  try {
    const link:       string = await getPlayerPage(`${base_url}${query_string}`, pseudo);
    const answer:   Response = await fetch(`${settings.encyclopedia.base_url}${link}`);
    if (answer.status === 200) {
      const data = await formateData(await answer.text(), `${settings.encyclopedia.link_url}${link}`, config.lang);
      await command.editReply({ embeds: [await createPlayerEmbed(data, config.lang)] });
    } else
      await command.editReply({ embeds:
        [ await createErrorEmbed(config.lang, `${settings.encyclopedia.link_url}/${settings.encyclopedia.player_url[config.lang]}${query_string}`, 2) ]
      });
  } catch (err) {
    await command.editReply(!err ? format(sentences[config.lang].ERROR_FORBIDEN) : {
      embeds: [await createErrorEmbed(config.lang, `${settings.encyclopedia.link_url}/${settings.encyclopedia.player_url[config.lang]}${query_string}`, 2)]
    });
  }
}

// Parse all page informations and return an epured object
const formateData = async (answer: string, link: string, lang: number) => {
  const data:       any = {};
  const soup:    JSSoup = new JSSoup(answer);
  const jobs:    JSSoup = soup.findAll('div', 'ak-title')?.reverse()?.splice(1)?.reverse();
  const main_info:  any = soup.find('div', 'ak-directories-main-infos');
  data.image            = `${soup.find('div', 'ak-entitylook').attrs.style.replace(/.*\(|\).*/g, '').replace(/[^/]*$/g, '')}200_350-0.png`;
  data.name             = soup.find('h1', 'ak-return-link').contents[1]._text.trim();
  data.level            = main_info.nextElement.nextElement.nextElement._text.trim().replace(/(.*)\s/g, '');
  data.race             = main_info.contents[1].previousElement._text.trim();
  data.server           = soup.find('span', 'ak-directories-server-name').nextElement._text.trim();
  data.title            = soup.find('span', 'ak-directories-grade')?.nextElement?._text?.trim();
  data.presentation     = soup.find('div', 'ak-character-presentation')?.contents?.[1]?.nextElement?._text?.trim();
  data.guild_name       = soup.find('a', 'ak-infos-guildname')?.nextElement?._text?.trim();
  data.alliance_name    = soup.find('a', 'ak-infos-alliancename')?.nextElement?._text?.trim();
  data.guild_role       = data.guild_name    && await getGuildRole(`${settings.encyclopedia.base_url}${soup.find('a', 'ak-infos-guildname')?.attrs?.href}`, data.name, lang);
  data.guild_emblem     = data.guild_name    && `${soup.find('div', 'ak-character-illu')?.contents?.[0]?.attrs?.style?.replace(/.*\(|\).*/g, '')?.replace(/[^/]*$/g, '')}128_128-0.png`;
  data.guild_link       = data.guild_name    && `${settings.encyclopedia.link_url}${soup.find('a', 'ak-infos-guildname')?.attrs?.href}`;
  data.guild_level      = data.guild_name    && soup.find('span', 'ak-infos-guildlevel')?.nextElement?._text?.trim()?.replace(/(.*)\s/g, '');
  data.guild_members    = data.guild_name    && soup.find('span', 'ak-infos-guildmembers')?.nextElement?._text?.trim()?.replace(/\s(.*)/g, '');
  data.alliance_emblem  = data.alliance_name && soup.find('div', 'ak-infos-alliance-illu')?.contents?.[0]?.attrs?.style?.replace(/.*\(|\).*/g, '');
  data.alliance_link    = data.alliance_name && `${settings.encyclopedia.link_url}${soup.find('a', 'ak-infos-alliancename')?.attrs?.href}`;
  data.alliance_number  = data.alliance_name && soup.find('span', 'ak-infos-allianceguild')?.nextElement?._text?.trim()?.replace(/\s(.*)/g, '');
  data.alliance_member  = data.alliance_name && soup.find('span', 'ak-infos-allianceguild')?.nextElement?.nextElement?.nextElement?._text?.trim()?.replace(/\s(.*)/g, '');
  data.marry_link       = data.marry_name    && `${settings.encyclopedia.link_url}/${soup.find('a', 'ak-infos-spousename')?.attrs?.href}`;
  data.success_percent  = soup.find('div', 'ak-progress-bar-text')?.nextElement?._text?.trim();
  data.success_lastName = soup.find('div', 'ak-last-achievement')?.contents?.[3]?._text?.trim();//.nextElement._text.trim();
  data.success_lastTime = soup.find('div', 'ak-last-achievement')?.contents?.[1]?.nextElement?._text?.trim()?.replace(/(.*)il y a/g, '')?.replace(/:/g, '')?.replace(/ago/g, '')?.trim();
  data.marry_name       = soup.find('a',   'ak-infos-spousename')?.nextElement?._text?.trim();
  data.xp               = soup.find('div', 'ak-total-xp')?.contents?.[1]?.nextElement?._text?.trim() || '-';
  data.koli             = soup.find('div', 'ak-total-kolizeum')?.contents?.[1]?.nextElement?._text?.trim() || '-';
  data.alignment_name   = soup.find('span', 'ak-alignment-name')?.nextElement?._text?.trim();
  data.alignment_level  = soup.find('span', 'ak-alignment-level')?.nextElement?._text?.trim();
  data.success          = soup.find('span', 'ak-score-text')?.contents?.[0]?._text?.trim();
  // TODO: handle eng & spain characteristics pages
  data.characteristics_link = `${settings.encyclopedia.link_url}/fr/mmorpg/communaute/annuaires/pages-persos/${link.replace(/(.*\/)*/, '')}/caracteristiques`;
  const ack: Response   = await fetch(data.characteristics_link);
  if (ack.status === 200) {
    const search: JSSoup = new JSSoup(await ack.text());
    data.characteristics_element = search.findAll('tr', "ak-bg-odd")?.concat(search.findAll('tr', "ak-bg-even"))?.filter(elem => elem.contents?.[3])?.map(({ contents }) => ({
      name:  contents?.[1]?.nextElement?.contents?.[0]?._text,
      base:  contents?.[3]?.contents?.[0]?._text,
      total: contents?.[4]?.contents?.[0]?._text
    }));
  }
  data.ladder = soup.find('tbody')?.contents?.map(({ contents }) => ({
    text:    contents?.[0]?.contents?.[0]?._text?.trim(),
    xp:      contents?.[1]?.contents?.[0]?._text,
    koli:    contents?.[2]?.contents?.[0]?._text,
    success: contents?.[3]?.contents?.[0]?._text
  }));
  data.jobs   = jobs?.map(({ nextElement }) => ({
    level: nextElement?.contents?.[0]?.nextElement?.nextElement?._text?.trim(),
    name:  nextElement?.nextElement?._text?.trim()
  }));
  return { ...data, link };
}

// Parse each guild member's page until find the required player and return his role
const getGuildRole = async (link: string, name: string, lang: number, page: number = 1) => {
  const guild_answer: Response = await fetch(`${link}/memb${["res", "ers"][lang]}?page=${page}`);
  const guild_page:     JSSoup = new JSSoup(await guild_answer.text());
  const guild_content          = guild_page.findAll('tr', 'tr_class');
  const guild_role             = guild_content.map(({ contents }) => ({
    name: contents?.[0]?.contents?.[1]?.contents?.[0]?._text,
    grade: contents?.[3]?.contents?.[0]?._text
  })).filter((elem) => elem.name === name)?.[0];
  return (!guild_role) ? await getGuildRole(link, name, lang, page + 1) : guild_role.grade;
}

// Parse each player's page until find the required player and return his page
const getPlayerPage = async (link: string, name: string, page: number = undefined): Promise<string> => {
  const answer: Response = await fetch(`${link}${page ? `?page=${page}` : ''}`);
  if (answer.status !== 200)
    throw false;
  const list:     JSSoup = new JSSoup(await answer.text());
  const content:   any[] = list.findAll('tr')?.reverse()?.splice(1)?.reverse();
  const filtered_result  = await content.filter(({ contents }) => (
    contents?.[1]?.nextElement?.nextElement?._text?.epur() === name.epur()
  ));
  return (!filtered_result?.length && page < 10)
    ? await getPlayerPage(link, name, page ?? 1 + 1)
    : `${filtered_result?.[0]?.contents?.[1]?.nextElement?.attrs?.href}`;
}
