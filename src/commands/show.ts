import * as sentences from "../../resources/language.json";
import * as moment from 'moment';
import { Message } from 'discord.js';
import { format } from 'format';
import User from "../models/user";

// Allow you to subscribe to discord' notifications
export const show = async (message: Message, line: void, config: any): Promise<Message> => {
    const user: any = await User.findOne({ identifier: message.author.id });
    if (user?.subscriptions.length) {
        const list: any[] = user.subscriptions.sort((almanax1, almanax2) => (
            moment(almanax1.date, "YYYY-MM-DD", 'fr') > moment(almanax2.date, "YYYY-MM-DD", 'fr')
        ) ? 1 : -1);
        const date: Date = new Date();
        return await message.channel.send(list.map(almanax => {
            const toto: number = moment(almanax.date).diff(moment(), 'days');
            const diff: number = (toto > 0) ? toto : moment(almanax.date).add(2, 'years').diff(moment([date.getFullYear() + 1, date.getMonth(), date.getDate()]), 'days');
            return `**${moment(almanax.date, "YYYY-MM-DD", 'fr').format("DD MMMM")}** (${diff}): ${almanax.name}`
        }));
    } else
        return await message.channel.send(format(sentences[config.lang].ERROR_NOTIFICATION_SHOW));
}
