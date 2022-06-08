/*
  This file contain express server's route sent by IFTTT
*/
import * as express           from "express";
import * as settings          from "../resources/config.json";
import { TextChannel        } from 'discord.js';
//import { createTwitterEmbed } from "../utils/embed";
import Server                 from "./models/server";
import { bot                } from "./discord";

const app: any = express();

app.use(express.urlencoded({ extended: true }))

app.use('*', async (req: express.Request, res: express.Response) => {
  console.log(req.body);
  const { name, text, link } = req.body;
  const image = text;
  // const servers = await Server.find({ auto_mode: true });
  // await Promise.all(servers.map(async ({ , server_id }) => (
  //   await (bot.channels.cache.get(channel) as TextChannel).send({
  //     embeds: [await createTwitterEmbed(name, text, link, image)]
  //   })
  // )));
  res.status(200).send();
});

app.listen(settings.server.port);