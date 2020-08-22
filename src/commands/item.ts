import * as sentences from "../../resources/sentence";
import { getList, createEmbed } from "../../src/utils";
const fs = require('fs');
import { Message, Guild, Channel } from 'discord.js';
import { argv } from "process";

//
export const item = async (message: Message, line: Array<any>, config: any) => {
    if (line.length === 1)
        return message.channel.send("Tu as oublié l'item.");
    line.shift();
    const argument: string = line.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const result = getList(argument);
    if (!result[0])
        return message.channel.send("Malgré mes recherches, je n'ai pas trouvé cet item dans la liste des offrandes... Peut etre l'as tu mal orthographié? (Vérifie l'orthographe sur l'encyclopédie du site officiel)")
    for (const almanax of result) {
        const embed = await createEmbed(almanax, config.server_id);
        message.channel.send(embed);
    }
}
