/*
  Cron file called each day at 00h00 to display almanax of day in each discord guild with auto mode enabled
*/
import { Client,
  TextChannel, Intents } from 'discord.js';
import { getDate       } from "../utils/utils";
import { createEmbed   } from "../utils/embed";
import { createButtons } from "../utils/buttons";
import Server            from "../models/server";
import * as settings     from "../../resources/config.json";
import * as moment       from 'moment-timezone';

const bot: Client = new Client({ intents: [ Intents.FLAGS.GUILDS ] });

export default async (): Promise<void> => {
  bot.on("ready", async () => {
		const date: string = moment().tz("Europe/Paris").format("DD/MM");
		const almanax: any = getDate(date)?.[0];
		const servers = await Server.find({ auto_mode: true });
    await Promise.all(servers.map(async ({ auto_channel, server_id }) => (
      await (bot.channels.cache.get(auto_channel) as TextChannel).send({
        embeds: [await createEmbed(almanax, server_id)],
        ...createButtons(almanax.Date)
      })
    )));
    bot.destroy();
    process.exit(0);
	});
	bot.login(settings.discord.token);
};
