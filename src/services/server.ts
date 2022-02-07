import * as sentences from "../../resources/language.json";
import Server         from "../models/server";
import { Message    } from 'discord.js';
import { format     } from 'format';

// TODO to rename
const tmp:  any = { "o": "Oshimo", "t": "Terra Cogita", "h": "Herdegrize" };
const tmp2: any = { "Oshimo": 1, "Terra Cogita": 2, "Herdegrize": 3 };

// Allow you to change discord' server current Dofus-Touch' Server
export const server = async (message: Message, line: string[], config: any): Promise<String> => {
  if (line.length <= 1)
    return format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}server ['Oshimo'|'Terra Cogita'|'Herdegrize']`);
  if (!message.member.permissions.has(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
    return sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS;
  const argument: string = line[1].epur();
  const server: string = tmp[argument[0]];
  if (!server)
    return sentences[config.lang].ERROR_UNKNOWN_SERVER;
  await Server.findOneAndUpdate({ identifier: config.identifier }, { server_id: tmp2[server] });
  return format(sentences[config.lang].SUCCESS_SERVER_CHANGED, `${server}`);
}
