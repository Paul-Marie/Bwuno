import { MessageEmbed         } from 'discord.js';
import { format               } from 'format';
import { getDate, getElement,
  getRemainingDay, getPrice   } from "./utils";
import * as sentences           from "../../resources/language.json";
import * as settings            from "../../resources/config.json";
import * as moment              from 'moment';

moment.locale('fr');

// Create an embed with all almanax of day's informations
export const createEmbed = async (almanax: any, id: number): Promise<MessageEmbed> => {
  const remaining_days: number = getRemainingDay(almanax.Date);
  const average_price: string = await getPrice(almanax.OfferingURL.substring(62).split('-')[0], id);
  const embed: MessageEmbed = new MessageEmbed()
    .setColor('#4E4EC8')
    .setTitle(`**Almanax du ${moment(almanax.Date.slice(5), "MM-DD", 'fr', true).format("DD MMMM")}**`)
    .setURL(`https://www.krosmoz.com/fr/almanax/${almanax.Date}?game=dofustouch`)
    .setThumbnail(almanax.OfferingImage)
    .addField("🙏 Offrande:", `[**${almanax.OfferingName}**](${almanax.OfferingURL}) **x${almanax.OfferingQuantity}**`)
    .addField("📜 Bonus:", `\`\`\`${almanax.BonusDescription}\`\`\`\n*Type de Bonus*: __${almanax.BonusType}__`)
    .addField("⏳ Temps:", "Cette almanax aura lieu " + (
      (remaining_days) <= 1 ? (
        (remaining_days == 1) ? "**demain**" : "**aujourd'hui**"
      ) : `dans **${remaining_days}** jours`), true)
    .addField("💵 Prix:", "Le prix moyen de l'offrande est actuellement de **" + (
      (Number(average_price) >= 0)
        ? "+" : "") + `${average_price}%** comparé à la semaine derniere.`, true)
  if (almanax.Event_Name) {
    embed.addField(`🎉 Event: **${almanax.EventName}**`, almanax.Event_Description)
    embed.setImage(almanax.Event_Image)
  }
  return embed;
};

// Return an embed where all field are almanax from tomorrow to the next 25 days
export const createFutureEmbed = (required_almanax: number): MessageEmbed => {
  const current_date: moment.Moment = moment();
  if (required_almanax > settings.discord.embed_limit)
    required_almanax = settings.discord.embed_limit;
  if (required_almanax <= 0)
    required_almanax = 1;
  const embed: MessageEmbed = new MessageEmbed()
    .setColor('#4E4EC8')
    .setTitle(`Almanax du **${current_date.format("DD/MM")}** au **${moment().add(required_almanax, 'days').format("DD/MM")}**`)
  for (let i = 0; i < required_almanax; i++) {
    const date: moment.Moment = current_date.add(1, 'days');
    const almanax: any = getDate(date.format("DD/MM"))[0];
    embed.addField(date.format("DD MMMM"), `🙏 **x${almanax.OfferingQuantity}** [**${almanax.OfferingName}**](${almanax.OfferingURL})\n📜 ${almanax.BonusDescription}\n`, true);
  }
  return embed;
};

