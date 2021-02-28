import * as sentences from "../../resources/language.json";
import * as moment from 'moment';
import { Message } from 'discord.js';
import { format } from 'format';
import User from "../models/user";

// Allow you to subscribe to discord' notifications
export const show = async (message: Message, line: void, config: any): Promise<Message> => {
    const user: any = await User.findOne({ identifier: message.author.id });
    if (user) {
        return await message.channel.send(user.subscriptions.map(almanax => (
            `**${moment(almanax.date, "YYYY-MM-DD", 'fr').format("DD MMMM")}**: ${almanax.name}`
        )));
    } else
        return await message.channel.send(format(sentences[config.lang].ERROR_NOTIFICATION_SHOW));
}
