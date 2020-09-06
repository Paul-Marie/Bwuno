import * as sentences from "../../resources/language.json";
import * as settings from "../../resources/config.json";
//import { getDate, formatDate } from "../../src/utils";
import { Message, MessageEmbed } from 'discord.js';
import { format } from 'format';
import * as request from 'async-request';

export const alliance = async (message: Message, line: string[], config: any): Promise<Message> => {
    if (line.length < 2)
        return message.channel.send(format(sentences[config.lang].ERROR_INSUFFICIENT_ARGUMENT, `${config.prefix}alliance []`));
    line.shift()
    const argument: string = line.join('+').toLowerCase();
    console.log(argument)
    console.log(`${settings.encyclopedia.alliance_url}/${argument}`)
    const response: any = await request(`${settings.encyclopedia.alliance_url}/${argument}`);
    //const response: any = await request(`https://google.com`);
    console.log(response)
    if (response.statusCode === 200) {
        const data: any = JSON.parse(response.body);
        //const current_date: moment.Moment = moment();
        //.subtract(1, 'd').format("YYYY-MM-DD");
        //const date: string = moment().subtract(7, 'd').format("YYYY-MM-DD");
        const almanax: any = {};//getDate(argument)[0];
        if (!almanax) {
            const param: string = line.join('');
            if (param.startsWith('+')) {
                const required_almanax: number = Number(param.slice(1, param.length));
                //const embed: Math.essageEmbed = createFutureEmbed(required_almanax);
                //message.channel.send(embed);
            } else {
                line.unshift(config.prefix)
            }
        }
    }/*else {
       const embed: MessageEmbed = await createEmbed(almanax, config.server);
        message.channel.send(embed);
        }*/
}        
