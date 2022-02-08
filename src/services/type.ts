import * as sentences from "../../resources/language.json";
import { type_message } from "../../resources/info";
import * as settings from "../../resources/config.json";
import { getAlmanax } from "../utils/utils";
import { Message } from 'discord.js';
import { format } from 'format';

// Send a succession of message containing all almanax's date with the required type
export const type = (message: Message, line: string[], config: any): String => {
  if (line.length < 2)
    return format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}type [type]`);
  const argument: string = line[1].epur();
  const almanax_list: any = Object.keys(type_message).map(key => (
    key.epur() === argument && getAlmanax(type_message[key])
  )).filter(item => {
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
    return result;
  } else
    return format(sentences[config.lang].ERROR_TYPE_WRONG_ARGUMENT, `${config.prefix}list`);
}
