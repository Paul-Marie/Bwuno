export const almanax = {
  name: "almanax",
  description: "Affiche la liste des commandes de Bwuno",
  options: [{
    name: "date",
    description: "La date de l'almanax souhaité",
    // Type of input from user: https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
    type: 3,
    required: false,
  }, {
    name: "item",
    description: "item de l'offrande des almanax souhaité",
    type: 3,
    required: false
  }
  ]
};