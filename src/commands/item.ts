import * as sentences from "../../resources/sentence";
import { getList, createEmbed } from "../../src/utils";
const fs = require('fs');
import { Message, Guild, Channel } from 'discord.js';

//
export const item = async (message: Message, line: any) => {
    if (line.length === 2) {
        message.channel.send("Il faut que tu me précises quel item tu souhaites rechercher parmis la liste des offrandes.");
        return
    } else {
        const argument = line.slice(2, line.length).join(" ");
        const epured_argument = argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const result = getList(epured_argument);
        if (!result[0]) {
            message.channel.send("Malgré mes recherches, je n'ai pas trouvé cet item dans la liste des offrandes... Peut etre l'as tu mal orthographié? (Vérifie l'orthographe sur l'encyclopédie du site officiel)")
            return
        }
        fs.readFile("./resources/config.json", "utf-8", async (err: Error, buffer: any) => {
            const data = JSON.parse(buffer)
            for (const almanax of result) {
                const embed = await createEmbed(almanax, data[message.guild.id].server);
                message.channel.send(embed);
            }
        });
    }
}
