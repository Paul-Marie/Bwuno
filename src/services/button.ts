import { ButtonInteraction  } from 'discord.js';
import { format             } from 'format';
import { remindButton       } from './remind';
import { createEmbed        } from "../utils/embed";
import { createButtons      } from "../utils/buttons";
import * as year              from "../../resources/year.json";
import * as moment            from 'moment';

// Handle almanax's embed buttons
export const button = async (interaction: ButtonInteraction, config: any): Promise<void> => {
  const [action, date, origin]: string[] = interaction.customId?.split('@');
  const newDate: string = {
    prev:   moment(date, "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD"),
    next:   moment(date, "YYYY-MM-DD").add(     1, "day").format("YYYY-MM-DD"),
    reload: date
  }[action];
  await [
    async () => (
      await interaction.reply({
        content: await remindButton(date, interaction.user.id, config), ephemeral: true
      })
    ),
    async () => {
      origin && !interaction.deferred && setTimeout(async () => (
        await interaction.editReply({
          embeds: [await createEmbed(year[origin], config.server)],
          ...createButtons(origin)
        })
      ), 120000);
      !interaction.deferred && await interaction.deferUpdate();
      await interaction.editReply({
        embeds: [await createEmbed(year[newDate], config.server)],
        ...createButtons(newDate, true)
      });
    }
  ][action !== "remind" ? 1 : 0]();
};
