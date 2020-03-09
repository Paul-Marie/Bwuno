const Discord = require('discord.js');
const Utils = require('../src/utils.js');
const moments = require('moment-timezone');
const client = new Discord.Client();
const fs = require('fs');

client.login("NjQyOTM1NDYzMDQ4NjQyNTcw.Xchc6g.Rp4_cHb9aXFBf4C_MIrPyZJBuqA").then(async () => {
    const guilds = [];
    const channels = [];
    const date = moments().tz("Europe/Paris");
    const almanax = Utils.getDate(date.format("DD/MM"))[0];
    const embed = await Utils.createEmbed(almanax);
    await fs.readFile("./resources/auto_channel_id", "utf-8", async (err, data) => {
        const buff = data.split("\n");
        for (const line of buff) {
            const tmp = line.split(": ");
            if (tmp.length === 2) {
                guilds.push(tmp[0]);
                channels.push(tmp[1]);
            }
        }
        await client.guilds.map(guild => {
            if (guilds.includes(guild.id))
                guild.channels.map(channel => {
                    if (channels.includes(channel.id))
                        client.channels.get(channel.id).send(embed);
                });
        });
    });
});

setTimeout(() => { client.destroy() }, 60000);

