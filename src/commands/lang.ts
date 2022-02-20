export const        lang = {
    name:           "lang",
    description:    "Change la langue de Bwuno sur ce serveur",
    options: [{
      name:         "langue",
      description:  "le nom du serveur de jeu Dofus-Touch",
      required:     true,
      type:         4,
      choices: [{
        name:       "Francais",
        value:      "fr"
      }, {
        name:       "Francais (Québec)",
        value:      "fr-CA"
      }, {
        name:       "English (United Kingdom)",
        value:      "en-GB"
      }, {
        name:       "Español",
        value:      "es"
      }]
    }]
  };
  