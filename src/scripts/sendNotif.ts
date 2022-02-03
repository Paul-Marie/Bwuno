import { Client, TextChannel, User } from 'discord.js';
import { format } from 'format';
import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
import * as moment from 'moment-timezone';
import * as mongoose from 'mongoose';
import UserModel from "../models/user";

const bot: Client = new Client();

export default async (): Promise<void> => {
  bot.on('ready', async () => {
    const current_date: moment.Moment = moment().tz("Europe/Paris");
    await UserModel.find({}, async (err: any, users: mongoose.Document[]) => {
      await Promise.all(users.map(async (user: any) => {
        const discord_user: User = await bot.users.fetch(user.identifier);
        await Promise.all(user.subscriptions.map(async (offering) => {
          const date: moment.Moment = moment(offering.date, "YYYY-MM-DD");
          const duration: moment.Duration = moment.duration(date.diff(current_date));
          const elapsed: number = Math.round(duration.asDays());
          const days: number = Math.round((elapsed < 0) ? 365 + elapsed : elapsed);
          if (days === 7 || days === 30)
            await discord_user.send(format(sentences[user.lang].SUCCESS_NOTIFICATION, offering.name, days));
        }));
      }));
      bot.destroy();
      process.exit(0);
    });
  });
  await bot.login(settings.discord.token);
};
