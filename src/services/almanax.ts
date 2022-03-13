import * as sentences                         from "../../resources/language.json";
import * as year                              from "../../resources/year.json";
import { getDate, getList                   } from "../utils/utils";
import { createButtons                      } from "../utils/buttons";
import { createEmbed,  createFutureEmbed    } from "../utils/embed";
import { MessageOptions, CommandInteraction } from 'discord.js';
import * as moment                            from 'moment';

// Send all almanax's informations as Embed from a date
export const almanax = async (command: CommandInteraction, config: any): Promise<String | MessageOptions> => (
  await {
    item: async () =>             await item(command, config),
    date: async () => ({ embeds: [await createEmbed(getDate(command.options.getString("date"))?.[0] ?? getDate(moment().format("DD/MM"))[0], config.server)] }),
    plus: async () => ({ embeds: [createFutureEmbed(command.options.getInteger("plus"))] }),
    '':   async () => ({
      embeds:     [await createEmbed(year[moment().format("2022-MM-DD")], config.server)],
      ...createButtons(moment().format("2022-MM-DD"))
    })
  }[command.options.data?.[0]?.name ?? '']()
);

// Send all almanax's informations Embed from an item's name
export const item = async (command: CommandInteraction, config: any): Promise<String | MessageOptions> => {
  const argument: string = command.options.getString("item").epur();
  const result: any[] = getList(argument);
  return !result.length
    ? sentences[config.lang].ERROR_INCORRECT_DATE_OR_ITEM
    : { embeds: await Promise.all(result.map(async (almanax: any) => await createEmbed(almanax, config.server_id))) };
}
