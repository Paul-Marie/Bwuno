import * as sentences                         from "../../resources/language.json";
import * as moment                            from 'moment';
import { format                             } from 'format';
import { CommandInteraction, MessageOptions } from "discord.js";
import User                                   from "../models/user";

// Allow you to subscribe to discord' notifications
export const show = async (command: CommandInteraction, config: any): Promise<String | MessageOptions> => {
  const user: any = await User.findOne({ identifier: command.user.id });
  if (user?.subscriptions?.length) {
    const list: any[] = user.subscriptions.sort((almanax1, almanax2) => (
      moment(almanax1.date, "YYYY-MM-DD", 'fr') > moment(almanax2.date, "YYYY-MM-DD", 'fr')
    ) ? 1 : -1);
    const date: Date = new Date();
    return { content: list.map(almanax => {
      const toto: number = moment(almanax.date).diff(moment(), 'days');
      const diff: number = (toto > 0) ? toto : moment(almanax.date).add(2, 'years').diff(moment({ y: date.getFullYear() + 1 }), 'days');
      return `**${moment(almanax.date, "YYYY-MM-DD", 'fr').format("DD MMMM")}** (${diff}): \`${almanax.name}\``
    }).join('\n'), ephemeral: true } as MessageOptions;
  } else
    return format(sentences[config.lang].ERROR_NOTIFICATION_SHOW);
}
