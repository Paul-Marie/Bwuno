import * as sentences from "../../resources/sentence";
import { getDate, formatDate, createZodiacEmbed } from "../../src/utils";
import { Message } from 'discord.js';

export const zodiac = (message: Message, line: Array<string>) => {
    if (line.length <= 2) {
        return message.channel.send("Donne moi ta date d'anniversaire pour que je te revele ton signe du zodiac!");
    } else {
        line.shift()
        const argument = formatDate(line);
        const epured_argument = argument.toLowerCase();
        const almanax = getDate(epured_argument)[0];
        if (!almanax)
            return message.channel.send("Je n'ai pas compris cette date.")
        const embed = createZodiacEmbed(almanax, sentences.zodiac_list)
        message.channel.send(embed);
    }
}
