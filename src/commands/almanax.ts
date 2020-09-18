import * as sentences from "../../resources/language.json";
import * as year from "../../resources/year.json";
import { getDate, formatDate, getList } from "../utils/utils";
import { createEmbed, createFutureEmbed } from "../utils/embed";
import { Message, MessageEmbed } from 'discord.js';
import * as moment from 'moment';

// TODO make possible to use `{prefix}almanax` and get today's almanax
// Send all almanax's informations Embed from a date
export const almanax = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length < 2)
        return message.channel.send(await createEmbed(year[moment().format("2020-MM-DD")], config.server));
    line.shift()
    const argument: string = formatDate(line).toLowerCase();
    const almanax: any = getDate(argument)[0];
    if (!almanax) {
        const param: string = line.join('');
        if (param.startsWith('+')) {
            const required_almanax: number = Number(param.slice(1, param.length));
            const embed: MessageEmbed = createFutureEmbed(required_almanax);
            message.channel.send(embed);
        } else {
            line.unshift(config.prefix)
            item(message, line, config);
        }
    } else {
        const embed: MessageEmbed = await createEmbed(almanax, config.server);
        message.channel.send(embed);
    }
}

// Send all almanax's informations Embed from an item's name
export const item = async (message: Message, line: string[], config: any): Promise<Message> => {
    line.shift();
    const argument: string = line.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const result: any[] = getList(argument);
    if (!result[0])
        return message.channel.send(sentences[config.lang].ERROR_INCORRECT_DATE_OR_ITEM);
    for (const almanax of result) {
        const embed: MessageEmbed = await createEmbed(almanax, config.server_id);
        message.channel.send(embed);
    }
}
