import * as sentences from "../../resources/sentence";
import { Message } from 'discord.js';
import Server from "../models/server";

const tmp: any = { "o": "Oshimo", "t": "Terra Cogita", "h": "Herdegrize" };
const tmp2: any = { "Oshimo": 1, "Terra Cogita": 2, "Herdegrize": 3 };

//
export const server = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length <= 1)
        return message.channel.send("Precise le serveur (Oshimo, Terra Cogita ou Herdegrize)");
    if (!message.member.guild.me.hasPermission('ADMINISTRATOR') ||
	    !message.member.guild.me.hasPermission('MANAGE_MESSAGES'))
        return message.channel.send("Tu n'as pas les permissions, Demande à un admin du serveur.");
    const argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const server: string = tmp[argument[0]];
    if (!server)
        return message.channel.send("Je ne gere malheuresement que les serveurs \`Oshimo\`, \`Terra Cogita\` et \`Herdegrize\` pour le moment.");
    await Server.findOneAndUpdate({ identifier: config.identifier }, { server_id: tmp2[server] });
    message.channel.send(`Je vous communiquerais maintenant l'évolution des prix des offrandes du serveur \`${server}\``);
}
