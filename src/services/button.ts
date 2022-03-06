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
  await wait(4000);
  await {
    prev:   async () => "",
    next:   async () => "",
    reload: async () => await interaction.editReply({
      embeds: [await createEmbed(year[date], config.server)],
      components: [createNavigationButtons(date)]
    }),
    remind: async () => {
      await interaction.reply(true ? "toto" : "tata");
    }
  }[action]();
}