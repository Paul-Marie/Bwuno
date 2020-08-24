import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { getDate, createEmbed } from "./utils";
import * as settings from "../resources/config.json";
import * as moment from 'moment-timezone';
import * as mongoose from 'mongoose';
import Server from "./models/server";

const bot: Client = new Client();

export default async (): Promise<void> => {
    bot.on('ready', async () => {
		const date: moment.Moment = moment().tz("Europe/Paris");
		const almanax: any = getDate(date.format("DD/MM"))[0];
		return Server.find({}, async (err: any, servers: mongoose.Document) => {
			for (const id in servers)
				if (servers[id].auto_mode) {
					const embed: MessageEmbed = await createEmbed(almanax, servers[id].server_id);
					await (bot.channels.cache.get(servers[id].auto_channel) as TextChannel).send(embed);
				}
			bot.destroy();
			process.exit(0);
		});
	});
	bot.login(settings.discord.token);
};
