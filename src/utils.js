const Discord = require('discord.js')
const moments = require('moment');
const fs = require('fs');

moments.locale('fr');

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
        console.log(item_name)
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
        console.log("format: " + format);
        if (date.isValid()) {
            return object[date.format("2020-MM-DD")];
        }
    }).filter(item => {
        return item !== undefined;
    });
}

// URGENT
const createEmbed = (almanax, epured_argument) => {
    const current_date = new Date()
    const date = moments([Number(current_date.getFullYear()) + 1, current_date.getMonth(), current_date.getDate()]);
    const diff = date.diff(moments(almanax.Date), 'days') * -1;
    let remaining_days = (diff < 0) ? diff + 366 : diff;
    let embed = new Discord.RichEmbed()
        .setColor('0x4E4EC8')
        .setTitle("**Almanax du " + moments(almanax.Date.slice(5), "MM-DD", 'fr', true).format("DD MMMM") + "**")
        .setURL("https://www.krosmoz.com/fr/almanax/" + almanax.Date + "?game=dofustouch")
        .setThumbnail(almanax.Offrande_Image)
        .addField("🙏 Offrande:", "[**" + almanax.Offrande_Name + "**](" + almanax.URL + ") **x" + almanax.Offrande_Quantity + "**")
        .addField("📜 Bonus:", "```" + almanax.Bonus_Description + "```\n*Type de Bonus*: " + almanax.Bonus_Type)
        .addField("⏳ Temps:", "Cette almanax aura lieu dans **" + remaining_days + "** jour" + (remaining_days > 1 ? "s" : ""), true)
        .addField("💵 Prix:", "Le prix moyen de l'offrande est actuellement de **" + 0 + "%** comparé à la semaine derniere.", true)
    if (almanax.Event_Name) {
        embed.addField("🎉 Event: **" + almanax.Event_Name + "**", almanax.Event_Description)
        embed.setImage(almanax.Event_Image)
    }
    return embed;
}

module.exports = {
    getAlmanax,
    getList,
    getDate,
    createEmbed
}
