export const     whois = {
  name:          "whois",
  description:   "Renvoi les informations IG d'un personnage",
  options: [{
    name:        "pseudo",
    description: "Le pseudo ou bout de pseudo du joueur à rechercher",
    type:        3,
    required:    true,
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
