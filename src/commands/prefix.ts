import * as sentences from "../../resources/language.json";
import Server from "../models/server";
import { Message } from 'discord.js';
import { format } from 'format';

//
export const prefix = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length !== 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}prefix [new_prefix]`));
    let argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    if (!message.member.hasPermission(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
        message.channel.send(sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS);
    else if (config.prefix === argument)
        message.channel.send(sentences[config.lang].ERROR_PREFIX_ALREADY);
    else {
        if (argument.length >= 3)
            argument += ' ';
        await Server.findOneAndUpdate({ identifier: config.identifier }, { prefix: argument });
        message.channel.send(format(sentences[config.lang].SUCCESS_PREFIX_CHANGED, `${argument}help`));
    }
}
