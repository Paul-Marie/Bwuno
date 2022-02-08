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

// Change Bwuno's language
export const lang = async (message: Message, line: string[], config: any): Promise<String> => {
  if (line.length !== 2)
    return format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}lang ['fr'|'en'|'es'|'de']`);
  let argument: string = line[1].epur();
  if (!message.member.permissions.has(['ADMINISTRATOR', 'VIEW_AUDIT_LOG']))
    return sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS;
  if (lang_available[argument] === undefined)
    return sentences[config.lang].ERROR_UNSUPORTED_LANGUAGE;
  const tmp: number = lang_available[argument];
  if (config.lang === tmp)
    return sentences[config.lang].ERROR_ALREADY_CURRENT_LANGUAGE;
  else {
    const neo_lang: any = await Server.findOneAndUpdate({ identifier: config.identifier }, { lang: tmp }, { new: true });
    return format(sentences[neo_lang.lang].SUCCESS_LANGUAGE_CHANGED, formal_lang[tmp]);
  }
}
