import * as sentences from "../../resources/language.json";
import Server         from "../models/server";
import { Message    } from 'discord.js';
import { format     } from 'format';

// Activate or desactivate `auto_mode` for a discord' server
export const auto = async (line: string[], config: any, message: Message): Promise<string> => {
  if (line.length > 2)
    return format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}auto ['on'|'off']`);
  const argument: string = (line[1] || '').epur();
  // TODO: check discord v13.6's permissions handling
  if (!message.member.permissions.has(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
    return sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS;
  let activate: Boolean;
  if (argument === '')
    activate = !config.auto_mode;
  if (["on", "true", "1", "start"].some(elem => argument.includes(elem)) || activate) {
    if (config.auto_mode)
      return format(sentences[config.lang].ERROR_AUTO_ALREADY_ACTIVATED, `<#${message.channel.id}>`);
    await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: true, auto_channel: message.channel.id });
    return sentences[config.lang].SUCCESS_AUTO_ACTIVATED;
  } else if (["off", "false", "0", "stop"].some(elem => argument.includes(elem)) || !activate) {
    if (!config.auto_mode)
      return sentences[config.lang].ERROR_AUTO_NOT_ACTIVATED;
    await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: false, auto_channel: undefined });
    return sentences[config.lang].SUCCESS_AUTO_DESACTIVATED;
  } else
    return sentences[config.lang].ERROR_AUTO_UNKNOWN_ARGUMENT;
}
