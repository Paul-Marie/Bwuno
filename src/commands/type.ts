import * as sentences from "../../resources/sentence";
import { getAlmanax } from "../../src/utils";
const fs = require('fs');
import { Message, Guild, Channel } from 'discord.js';

// 
export const type = (message: Message, line: Array<string>, config: any) => {
    if (line.length !== 2)
        return message.channel.send("eececzec");
    const argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    const almanax_list = Object.keys(sentences.type_message).map(key => {
        const epured_key = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (epured_key === argument)
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
