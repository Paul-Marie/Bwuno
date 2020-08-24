import { getDate, formatDate } from "../../src/utils";
import { Message, MessageEmbed } from 'discord.js';
import { format } from 'format';
import * as zodiac_data from "../../resources/zodiac.json";
import * as sentences from "../../resources/language.json";
import * as moment from 'moment';

export const zodiac = (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length < 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}zodiac [date]`));
    line.shift()
    const argument: string = formatDate(line).toLowerCase();
    const almanax: any = getDate(argument)[0];
    if (!almanax)
        return message.channel.send(sentences[config.lang].ERROR_INCORRECT_DATE);
    const astro_sign: any = {
        "Le Bouftou": "♈", "La Bworkette": "♑", "Le Centoror": "♐", "Le Chacha": "♌",
        "Le Crustorail": "♋", "Les Dopeuls": "♊", "Le Dragocampe": "♍", "Le Flaqueux": "♒",
        "Le Kilibriss": "♎", "Le Minotoror": "♉", "Les Pichons": "♓", "Le Scorbute": "♏",
    };
    const embed: MessageEmbed = new MessageEmbed()
        .setColor('0x4E4EC8')
        .setTitle(`**Zodiac du ${moment(almanax.Date.slice(5), "MM-DD", 'fr', true).format("DD MMMM")}**`)
        .setDescription(`Hmmm... Apres de nombreuse recherche a travers le Krosmoz, je suis en mesure de t'affirmer que ton signe du zodiac est:`)
        .setThumbnail(zodiac_data[almanax.Zodiac_Name].Image)
        .addField(`**${astro_sign[almanax.Zodiac_Name]} ${zodiac_data[almanax.Zodiac_Name].Name}**`, zodiac_data[almanax.Zodiac_Name].Description)
    if (almanax.Event_Name) {
        embed.addField(`📅 Tu es par ailleur né lors de: **${almanax.Event_Name}**`, almanax.Event_Description)
        embed.setImage(almanax.Event_Image)
    }
    message.channel.send(embed);
}
