import { MessageEmbed, GuildEmoji } from 'discord.js';
import { format } from 'format';
import { getRemainingDay, getPrice, getDate, getElement } from "./utils";
import { bot } from "../discord";
import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
import * as moment from 'moment';

moment.locale('fr');

// Create an embed with all almanax of day's informations
export const createEmbed = async (almanax: any, id: number) => {
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
}

// Return an embed where all field are almanax from tomorrow to the next 25 days
export const createFutureEmbed = (required_almanax: number) => {
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
}

// Create and return an Embed containing all guild's informations
export const createGuildEmbed = async (guild_info: any, lang: number): Promise<MessageEmbed> => {
    const icon: any = { "Meneur": '🔺', "Leader": '🔺', "Bras Droit": '▫', "Second in Command": '▫' };
    const pillars: string = guild_info.pillars.map((element: any) => {
        const symbol: string = icon[element.role] || '▪';
        return `${symbol} [${element.name}](https://google.com) (lvl ${element.lvl}) **${element.role}**`;
    }).join('\n');
    const activities: string = guild_info.activities.map((element: any) => {
        const symbol: string = (element.action.includes("rejoin")) ? '🔹' :
            (["maison", "home"].some(elem => element.action.includes(elem))) ? '▫' : '🔸';
        const adjective: string = (element.name && !lang) ? 'a' : ' ';
        return `${symbol} [${element.time}] **${element.name || ' '}** ${adjective} ${element.action}`;
    }).join('\n');
    return new MessageEmbed()
        .setColor('#4E4EC8')
        .setTitle(guild_info.guild_name)
        .setURL(guild_info.link)
        .setThumbnail(guild_info.icon)
        .setDescription(format(sentences[lang].INFO_GUILD_DESCRIPTION, guild_info.level, 
            moment(guild_info.created_at, "DD/MM/YYYY").format("DD MMMM YYYY"), guild_info.server, guild_info.member_number))
        .addField(sentences[lang].INFO_GUILD_PILLARS, pillars, true)
        .addField(sentences[lang].INFO_GUILD_HISTORY, activities)
        .setFooter(format(sentences[lang].INFO_GUILD_FOOTER, guild_info.alliance_name,
            guild_info.alliance_members, guild_info.alliance_guilds_number), guild_info.alliance_emblem);
}

