export const       remind = {
  name:            "remind",
  description:     "Gère les rappels que Bwuno fait en MP quelques jours avant les almanax",
  options: [{
    name:          "start",
    description:   "Débute les rappels pour un almanax précis",
    type:          1,
    options: [{
      name:        "date",
      description: "La date de l'almanax à rappeller",
      type:        3,
      required:    false,
    }, {
      name:        "item",
      description: "Offrande de l'almanax à rappeller",
      type:        3,
      required:    false
    }]
  }, {
    name:          "stop",
    description:   "Arrete les rappels pour un almanax",
    type:          1,
    options: [{
      name:        "date",
      description: "La date de l'almanax souhaité",
      type:        3,
      required:    false,
    }, {
      name:        "item",
      description: "Offrande de l'almanax souhaité",
      type:        3,
      required:    false
    }]
  }]
};
