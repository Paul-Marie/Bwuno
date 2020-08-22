import * as sentences from "../../resources/sentence";
import { Message, RichEmbed } from 'discord.js';

// TODO to comment
export const list = (message: Message) => {
    let type_list: string[] = ['', '', ''];
    for (const title of Object.keys(sentences.list_message.xp))
        type_list[0] += `🔹 ${title}\n`;
    for (const title of Object.keys(sentences.list_message.job))
        type_list[1] += `▫️ ${title}\n`;
    for (const title of Object.keys(sentences.list_message.miscellaneous))
        type_list[2] += `🔸 ${title}\n`;
    const embed: RichEmbed  = new RichEmbed()
        .setColor("0x4E4EC8")
        .setTitle("Liste des Bonus Almanax:")
        .addField("XP / Drop:", type_list[0])
        .addField("Métier:", type_list[1])
        .addField("Divers", type_list[2])
    message.channel.send({ embed });
}
