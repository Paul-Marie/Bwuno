import * as sentences from "../../resources/sentence";
import { getDate, formatDate, createZodiacEmbed } from "../../src/utils";
import { Message, RichEmbed } from 'discord.js';

export const zodiac = (message: Message, line: string[]): Promise<Message> => {
    if (line.length < 2)
        return message.channel.send("Donne moi ta date d'anniversaire pour que je te revele ton signe du zodiac!");
    line.shift()
    const argument: string = formatDate(line).toLowerCase();
    const almanax: any = getDate(argument)[0];
    if (!almanax)
        return message.channel.send("Je n'ai pas compris cette date.")
    const embed: RichEmbed = createZodiacEmbed(almanax, sentences.zodiac_list)
    message.channel.send(embed);
}
