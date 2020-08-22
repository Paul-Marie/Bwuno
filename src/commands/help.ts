import * as sentences from "../../resources/sentence";
import { Message, RichEmbed } from 'discord.js';

// 
export const help = (message: Message) => {
    const embed: RichEmbed = sentences.help_message;
    message.channel.send({ embed });
}
