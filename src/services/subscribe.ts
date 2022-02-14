import * as sentences from "../../resources/language.json";
import User           from "../models/user";
import { getList    } from "../utils/utils";
import { Message    } from 'discord.js';
import { format     } from 'format';

// Allow you to subscribe to discord' notifications
export const subscribe = async (line: string[], config: any, message: Message, forwarded: boolean = false): Promise<String> => {
  if (line.length <= 1)
    return format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}subscribe [item]`);
  line.shift();
  const argument: string = line.join(' ');
  const result:    any[] = getList(argument);
  if (!result.length)
    return sentences[config.lang].ERROR_INCORRECT_ITEM;
  const list:      any[] = result.map((offering: any) => ({
    date: offering.Date, name: offering.OfferingName
  }));
  const user:        any = await User.findOne({ identifier: message.author.id });
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
    identifier:    message.author.id,
    server_id:     config.server,
    lang:          config.lang,
    subscriptions: list
  });
  return format(sentences[config.lang].SUCCESS_NOTIFICATION_SET, `${argument}`);
}

export const unsubscribe = async (line: string[], config: any, message: Message, forwarded: boolean = false): Promise<String> => {
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
