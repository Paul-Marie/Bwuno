import * as sentences from "../../resources/sentence";
import { getDate, formatDate, createEmbed, createFutureEmbed } from "../../src/utils";
const fs = require('fs');
import { Message, Guild, Channel } from 'discord.js';

export const almanax = async (message: Message, line: any) => {
    if (line.length === 2) {
        message.channel.send("Tu as oublié de me donner la date de l'almanax.");
        return;
    } else {
        const epur = ([x, y, ...arr]) => arr;
        const argument = formatDate(line.slice(2, line.length));
        const epured_argument = argument.toLowerCase();
        const almanax = getDate(epured_argument)[0];
        if (!almanax) {
            const param = epur(line).join('');
            if (param.startsWith('+')) {
                const required_almanax = Number(param.slice(1, param.length));
                const embed = createFutureEmbed(required_almanax);
                message.channel.send(embed);
            } else {
                message.channel.send("Je n'ai pas compris cette date.")
                return
            }
        } else {
            fs.readFile("./resources/config.json", "utf-8", async (err: Error, buffer: any) => {
                const data = JSON.parse(buffer)
                const embed = await createEmbed(almanax, data[message.guild.id].server);
                message.channel.send(embed);
            });
        }
    }
}
