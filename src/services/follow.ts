import * as sentences         from "../../resources/language.json";
import      Channel           from "../models/channel";
import { CommandInteraction } from 'discord.js';

// Activate or desactivate automatic post of tweet or staff's reaction on the forum for a discord' server
export const follow = async (command: CommandInteraction, config: any): Promise<string> => {
  if (!command.memberPermissions.has(['ADMINISTRATOR']))
    return sentences[config.lang].ERROR_INSUFFICIENT_PERMISSIONS;
  if (command.options.getSubcommand() === "start") {
    await Channel.create({
      channel: command.options.getChannel("channel")?.id,
      author:  command.options.getString("type"),
      guild:   command.guild.id
    });
    return sentences[config.lang].SUCCESS_AUTO_ACTIVATED;
  } else if (command.options.getSubcommand() === "stop") {
    const result: any = await Channel.findOneAndDelete({
      channel: command.options.getChannel("channel")?.id,
      author:  command.options.getString("type"),
      guild:   command.guild.id
    });
    console.log(`result: ${result}`);
    return result
      ? sentences[config.lang].SUCCESS_AUTO_DESACTIVATED
      : sentences[config.lang].ERROR_AUTO_NOT_ACTIVATED;
  }
}
