import * as sentences from "../../resources/sentence";
import { Message } from 'discord.js';

// 
export const help = (message: Message, line: String) => {
    const embed = sentences.help;
    message.channel.send({ embed });
}
