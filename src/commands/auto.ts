import * as sentences from "../../resources/sentence";
const fs = require('fs');
import { Message, Guild, Channel } from 'discord.js';

//
export const auto = (message: Message, line: any) => {
    if (line.length <= 2)
        return message.channel.send("Veut tu l'activé ou le desactivé ?");
    const argument = line.slice(2, line.length).join(" ");
    const epured_argument = argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const guild = message.guild.id;
    const channel = message.channel.id;
    if (!(message.member.guild.me.hasPermission('ADMINISTRATOR') &&
	      message.member.guild.me.hasPermission('MANAGE_ROLES_OR_PERMISSIONS') &&
	      message.member.guild.me.hasPermission('MANAGE_MESSAGES')))
        return message.channel.send("Tu n'as pas les permissions :sob:, Demande à un admin du serveur d'executer la commande pour toi :smile:");
    if (epured_argument === "true" || epured_argument === "on" || epured_argument === "1" || epured_argument === "start" || epured_argument == "activate") {
        fs.readFile("./resources/config.json", "utf-8", (err: Error, buffer: any) => {
            const data = JSON.parse(buffer)
            if (data[guild].auto_mode) {
                const name = message.guild.channels.map(chan => {
                    if (chan.id == data[guild].channel) return chan.name;
                }).filter(item => item !== undefined)[0];
                return message.channel.send(`Oups, il est déja activé dans le salon \`#${name}\``);
            }
            data[guild].auto_mode = true;
            data[guild].channel = channel;
            fs.writeFile("./resources/config.json", JSON.stringify(data), (err: Error) => {});
            return message.channel.send(`J'enverrais dorrenavant les almanax du jours dans ce salon a minuit !`);
        });
    } else if (epured_argument === "false" || epured_argument === "off" || epured_argument === "0" || epured_argument === "stop" || epured_argument === "desactivate") {
        fs.readFile("./resources/config.json", "utf-8", (err: any, buffer: any) => {
            const data = JSON.parse(buffer);
            if (!data[guild].auto_mode)
                return message.channel.send(`Oupsi, le mode automatique n'est pas activé sur ce serveur`);
            //else if (data[guild].channel !== channel)
            //    return message.channel.send(`Il faut etre dans le salon textuel ou vous avez activé le mode automatique pour le désactivé`);
            data[guild].auto_mode = false;
            delete data[guild].channel;
            fs.writeFile("./resources/config.json", JSON.stringify(data), (err) => {});
            message.channel.send(`Vous ne recevrez plus les almanax du jour a minuit dans ce salon !`);
        });
    } else
        // utilise start / stop / 1 / 0 / true / false / on / off / activate / desactivate
        return message.channel.send("ptdr t nûl.");
}
