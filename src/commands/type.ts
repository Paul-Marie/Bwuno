import * as sentences from "../../resources/sentence";
import { getAlmanax } from "../../src/utils";
const fs = require('fs');
import { Message, Guild, Channel } from 'discord.js';

// 
export const type = (message: Message, line: any) => {
    if (line.length === 2) {
        message.channel.send("Il faut que tu me précises quel type de bonus Almanax tu recherches, utilise `!bruno list` pour le connaitre.");
        return;
    }
    const argument = line.slice(2, line.length).join(" ");
    const epured_argument = argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const almanax_list = Object.keys(sentences.type_message).map(key => {
        const epured_key = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (epured_key === epured_argument)
            return getAlmanax(sentences.type_message[key]);
    }).filter(item => {
        return item !== undefined;
    })[0];
    if (almanax_list) {
        let result = "";
        for (const element of almanax_list) {
            // TODO replace "2000" by config/discord/max_length
            if (result.length + element.length <= 2000) {
                result += element;
            } else {
                message.channel.send(result);
                result = element;
            }
        }
        message.channel.send(result);
    } else
        message.channel.send("Hmmm, Il semble que ce type n'existe pas. Est il bien présent dans la liste des types d'Almanax valides? (`!bruno list`).");
}
