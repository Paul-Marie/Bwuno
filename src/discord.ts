//const Discord = require('discord.js');
import * as discord from 'discord.js';
import { GuildChannel, Collection } from 'discord.js';
import * as commands from "./commands/";

const bot = new discord.Client();

bot.on('ready', () => {
    console.log("[BOOT] Bip Boop, Bip Boop, Me voila pret !")
    console.log("Actuellement connécté sur les serveurs:")
    try {
        bot.guilds.forEach((guild) => {
            console.log(" - " + guild.name)
        })
        bot.user.setActivity("le Krosmoz", {type: "WATCHING"})
    } catch {
        process.exit(1);
    }
});

bot.on("guildCreate", guild => {
    // TODO add server in the MongoDB and check default channel id to post message
    //console.log(`J'ai rejoins le serveur ${guild.name} (${guild.id}). Il a ${guild.memberCount} membres!`);
    //!\\ guild.defaultChannel //!\\
    let channelID: any;
    let channels: any = guild.channels;
    channelLoop:
    for (let c of channels) {
        let channelType = c[1].type;
        if (channelType === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }
    //let channel: discord.Channel = bot.channels.get(guild.systemChannelID || channelID);
    let channel: any = bot.channels.get(channelID);
    try {
        channel.send(`Salut ! Moi c'est Bruno, je suis un robot ayant parcouru l'intégralité du Krosomoz dans la spatio-temporalité de Dofus-Touch. Je suis en mesure de répondre à n'importe laquelle de tes questions sur l'almanax ! Tu peux me demander quand auront lieux les almanax economie d'ingrédient ou à quelle date l'almanax "Plume de Tofu" aura lieu par exemple. J'ai été conçu par les créateurs de DT-Price.\nQue dirais tu d'un \`!bruno help\` pour commencer?`);
    } catch {
        return;
    }
});

// 
bot.on('message', message => {
    if (message.content.toLowerCase().startsWith("!bruno")) {
        const author = message.author.username + "#" + message.author.discriminator;
        const sentence = message.content.split(" ");
        console.log("[MESSAGE (" + author + ")] " + message.content);
        /*if (sentence.length === 1) {
            if (empty_iterator <= 3 && failure_iterator <= 4) {
                message.channel.send(Sentence.empty_message[empty_iterator]);
                empty_iterator += 1;
            } else
                failure_iterator = 5;
            return;
        }
        empty_iterator = 0;
        */
        const functions = { 
            "help": commands.help, "item": commands.item, "almanax": commands.almanax,
            "zodiac": commands.zodiac, "type": commands.type, "list": commands.list,
            "auto": commands.auto, "server": commands.server
        };
        try {
            functions[sentence[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")](message, sentence)
            //failure_iterator = 0;
        } catch {
            console.error("[ERROR (INVALID_COMMAND)] Command: \"" + sentence[1] + "\".");
            /*if (failure_iterator <= 4) {
                message.channel.send(Sentence.failure_message[failure_iterator]);
                failure_iterator += 1;
            } else
                empty_iterator = 4;*/
        }
    }
});

export default bot;
