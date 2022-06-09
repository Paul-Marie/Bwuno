export const         follow = {
  name:              "follow",
  description:       "Gere le suivi des méssages officiels d'Ankama dans un salon Discord",
  options:           [{
    name:            "start",
    description:     "Active le suivi des méssages officiels d'Ankama dans un salon",
    type:            1,
    options:         [{
      name:          "channel",
      description:   "Le salon dans lequels sera posté les news",
      type:          7,
      channel_types: [0, 1, 3, 5],
      required:      true
    }, {
      name:          "type",
      description:   "Le type de compte officiel à suivre",
      type:          3,
      required:      true,
      choices:       [{
        name:        "@DofusTouch (Twitter)",
        value:       "DofusTouch"
      }, {
        name:        "@DofusTouch_EN (Twitter)",
        value:       "DOFUSTouch_EN"
      }, {
        name:        "AnkaTracker (Forum)",
        value:       "DofusTracker_DT"
      }]
    }]
  }, {
    name:            "stop",
    description:     "Désactive le suivi des méssages officiels d'Ankama dans un salon",
    type:            1,
    options:         [{
      name:          "channel",
      description:   "Le salon dans lequels sera posté les news",
      type:          7,
      channel_types: [0, 1, 3, 5],
      required:      true
    }, {
      name:          "type",
      description:   "Le type de compte officiel à ne plus suivre dans ce salon",
      type:          3,
      required:      true,
      choices:       [{
        name:        "@DofusTouch (Twitter)",
        value:       "DofusTouch"
      }, {
        name:        "@DofusTouch_EN (Twitter)",
        value:       "DOFUSTouch_EN"
      }, {
        name:        "AnkaTracker (Forum)",
        value:       "DofusTracker_DT"
      }]
    }]
  }]
};