import * as sentences from "../../resources/language.json";
import Server         from "../models/server";
import { Message    } from 'discord.js';
import { format     } from 'format';

// Activate or desactivate `auto_mode` for a discord' server
export const auto = async (message: Message, line: string[], config: any): Promise<Message> => {
  if (line.length > 2)
    return message.channel.send(format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}auto ['on'|'off']`));
  const argument: string = (line[1] || '').epur();
  if (!message.member.hasPermission(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
    return message.channel.send(sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS);
  let activate: Boolean;
  if (argument === '')
    activate = !config.auto_mode;
  if (["on", "true", "1", "start"].some(elem => argument.includes(elem)) || activate) {
    if (config.auto_mode)
      return message.channel.send(format(sentences[config.lang].ERROR_AUTO_ALREADY_ACTIVATED, `<#${message.channel.id}>`));
    await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: true, auto_channel: message.channel.id });
    message.channel.send(sentences[config.lang].SUCCESS_AUTO_ACTIVATED);
  } else if (["off", "false", "0", "stop"].some(elem => argument.includes(elem)) || !activate) {
    if (!config.auto_mode)
      return message.channel.send(sentences[config.lang].ERROR_AUTO_NOT_ACTIVATED);
    await Server.findOneAndUpdate({ identifier: config.identifier }, { auto_mode: false, auto_channel: undefined });
    message.channel.send(sentences[config.lang].SUCCESS_AUTO_DESACTIVATED);
  } else
    message.channel.send(sentences[config.lang].ERROR_AUTO_UNKNOWN_ARGUMENT);
}
