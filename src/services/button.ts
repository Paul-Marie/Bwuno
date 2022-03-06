import { MessageEmbed, ButtonInteraction } from 'discord.js';
import { createEmbed                     } from "../utils/embed";
import { createNavigationButtons         } from "../utils/buttons";
import * as sentences                      from "../../resources/language.json";
import * as year                           from "../../resources/year.json";
import * as moment                         from 'moment';
import { setTimeout as wait }  from 'node:timers/promises';

// Return your doziak' symbol from a date
export const button = async (interaction: ButtonInteraction, config: any): Promise<void> => {
  const [action, date]: string[] = interaction.customId?.split('@');
  await interaction.deferUpdate();
  await wait(1000);
  //const newDate = ((action === "next" && moment(date, "YYYY-MM-DD").add(1, "day").format("YYYY-MM-DD")) ?? date) || moment(date, "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD")
  const newDate: string = {
    prev: moment(date, "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD"),
    next: moment(date, "YYYY-MM-DD").add(     1, "day").format("YYYY-MM-DD"),
    reload: date
  }[action];
  await {
    remind:     async () => {
      await interaction.reply(true ? "toto" : "tata");
    },
    navigation: async () => await interaction.editReply({
      embeds:     [await createEmbed(year[newDate], config.server)],
      components: [createNavigationButtons(newDate)]
    })
  }[action === "remind" ? "remind" : "navigation"]();
}