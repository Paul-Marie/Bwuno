import * as sentences                   from "../../resources/language.json";
import * as info                        from "../../resources/info";
import { MessageEmbed, MessageOptions } from 'discord.js';

// Display list of all almanax's bonuses type
export const list = (line: void, config: any): MessageOptions => {
  let type_list: string[] = ['', '', ''];
  for (const title of Object.keys(info.list_message.xp))
    type_list[0] += `🔹 ${title}\n`;
  for (const title of Object.keys(info.list_message.job))
    type_list[1] += `▫️ ${title}\n`;
  for (const title of Object.keys(info.list_message.miscellaneous))
    type_list[2] += `🔸 ${title}\n`;
  const embed: MessageEmbed = new MessageEmbed()
    .setColor("#4E4EC8")
    .setTitle(sentences[config.lang].INFO_LIST_TITLE)
    .addField(sentences[config.lang].INFO_LIST_XP_FIELD, type_list[0])
    .addField(sentences[config.lang].INFO_LIST_JOB_FIELD, type_list[1])
    .addField(sentences[config.lang].INFO_LIST_MISCELLANEOUS_FIELD, type_list[2])
  return { embeds: [embed] };
}
