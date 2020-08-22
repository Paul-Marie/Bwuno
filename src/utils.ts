import { RichEmbed } from 'discord.js';
import request from 'async-request';
import * as year from "../resources/year.json";
const moments = require('moment');

moments.locale('fr');

//
export const formatDate = (sentence) => {
    return ((sentence.map(elem => {
        return elem.split("-").map(item => {
            return (item.length === 1) ? "0" + item : item;
        })
    })).map(elem => {
        return (elem.map(tmp => {
            return tmp.split("/").map(item => {
                return (item.length === 1) ? "0" + item : item;
            }).join(" ");
        })).join(" ");
    })).map(toto => {
        return (toto.length === 1) ? "0" + toto : toto;
    }).join(" ");
}

//
export const getPrice = async (item_id, server_id = 2) => {
    try {
        const url = "https://api.dt-price.com/value";
        const response = await request(`${url}/${server_id}/${item_id}`);//, (err, res, body) => {
        if (response.statusCode === 200) {
            const data = JSON.parse(response.body);
            const current_date = moments();
                  //.subtract(1, 'd').format("YYYY-MM-DD");
            const date = moments().subtract(7, 'd').format("YYYY-MM-DD");
            const getAverageOfDay = (array, date) => {
                const days = array.filter(hour => { return hour.date.includes(date) });
                const result = days.map(day => {
                    return (day.unit + (day.decade / 10) + (day.hundred / 100)) / 3;
                });
                return (result.reduce((a,b) => a + b, 0) / result.length).toFixed(2);
            };
            const tmp = parseFloat(getAverageOfDay(data, current_date.format("YYYY-MM-DD")));
            console.log(tmp);
            const current_price = (tmp) ? tmp : parseFloat(getAverageOfDay(data, current_date.subtract(1, 'd').format("YYYY-MM-DD")));
            const week_price = parseFloat(getAverageOfDay(data, date));
            return ((current_price - week_price) / week_price * 100).toFixed(2);
        }
    } catch (err) {
        console.log(err);
        return 0;
    }
}

//
export const getAlmanax = (bonus_types) => {
    const result = Object.keys(year).map(key => {
        if (bonus_types.indexOf(year[key].Bonus_Type) >= 0) {
            const date = moments(key, "YYYY-MM-DD", 'fr');
            return `**${date.format("DD MMMM")}**: ${year[key].Bonus_Description.replace(/(?<=\d+)\s+(?=%)/g, '')}\n`;
        }
    }).filter(item => {
        return item !== undefined;
    });
    return result;
}

//
export const getList = (item_name) => {
    const result = Object.keys(year).map(key => {
        const epured = year[key].Offrande_Name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (epured === item_name)
            return year[key];
    }).filter(item => {
        return item !== undefined;
    });
    return result;
}

//
export const getDate = (requested_date) => {
    const accepted_format = ["DD/MM", "DD-MM", "DD MM", "DD MMM", "DD MMMM", "DD/MM/YYYY",
                             "DD-MM-YYYY", "DD MM YYYY", "DD MMM YYYY", "DD MMMM YYYY"];
    return accepted_format.map(format => {
        const date = moments(requested_date, format, 'fr', true);
        if (date.isValid())
            return year[date.format("2020-MM-DD")];
    }).filter(item => {
        return item !== undefined;
    });
}

//
export const getRemainingDay = (almanax_date) => {
    const current_date = new Date();
    const date = moments([current_date.getFullYear(), current_date.getMonth(), current_date.getDate()]);
    let searched_date = moments([current_date.getFullYear(), Number(almanax_date.split("-")[1]) - 1, almanax_date.split("-")[2]]);
    if (date > searched_date)
        searched_date = moments([current_date.getFullYear() + 1, Number(almanax_date.split("-")[1]) - 1, almanax_date.split("-")[2]]);
    const diff = date.diff(searched_date, 'days');
    return Math.abs(Math.trunc(diff));
}

// TODO URGENT
export const createEmbed = async (almanax, id) => {
    const remaining_days = getRemainingDay(almanax.Date);
    const average_price = 0;//await getPrice(almanax.URL.substring(62).split('-')[0], id);
    almanax.URL = 0;
    const embed = new RichEmbed()
        .setColor('0x4E4EC8')
        .setTitle("**Almanax du " + moments(almanax.Date.slice(5), "MM-DD", 'fr', true).format("DD MMMM") + "**")
        .setURL("https://www.krosmoz.com/fr/almanax/" + almanax.Date + "?game=dofustouch")
        .setThumbnail(almanax.Offrande_Image)
        .addField("🙏 Offrande:", "[**" + almanax.Offrande_Name + "**](" + almanax.URL + ") **x" + almanax.Offrande_Quantity + "**")
        .addField("📜 Bonus:", "```" + almanax.Bonus_Description + "```\n*Type de Bonus*: " + almanax.Bonus_Type)
        .addField("⏳ Temps:", "Cette almanax aura lieu " + (
            (remaining_days) <= 1 ? (
                (remaining_days == 1) ? "**demain**" : "**aujourd'hui**"
            ) : `dans **${remaining_days}** jours`), true)
          .addField("💵 Prix:", "Le prix moyen de l'offrande est actuellement de **" + (
	      (average_price >= 0)
		    ? "+" : "") + `${average_price}%** comparé à la semaine derniere.`, true)
    if (almanax.Event_Name) {
        embed.addField("🎉 Event: **" + almanax.Event_Name + "**", almanax.Event_Description)
        embed.setImage(almanax.Event_Image)
    }
    return embed;
}

// 
export const createFutureEmbed = (required_almanax) => {
    const current_date = moments();
    // TODO replace '25' by the maximum `field` value
    if (required_almanax > 25)
        required_almanax = 25;
     if (required_almanax <= 0)
        required_almanax = 1;
    const embed = new RichEmbed()
        .setColor('0x4E4EC8')
        .setTitle("Almanax du **" + current_date.format("DD/MM") + "** au **" + moments().add(required_almanax, 'days').format("DD/MM") + "**")
    for (let i = 0; i < required_almanax; i++) {
        const date = current_date.add(1, 'days');
        const almanax = getDate(date.format("DD/MM"))[0];
        embed.addField(date.format("DD MMMM"), `🙏 **x${almanax.Offrande_Quantity}** [**${almanax.Offrande_Name}**](${almanax.URL})\n📜 ${almanax.Bonus_Description}\n`, true);
    }
    return embed;
}

//
export const createZodiacEmbed = (almanax, zodiac_list) => {
    console.log("toto")
    console.log(zodiac_list)
    console.log(almanax.Date.slice(5))
    console.log(moments(almanax.Date.slice(5), "MM-DD", 'fr', true).format("DD MMMM"))
    const embed = new RichEmbed()
        .setColor('0x4E4EC8')
        .setTitle("**Zodiac du " + moments(almanax.Date.slice(5), "MM-DD", 'fr', true).format("DD MMMM") + "**")
        .setDescription("Hmmm... Apres de nombreuse recherche a travers le Krosmoz, je suis en mesure de t'affirmer que ton signe du zodiac est:")
        .setThumbnail(zodiac_list[almanax.Zodiac_Name].Image)
        .addField("**" + zodiac_list[almanax.Zodiac_Name].Name + "**", zodiac_list[almanax.Zodiac_Name].Description)
    if (almanax.Event_Name) {
        embed.addField("📅 Tu es par ailleur né lors de: **" + almanax.Event_Name + "**", almanax.Event_Description)
        embed.setImage(almanax.Event_Image)
    }
    return embed;
}
