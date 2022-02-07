import * as sentences from "../../resources/language.json";
import * as settings  from "../../resources/config.json";
import { Message, MessageEmbed, MessageOptions } from 'discord.js';
import { format                } from 'format';

// Return an Embed object containing all Bwuno's informations
export const info = (message: Message, line: void, config: any): MessageOptions => {
  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0x4E4EC8)
    .setDescription(format(sentences[config.lang].INFO_ABOUT_DESCRIPTION,
      Math.floor(Math.random() * 90000) + 10000, settings.bwuno.name))
    .addField(sentences[config.lang].INFO_ABOUT_CREATOR, sentences[config.lang].INFO_ABOUT_CREATOR_CONTENT, true)
    .addField(sentences[config.lang].INFO_ABOUT_PROJECTS, sentences[config.lang].INFO_ABOUT_PROJECTS_CONTENT, true)
    .addField("Discord:", `[Discord](${settings.dt_price.invite_url})`)
    .addField(sentences[config.lang].INFO_ABOUT_INVIT, `[Invitation](${settings.bwuno.invite_link})`, true)
    .setImage("https://i.imgur.com/mcpPHoh.png")
  return { embeds: [embed] };
};
