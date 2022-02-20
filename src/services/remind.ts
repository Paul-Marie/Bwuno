import * as sentences         from "../../resources/language.json";
import * as moment            from 'moment';
import      User              from "../models/user";
import { getList, getDate   } from "../utils/utils";
import { CommandInteraction } from 'discord.js';
import { format             } from 'format';

// Allow you to subscribe to discord' notifications
export const remind = async (command: CommandInteraction, config: any, forwarded: boolean = false): Promise<String> => {
  const user: any = await User.findOne({ identifier: command.user.id });
  await {
    item: async (subCommand) => {
      const items: any[] = getList(command.options.getString("item"))
      const list:  any[] = items?.map((offering: any) => ({ date: offering.Date, name: offering.OfferingName }));
      list ? await (async () => {
        if (user.subscriptions.filter(elem => argument.epur() === elem.name?.epur()).length)
          return format(sentences[config.lang].SUCCESS_NOTIFICATION_ALREADY_MADE, getList(command.options.getString("item")))
        await User.updateOne({ identifier: command.user.id }, { subscriptions: [...user.subscriptions, ...list] });
        return format(sentences[config.lang].SUCCESS_NOTIFICATION_SET, getList(command.options.getString("item")))
      })() : sentences[config.lang].ERROR_INCORRECT_ITEM
    },
    date: async (subCommand) => getDate(command.options.getString("date"))?.[0] ?? getDate(moment().format("DD/MM"))[0],
    '':   async (subCommand) => format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `/remind ${subCommand} [item|date]`)
  }[command.options.data?.[0]?.name ?? ''](command.options.getSubcommand())

  const argument: string = line.join(' ');
  const result:    any[] = getList(argument);
  if (!result.length)
    return sentences[config.lang].ERROR_INCORRECT_ITEM;
  const list:      any[] = result.map((offering: any) => ({
    date: offering.Date, name: offering.OfferingName
  }));
  const user:      any   = await User.findOne({ identifier: command.user.id });
  if (user) {
    if (user.subscriptions.filter(elem => argument.epur() === elem.name?.epur()).length) {
      line.unshift(config.prefix);
      return await unsubscribe(line, config, message, true);
    }
    await User.updateOne({ identifier: message.author.id }, {
      subscriptions: [...user.subscriptions, ...list]
    });
    return (forwarded)
      ? format(sentences[config.lang].SUCCESS_NOTIFICATION_FORWARDED, `${argument}`)
      : format(sentences[config.lang].SUCCESS_NOTIFICATION_SET, `${argument}`);
  }
  await User.create({
    identifier:    command.user.id,
    server_id:     config.server,
    lang:          config.lang,
    subscriptions: list
  });
  return format(sentences[config.lang].SUCCESS_NOTIFICATION_SET, `${argument}`);
}

export const unsubscribe = async (command: CommandInteraction, config: any, forwarded: boolean = false): Promise<String> => {
  if (line.length <= 1)
    return format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}unsubscribe [item]`);
  line.shift();
  const argument: string = line.join(' ');
  const result:    any[] = getList(argument);
  if (!result.length)
    return sentences[config.lang].ERROR_INCORRECT_ITEM;
  const list:      any[] = result.map((offering: any) => ({
    date: offering.Date, name: offering.OfferingName
  }));
  const user:       any = await User.findOne({ identifier: message.author.id });
  if (user) {
    if (!user.subscriptions.filter(elem => argument === elem.name?.epur()).length) {
      line.unshift(config.prefix);
      return await subscribe(line, config, message, true);
    }
    await User.updateOne({ identifier: message.author.id }, {
      subscriptions: user.subscriptions.filter((subscription) => subscription.name !== list[0].name)
    });
    return (forwarded)
      ? format(sentences[config.lang].SUCCESS_NOTIFICATION_DISABLE_FORWARDED, `${argument}`)
      : format(sentences[config.lang].SUCCESS_NOTIFICATION_UNSET, `${argument}`);
  }
  await User.create({
    identifier:     message.author.id,
    server_id:      config.server,
    lang:           config.lang,
    subscriptions:  list
  });
  return format(sentences[config.lang].SUCCESS_NOTIFICATION_UNSET, `${argument}`);
}
