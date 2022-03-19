/*
  Cron file called each day at 00h00 to display almanax of day in each discord guild with auto mode enabled
*/
import { Client, TextChannel, GuildBasedChannel, Collection, Message, Intents } from 'discord.js';
import * as settings from "../../resources/config.json";
import * as moment from 'moment';

const bot: Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
});

export default async (): Promise<void> => {
  bot.on('ready', async () => {
    const id: string = bot.guilds.cache.filter((e: any) => e.name.includes(`${process.argv[3]}`)).map((e) => e.id)[0];
    const handleTime = (timestamp: any) => moment(timestamp).format("DD/MM/YYYY - hh:mm:ss a").replace("pm", "PM").replace("am", "AM");
    bot.guilds.cache.get(id).channels.cache.map(async (ch: GuildBasedChannel) => {
      if (ch.type === "GUILD_TEXT") {
        try {
          const result: Collection<string, Message> = await (ch as TextChannel).messages.fetch({
            limit: 100
          });
          const msgs: Collection<string, Message> = result.filter(m => m.content.includes(process.argv[4] || ""))
          msgs.forEach((m: Message) => {
            console.log(`${handleTime(m.createdAt)} ${m.author.username}#${m.author.discriminator} ${(m.channel as TextChannel).name}:\n${m.content}`);
          })
        } catch {}
      }
    })
  });
  bot.login(settings.discord.token);
};
