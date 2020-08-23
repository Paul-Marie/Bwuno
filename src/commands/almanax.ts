import * as sentences from "../../resources/sentence";
import { getDate, formatDate, getList, createEmbed, createFutureEmbed } from "../../src/utils";
import { Message, MessageEmbed } from 'discord.js';

export const almanax = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length < 2) {
        return message.channel.send("Tu as oublié de me donner la date de l'almanax.");
    } else {
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
}

//
export const item = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length === 1)
        return message.channel.send("Tu as oublié l'item.");
    line.shift();
    const argument: string = line.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const result: any[] = getList(argument);
    if (!result[0])
        return message.channel.send("Malgré mes recherches, je n'ai pas trouvé cet item dans la liste des offrandes... Peut etre l'as tu mal orthographié? (Vérifie l'orthographe sur l'encyclopédie du site officiel)")
    for (const almanax of result) {
        const embed: MessageEmbed = await createEmbed(almanax, config.server_id);
        message.channel.send(embed);
    }
}
