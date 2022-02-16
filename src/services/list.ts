import * as sentences                   from "../../resources/language.json";
import { list_message                 } from "../../resources/info";
import { MessageEmbed, MessageOptions } from 'discord.js';

// Display list of all almanax's bonuses type
export const list = (command: void, { lang }): MessageOptions => ({
  embeds: [new MessageEmbed()
    .setColor("#4E4EC8")
    .setTitle(sentences[lang].INFO_LIST_TITLE)
    .addField(sentences[lang].INFO_LIST_XP_FIELD,
      Object.keys(list_message.xp).map(title => `🔹 ${title}`).join('\n'))
    .addField(sentences[lang].INFO_LIST_JOB_FIELD,
      Object.keys(list_message.job).map(title => `▫️ ${ title}`).join('\n'))
    .addField(sentences[lang].INFO_LIST_MISCELLANEOUS_FIELD,
      Object.keys(list_message.miscellaneous).map(title => `🔸 ${title}`).join('\n'))
  ]
});
