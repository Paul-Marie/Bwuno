export const     guild = {
  name:          "guild",
  description:   "Renvoi les informations IG d'une guilde",
  options: [{
    name:        "nom",
    description: "Le nom de la guilde à rechercher",
    type:        3,
    required:    true,
  }, {
    name:        "serveur",
    description: "Serveur de jeu Dofus-Touch ou éfféctuer la recherche",
    type:        3,
    required:    false
  }]
};
