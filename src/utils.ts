import { MessageEmbed, GuildEmoji } from 'discord.js';
import { format } from 'format';
import request from 'async-request';
import * as sentences from "../resources/language.json";
import * as year from "../resources/year.json";
import * as settings from "../resources/config.json";
import * as moment from 'moment';
import bot from "./discord";

moment.locale('fr');

// TODO to replace by triche regexp
export const formatDate = (sentence: string[]) => {
    return ((sentence.map((elem: string) => {
        return elem.split("-").map((item: string) => {
            return (item.length === 1) ? "0" + item : item;
        })
    })).map((elem: string[]) => {
        return (elem.map((tmp: string ) => {
            return tmp.split("/").map((item: string) => {
                return (item.length === 1) ? "0" + item : item;
            }).join(" ");
        })).join(" ");
    })).map((elem: string) => {
        return (elem.length === 1) ? "0" + elem : elem;
    }).join(" ");
}

//
export const getPrice = async (item_id: number, server_id: number = 2): Promise<string> => {
    try {
        const url: string = settings.dt_price.api_url;
        const response: any = await request(`${url}/${server_id}/${item_id}`);
        if (response.statusCode === 200) {
            const data: any = JSON.parse(response.body);
            const current_date: moment.Moment = moment();
                  //.subtract(1, 'd').format("YYYY-MM-DD");
            const date: string = moment().subtract(7, 'd').format("YYYY-MM-DD");
            const getAverageOfDay = (array: Array<any>, date: string): string => {
                const days: any = array.filter((hour) => { return hour.date.includes(date) });
                const result: any = days.map((day: any) => {
                    return (day.unit + (day.decade / 10) + (day.hundred / 100)) / 3;
                });
                return (result.reduce((a,b) => a + b, 0) / result.length).toFixed(2);
            };
            const tmp: number = parseFloat(getAverageOfDay(data, current_date.format("YYYY-MM-DD")));
            const current_price: number = (tmp) ? tmp : parseFloat(getAverageOfDay(data, current_date.subtract(1, 'd').format("YYYY-MM-DD")));
            const week_price: number = parseFloat(getAverageOfDay(data, date));
            return ((current_price - week_price) / week_price * 100).toFixed(2);
        }
    } catch (err) {
        return '0';
    }
}

//
export const getAlmanax = (bonus_types: string[]) => {
    return Object.keys(year).map(key => {
        if (bonus_types.indexOf(year[key].Bonus_Type) >= 0) {
            const date: moment.Moment = moment(key, "YYYY-MM-DD", 'fr');
            return `**${date.format("DD MMMM")}**: ${year[key].Bonus_Description}\n`;
        }
    }).filter((item: any) => {
        return item !== undefined;
    });
}

//
export const getList = (item_name: string) => {
    return Object.keys(year).map((key: string) => {
        const epured: string = year[key].Offrande_Name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (epured === item_name)
            return year[key];
    }).filter((item: any) => {
        return item !== undefined;
    });
}

//
export const getDate = (requested_date: string) => {
    const accepted_format: string[] = ["DD/MM", "DD-MM", "DD MM", "DD MMM", "DD MMMM",
                                       "DD/MM/YYYY", "DD-Math.M-YYYY", "DD MM YYYY",
                                       "DD MMM YYYY", "DD MMMM YYYY"];
    return accepted_format.map((format: string) => {
        const date: moment.Moment = moment(requested_date, format, 'fr', true);
        if (date.isValid())
            return year[date.format("2020-MM-DD")];
    }).filter((item: any) => {
        return item !== undefined;
    });
}

//
export const getRemainingDay = (almanax_date: string) => {
    const current_date: Date = new Date();
    const date: moment.Moment = moment([current_date.getFullYear(), current_date.getMonth(), current_date.getDate()]);
    let searched_date: moment.Moment = moment([current_date.getFullYear(), Number(almanax_date.split("-")[1]) - 1, almanax_date.split("-")[2]]);
    if (date > searched_date)
        searched_date = moment([current_date.getFullYear() + 1, Number(almanax_date.split("-")[1]) - 1, almanax_date.split("-")[2]]);
    const diff: number = date.diff(searched_date, 'days');
    return Math.abs(Math.trunc(diff));
}

// TODO URGENT
export const createEmbed = async (almanax: any, id: number) => {
    const remaining_days: number = getRemainingDay(almanax.Date);
    const average_price: string = await getPrice(almanax.URL.substring(62).split('-')[0], id);
    const embed: MessageEmbed = new MessageEmbed()
        .setColor('0x4E4EC8')
        .setTitle(`**Almanax du ${moment(almanax.Date.slice(5), "MM-DD", 'fr', true).format("DD MMMM")}**`)
        .setURL(`https://www.krosmoz.com/fr/almanax/${almanax.Date}?game=dofustouch`)
        .setThumbnail(almanax.Offrande_Image)
        .addField("🙏 Offrande:", `[**${almanax.Offrande_Name}**](${almanax.URL}) **x${almanax.Offrande_Quantity}**`)
        .addField("📜 Bonus:", `\`\`\`${almanax.Bonus_Description}\`\`\`\n*Type de Bonus*: __${almanax.Bonus_Type}__`)
        .addField("⏳ Temps:", "Cette almanax aura lieu " + (
            (remaining_days) <= 1 ? (
                (remaining_days == 1) ? "**demain**" : "**aujourd'hui**"
            ) : `dans **${remaining_days}** jours`), true)
          .addField("💵 Prix:", "Le prix moyen de l'offrande est actuellement de **" + (
	          (Number(average_price) >= 0)
		    ? "+" : "") + `${average_price}%** comparé à la semaine derniere.`, true)
    if (almanax.Event_Name) {
        embed.addField(`🎉 Event: **${almanax.Event_Name}**`, almanax.Event_Description)
        embed.setImage(almanax.Event_Image)
    }
    return embed;
}

