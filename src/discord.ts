import { Client, Message, Guild, GuildChannel, TextChannel } from 'discord.js';
import { format } from 'format';
import * as sentences from "../resources/language.json";
import * as settings from "../resources/config.json";
import * as commands from "./commands/";
import Server from "./models/server";

const bot: Client = new Client();

bot.on('ready', (): void => {
    console.log("Actuellement connécté sur les serveurs:");
    try {
        bot.guilds.cache.forEach((guild: Guild) => { console.log(" - " + guild.name) });
        bot.user.setActivity("le Krosmoz", { type: "WATCHING" });
    } catch {
        process.exit(1);
    }
});

bot.on("guildCreate", async (guild: Guild): Promise<void> => {
    const channel: GuildChannel = guild.channels.cache.find((chan: GuildChannel) =>
        ["general", "bienvenue", "acceuil", "bavardage", "hall"]
            .includes(chan.name.toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ""))
    );
    (channel as TextChannel).send(`Salut ! Moi c'est Bruno, je suis un robot ayant parcouru l'intégralité du Krosomoz dans la spatio-temporalité de Dofus-Touch. Je suis en mesure de répondre à n'importe laquelle de tes questions sur l'almanax ! Tu peux me demander quand auront lieux les almanax economie d'ingrédient ou à quelle date l'almanax "Plume de Tofu" aura lieu par exemple. J'ai été conçu par les créateurs de DT-Price.\nQue dirais tu d'un \`!bruno help\` pour commencer?`);
    await Server.create({ 
        identifier: guild.id, name: guild.name, lang: 0, server_id: 2,
        auto_mode: false, prefix: settings.bruno.default_prefix
    });
});

bot.on("guildDelete", async (guild: Guild): Promise<void> => {
    await Server.findOneAndDelete({ identifier: guild.id });
});

// 
bot.on('message', async (message: Message): Promise<void> => {
    if (!message.guild || message.author.bot)
        return;
    const config: any = await Server.findOne({ identifier: message.guild.id });
    if (message.content.toLowerCase().startsWith(config.prefix)) {
        const author: string = message.author.username + "#" + message.author.discriminator;
        const response: string = message.content.replace(config.prefix, '');
        const sentence: string[] = response.split(" ");
        console.log(`${author}: ${message.content}`);
        const functions: any = { 
            "help": commands.help, "item": commands.item, "almanax": commands.almanax,
            "zodiac": commands.zodiac, "type": commands.type, "list": commands.list,
            "auto": commands.auto, "server": commands.server, "prefix": commands.prefix,
            "lang": commands.lang, "guild": commands.guild, "whois": commands.whois
        };
        try {
            functions[sentence[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")](message, sentence, config);
        } catch (err) {
            message.channel.send(format(sentences[config.lang].ERROR_COMMAND_NOT_FOUND, sentence[0], `${config.prefix}help`));
        }
    }
});

export default bot;
