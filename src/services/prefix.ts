import * as sentences from "../../resources/language.json";
import Server from "../models/server";
import { Message } from 'discord.js';
import { format } from 'format';

// Change discord' server prefix
export const prefix = async (message: Message, line: string[], config: any): Promise<String> => {
  if (line.length !== 2)
    return format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}prefix [new_prefix]`);
  let argument: string = line[1].epur();
  if (!message.member.permissions.has(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
    return sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS;
  else if (config.prefix === argument)
    return sentences[config.lang].ERROR_PREFIX_ALREADY;
  else {
    await Server.findOneAndUpdate({ identifier: config.identifier }, { prefix: `${argument}${argument.length >= 3 ? ' ' : ''}` });
    return format(sentences[config.lang].SUCCESS_PREFIX_CHANGED, argument, `${argument}help`);
  }
}
