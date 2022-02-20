// TODO create a json
const xp  = "Point d'Experience";
const eco = "Economie d'Ingredients";

export const type_message: any = {
  alchimiste:   ["Ceuillette abondante"],
  benediction:  ['Bénédiction de Miss Triste', 'Bénédiction du Fin Patraque', 'Vitalité débordante'],
  bucheron:     ['Bois abondant'],
  butin:        ['Butin', 'Butin et XP dans la Maison Fantôme', 'Butin frigostien', 'Butin et XP sur tous les Bouftous', 'Butin et XP sur les pirates', 'Butin et XP sur les créatures marines', 'Butin et XP en slip'],
  challenge:    ['Challenge supplémentaire', 'Challenges augmentés'],
  chasseur:     ['Gibier abondant'],
  craft:        ['Objets de qualité', "Économie d'ingrédients", 'Fabrication intensive', 'Fabrique Féérique', 'Bonta et Brâkmar'],
  economie:     ["Économie d'ingrédients"],
  elevage:      ['Élevage de Dragodindes'],
  etoile:       ['Apparition des étoiles', 'Étoiles défilantes'],
  familier:     ['Familiers Frénétiques'],
  kolizeum:     ['Expérience du Kolizéum',    'Kolizétons'],
  metier:       ['Apparition des ressources', 'Apparition des ressources et des Archimonstres', 'Fabrication intensive', 'Fabrique Féérique', 'Objets de qualité', "Économie d'ingrédients", 'Bonta et Brâkmar'],
  mineur:       ['Minerai abondant'],
  paysan:       ['Récolte abondante'],
  pecheur:      ['Pêche abondante'],
  percepteur:   ['Percepteurs avides',    'Percepteurs zélés'],
  xp:           ["Points d'expérience",   'Expérience du Kolizéum', 'Expérience des quêtes', 'Butin et XP dans la Maison Fantôme', 'Butin et XP sur tous les Bouftous', 'Butin et XP sur les pirates', 'Butin et XP sur les créatures marines', 'Butin et XP en slip'],
  quete:        ['Expérience des quêtes', 'Quête répétable', 'Quêtes et kamas']
}

export const list_message: any = {
  xp: {
    Butin:      ['Butin', 'Butin et XP dans la Maison Fantôme', 'Butin frigostien', 'Butin et XP sur tous les Bouftous', 'Butin et XP sur les pirates', 'Butin et XP sur les créatures marines', 'Butin et XP en slip'],
    Challenge:  ['Challenge supplémentaire', 'Challenges augmentés'],
    Etoile:     ['Apparition des étoiles', 'Étoiles défilantes'],
    [xp]:       ["Points d'expérience",    'Expérience du Kolizéum', 'Expérience des quêtes', 'Butin et XP dans la Maison Fantôme', 'Butin et XP sur tous les Bouftous', 'Butin et XP sur les pirates', 'Butin et XP sur les créatures marines', 'Butin et XP en slip'],
    Quete:      ['Expérience des quêtes',  'Quête répétable', 'Quêtes et kamas']
  },
  job: {
    Alchimiste: ["Ceuillette abondante"],
    Bucheron:   ['Bois abondant'],
    Chasseur:   ['Gibier abondant'],
    Craft:      ['Objets de qualité', "Économie d'ingrédients", 'Fabrication intensive', 'Fabrique Féérique', 'Bonta et Brâkmar'],
    [eco]:      ["Économie d'ingrédients"],
    Metier:     ['Apparition des ressources', 'Apparition des ressources et des Archimonstres', 'Fabrication intensive', 'Fabrique Féérique', 'Objets de qualité', "Économie d'ingrédients", 'Bonta et Brâkmar'],
    Mineur:     ['Minerai abondant'],
    Paysan:     ['Récolte abondante'],
    Pecheur:    ['Pêche abondante']
  },
  miscellaneous: {
    Buff:       ['Bénédiction de Miss Triste', 'Bénédiction du Fin Patraque', 'Vitalité débordante'],
    Elevage:    ['Élevage de Dragodindes'],
    Familier:   ['Familiers Frénétiques'],
    Percepteur: ['Percepteurs avides', 'Percepteurs zélés']
  }
}
