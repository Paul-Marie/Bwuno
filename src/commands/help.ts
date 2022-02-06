export const help = {
  name: "help",
  description: "Affiche la liste des commandes de Bwuno",
  execute: (message) => {
    const delay = Date.now() - message.createdAt
    message.reply(`**pong** *(delay: ${delay}ms)*`)
  }
}