// TODO Uggly function returning an Embed all formated info on a player
export const createPlayerEmbed = async (data: any, lang: number): Promise<MessageEmbed> => {
    const success_list: string[] = [
        "754731377995415703", "754494973101211659", "754494998040543346",
        "754494998342402070", "754495072648560723"];
    const server_list: any = {
        "Oshimo": "754738578327601153", "Terra Cogita": "754738579778961458",
        "Herdegrize": "754738579808321537", "Brutas": "754738573089177700",
        "Dodge": "754738574548533379", "Grandapan": "754738579430965399"
    };
    const alignment_list: any = { "bonta": "754819105894170707", "brakmar": "754819103704875039" };
    const get_success_icon: any = (success: string) => {
        return Math.floor(Math.sqrt(Math.pow(
            Number(success.replace(/ /g, '')) - 2000, 2)) / 2000)};
    const success_icon: GuildEmoji = bot.emojis.cache.find(emoji => emoji.id === success_list[get_success_icon(data.success)]);
    const xp_icon: GuildEmoji = bot.emojis.cache.find(emoji => emoji.id === "754770281230237786");
    const jobs_icon: GuildEmoji = bot.emojis.cache.find(emoji => emoji.id === "754731377274126438");
    const informations: string = format(sentences[lang].INFO_WHOIS_SERVER,
        bot.emojis.cache.find(emoji => emoji.id === server_list[data.server]).toString(), data.server);
    const guild: string = (data.guild_name) ? format(sentences[lang].INFO_WHOIS_GUILD,
        bot.emojis.cache.find(emoji => emoji.id === "754737710937145504").toString(), data.guild_name, data.guild_link, data.guild_level) : '';
    const role: string = (data.guild_name) ? format(sentences[lang].INFO_WHOIS_ROLE,
        bot.emojis.cache.find(emoji => emoji.id === "754737709532053679").toString(), data.guild_role, data.guild_members) : '';
    const marry: string = (data.marry_name) ? format(sentences[lang].INFO_WHOIS_MARRY,
        bot.emojis.cache.find(emoji => emoji.id === "754737711729999913").toString(), data.marry_name, data.marry_link) : '';
    const alignment: string = (data.alignment_name) ? format(sentences[lang].INFO_WHOIS_ALIGNMENT,
        bot.emojis.cache.find(emoji => emoji.id === alignment_list[data.alignment_name]).toString(), data.alignment_name, data.alignment_level) : '';
    const kolizeum: string = (data.koli) ? format(sentences[lang].INFO_WHOIS_KOLIZEUM,
        bot.emojis.cache.find(emoji => emoji.id === "754836911306309792").toString(), data.koli) : '';
    const element: string = (data.characteristics_element.length) ? getElement(data.characteristics_element, data.level) : '';
    const embed: MessageEmbed = new MessageEmbed()
        .setColor('#4E4EC8')
        .setTitle(data.name)
        .setURL(data.link)
        .setThumbnail(data.guild_emblem.replace(/dofus/g, 'dofustouch'))
        .setDescription(`${data.title ? ("`" + data.title + "`") : ""}\n${data.presentation || ""}`)
        .addField(`${data.race} ${element} (lvl ${data.level}):`, `${informations}${guild}${role}${marry}${alignment}${kolizeum}`)
    if (data.ladder) {
        embed.addField(format(sentences[lang].INFO_WHOIS_SUCCESS, success_icon.toString(), data.success, data.success_percent), format(
            sentences[lang].INFO_WHOIS_LADDER_CONTENT, data.ladder[0].text, data.ladder[0].success, data.ladder[1].text,
            data.ladder[1].success, data.ladder[2].text, data.ladder[2].success, data.ladder[3].text.replace(/ Cogita/g,''), data.ladder[3].success,
        ), true)
            .addField(format(sentences[lang].INFO_WHOIS_EXPERIENCE, xp_icon.toString(), data.xp), format(
                sentences[lang].INFO_WHOIS_LADDER_CONTENT, data.ladder[0].text, data.ladder[0].xp, data.ladder[1].text,
                data.ladder[1].xp, data.ladder[2].text, data.ladder[2].xp, data.ladder[3].text.replace(/ Cogita/g,''), data.ladder[3].xp,
            ), true)
    }
    embed
        .setImage(data.image.replace(/touch/g, ''))
        .setFooter((data.alliance_name) ?
            format(sentences[lang].INFO_GUILD_FOOTER, data.alliance_name,
                   data.alliance_members, data.alliance_guilds_number) : "", data.alliance_emblem);
    if (data.jobs.length)
        embed.addField(format(sentences[lang].INFO_WHOIS_JOBS, jobs_icon.toString()), data.jobs.map((element: any) => {
            return `🔸 \`${element.name}\` ${element.level.replace(/\D/g, "")}`;
        }).join('\n'), true);
    return embed;
}

// Create an Embed sent in case of error(s)
export const createErrorEmbed = async (lang: number, link: string, mode: number): Promise<MessageEmbed> => {
    const content: any = [ ["guilde", "alliance", "personne"], ["guild", "alliance", "player"] ];
    return new MessageEmbed()
        .setColor('#FF0000')
	    .setTitle(`${content[lang][mode].charAt(0).toUpperCase()}${content[lang][mode].slice(1)} ${sentences[lang]["ERROR_NOT_FOUND"]}`)
	    .setDescription(format(sentences[lang].ERROR_CONTENT_NOT_FOUND, content[lang][mode], content[lang][mode], link))
	    .setImage(settings.bwuno.not_found_url)
        .setTimestamp()
	    .setFooter(sentences[lang].ERROR_LOST, settings.bwuno.thumbnail_author);
}
