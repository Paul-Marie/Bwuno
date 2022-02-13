import * as sentences                      from "../../resources/language.json";
import * as year                           from "../../resources/year.json";
import { getDate, formatDate, getList    } from "../utils/utils";
import { createEmbed,  createFutureEmbed } from "../utils/embed";
import { MessageEmbed, MessageOptions, CommandInteraction } from 'discord.js';
import * as moment                         from 'moment';

// Send all almanax's informations Embed from a date
export const almanax = async (line: string[] | CommandInteraction, config: any): Promise<String | MessageOptions> => {
  if ((line as string[])?.length < 2 || !(line as CommandInteraction)?.options?.data?.length)
    return { embeds: [await createEmbed(year[moment().format("2022-MM-DD")], config.server)] };
  (line as CommandInteraction).isCommand() || (line as string[]).shift();
  const argument: string = (line as CommandInteraction).isCommand()
    ? `${(line as CommandInteraction)?.options?.data?.[0]?.value}`?.epur()
    : formatDate(line as string[]).toLowerCase();
  const almanax: any = getDate(argument)[0];
  if (!almanax) {
    const param: string = (line as CommandInteraction).isCommand()
      ? `${(line as CommandInteraction)?.options?.get("plus") ? '+' : ''}${(line as CommandInteraction)?.options?.getInteger("plus")}`
      : (line as string[]).join('');
    if (param.startsWith('+')) {
      const required_almanax: number = Number(param.slice(1, param.length));
      const embed: MessageEmbed = createFutureEmbed(required_almanax);
      return { embeds: [embed] };
    } else {
      (line as CommandInteraction).isCommand() || (line as string[]).unshift(config.prefix)
      return await item(["almanax", (line as CommandInteraction)?.options?.getString("item")], config);
    }
  } else {
    const embed: MessageEmbed = await createEmbed(almanax, config.server);
    return { embeds: [embed] };
  }
}

// Send all almanax's informations Embed from an item's name
export const item = async (line: string[], config: any): Promise<String | MessageOptions> => {
  line.shift();
  const argument: string = line.join(' ').epur();
  const result: any[] = getList(argument);
  return !result[0]
    ? sentences[config.lang].ERROR_INCORRECT_DATE_OR_ITEM
    : { embeds: await Promise.all(result.map(async (almanax: any) => await createEmbed(almanax, config.server_id))) };
}
