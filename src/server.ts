/*
  This file contain express server's route sent by IFTTT
*/
import * as express           from "express";
import * as settings          from "../resources/config.json";
import { TextChannel        } from 'discord.js';
import { bot                } from "./discord";
import { createTwitterEmbed } from "./utils/embed";
import Channel                from "./models/channel";
import * as fi                from "feat-image";

const app: any = express();

app.use('*', (req: express.Request, res: express.Response, next: any) => {
  let data = "";
  req.on("data", chunk => data += chunk);
  req.on("end", () => {
    req.body = JSON.parse(data?.replace(/\n/g, "\\n").replace(/ {2,}/g, ' '));
    next();
  });
}, async (req: express.Request, res: express.Response) => {
  const { user, text, link } = req?.body;
  let   body:  string        = text;
  const imageOBJ: any        = (async () => {
    try {
      new URL(text?.split(' ')?.slice(-1)?.[0]);
      body = text?.replace(/[\W]*\S+[\W]*$/, '')?.trim();
      return { image: { url: (await fi(text?.split(' ')?.slice(-1)?.[0]))?.[0] }};
    } catch {};
  })();
  const channels: any[] = await Channel.find({ author: user });
  await Promise.all(channels.map(async ({ channel }) => (
    await (bot.channels.cache.get(channel) as TextChannel).send({
      embeds: [createTwitterEmbed(user, body, link, await imageOBJ)]
    })
  )));
  res.status(200).send();
});

app.listen(settings.server.port);