// Create and return an Embed containing all guild's informations
export const createGuildEmbed = async (guild_info: any, lang: number): Promise<MessageEmbed> => {
  const icon: any = { "Meneur": '🔺', "Leader": '🔺', "Bras Droit": '▫', "Second in Command": '▫' };
  // TODO: use `link` when Discord API'll accept content greater than 1024
  const pillars: string = guild_info.pillars.map(({ name, role, lvl, link }) => (
    `${icon[role] || '▪'} [${name}](${"https://google.com" || link}) (lvl ${lvl}) **${role}**`
  )).join('\n');
  const activities: string = guild_info.activities?.[0]?.action !== "undefined."
    && guild_info.activities?.map(({ action, time, name }) => {
    const symbol: string = action.includes("rejoin") ? '🔹' :
      (["maison", "home"].some(elem => action.includes(elem))) ? '▫' : '🔸';
    const adjective: string = (name && !lang) ? 'a' : ' ';
    return `${symbol} [${time}] **${name || ' '}** ${adjective} ${action}`;
  }).join('\n');
  const embed: MessageEmbed = new MessageEmbed()
    .setColor('#4E4EC8')
    .setTitle(guild_info.guild_name)
    .setURL(guild_info.link)
    .setThumbnail(guild_info.icon)
    .setDescription(format(sentences[lang].INFO_GUILD_DESCRIPTION, guild_info.level,
      moment(guild_info.created_at, "DD/MM/YYYY").format("DD MMMM YYYY"), guild_info.server, guild_info.member_number))
    .addField(sentences[lang].INFO_GUILD_PILLARS, pillars, true)
    .setFooter({ text: format(sentences[lang].INFO_GUILD_FOOTER, guild_info.alliance_name,
      guild_info.alliance_members, guild_info.alliance_number), iconURL: guild_info.alliance_emblem });
  activities && embed.addField(sentences[lang].INFO_GUILD_HISTORY, activities)
  return embed;
};

// TODO Uggly function returning an Embed all formated info on a player
export const createPlayerEmbed = async (data: any, lang: number): Promise<MessageEmbed> => {
  const { guild_name, guild_link, guild_level, guild_role, guild_members, guild_emblem,
    marry_name, marry_link, alignment_name, alignment_level, koli, characteristics_element,
    name, level, link, race, title, presentation, ladder, image, success, success_percent,
    alliance_emblem, alliance_member, alliance_name, alliance_number, jobs, xp, server
  } = data;
  const success_list: string[] = [
    "<:success:754731377995415703>", "<:4k:754494973101211659>", "<:6k:754494998040543346>",
    "<:8k:754494998342402070>", "<:10k:754495072648560723>"];
  const server_list: any = {
    "Oshimo":     "<:oshimo:754738578327601153>",     "Terra Cogita": "<:terra_cogita:754738579778961458>",
    "Herdegrize": "<:herdegrize:754738579808321537>", "Brutas": "<:brutas:754738573089177700>",
    "Dodge":      "<:dodge:754738574548533379>",      "Grandapan": "<:grandapan:754738579430965399>"
  };
  const get_success_icon     = (success: string) => Math.floor(Math.sqrt(Math.pow(Number(success.replace(/ /g, '')) - 2000, 2)) / 2000);
  const alignment_list:  any = { "bonta": "<:bonta:754819105894170707>", "brakmar": "<:brakmar:754819103704875039>" };
  const informations: string = format(sentences[lang].INFO_WHOIS_SERVER, server_list[server], server);
  const guild:        string = guild_name     ? format(sentences[lang].INFO_WHOIS_GUILD,    "<:guild:754737710937145504>",   guild_name, guild_link, guild_level) : '';
  const role:         string = guild_name     ? format(sentences[lang].INFO_WHOIS_ROLE,     "<:role:754737709532053679>",    guild_role, guild_members)           : '';
  const marry:        string = marry_name     ? format(sentences[lang].INFO_WHOIS_MARRY,    "<:spouse:754737711729999913>",  marry_name, marry_link)              : '';
  const kolizeum:     string = koli           ? format(sentences[lang].INFO_WHOIS_KOLIZEUM, "<:kolosseum:754836911306309792>", koli)                              : '';
  const alignment:    string = alignment_name ? format(sentences[lang].INFO_WHOIS_ALIGNMENT, alignment_list[alignment_name], alignment_name, alignment_level)     : '';
  const element:      string = characteristics_element?.length ? getElement(characteristics_element, level) : '';
  const embed:  MessageEmbed = new MessageEmbed().setColor('#4E4EC8').setTitle(name).setURL(link)
    .setThumbnail(guild_emblem?.replace(/dofus/g, 'dofustouch'))
    .setDescription(`${title ? `\`${title}\`` : ""}\n${presentation || ""}`)
    .addField(`${race} ${element} (lvl ${level}):`, `${informations}${guild}${role}${marry}${alignment}${kolizeum}`)
  if (ladder)
    embed.addField(format(sentences[lang].INFO_WHOIS_SUCCESS, success_list[get_success_icon(success)], success, success_percent),
      format(sentences[lang].INFO_WHOIS_LADDER_CONTENT, ladder[0].text, ladder[0].success, ladder[1].text,
        ladder[1].success, ladder[2].text, ladder[2].success, ladder[3].text.replace(/ Cogita/g, ''), ladder[3].success), true)
      .addField(format(sentences[lang].INFO_WHOIS_EXPERIENCE, "<:xp:754770281230237786>", xp), format(sentences[lang].INFO_WHOIS_LADDER_CONTENT, ladder[0].text,
        ladder[0].xp, ladder[1].text, ladder[1].xp, ladder[2].text, ladder[2].xp, ladder[3].text.replace(/ Cogita/g, ''), ladder[3].xp), true)
  embed.setImage(image.replace(/touch/g, ''))
    .setFooter({ iconURL: alliance_emblem, text: !(alliance_name) ? "" :
      format(sentences[lang].INFO_GUILD_FOOTER, alliance_name, alliance_member, alliance_number)
    });
  jobs.length && embed.addField(format(sentences[lang].INFO_WHOIS_JOBS, "<:job:754731377274126438>"), jobs.map(
    ({ name, level }) => `🔸 \`${name}\` ${level.replace(/\D/g, "")}`).join('\n'), true);
  return embed;
};

