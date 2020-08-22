import * as sentences from "../../resources/sentence";
import { getDate, formatDate, createEmbed, createFutureEmbed } from "../../src/utils";
import { Message, RichEmbed } from 'discord.js';

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
                const embed: RichEmbed = createFutureEmbed(required_almanax);
                message.channel.send(embed);
            } else
                message.channel.send("Je n'ai pas compris cette date.")
        } else {
            const embed: RichEmbed = await createEmbed(almanax, config.server);
            message.channel.send(embed);
        }
    }
}
