import * as sentences from "../../resources/sentence";
import { Message } from 'discord.js';

// 
export const help = (message: Message) => {
    const embed = sentences.help_message;
    message.channel.send({ embed });
}
