import { MessageActionRow, MessageButton } from 'discord.js';

//
export const createNavigationButtons = (date) => (
  new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId(`prev-${date}`)
      .setStyle('SECONDARY')
      .setEmoji("946186554517389332"),
    new MessageButton()
      .setCustomId(date)
      .setStyle('SUCCESS')
      .setEmoji("946190012154794055"),
    new MessageButton()
      .setCustomId(`remind-${date}`)
      .setStyle('PRIMARY')
      .setEmoji("946192601806155806"),
    new MessageButton()
      .setCustomId(`next-${date}`)
      .setStyle('SECONDARY')
      .setEmoji("946186699745161296")
  ])
)