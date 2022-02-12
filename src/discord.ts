/*
  This file contain all the discord logic.
*/
import { format } from 'format';
//import { readdirSync } from 'fs';
import { Client, Message, Guild, GuildBasedChannel, TextChannel, Intents, Interaction, Collection, CommandInteraction, ClientEvents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as sentences from "../resources/language.json";
import * as settings from "../resources/config.json";
import * as services from "./services/";
import * as commands from "./commands/";
import Server from "./models/server";

declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, any>
  }
}
    
const rest = new REST({ version: '9' }).setToken(settings.discord.token);
export const bot: Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
});

bot.commands = new Collection();

import { ApplicationCommand, Client as toto } from "discord-slash-commands-client";

// Called when Bwuno is online
bot.on("ready", async (): Promise<void> => {
  try {
    const commandsList: any[] = Object.keys(commands)?.map((name: string) => commands[name]);
    console.log(`Curently connected on (${bot.guilds.cache.size}) servers:`);
    const tata: toto = new toto(settings.discord.token, bot.user.id);
    // await Promise.all(bot.guilds.cache.map(async (guild: Guild) => {
    //   console.log(`name: ${guild.name} id: ${guild.id}`);
    //   try {
    //     const titi: any = await tata.getCommands({ guildID: guild.id });//.then(console.log).catch(console.error);
    //     await new Promise(resolve => setTimeout(resolve, 3000));
    //     await Promise.all(titi.map(async (tete: ApplicationCommand) => await tata.deleteCommand(tete.id, guild.id)))
    //     await new Promise(resolve => setTimeout(resolve, 3000));
    //     console.log(`✔️ ${guild.name}`);
    //   } catch (error) {
    //     console.error(`❌ ${guild.name} ${error}`);
    //   }
    // }));
    // return
    for (const guild of bot.guilds.cache) {
      try {
        const titi: any = await rest.get(Routes.applicationGuildCommands(bot.user.id, guild[1].id));
        console.log(`✔️ ${guild[1].name} ${titi?.length}`);
        for (const tyty of titi) {
          try {
            //const tktk: any = await rest.delete(Routes.applicationGuildCommands(bot.user.id, guild[1].id));
            const tktkt = await tata.deleteCommand(tyty.id, guild[1].id)
            console.log(`\t✔️ ${tyty.name}`);
          } catch (errors) {
            console.error(`\t❌ ${guild[1].name} ${errors}`);
          }
        }
      } catch (error) {
        console.error(`❌ ${guild[1].name} ${error}`);
      } finally {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    return;
    await Promise.all(bot.guilds.cache.map(async (guild: Guild) => {
      console.log(guild.name);
      const data: any = await rest.get(Routes.applicationGuildCommands(bot.user.id, guild.id))
      console.log(data);
      return data;
      // const promises = [];
      // for (const command of data) {
      //   console.log("======");
      //   const deleteUrl: any = `${Routes.applicationGuildCommands(bot.user.id, guild.id)}/${command.id}`;
      //   console.log(deleteUrl);
      //   await rest.delete(deleteUrl);
      // }
      //return Promise.all(promises);
    }));
    // await Promise.all(bot.guilds.cache.map(async (guild: Guild) => {
    //   try {
    //     await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), { body: commandsList });
    //     console.log(` - ${guild.name} ✔️`);
    //   } catch (error) {
    //     console.log(` - ${guild.name} ❌`);
    //   }
    // }));
    console.log(`${commandsList.length} imported command${commandsList.length ? 's' : ''}.`);
    await bot.user.setActivity("le Krosmoz", { type: "WATCHING" });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

bot.on("disconnect", ({ reason, code }) => {
  console.log(`Disconnected (${code}): ${reason}`)
})

// Called when Bwuno join a new discord' server
bot.on("guildCreate", async (guild: Guild): Promise<void> => {
  try {
    const server = await Server.findOne({ identifier: guild.id });
    if (server)
      return;
    const channel: GuildBasedChannel = guild.channels?.cache?.find((chan: GuildBasedChannel) =>
      ["general", "bienvenue", "acceuil", "bavardage", "hall"].some((elem: string) => chan.name.epur().includes(elem)));
    await Server.create({
      identifier: guild.id, name: guild.name, lang: 0, server_id: 2,
      auto_mode: false, prefix: settings.bwuno.default_prefix
    });
    // TODO: Replace the welcome text in the .json
    (channel as TextChannel)?.send(`Salut ! Moi c'est Bwuno, je suis un robot ayant parcouru l'intégralité du Krosomoz dans la spatio-temporalité de Dofus-Touch. Je suis en mesure de répondre à n'importe laquelle de tes questions sur l'almanax ! Tu peux me demander quand auront lieux les almanax economie d'ingrédient ou à quelle date l'almanax "Plume de Tofu" aura lieu par exemple.\nHésite surtout pas à changer mon préfix, et que dirais tu d'un \`!bwuno help\` pour commencer?`);
  } catch {
    (await guild?.fetchOwner())?.send(`Salut ! Moi c'est Bwuno, je suis un robot ayant parcouru l'intégralité du Krosomoz dans la spatio-temporalité de Dofus-Touch. Je suis en mesure de répondre à n'importe laquelle de tes questions sur l'almanax ! Tu peux me demander quand auront lieux les almanax economie d'ingrédient ou à quelle date l'almanax "Plume de Tofu" aura lieu par exemple.\nHésite surtout pas à changer mon préfix, et que dirais tu d'un \`!bwuno help\` pour commencer?`);
  }
});

// Called when Bwuno is kick or ban of a discord' server
bot.on("guildDelete", async (guild: Guild): Promise<void> => {
  await Server.findOneAndDelete({ identifier: guild.id });
});

// Called each time a message is posted on a guild where Bwuno belongs to
bot.on("messageCreate", async (message: Message): Promise<void> => {
  if (!message.guild || message.author.bot)
    return;
  // TODO: rename `config` into more revelant name like `server`
  const config: any = await Server.findOne({ identifier: message.guild.id });
  if (message.mentions.has(bot.user) && !message.mentions.everyone)
    await message.channel.send(format(sentences[config.lang].INFO_MENTION,
      Math.floor(Math.random() * 90000) + 10000, config.prefix));
  else if (message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) {
    const author: string = `${message.author.username}#${message.author.discriminator}`;
    const response: string = message.content.epur().replace(config.prefix.epur(), '').trim();
    const sentence: string[] = response.split(" ");
    // TODO: improve logging
    console.log(`${author}: ${message.content}`);
    const functions: any = { ...services, '': services.help };
    try {
      await message.channel.send(await functions[sentence[0].epur()](sentence, config, message));
    } catch (err) {
      await message.channel.send(format(sentences[config.lang].ERROR_COMMAND_NOT_FOUND, sentence[0], `${config.prefix}help`));
    }
  }
});

// Called each time a message is posted on a guild where Bwuno belongs to
bot.on("interactionCreate", async (interaction: Interaction): Promise<void> => {
  console.dir(interaction, { depth: null });
  if (!interaction.isCommand())
    return;
  const config: any = await Server.findOne({ identifier: interaction.guild.id });
  try {
    await interaction.reply(await services[interaction.commandName.epur()](interaction, config, interaction));
  } catch (err) {
    console.trace(err);
    await interaction.reply(format(sentences[config.lang].ERROR_COMMAND_NOT_FOUND, interaction.commandName, `/help`));
  }
});