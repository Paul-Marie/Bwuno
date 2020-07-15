const Sentence = require('../resources/sentence.js');
const Utils = require('../src/utils.js');
const fs = require('fs');
import Message, { Message, Guild, Channel } from 'discord.js';
// 
export const help = (message: Message, sentence: String) => {
    const embed = Sentence.help_message;
    message.channel.send({ embed });
}

export const item = async (message: Message, sentence: String) => {
    if (sentence.length === 2) {
        message.channel.send("Il faut que tu me précises quel item tu souhaites rechercher parmis la liste des offrandes.");
        return
    } else {
        const argument = sentence.slice(2, sentence.length).join(" ");
        const epured_argument = argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const result = Utils.getList(epured_argument);
        if (!result[0]) {
            message.channel.send("Malgré mes recherches, je n'ai pas trouvé cet item dans la liste des offrandes... Peut etre l'as tu mal orthographié? (Vérifie l'orthographe sur l'encyclopédie du site officiel)")
            return
        }
        fs.readFile("./resources/config.json", "utf-8", async (err: Error, buffer: any) => {
            const data = JSON.parse(buffer)
            for (const almanax of result) {
                const embed = await Utils.createEmbed(almanax, data[message.guild.id].server);
                message.channel.send(embed);
            }
        });
    }
}

export const zodiac = (message: Message, sentence: String) => {
    if (sentence.length === 2) {
        message.channel.send("Donne moi ta date d'anniversaire pour que je te revele ton signe du zodiac!");
        return;
    } else {
        const argument = Utils.formatDate(sentence.slice(2, sentence.length));
        const epured_argument = argument.toLowerCase();
        const almanax = Utils.getDate(epured_argument)[0];
        if (!almanax) {
            message.channel.send("Je n'ai pas compris cette date.")
            return;
        }
        const embed = Utils.createZodiacEmbed(almanax, Sentence.zodiac_list)
        message.channel.send(embed);
    }
}

export const almanax = async (message: Message, sentence: String) => {
    if (sentence.length === 2) {
        message.channel.send("Tu as oublié de me donner la date de l'almanax.");
        return;
    } else {
        const epur = ([x, y, ...arr]) => arr;
        const argument = Utils.formatDate(sentence.slice(2, sentence.length));
        const epured_argument = argument.toLowerCase();
        const almanax = Utils.getDate(epured_argument)[0];
        if (!almanax) {
            const param = epur(sentence).join('');
            if (param.startsWith('+')) {
                const required_almanax = Number(param.slice(1, param.length));
                const embed = Utils.createFutureEmbed(required_almanax);
                message.channel.send(embed);
            } else {
                message.channel.send("Je n'ai pas compris cette date.")
                return
            }
        } else {
            fs.readFile("./resources/config.json", "utf-8", async (err: Error, buffer: any) => {
                const data = JSON.parse(buffer)
                const embed = await Utils.createEmbed(almanax, data[message.guild.id].server);
                message.channel.send(embed);
            });
        }
    }
}

// 
export const type = (message: Message, sentence: String) => {
    if (sentence.length === 2) {
        message.channel.send("Il faut que tu me précises quel type de bonus Almanax tu recherches, utilise `!bruno list` pour le connaitre.");
        return;
    }
    const argument = sentence.slice(2, sentence.length).join(" ");
    const epured_argument = argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const almanax_list = Object.keys(Sentence.type_message).map(key => {
        const epured_key = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (epured_key === epured_argument)
            return Utils.getAlmanax(Sentence.type_message[key]);
    }).filter(item => {
        return item !== undefined;
    })[0];
    if (almanax_list) {
        let result = "";
        for (const element of almanax_list) {
            if (result.length + element.length <= 2000) {
                result += element;
            } else {
                message.channel.send(result);
                result = element;
            }
        }
        message.channel.send(result);
    } else
        message.channel.send("Hmmm, Il semble que ce type n'existe pas. Est il bien présent dans la liste des types d'Almanax valides? (`!bruno list`).");
}

//
export const auto = (message: Message, sentence: String) => {
    if (sentence.length <= 2)
        return message.channel.send("Veut tu l'activé ou le desactivé ?");
    const argument = sentence.slice(2, sentence.length).join(" ");
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

//
export const server = async (message: Message, sentence: String) => {
    if (sentence.length <= 2)
        return message.channel.send("Precise le serveur (Oshimo, Terra Cogita ou Herdegrize)");
    const argument = sentence.slice(2, sentence.length).join(" ");
    const epured_argument = argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const tmp = { "o": "Oshimo", "t": "Terra Cogita", "h": "Herdegrize" };
    const tmp2 = { "Oshimo": 1, "Terra Cogita": 2, "Herdegrize": 3 };
    const server = tmp[epured_argument[0]];
    if (!server)
        return message.channel.send("Je ne gere malheuresement que les serveurs Oshimo, Terra Cogita et Herdegrize pour le moment.");
    await fs.readFile("./resources/config.json", "utf-8", async (err, buffer) => {
        const guild = message.guild.id;
        const data = JSON.parse(buffer)
        data[guild].server = tmp2[server];
        console.log("tata");
        await fs.writeFile("./resources/config.json", JSON.stringify(data), (err) => {});
        console.log("titi");
    });
    console.log("toto");
    return message.channel.send(`Je vous communiquerais maintenant l'évolution des prix des offrandes du serveur \`${server}\``);
}

// 
export const list_type = (message: Message, sentence: String) => {
    const list = Object.keys(Sentence.type_message).join("\n");
    message.channel.send("__Voici les différents types d'almanax existants:__\n" + list);
}
