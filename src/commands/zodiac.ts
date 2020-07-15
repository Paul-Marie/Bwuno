import * as sentences from "../../resources/sentence";
import { getDate, formatDate, createZodiacEmbed } from "../../src/utils";
import { Message } from 'discord.js';

export const zodiac = (message: Message, line: String) => {
    if (line.length === 2) {
        message.channel.send("Donne moi ta date d'anniversaire pour que je te revele ton signe du zodiac!");
        return;
    } else {
        const argument = formatDate(line.slice(2, line.length));
        const epured_argument = argument.toLowerCase();
        const almanax = getDate(epured_argument)[0];
        if (!almanax) {
            message.channel.send("Je n'ai pas compris cette date.")
            return;
        }
        const embed = createZodiacEmbed(almanax, sentences.zodiac)
        message.channel.send(embed);
    }
}
