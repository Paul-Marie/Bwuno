import { getDate                                          } from "../utils/utils";
import { MessageEmbed, MessageOptions, CommandInteraction } from 'discord.js';
import * as zodiac_data                                     from "../../resources/zodiac.json";
import * as sentences                                       from "../../resources/language.json";
import * as moment                                          from 'moment';

// Return your doziak' symbol from a date
export const doziak = (command: CommandInteraction, config: any): String | MessageOptions => {
  const almanax: any = getDate(command.options.getString("date"))[0];
  if (!almanax)
    return sentences[config.lang].ERROR_INCORRECT_DATE;
  const astro_sign: object = {
    "Le Bouftou":    "♈", "La Bworkette": "♑", "Le Centoror":   "♐", "Le Chacha":   "♌",
    "Le Crustorail": "♋", "Les Dopeuls":  "♊", "Le Dragocampe": "♍", "Le Flaqueux": "♒",
    "Le Kilibriss":  "♎", "Le Minotoror": "♉", "Les Pichons":   "♓", "Le Scorbute": "♏"
  };
  // TODO: trad following hardcodded strings:
  const embed: MessageEmbed = new MessageEmbed()
    .setColor('#4E4EC8')
    .setTitle(`**Doziak du ${moment(almanax.Date.slice(5), "MM-DD", 'fr', true).format("DD MMMM")}**`)
    .setDescription(`Hmmm... Apres de nombreuse recherche a travers le Krosmoz, je suis en mesure de t'affirmer que ton signe du doziak est:`)
    .setThumbnail(zodiac_data[almanax.ZodiacName].Image)
    .addField(`**${astro_sign[almanax.ZodiacName]} ${zodiac_data[almanax.ZodiacName].Name}**`, zodiac_data[almanax.ZodiacName].Description)
  if (almanax.Event_Name) {
    embed.addField(`📅 Tu es par ailleur né lors de: **${almanax.EventName}**`, almanax.EventDescription);
    embed.setImage(almanax.EventImage);
  }
  return { embeds: [embed] };
}
