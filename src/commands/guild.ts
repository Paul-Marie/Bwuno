export const     guild = {
  name:          "guild",
  description:   "Renvoi les informations IG d'une guilde",
  options: [{
    name:        "name",
    description: "Le nom de la guilde à rechercher",
    type:        3,
    required:    true,
  }, {
    name:        "level",
    description: "Le level précis de la guilde à rechercher",
    type:        4,
    min_value:   1,
    max_value:   200,
    required:    false,
  }, {
    name:        "serveur",
    description: "Serveur de jeu Dofus-Touch ou éfféctuer la recherche",
    type:        4,
    required:    false,
    choices: [{
      name:      "Oshimo",
      value:     403
    }, {
      name:      "Terra Cogita",
      value:     404
    }, {
      name:      "Herdegrize",
      value:     405
    }, {
      name:      "Grandapan",
      value:     401
    }, {
      name:      "Dodge",
      value:     406
    }, {
      name:      "Brutas",
      value:     407
    }]
  }]
};
