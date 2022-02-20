import * as sentences         from "../../resources/language.json";
import      User              from "../models/user";
import { getList, getDate   } from "../utils/utils";
import { CommandInteraction } from 'discord.js';
import { format             } from 'format';

// Allow you to subscribe/unsubscribe to discord' notifications
export const remind = async (command: CommandInteraction, config: any): Promise<String> => {
  const user: any   = await User.findOne({ identifier: command.user.id });
  const arg: string = command.options.getString("date") ?? command.options.getString("item");
  const list: any[] = {
    item: getList(arg), date: getDate(arg)
  }[command.options.data?.[0]?.options?.[0]?.name]?.map((offering: any) => ({
    date: offering.Date, name: offering.OfferingName
  }));
  if (!list?.length)
    return sentences[config.lang].ERROR_INCORRECT_DATE_OR_ITEM;
  const subCommand: string = command.options.getSubcommand();
  if (subCommand === "start") {
    if (user?.subscriptions?.filter(({ name, date }) => (
      arg.epur() === name?.epur() || getDate(arg.epur())?.[0]?.Date === date?.epur()
    ))?.length)
      return format(sentences[config.lang].ERROR_NOTIFICATION_ALREADY_EXIST);
    user
      ? await User.updateOne({ identifier: command.user.id }, { subscriptions: [ ...user.subscriptions, ...list ] })
      : await User.create({
        identifier:    command.user.id,
        server_id:     config.server,
        lang:          config.lang,
        subscriptions: list
      });
    return format(sentences[config.lang].SUCCESS_NOTIFICATION_SET, arg);
  } else if (subCommand === "stop") {
    if (!user?.subscriptions?.filter(({ name, date }) => (
      arg.epur() === name?.epur() || getDate(arg.epur())?.[0]?.Date === date?.epur()
    ))?.length)
      return format(sentences[config.lang].ERROR_NOTIFICATION_NOT_FOUND);
    await User.updateOne({ identifier: command.user.id }, {
      subscriptions: user.subscriptions.filter(({ name, date }) => (
        !list.map(({ name }) => name).includes(name) && !list.map(({ date }) => date).includes(date)
      ))
    });
    return format(sentences[config.lang].SUCCESS_NOTIFICATION_UNSET, arg);
  }
}
