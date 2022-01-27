/*
  This file contain all the discord logic.
*/
import { format } from 'format';
import { Client, Message, Guild, GuildChannel, TextChannel } from 'discord.js';
import * as sentences from "../resources/language.json";
import * as settings from "../resources/config.json";
import * as commands from "./commands/";
import Server from "./models/server";

export const bot: Client = new Client();

// Called when Bwuno is online
bot.on("ready", async (): Promise<void> => {
  console.log("Actuellement connécté sur les serveurs:");
  try {
    bot.guilds.cache.forEach((guild: Guild) => console.log(` - ${guild.name}`));
    await bot.user.setActivity("le Krosmoz", { type: "WATCHING" });
  } catch {
    process.exit(1);
  }
});

// TODO: Check if it's really usefull...
// Called when Bwuno is offline
bot.on('shardDisconnect', (event: CloseEvent, id: number): void => {
  console.log(`Disconnected: ${id}`);
  console.log(event);
  process.exit(1);
});

// Called when Bwuno join a new discord' server
bot.on("guildCreate", async (guild: Guild): Promise<void> => {
  try {
    const server = await Server.findOne({ identifier: guild.id });
    if (server)
      return;
    const channel: GuildChannel = guild.channels?.cache?.find((chan: GuildChannel) =>
      ["general", "bienvenue", "acceuil", "bavardage", "hall"].some(elem => chan.name
        .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(elem)));
    await Server.create({ 
      identifier: guild.id, name: guild.name, lang: 0, server_id: 2,
      auto_mode: false, prefix: settings.bwuno.default_prefix
    });
    (channel as TextChannel)?.send(`Salut ! Moi c'est Bwuno, je suis un robot ayant parcouru l'intégralité du Krosomoz dans la spatio-temporalité de Dofus-Touch. Je suis en mesure de répondre à n'importe laquelle de tes questions sur l'almanax ! Tu peux me demander quand auront lieux les almanax economie d'ingrédient ou à quelle date l'almanax "Plume de Tofu" aura lieu par exemple.\nHésite surtout pas à changer mon préfix, et que dirais tu d'un \`!bwuno help\` pour commencer?`);
  } catch {
    guild?.owner?.send(`Salut ! Moi c'est Bwuno, je suis un robot ayant parcouru l'intégralité du Krosomoz dans la spatio-temporalité de Dofus-Touch. Je suis en mesure de répondre à n'importe laquelle de tes questions sur l'almanax ! Tu peux me demander quand auront lieux les almanax economie d'ingrédient ou à quelle date l'almanax "Plume de Tofu" aura lieu par exemple.\nHésite surtout pas à changer mon préfix, et que dirais tu d'un \`!bwuno help\` pour commencer?`);
  }
});

// Called when Bwuno is kick or ban of a discord' server
bot.on("guildDelete", async (guild: Guild): Promise<void> => {
    await Server.findOneAndDelete({ identifier: guild.id });
});

// Called each time a message is posted on a guild where Bwuno belongs to
bot.on('message', async (message: Message): Promise<void> => {
  if (!message.guild || message.author.bot)
    return;
  // TODO: rename `config` into more revelant name like `server`
  const config: any = await Server.findOne({ identifier: message.guild.id });
  if (message.mentions.has(bot.user) && !message.mentions.everyone)
    message.channel.send(format(sentences[config.lang].INFO_MENTION,
      Math.floor(Math.random() * 90000) + 10000, config.prefix));
  else if (message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) {
    const author: string = `${message.author.username}#${message.author.discriminator}`;
    const response: string = message.content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      .replace(config.prefix.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""), '').trim();
    const sentence: string[] = response.split(" ");
    // TODO: improve logging
    console.log(`${author}: ${message.content}`);
    // TODO: delete extra commands
    const functions: any = {
      ...commands, "alarm": commands.subscribe, "remind": commands.subscribe, '': commands.help
    };
    try {
      functions[sentence[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")](message, sentence, config);
    } catch (err) {
      message.channel.send(format(sentences[config.lang].ERROR_COMMAND_NOT_FOUND, sentence[0], `${config.prefix}help`));
    }
  }
});
