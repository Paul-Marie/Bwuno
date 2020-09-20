import * as mongoose from 'mongoose';
import * as discord from 'discord.js';
import * as config from "../../resources/config.json";
import Server from '../models/server';

// CAUTION: This will drop bruno's database and recreate it with default value
export default async () => {
    console.log("Clearing database...");
    await mongoose.connection.dropDatabase();

    console.log("Creating servers...");
    const bot = new discord.Client();
    const server_list = [];

    bot.on('ready', async () => {
        try {
            bot.guilds.cache.forEach((guild) => {
                const server = {
                    identifier: guild.id,
                    name: guild.name,
                    lang: 0,
                    server_id: 2,
                    auto_mode: false,
                    prefix: config.bruno.default_prefix,
                };
                server_list.push(server);
            });

            await Server.create(server_list);
            console.log("All done, have a nice day!");
            process.exit(0);
        } catch {
            process.exit(1);
        }
    });
    bot.login(config.discord.token);
};
