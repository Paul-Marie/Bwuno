import * as sentences         from "../../resources/language.json";
import Server                 from "../models/server";
import { CommandInteraction } from 'discord.js';
import { format             } from 'format';

const servers: any = {
  1: "Oshimo",    2: "Terra Cogita", 3: "Herdegrize",
  4: "Grandapan", 5: "Dodge",        6: "Brutas"
};

// Allow you to change discord' server current Dofus-Touch' Server
export const server = async (command: CommandInteraction, config: any): Promise<String> => {
  if (!command.memberPermissions.has(['ADMINISTRATOR']))
    return sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS;
  const server_id: number = command.options.getInteger("nom");
  await Server.findOneAndUpdate({ identifier: config.identifier }, { server_id });
  return format(sentences[config.lang].SUCCESS_SERVER_CHANGED, `${servers[server_id]}`);
}
