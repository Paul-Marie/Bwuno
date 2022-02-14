import * as sentences                   from "../../resources/language.json";
import * as settings                    from "../../resources/config.json";
import { MessageEmbed, MessageOptions } from 'discord.js';
import { format                       } from 'format';

// Return an Embed object containing all commands' informations
export const help = (_: void, config: any): MessageOptions => {
  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0x4E4EC8)
    .setThumbnail(settings.bwuno.thumbnail_help)
    // TODO: add new commands
    .addField("`/help`",                sentences[config.lang].INFO_HELP_BASE)
    .addField("`/info`",                format(sentences[config.lang].INFO_HELP_ABOUT, settings.bwuno.name))
    .addField("`/lang ['fr'|'en']`",    format(sentences[config.lang].INFO_HELP_LANG, settings.bwuno.name))
    .addField("`/prefix [prefix]`",     format(sentences[config.lang].INFO_HELP_PREFIX, settings.bwuno.name))
    .addField("`/server [name]`",       sentences[config.lang].INFO_HELP_SERVER)
    .addField("`/auto ['on'|'off']`",   sentences[config.lang].INFO_HELP_AUTO)
    .addField("`/list`",                sentences[config.lang].INFO_HELP_LIST)
    .addField("`/type [type]`",         sentences[config.lang].INFO_HELP_TYPE)
    .addField("`/almanax [date|item]`", sentences[config.lang].INFO_HELP_ALMANAX)
    .addField("`/guild [name]`",        sentences[config.lang].INFO_HELP_GUILD)
    .addField("`/whois [pseudo]`",      sentences[config.lang].INFO_HELP_WHOIS)
    .addField("`/zodiac [date]`",       sentences[config.lang].INFO_HELP_ZODIAC)
  return { embeds: [embed] };
};
