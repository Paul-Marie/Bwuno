import * as sentences from "../../resources/language.json";
import { type_message } from "../../resources/info";
import * as settings from "../../resources/config.json";
import { getAlmanax } from "../../src/utils";
import { Message } from 'discord.js';
import { format } from 'format';

// 
export const type = (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length < 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFICIENT_ARGUMENT, `${config.prefix}type [type]`));
    const argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    const almanax_list: any = Object.keys(type_message).map(key => {
        const epured_key: string = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (epured_key === argument)
            return getAlmanax(type_message[key]);
    }).filter(item => {
        return item !== undefined;
    })[0];
    if (almanax_list) {
        let result: string = "";
        for (const element of almanax_list) {
            if (result.length + element.length <= settings.discord.length_limit) {
                result += element;
            } else {
                message.channel.send(result);
                result = element;
            }
        }
        message.channel.send(result);
    } else
        message.channel.send(format(sentences[config.lang].ERROR_TYPE_WRONG_ARGUMENT, `${config.prefix}list`));
}
