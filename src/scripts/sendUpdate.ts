import { Client, Intents, User, Guild, GuildMember } from 'discord.js';
import * as settings from "../../resources/config.json";
import * as moment from 'moment-timezone';

const bot: Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ]
});

export default async (): Promise<void> => {
  bot.on('ready', async () => {
    const length: number = (await Promise.all(bot.guilds.cache
    .filter(({ joinedTimestamp }) => moment(joinedTimestamp) >= moment("2021-10-25", "YYYY-MM-DD"))
    .map(async (guild: Guild) => {
      const user: GuildMember = await guild.fetchOwner();
      try {
        const invit: string = "https://discord.com/oauth2/authorize?client_id=642935463048642570&permissions=347200&scope=applications.commands%20bot";
        return await user?.send(`Salut ${user.user.username} ! Je viens juste te prévenir que je viens d'être mis à jour, donc si tu veux pouvoir continuer à m'utiliser sur le discord ${guild.name} que tu possèdes, il va falloir me kick et me réinviter avec le lien suivant:\n${invit}\n\nTu peux évidement ignorer ce message, ou me kick sans me réinviter (🥵), mais juste je fonctionnerais plus trop sur ton serveur :x`);
      } catch {
        console.error(`❌ ${user.user.username}#${user.user.discriminator}`);
      }
    })))?.filter(_ => _)?.length;
    console.log(`${length} update sent`);
    bot.destroy();
    process.exit(0);
  });
  await bot.login(settings.discord.token);
};
