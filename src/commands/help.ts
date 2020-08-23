import * as sentences from "../../resources/sentence";
import { Message, MessageEmbed } from 'discord.js';

// 
export const help = (message: Message) => {
    const embed: MessageEmbed = sentences.help_message;
    message.channel.send({ embed });
}
