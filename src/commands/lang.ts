import { Message } from 'discord.js';
import { format } from 'format';
import * as sentences from "../../resources/language.json";
import Server from "../models/server";

const formal_lang: any = { 0: "francais", 1: "english", 2: "spain", 3: "deutsh" };
const lang_available: any = {
    "fr": 0, "france": 0, "francais": 0, "french": 0,
    "en": 1, "gb": 1, "anglais": 1, "engleterre": 1, "english": 1,
    //"es": 2, "espanol": 2, "espagnol": 2, "spain": 2, "spanish": 2,
    //"de": 3, "deutsh": 3, "allemand": 3, "germany": 3, "germain": 3
}

//
export const lang = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length !== 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFICIANT_ARGUMENT, `${config.prefix}lang [fr|en|es|de]`));
    let argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    if (!message.member.guild.me.hasPermission(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
        return message.channel.send(sentences[config.lang].ERROR_INSUFICIANT_PERMISSION);
    if (lang_available[argument] === undefined)
        return message.channel.send(sentences[config.lang].ERROR_UNSUPORTED_LANGUAGE);
    const tmp: number = lang_available[argument];
    if (config.lang === tmp)
        message.channel.send(sentences[config.lang].ERROR_ALREADY_CURRENT_LANGUAGE);
    else {
        const neo_lang: any = await Server.findOneAndUpdate({ identifier: config.identifier }, { lang: tmp }, { new: true });
        message.channel.send(format(sentences[neo_lang.lang].SUCCESS_LANGUAGE_CHANGED, formal_lang[tmp]));
    }
}
