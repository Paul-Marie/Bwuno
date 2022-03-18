import { Client, Intents, User } from 'discord.js';
import { format } from 'format';
import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
import * as moment from 'moment-timezone';
import * as mongoose from 'mongoose';
import UserModel from "../models/user";

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
    const current_date: moment.Moment = moment().tz("Europe/Paris").startOf("day");
    await UserModel.find({}, async (err: any, users: mongoose.Document[]) => {
      await Promise.all(users.map(async (user: any) => {
        const discord_user: User = await bot.users.fetch(user.identifier);
        await Promise.all(user.subscriptions.map(async (offering) => {
          const days: number = moment.duration(moment(offering.date, "YYYY-MM-DD").diff(current_date)).asDays();
          if (days === 0 || days === 7 || days === 30 || days === 90)
            await discord_user.send(format(sentences[user.lang].SUCCESS_NOTIFICATION, offering.name, days));
        }));
      }));
      bot.destroy();
      process.exit(0);
    });
  });
  await bot.login(settings.discord.token);
};
