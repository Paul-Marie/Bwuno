import * as sentences from "../../resources/language.json";
import Server         from "../models/server";
import { CommandInteraction } from 'discord.js';
import { format     } from 'format';

// Activate or desactivate `auto_mode` for a discord' server
export const auto = async (command: CommandInteraction, config: any): Promise<string> => {
  if (!command.memberPermissions.has(['ADMINISTRATOR']))
    return sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS;
  if (command.options.getSubcommand() === "start") {
    if (config.auto_mode)
      return format(sentences[config.lang].ERROR_AUTO_ALREADY_ACTIVATED, `<#${command.channel.id}>`);
    await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: true, auto_channel: command.channel.id });
    return sentences[config.lang].SUCCESS_AUTO_ACTIVATED;
  } else if (command.options.getSubcommand() === "stop") {
    if (!config.auto_mode)
      return sentences[config.lang].ERROR_AUTO_NOT_ACTIVATED;
    await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: false, auto_channel: undefined });
    return sentences[config.lang].SUCCESS_AUTO_DESACTIVATED;
  }
}
