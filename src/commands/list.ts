import * as sentences from "../../resources/sentence";
import { Message } from 'discord.js';

// TODO to comment
export const list = (message: Message, line: String) => {
    const list = Object.keys(sentences.type).join("\n");
    message.channel.send("__Voici les différents types d'almanax existants:__\n" + list);
}