// 
export const createFutureEmbed = (required_almanax: number) => {
    const current_date: moment.Moment = moment();
    if (required_almanax > settings.discord.embed_limit)
        required_almanax = settings.discord.embed_limit;
     if (required_almanax <= 0)
        required_almanax = 1;
    const embed: MessageEmbed = new MessageEmbed()
        .setColor('0x4E4EC8')
        .setTitle(`Almanax du **${current_date.format("DD/MM")}** au **${moment().add(required_almanax, 'days').format("DD/MM")}**`)
    for (let i = 0; i < required_almanax; i++) {
        const date: moment.Moment = current_date.add(1, 'days');
        const almanax: any = getDate(date.format("DD/MM"))[0];
        embed.addField(date.format("DD MMMM"), `🙏 **x${almanax.Offrande_Quantity}** [**${almanax.Offrande_Name}**](${almanax.URL})\n📜 ${almanax.Bonus_Description}\n`, true);
    }
    return embed;
}

// TODO URGENT
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
        .setColor('0x4E4EC8')
        .setTitle(guild_info.guild_name)
        .setURL(guild_info.link)
        .setThumbnail(guild_info.icon)
        .setDescription(format(sentences[lang].INFO_GUILD_DESCRIPTION, guild_info.level, 
            moment(guild_info.created_at, "DD/MM/YYYY").format("DD MMMM YYYY"), guild_info.server))
        .addField(sentences[lang].INFO_GUILD_PILLARS, pillars, true)
        .addField(sentences[lang].INFO_GUILD_HISTORY, activities)
        .setFooter(format(sentences[lang].INFO_GUILD_FOOTER, guild_info.alliance_name,
            guild_info.alliance_members, guild_info.alliance_guilds_number), guild_info.alliance_emblem);
}

// TODO URGENT
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
    const informations: string = format(sentences[lang].INFO_WHOIS_SERVER,
        bot.emojis.cache.find(emoji => emoji.id === server_list[data.server]).toString(), data.server);
    const guild: string = (data.guild_name) ? format(sentences[lang].INFO_WHOIS_GUILD,
        bot.emojis.cache.find(emoji => emoji.id === "754737710937145504").toString(), data.guild_name, data.guild_link, data.guild_level) : '';
    const marry: string = (data.marry_name) ? format(sentences[lang].INFO_WHOIS_MARRY,
        bot.emojis.cache.find(emoji => emoji.id === "754737711729999913").toString(), data.marry_name, data.marry_link) : '';
    const alignment: string = (data.marry_name) ? format(sentences[lang].INFO_WHOIS_ALIGNMENT,
        bot.emojis.cache.find(emoji => emoji.id === alignment_list[data.alignment_name]).toString(), data.alignment_name, data.alignment_level) : '';
    const kolizeum: string = (data.koli) ? format(sentences[lang].INFO_WHOIS_KOLIZEUM,
        bot.emojis.cache.find(emoji => emoji.id === "754836911306309792").toString(), data.koli) : '';
    return new MessageEmbed()
        .setColor('0x4E4EC8')
        .setTitle(data.name)
        .setURL(data.link)
        .setThumbnail(data.guild_emblem)
        .setDescription(`${data.title ? ("`" + data.title + "`") : ""}\n${data.presentation || ""}`)
        .addField(`${data.race} (${data.level}):`, `${informations}${guild}${marry}${alignment}${kolizeum}`)
    /*,)
            bot.emojis.cache.find(emoji => emoji.id === "754496011552161803"), data.element)),*/
        .addField(format(sentences[lang].INFO_WHOIS_SUCCESS, success_icon.toString(), data.success, data.success_percent), format(
            sentences[lang].INFO_WHOIS_LADDER_CONTENT, data.ladder[0].text, data.ladder[0].success, data.ladder[1].text,
            data.ladder[1].success, data.ladder[2].text, data.ladder[2].success, data.ladder[3].text.replace(/ Cogita/g,''), data.ladder[3].success,
        ), true)
        .addField(format(sentences[lang].INFO_WHOIS_EXPERIENCE, xp_icon.toString(), data.xp), format(
            sentences[lang].INFO_WHOIS_LADDER_CONTENT, data.ladder[0].text, data.ladder[0].xp, data.ladder[1].text,
            data.ladder[1].xp, data.ladder[2].text, data.ladder[2].xp, data.ladder[3].text.replace(/ Cogita/g,''), data.ladder[3].xp,
        ), true)
        .setImage(data.image.replace(/touch/g, ''))
        .setFooter((data.alliance_name) ?
            format(sentences[lang].INFO_GUILD_FOOTER, data.alliance_name,
                   data.alliance_members, data.alliance_guilds_number) : "", data.alliance_emblem);
}

export const createErrorEmbed = async (lang: number, link: string, mode: number): Promise<MessageEmbed> => {
    const content: any = [ ["guilde", "alliance", "personne"], ["guild", "alliance", "player"] ];
    return new MessageEmbed()
        .setColor('0xFF0000')
	    .setTitle(`${content[lang][mode].charAt(0).toUpperCase()}${content[lang][mode].slice(1)} ${sentences[lang]["ERROR_NOT_FOUND"]}`)
	    .setDescription(format(sentences[lang].ERROR_CONTENT_NOT_FOUND, content[lang][mode], content[lang][mode], link))
	    .setImage(settings.bruno.not_found_url)
        .setTimestamp()
	    .setFooter(sentences[lang].ERROR_LOST, settings.bruno.thumbnail_author);
}

