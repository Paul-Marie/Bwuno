import * as sentences from "../../resources/language.json";
import Server from "../models/server";
import { Message } from 'discord.js';
import { format } from 'format';

//
export const auto = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length > 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFICIANT_ARGUMENT, `${config.prefix}auto ['on'|'off']`));
    const argument: string = (line[1] || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    if (!message.member.guild.me.hasPermission(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
        return message.channel.send(sentences[config.lang].ERROR_INSUFICIANT_PERMISSION);
    let activate: Boolean;
    if (argument === '')
        activate = !config.auto_mode;
    if (["on", "true", "1", "start"].includes(argument) || activate) {
        if (config.auto_mode)
            return message.channel.send(format(sentences[config.lang].ERROR_AUTO_ALREADY_ACTIVATED, `<#${message.channel.id}>`));
        await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: true, auto_channel: message.channel.id });
        message.channel.send(sentences[config.lang].SUCCESS_AUTO_ACTIVATED);
    } else if (["off", "false", "0", "stop"].includes(argument) || !activate) {
        if (!config.auto_mode)
            return message.channel.send(sentences[config.lang].ERROR_AUTO_NOT_ACTIVATED);
        await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: false, auto_channel: undefined });
        message.channel.send(sentences[config.lang].SUCCESS_AUTO_DESACTIVATED);
    } else
        message.channel.send(sentences[config.lang].ERROR_AUTO_UNKNOWN_ARGUMENT);
}
