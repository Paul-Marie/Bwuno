import * as sentences from "../../resources/language.json";
import Server from "../models/server";
import { Message } from 'discord.js';
import { format } from 'format';

const tmp: any = { "o": "Oshimo", "t": "Terra Cogita", "h": "Herdegrize" };
const tmp2: any = { "Oshimo": 1, "Terra Cogita": 2, "Herdegrize": 3 };

//
export const server = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length <= 1)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFICIANT_ARGUMENT, `${config.prefix}server ['Oshimo'|'Terra Cogita'|'Herdegrize']`));
    if (!message.member.guild.me.hasPermission('ADMINISTRATOR') ||
	    !message.member.guild.me.hasPermission('MANAGE_MESSAGES'))
        return message.channel.send(sentences[config.lang].ERROR_INSUFICIANT_PERMISSION);
    const argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const server: string = tmp[argument[0]];
    if (!server)
        return message.channel.send(sentences[config.lang].ERROR_UNKNOWN_SERVER);
    await Server.findOneAndUpdate({ identifier: config.identifier }, { server_id: tmp2[server] });
    message.channel.send(format(sentences[config.lang].SUCCESS_SERVER_CHANGED, `${server}`));
}
