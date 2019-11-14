const Sentence = require('../resources/sentence.js');
const Utils = require('../src/utils.js');
//const promisify = require('util').promisify;
const Discord = require('discord.js')
const bot = new Discord.Client()

let empty_iterator = 0;
let failure_iterator = 0;

// 
const help = (message, sentence) => {
    const embed = Sentence.help_message;
    message.channel.send({ embed });
}

const item = (message, sentence) => {
    if (sentence.length === 2) {
        message.channel.send("Il faut que tu me précise quel item tu souhaites rechercher parmis la liste des offrandes.");
        return
    } else {
        const argument = sentence.slice(2, sentence.length).join(" ");
        const epured_argument = argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const result = Utils.getList(epured_argument);
        console.log(result);
        if (!result) {
            message.channel.send("Malgré mes recherches, je n'ai pas trouvé cette item dans la liste des offrandes... Peut etre la tu mal orthographier? il est si facile d'oublier un `s`.")
            return
        }
        for (const almanax of result) {
            const embed = Utils.createEmbed(almanax, epured_argument)
            message.channel.send(embed);
        }
    }
}

const almanax = (message, sentence) => {
    if (sentence.length === 2) {
        message.channel.send("Il faut que tu me précise quel type de bonus Almanax tu recherches, utilise `!bruno list_type` pour la connaitre.");
        return
    } else {
        const argument = sentence.slice(2, sentence.length).join(" ");
        const epured_argument = argument.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        console.log("epured_argument: {" + epured_argument + "}")
        const almanax = Utils.getDate(epured_argument)[0];
        console.log(almanax);
        if (!almanax) {
            message.channel.send("Je n'ai pas compris cette date.")
            return
        }
        console.log(almanax)
        const embed = Utils.createEmbed(almanax, epured_argument)
        message.channel.send(embed);
    }
}

// 
const type = (message, sentence) => {
    if (sentence.length === 2)
        message.channel.send("Il faut que tu me précise quel type de bonus Almanax tu recherches, utilise `!bruno list_type` pour la connaitre.");
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
        message.channel.send("Hmmm, Il semble que ce type n'existe pas. Est il bien présent dans la liste des types d'Almanax valide? (`!bruno list_type`).");
}

// 
const list_type = (message, sentence) => {
    const list = Object.keys(Sentence.type_message).join("\n");
    message.channel.send("__Voici les différents type d'almanax existant:__\n" + list);
}

//
bot.on('ready', function () {
    console.log("[BOOT] Bip Boop, Bip Boop, Me voila pret !")
});

// 
bot.on('message', message => {
    if (message.content.toLowerCase().startsWith("!bruno")) {
        const author = message.author.username + "#" + message.author.discriminator;
        const sentence = message.content.split(" ");
        console.log("[MESSAGE (" + author + ")] " + message.content);
        if (sentence.length === 1) {
            if (empty_iterator <= 3 && failure_iterator <= 4) {
                message.channel.send(Sentence.empty_message[empty_iterator]);
                empty_iterator += 1;
            } else
                failure_iterator = 5;
            return;
        }
        empty_iterator = 0;
        const functions = { "help": help, "item": item, "almanax": almanax, "type": type, "list": list_type };
        //try {
            functions[sentence[1]](message, sentence)
            failure_iterator = 0;
        /*}
          catch {
            console.error("[ERROR (INVALID_COMMAND)] Command: \"" + sentence[1] + "\".");
            if (failure_iterator <= 4) {
                message.channel.send(Sentence.failure_message[failure_iterator]);
                failure_iterator += 1;
            } else
                empty_iterator = 4;
        }
        */
    }
    //}
});

bot.login("NjQyOTM1NDYzMDQ4NjQyNTcw.Xchc6g.Rp4_cHb9aXFBf4C_MIrPyZJBuqA");
