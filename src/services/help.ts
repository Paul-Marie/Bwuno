import * as sentences                   from "../../resources/language.json";
import * as settings                    from "../../resources/config.json";
import { MessageEmbed, MessageOptions, CommandInteraction } from 'discord.js';
import { format                       } from 'format';

// Return an Embed object containing all commands' informations
export const help = (line: Object, config: any): MessageOptions => {
  const prefix = line.isCommand() ? '/' : config.prefix;
  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0x4E4EC8)
    .setThumbnail(settings.bwuno.thumbnail_help)
    // TODO: add new commands
    .addField(`\`${prefix}help\``, sentences[config.lang].INFO_HELP_BASE)
    .addField(`\`${prefix}info\``, format(sentences[config.lang].INFO_HELP_ABOUT, settings.bwuno.name))
    .addField(`\`${prefix}lang ['fr'|'en']\``, format(sentences[config.lang].INFO_HELP_LANG, settings.bwuno.name))
    .addField(`\`${prefix}prefix [prefix]\``, format(sentences[config.lang].INFO_HELP_PREFIX, settings.bwuno.name))
    // TODO: put an object of all servers from `./utils/utils.ts`
    .addField(`\`${prefix}server ['Oshimo'|'Terra Cogita'|'Herdegrize']\``, sentences[config.lang].INFO_HELP_SERVER)
    .addField(`\`${prefix}auto ['on'|'off']\``, sentences[config.lang].INFO_HELP_AUTO)
    .addField(`\`${prefix}list\``, sentences[config.lang].INFO_HELP_LIST)
    .addField(`\`${prefix}type [type]\``, sentences[config.lang].INFO_HELP_TYPE)
    .addField(`\`${prefix}almanax [date|item|+number]\``, sentences[config.lang].INFO_HELP_ALMANAX)
    .addField(`\`${prefix}guild [name]\``, sentences[config.lang].INFO_HELP_GUILD)
    .addField(`\`${prefix}whois [pseudo]\``, sentences[config.lang].INFO_HELP_WHOIS)
    .addField(`\`${prefix}zodiac [date]\``, sentences[config.lang].INFO_HELP_ZODIAC)
  return { embeds: [embed] };
};
