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
		return UserModel.find({}, async (err: any, users: mongoose.Document) => {
			for (const id in users) {
                const user = bot.users.cache.filter((toto: User) => toto.id === users[id].identifier);
				users[id].subscriptions.map(async (offering) => {
                    const date: moment.Moment = moment(offering.date, 'YYYY-MM-DD');
                    const duration: moment.Duration = moment.duration(date.diff(current_date));
                    const elapsed: number = Math.round(duration.asDays());
                    const days: number = (elapsed < 0) ? 365 + elapsed : elapsed;
                    if (days === 7 || days === 30)
                        await user[0].send(format(sentences[users[id].lang].SUCCESS_NOTIFICATION, days));
                });
            }
			bot.destroy();
			process.exit(0);
		});
	});
	bot.login(settings.discord.token);
};