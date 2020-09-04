import { MessageEmbed } from 'discord.js';
import { format } from 'format';
import request from 'async-request';
import * as sentences from "../resources/language.json";
import * as year from "../resources/year.json";
import * as settings from "../resources/config.json";
import * as moment from 'moment';
import { guild } from './commands';

moment.locale('fr');

//
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
    const icon: any = { "Meneur": '🔺', "Bras Droit": '▫' };
    const pillars: string = guild_info.pillars.map((element: any) => {
        const symbol: string = icon[element.role] || '▪';
        return `${symbol} [${element.name}](https://google.com) (lvl ${element.lvl}) **${element.role}**`;
    }).join('\n');
    const activities: string = guild_info.activities.map((element: any) => {
        const symbol: string = (element.action.includes("rejoin")) ? '🔹' :
            (element.action.includes("maison", "home")) ? '▫' : '🔸';
        const adjective: string = (element.name && !lang) ? 'a' : ' ';
        return `${symbol} [${element.time}] **${element.name || ' '}** ${adjective} ${element.action}`;
    }).join('\n');
    return new MessageEmbed()
        .setColor('0x4E4EC8')
        .setTitle(guild_info.guild_name)
        .setURL(guild_info.link)
        .setThumbnail(guild_info.icon)
        .addField(sentences[lang].INFO_GUILD_PILLARS, pillars)
        .addField(sentences[lang].INFO_GUILD_HISTORY, activities)
        .setFooter(format(sentences[lang].INFO_GUILD_FOOTER, guild_info.alliance_name,
            guild_info.alliance_members, guild_info.alliance_guilds_number), guild_info.alliance_emblem);
}

// TODO URGENT
export const createGuildErrorEmbed = async (lang: number, argument: string, link: string, mode: number): Promise<MessageEmbed> => {
    const content: any = [ ["guilde", "alliance"], ["guild", "alliance"] ];
    return new MessageEmbed()
        .setColor('0xFF0000')
	    .setTitle(`${content[lang][mode].charAt(0).toUpperCase()}${content[lang][mode].slice(1)} ${sentences[lang]["ERROR_NOT_FOUND"]}`)
	    .setDescription(format(sentences[lang].ERROR_CONTENT_NOT_FOUND, content[lang][mode], content[lang][mode], link))
	    .setImage(settings.bruno.not_found_url)
        .setTimestamp()
	    .setFooter(sentences[lang].ERROR_LOST, settings.bruno.thumbnail_author);
}

