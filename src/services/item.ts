import * as sentences            from "../../resources/language.json";
import { getList               } from "../utils/utils";
import { createEmbed           } from "../utils/embed";
import { Message, MessageEmbed, MessageOptions } from 'discord.js';

// This command was moved to `almanax` command, you can now research almanax by it's offander's item
// by requesting `${prefix}almanax <item>`. This command will search for an item'stats in encyclopedia
export const item = async (message: Message, line: string[], config: any): Promise<String | MessageOptions> => {
  if (line.length === 1)
    return sentences[config.lang].ERROR_INCORRECT_ITEM;
  line.shift();
  const argument: string = line.join(' ').epur();
  const result: any[] = getList(argument);
  if (!result[0])
    return "Malgré mes recherches, je n'ai pas trouvé cet item dans la liste des offrandes... Peut etre l'as tu mal orthographié? (Vérifie l'orthographe sur l'encyclopédie du site officiel)";
  return { embeds: await Promise.all(result.map(async (almanax) => await createEmbed(almanax, config.server_id))) };
}
