import { Message, Guild, Channel } from 'discord.js';
import * as sentences from "../../resources/sentence";
import Server from "../models/server";

const tmp = { "o": "Oshimo", "t": "Terra Cogita", "h": "Herdegrize" };
const tmp2 = { "Oshimo": 1, "Terra Cogita": 2, "Herdegrize": 3 };

//
export const server = async (message: Message, line: Array<string>, config: any) => {
    if (line.length <= 1)
        return message.channel.send("Precise le serveur (Oshimo, Terra Cogita ou Herdegrize)");
    if (!message.member.guild.me.hasPermission('ADMINISTRATOR') ||
	    !(message.member.guild.me.hasPermission('MANAGE_ROLES_OR_PERMISSIONS') &&
	        message.member.guild.me.hasPermission('MANAGE_MESSAGES')))
        return message.channel.send("Tu n'as pas les permissions, Demande à un admin du serveur.");
    let argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const server = tmp[argument[0]];
    if (!server)
        return message.channel.send("Je ne gere malheuresement que les serveurs \`Oshimo\`, \`Terra Cogita\` et \`Herdegrize\` pour le moment.");
    await Server.findOneAndUpdate({ identifier: config.identifier }, { server_id: tmp2[server] });
    return message.channel.send(`Je vous communiquerais maintenant l'évolution des prix des offrandes du serveur \`${server}\``);
}