// Create an embed with a Twitter post's data
export const createTwitterEmbed = (user: string, text: string, link: string, image: any): MessageEmbed => ({
  color: user === "DofusTracker_DT" ? 0x97A800 : 0x1DA1F2,
  title: user === "DofusTracker_DT" ? "Nouvelle intervention du Staff !" : "Nouveau Tweet !",
  url: link,
  description: user === "DofusTracker_DT" ? (
    text.indexOf('↪️') > 0
      ? text?.replace(/\[[^\}]*\]\s/g, '')?.split('\n')?.[0]
      : text?.replace(/\[[^\}]*\]\s/g, '')
  ) : text,
  ...((user === "DofusTracker_DT" && text.indexOf('↪️') > 0) && {
    fields: [{
      name:  text?.split('\n')?.[1]?.match(/"([^+]+)"/)?.[1],
      value: text?.split('\n')?.[2]?.match(/"([^+]+)"/)?.[1]
    }]
  }),
  ...image,
  thumbnail: {
    url: user === "DofusTracker_DT" 
      ? "https://i.imgur.com/N6YTjZd.png"
      : "https://i.imgur.com/hfBJR3S.png"
  },
  footer: {
    text: user === "DofusTracker_DT" ? text.split('\n')?.[0]?.match(/\[.*?\]/g)?.join(' > ') : `@${user}`,
    iconURL: user === "DofusTracker_DT" 
      ? "https://i.imgur.com/RNhPqaP.png"
      : "https://pbs.twimg.com/profile_images/1506538172884430853/NL9YuBYw_400x400.png"
  }
});

// Create an Embed sent in case of error(s)
export const createErrorEmbed = async (lang: number, link: string, mode: number): Promise<MessageEmbed> => {
  const content: any = [["guilde", "alliance", "personne"], ["guild", "alliance", "player"]];
  return new MessageEmbed()
    .setColor('#FF0000')
    .setTitle(`${content[lang][mode].charAt(0).toUpperCase()}${content[lang][mode].slice(1)} ${sentences[lang]["ERROR_NOT_FOUND"]}`)
    .setDescription(format(sentences[lang].ERROR_CONTENT_NOT_FOUND, content[lang][mode], content[lang][mode], link))
    .setImage(settings.bwuno.not_found_url)
    .setTimestamp()
    .setFooter({ text: sentences[lang].ERROR_LOST, iconURL: settings.bwuno.thumbnail_author });
};
