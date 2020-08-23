import * as sentences from "../../resources/language.json";
import { Message } from 'discord.js';
import Server from "../models/server";

//
export const auto = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length > 2)
        return message.channel.send("gneuh");
    const argument: string = (line[1] || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    if (!message.member.guild.me.hasPermission(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
        return message.channel.send("Tu n'as pas les permissions, Demande à un admin du serveur");
    let activate: Boolean;
    if (argument === '')
        activate = !config.auto_mode;
    if (["on", "true", "1", "start"].includes(argument) || activate) {
        if (config.auto_mode)
            return message.channel.send(`Il est déja activé dans le salon <#${message.channel.id}>`);
        await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: true, auto_channel: message.channel.id });
        message.channel.send(`J'enverrais dorrenavant les almanax du jours dans ce salon a minuit !`);
    } else if (["off", "false", "0", "stop"].includes(argument) || !activate) {
        if (!config.auto_mode)
            return message.channel.send(`Oupsi, le mode automatique n'est pas activé sur ce serveur`);
        await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: false, auto_channel: undefined });
        message.channel.send(`Vous ne recevrez plus les almanax du jour a minuit dans ce salon !`);
    } else
        message.channel.send(`erreur`);
}
