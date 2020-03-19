const Discord = require('discord.js');
const Utils = require('../src/utils.js');
const moments = require('moment-timezone');
const client = new Discord.Client();
const fs = require('fs');

client.login("NjQyOTM1NDYzMDQ4NjQyNTcw.Xchc6g.Rp4_cHb9aXFBf4C_MIrPyZJBuqA").then(async () => {
    const guilds = [];
    const channels = [];
    const result = JSON.parse("{}");
    fs.readFile("./resources/auto_channel_id.json", "utf-8", async (err, buffer) => {
        const data = JSON.parse(buffer)
        await client.guilds.map(guild => {
            result[guild.id] = {
                "name": guild.name,
                "auto_mode": false,
                "server": 2,
                "lang": "FR",
                "prefix": "!bruno",
                "message": {}
            }
            if (data[guild.id]) {
                result[guild.id].auto_mode = data[guild.id].auto_mode;
                result[guild.id].channel = data[guild.id].channel;
            }
            
        });
        fs.writeFile("./resources/auto_channel_id.json", JSON.stringify(result), (err) => {});
        console.log(result);
    });
});

setTimeout(() => { client.destroy() }, 60000);

