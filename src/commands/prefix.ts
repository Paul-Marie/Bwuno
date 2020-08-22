import * as sentences from "../../resources/sentence";
import { Message } from 'discord.js';
import Server from "../models/server";

//
export const prefix = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length !== 2)
        return message.channel.send("USAGE: `<old_prefix>prefix <new_prefix>`");
    let argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    if (!message.member.guild.me.hasPermission('ADMINISTRATOR') ||
	    !(message.member.guild.me.hasPermission('MANAGE_ROLES_OR_PERMISSIONS') &&
	        message.member.guild.me.hasPermission('MANAGE_MESSAGES')))
        message.channel.send("Tu n'as pas les permissions :sob:, Demande à un admin du serveur d'executer la commande pour toi :smile:");
    else if (config.prefix === argument)
        message.channel.send("C'est deja le prefix utilisé.");
    else {
        if (argument.length >= 3)
            argument += ' ';
        await Server.findOneAndUpdate({ identifier: config.identifier }, { prefix: argument });
        message.channel.send(`Vous pouvez désormais me parlé comme ceci: \`${argument}help\`.`);
    }
}
