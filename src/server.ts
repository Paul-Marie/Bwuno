/*
  This file contain express server's route sent by IFTTT
*/
import * as express           from "express";
import * as settings          from "../resources/config.json";
import { TextChannel        } from 'discord.js';
import { bot                } from "./discord";
import { createTwitterEmbed } from "./utils/embed";
import Channel                from "./models/channel";
import * as bodyParser from "body-parser";

const app: any = express();

app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }))

app.use('*', async (req: express.Request, res: express.Response) => {
  console.log(req.body);
  const { user, text, link } = req?.body;
  const body: string         = text?.replace(/[\W]*\S+[\W]*$/, '')?.trim();
  console.log(text?.split(' ')?.slice(-1)?.[0]);
  const image: any           = (() => {
    try {
      new URL(text?.split(' ')?.slice(-1)?.[0]);
      return { image: { url: text?.split(' ')?.slice(-1)?.[0] }};
    } catch {};
  })();
  const channels: any[] = await Channel.find({ author: user });
  await Promise.all(channels.map(async ({ channel }) => (
    await (bot.channels.cache.get(channel) as TextChannel).send({
      embeds: [createTwitterEmbed(user, body, link, image)]
    })
  )));
  res.status(200).send();
});

// user=toto_lasticot42&text=%F0%9F%93%96+Un+nouveau+Devblog+est+disponible+!+D%C3%A9couvrez+en+d%C3%A9tail+le+fonctionnement+des+armes+l%C3%A9gendaires+%E2%9A%94%EF%B8%8F+%0A%E2%9E%A1%EF%B8%8F+https%3A%2F%2Ft.co%2FYqhN5wxE0c+https%3A%2F%2Ft.co%2FZdkMvFl7Yd&link=https://twitter.com/toto_lasticot42/status/1534970809558650900

app.listen(settings.server.port);