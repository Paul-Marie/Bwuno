const Discord = require('discord.js');
const Utils = require('../src/utils.js');
const moments = require('moment-timezone');
const client = new Discord.Client();
const fs = require('fs');

client.login("NjQyOTM1NDYzMDQ4NjQyNTcw.Xchc6g.Rp4_cHb9aXFBf4C_MIrPyZJBuqA").then(async () => {
    const date = moments().tz("Europe/Paris");
    const almanax = Utils.getDate(date.format("DD/MM"))[0];
    await fs.readFile("./resources/config.json", "utf-8", async (err, buffer) => {
	const data = JSON.parse(buffer);
	for (const server in data) {
            if (data[server].auto_mode) {
		const embed = await Utils.createEmbed(almanax, data[server].server);
		client.channels.get(data[server].channel).send(embed);
            }
	}
    });
});

setTimeout(() => { client.destroy() }, 60000);

