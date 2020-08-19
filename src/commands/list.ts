import * as sentences from "../../resources/sentence";
import { Message, RichEmbed } from 'discord.js';

// TODO to comment
export const list = (message: Message) => {
    let type_list: string = "";
    for (const title of Object.keys(sentences.type_message))
        type_list += `▫️ ${title}\n`;
    const embed: RichEmbed  = new RichEmbed()
        .setColor("0x4E4EC8")
        .addField("Liste des Bonus Almanax:", type_list)
    message.channel.send({ embed });
}
