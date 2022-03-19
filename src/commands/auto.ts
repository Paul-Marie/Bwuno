export const         auto = {
  name:              "auto",
  description:       "Active ou désactive l'ajout de l'almanax du jour dans un salon à minuit",
  options: [{
    name:            "start",
    description:     "Active le mode auto",
    type:            1,
    options: [{
      name:          "channel",
      description:   "Le salon dans lequels sera posté les almanax à minuit",
      type:          7,
      channel_types: 0,
      required:      true
    }]
  }, {
    name:            "stop",
    description:     "Désactive le mode auto",
    type:            1
  }]
};
