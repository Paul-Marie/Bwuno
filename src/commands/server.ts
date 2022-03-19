export const server = {
    name:           "server",
    description:    "Modifi le serveur de jeu principal de ce serveur Discord",
    options: [{
      name:         "nom",
      description:  "le nom du serveur de jeu Dofus-Touch",
      required:     true,
      type:         4,
      choices: [{
        name:       "Oshimo",
        value:      0
      }, {
        name:       "Terra Cogita",
        value:      1
      }, {
        name:       "Herdegrize",
        value:      2
      }, {
        name:       "Grandapan",
        value:      3
      }, {
        name:       "Dodge",
        value:      4
      }, {
        name:       "Brutas",
        value:      5
      }]
    }]
  };
  