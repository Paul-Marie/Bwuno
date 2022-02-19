import * as sentences         from "../../resources/language.json";
import * as settings          from "../../resources/config.json";
import { type_message       } from "../utils/types";
import { getAlmanax         } from "../utils/utils";
import { CommandInteraction } from 'discord.js';
import { list               } from "./list";

// Send a succession of message containing all almanax's date with the required type
export const type = async (command: CommandInteraction, config: any): Promise<string> => {
  // FIXME:: handle multi lang
  const almanax_list: string[] = getAlmanax(type_message[command.options.getString("bonus")]);
  //const toto = almanax_list.reduce((a, c) => `${a}${c}\n`, "")
  //.match(new RegExp(`[\\s\\S]{1,${settings.discord.length_limit}}`, 'g'))
  //.map((msg: string) => command.channel.send(msg));
  let result: string = "";
  for (const element of almanax_list) {
    if (result.length + element.length <= settings.discord.length_limit)
      result += element;
    else {
      await command.channel.send(result);
      result = element;
    }
  }
  await command.channel.send(result);
  return `Voici la liste de tout les almanax ou le bonus du jour sera de type \`${command.options.getString("bonus")}\``;
}
