import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
import { Message, MessageEmbed } from 'discord.js';
import { format } from 'format';

// Return an Embed object containing all commands' informations
export const help = (message: Message, line: void, config: any): void => {
  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0x4E4EC8)
    .setThumbnail(settings.bwuno.thumbnail_help)
    .addField(`\`${config.prefix}help\``, sentences[config.lang].INFO_HELP_BASE)
    .addField(`\`${config.prefix}info\``, format(sentences[config.lang].INFO_HELP_ABOUT, settings.bwuno.name))
    .addField(`\`${config.prefix}lang ['fr'|'en']\``, format(sentences[config.lang].INFO_HELP_LANG, settings.bwuno.name))
    .addField(`\`${config.prefix}prefix [prefix]\``, format(sentences[config.lang].INFO_HELP_PREFIX, settings.bwuno.name))
    .addField(`\`${config.prefix}server ['Oshimo'|'Terra Cogita'|'Herdegrize']\``, sentences[config.lang].INFO_HELP_SERVER)
    .addField(`\`${config.prefix}auto ['on'|'off']\``, sentences[config.lang].INFO_HELP_AUTO)
    .addField(`\`${config.prefix}list\``, sentences[config.lang].INFO_HELP_LIST)
    .addField(`\`${config.prefix}type [type]\``, sentences[config.lang].INFO_HELP_TYPE)
    .addField(`\`${config.prefix}almanax [date|item|+number]\``, sentences[config.lang].INFO_HELP_ALMANAX)
    .addField(`\`${config.prefix}guild [name]\``, sentences[config.lang].INFO_HELP_GUILD)
    .addField(`\`${config.prefix}whois [pseudo]\``, sentences[config.lang].INFO_HELP_WHOIS)
    .addField(`\`${config.prefix}zodiac [date]\``, sentences[config.lang].INFO_HELP_ZODIAC)
  message.channel.send({ embeds: [embed] });
};
