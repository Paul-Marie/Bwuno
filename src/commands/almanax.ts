export const almanax = {
  name: "almanax",
  description: "Affiche la liste des commandes de Bwuno",
  options: [{
    name: "date",
    description: "La date de l'almanax souhaité",
    type: 3,
    required: false,
  }, {
    name: "item",
    description: "Item de l'offrande des almanax souhaité",
    type: 3,
    required: false
  }, {
    // TODO: Replace the `plus` by `+` when Discord API will accept it
    name: "plus",
    description: "Nombre des prochains almanax à afficher",
    type: 4,
    "min_value": 1,
    "max_value": 25,
    required: false
  }]
};