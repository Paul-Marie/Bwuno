import * as sentences from "../../resources/language.json";
import { getList } from "../utils/utils";
import { createEmbed } from "../utils/embed";
import { Message, MessageEmbed } from 'discord.js';

// This command was moved to `almanax` command, you can now research almanax by it's offander's item
// by requesting `${prefix}almanax <item>`. This command will search for an item'stats in encyclopedia
export const item = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length === 1)
        return message.channel.send(sentences[config.lang].ERROR_INCORRECT_ITEM);
    line.shift();
    const argument: string = line.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const result: any[] = getList(argument);
    if (!result[0])
        return message.channel.send("Malgré mes recherches, je n'ai pas trouvé cet item dans la liste des offrandes... Peut etre l'as tu mal orthographié? (Vérifie l'orthographe sur l'encyclopédie du site officiel)")
    for (const almanax of result) {
        const embed: MessageEmbed = await createEmbed(almanax, config.server_id);
        message.channel.send(embed);
    }
}
