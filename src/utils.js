const Discord = require('discord.js')
const moments = require('moment');
const fs = require('fs');

moments.locale('fr');

//
const formatDate = (sentence) => {
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
const getAlmanax = (bonus_types) => {
    const file = fs.readFileSync('./resources/year.json', "utf8")
    const object = JSON.parse(file);
    const result = Object.keys(object).map(key => {
        if (bonus_types.indexOf(object[key].Bonus_Type) >= 0) {
            const date = moments(key, "YYYY-MM-DD", 'fr');
            return "**" + date.format("DD MMMM") + "**: " + object[key].Bonus_Description + "\n";
        }
    }).filter(item => {
        return item !== undefined;
    });
    return result;
}

//
const getList = (item_name) => {
    const file = fs.readFileSync('./resources/year.json', "utf8")
    const object = JSON.parse(file);
    const result = Object.keys(object).map(key => {
        const epured = object[key].Offrande_Name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (epured === item_name)
            return object[key];
    }).filter(item => {
        return item !== undefined;
    });
    return result;
}

//
const getDate = (requested_date) => {
    const file = fs.readFileSync('./resources/year.json', "utf8")
    const object = JSON.parse(file);
    const accepted_format = ["DD/MM", "DD-MM", "DD MM", "DD MMM", "DD MMMM", "DD/MM/YYYY",
                             "DD-MM-YYYY", "DD MM YYYY", "DD MMM YYYY", "DD MMMM YYYY"];
    return accepted_format.map(format => {
        const date = moments(requested_date, format, 'fr', true);
        if (date.isValid()) {
            return object[date.format("2020-MM-DD")];
        }
    }).filter(item => {
        return item !== undefined;
    });
}

//
const getRemainingDay = (almanax_date) => {
    const current_date = new Date();
    const date = moments([current_date.getFullYear(), current_date.getMonth(), current_date.getDate()]);
    let searched_date = moments([current_date.getFullYear(), Number(almanax_date.split("-")[1]) - 1, almanax_date.split("-")[2]]);
    if (date > searched_date)
        searched_date = moments([current_date.getFullYear() + 1, Number(almanax_date.split("-")[1]) - 1, almanax_date.split("-")[2]]);
    const diff = date.diff(searched_date, 'days');
    return Math.abs(Math.trunc(diff));
}

// URGENT
const createEmbed = (almanax) => {
    const remaining_days = getRemainingDay(almanax.Date);
    const embed = new Discord.RichEmbed()
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
        .addField("💵 Prix:", "Le prix moyen de l'offrande est actuellement de **" + 0 + "%** comparé à la semaine derniere.", true)
    if (almanax.Event_Name) {
        embed.addField("🎉 Event: **" + almanax.Event_Name + "**", almanax.Event_Description)
        embed.setImage(almanax.Event_Image)
    }
    return embed;
}

// 
const createFutureEmbed = (required_almanax) => {
    const current_date = moments();
    // TODO replace '25' by the maximum `field` value
    if (required_almanax > 25)
        required_almanax = 25;
     if (required_almanax <= 0)
        required_almanax = 1;
    const embed = new Discord.RichEmbed()
        .setColor('0x4E4EC8')
        .setTitle("Almanax du **" + current_date.format("DD/MM") + "** au **" + moments().add(required_almanax, 'days').format("DD/MM") + "**")
    for (i = 0; i < required_almanax; i++) {
        const date = current_date.add(1, 'days');
        const almanax = getDate(date.format("DD/MM"))[0];
        embed.addField(date.format("DD MMMM"), `🙏 **x${almanax.Offrande_Quantity}** [**${almanax.Offrande_Name}**](${almanax.URL})\n📜 ${almanax.Bonus_Description}\n`, true);
    }
    return embed;
}

//
const createZodiacEmbed = (almanax, zodiac_list) => {
    const embed = new Discord.RichEmbed()
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

module.exports = {
    getAlmanax,
    getList,
    getDate,
    formatDate,
    createEmbed,
    createFutureEmbed,
    createZodiacEmbed
}
