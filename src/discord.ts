import { Client, Message, Guild } from 'discord.js';
import * as commands from "./commands/";
import Server from "./models/server";

const bot: Client = new Client();

bot.on('ready', () => {
    console.log("Actuellement connécté sur les serveurs:");
    try {
        bot.guilds.forEach((guild: Guild) => { console.log(" - " + guild.name) });
        bot.user.setActivity("le Krosmoz", { type: "WATCHING" });
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
bot.on('message', async (message: Message): Promise<void> => {
    if (!message.guild || message.author.bot)
        return;
    const config: any = await Server.findOne({ identifier: message.guild.id });
    if (message.content.toLowerCase().startsWith(config.prefix)) {
        const author: string = message.author.username + "#" + message.author.discriminator;
        const response: string = message.content.replace(config.prefix, '');
        const sentence: Array<string> = response.split(" ");
        console.log(`${author}: ${message.content}`);
        const functions: any = { 
            "help": commands.help, "item": commands.item, "almanax": commands.almanax,
            "zodiac": commands.zodiac, "type": commands.type, "list": commands.list,
            "auto": commands.auto, "server": commands.server, "prefix": commands.prefix,
            "lang": commands.lang
        };
        try {
            functions[sentence[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")](message, sentence, config);
        } catch (err) {
            console.log(`INVALID_COMMAND: ${sentence[0]}`);
            message.channel.send(`Commande \`${sentence[0]}\` introuvable. Essaye \`${config.prefix}help\`.`);
        }
    }
});

export default bot;
