import * as sentences from "../../resources/sentence";
const fs = require('fs');
import { Message, Guild, Channel } from 'discord.js';

// TODO not made
export const lang = async (message: Message, line: any) => {
    if (line.length <= 2)
        return message.channel.send("Precise le serveur (Oshimo, Terra Cogita ou Herdegrize)");
    const argument = line.slice(2, line.length).join(" ");
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
