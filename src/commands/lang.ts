import * as sentences from "../../resources/sentence";
import { Message } from 'discord.js';
import Server from "../models/server";

const formal_lang = { 0: "francais", 1: "english", 2: "spain", 3: "deutsh" };
const lang_available = {
    "fr": 0, "france": 0, "francais": 0, "french": 0,
    "en": 1, "gb": 1, "anglais": 1, "engleterre": 1, "english": 1,
    "es": 2, "espanol": 2, "espagnol": 2, "spain": 2, "spanish": 2,
    "de": 3, "deutsh": 3, "allemand": 3, "germany": 3, "germain": 3
}


//
export const lang = async (message: Message, line: any, config: any) => {
    if (line.length !== 2)
        return message.channel.send("erf");
    let argument: string = line[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    if (!message.member.guild.me.hasPermission('ADMINISTRATOR') ||
	    !(message.member.guild.me.hasPermission('MANAGE_ROLES_OR_PERMISSIONS') &&
	        message.member.guild.me.hasPermission('MANAGE_MESSAGES')))
        return message.channel.send("Tu n'as pas les permissions :sob:, Demande à un admin du serveur d'executer la commande pour toi :smile:");
    if (lang_available[argument] === undefined)
        return message.channel.send("Cette langue n'est pas suporté");
    const tmp: number = lang_available[argument];
    if (config.lang === tmp)
        return message.channel.send("C'est deja la langue utilisée.");
    else {
        await Server.findOneAndUpdate({ identifier: config.identifier }, { lang: tmp });
        message.channel.send(`La langue a bien été changer en \`${formal_lang[tmp]}\`.`);
    }
}
