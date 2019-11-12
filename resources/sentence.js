const empty_message = [
    "Oh, il semble que tu ai oublié de mettre une action apres le `!bruno`. Tappe `!bruno help` pour voir la liste des commandes disponible.",
    "Tu as encore oublié de préciser l'action apres `!bruno`. Comment suis je censé deviné ce que tu attends de moi?",
    "Bon, vu que tu essaye de m'énervé, je vais en profité pour faire la PUB du serveur discord de mes créateurs sur ton serveur; Les autres hésitez pas à rejoindre ce serveur discord si jamais la spéculation vous interesse :)",
    "Alright, puisque tu continues de me prendre pour un imbécile j'arrete de te repondre tant que tu ne diras que des bétises...",
];

const failure_message = [
    "Je n'est pas reconnu la commande, n'hésite pas a consulté l'aide: `!bruno help`",
    "Je n'ai toujours pas compris ta requete",
    "Consulte l'aide (`!bruno help`), je ne lis pas encore dans les pensées pour savoir ce que tu attends de moi !",
    "Bon, tu fais expres de me prendre pour un idiot, du coups je me permet de faire de la PUB sur ton serveur :)\nInteresser par la spéculation des offrandes d'almanax? Rejoins sans plus attendre le serveur discord de DT-Price! ", // + Base.discord_url,
    "Okay, c'etait le fail de trop... Je te reparlerais quand tu me feras une vrai demande (Oui je te boude)."
];

const help_message = {
    color: 0x4e4ec8,
    thumbnail: { url: "https://cdn.discordapp.com/attachments/643158383104491545/643462146696413184/aide.png" },
    author: {
        name: "Bruno de DT-Price",
        icon_url: "https://cdn.discordapp.com/avatars/642935463048642570/39d03bf8899872de9ead0e871f6cfda6.png"
    },
    fields: [{
        name: "Affiche ce menu",
        value: "!bruno help",
    }, {
        name: "Liste la ou les dates ou l'item spécifié est l'offrande du jour",
        value: "!bruno item <Nom de l'Item>",
    }, {
        name: "Affiche les informations de l'almanax de la date spécifié",
        value: "!bruno date <Date>",
    }, {
        name: "Liste tout les almanax du Type spécifié",
        value: "!bruno type <Type>",
    }, {
        name: "Renvoi la liste des types d'almanax disponible",
        value: "!bruno list_type",
    }]
};

/*
const type_message = [
    "Apparition des ressources",
    "Apparition des ressources et des Archimonstres",
    "Apparition des étoiles",
    "Bois abondant",
    "Bonta et Brâkmar",
    "Butin",
    "Butin et XP dans la Maison Fantôme",
    "Butin et XP en slip",
    "Butin et XP sur les créatures marines",
    "Butin et XP sur les pirates",
    "Butin et XP sur tous les Bouftous",
    "Butin frigostien",
    "Bénédiction de Miss Triste",
    "Bénédiction du Fin Patraque",
    "Cadeaux Surprises",
    "Cadeaux surprises",
    "Challenge supplémentaire",
    "Challenges augmentés",
    "Cueillette abondante",
    "Expérience Robillesque",
    "Expérience amoureuse",
    "Expérience des métiers",
    "Expérience des quêtes",
    "Expérience du Kolizéum",
    "Fabrication intensive",
    "Fabrique Féérique",
    "Familiers Frénétiques",
    "Gibier abondant",
    "Kolizétons",
    "Minerai abondant",
    "Objets de qualité",
    "Percepteurs avides",
    "Percepteurs zélés",
    "Points d'expérience",
    "Pêche abondante",
    "Quête répétable",
    "Quêtes et kamas",
    "Récolte abondante",
    "Tarif réduit",
    "Vitalité débordante",
    "Économie d'ingrédients",
    "Élevage de Dragodindes",
    "Étoiles défilantes",
];
*/

const type_message = {
    "Benediction": ['Bénédiction de Miss Triste', 'Bénédiction du Fin Patraque', 'Vitalité débordante'],
    "Bucheron": ['Bois abondant', 'Récolte abondante'],
    "Butin": ['Butin', 'Butin et XP dans la Maison Fantôme', 'Butin frigostien', 'Butin et XP sur tous les Bouftous', 'Butin et XP sur les pirates', 'Butin et XP sur les créatures marines', 'Butin et XP en slip'],
    "Challenge": ['Challenge supplémentaire', 'Challenges augmentés'],
    "Chasseur": ['Gibier abondant'],
    "Craft": ['Objets de qualité', "Économie d'ingrédients", 'Fabrication intensive', 'Fabrique Féérique', 'Bonta et Brâkmar'],
    "Economie d'Ingredients": ["Économie d'ingrédients"],
    "Elevage": ['Élevage de Dragodindes'],
    "Etoile": ['Apparition des étoiles', 'Étoiles défilantes'],
    "Familier": ['Familiers Frénétiques'],
    "Kolizeum": ['Expérience du Kolizéum', 'Kolizétons'],
    "Metier": ['Apparition des ressources', 'Apparition des ressources et des Archimonstres', 'Fabrication intensive', 'Fabrique Féérique', 'Objets de qualité', 'Récolte abondante', "Économie d'ingrédients", 'Cueillette abondante', 'Bonta et Brâkmar', 'Récolte abondante'],
    "Mineur": ['Minerai abondant', 'Récolte abondante'],
    "Paysan": ['Cueillette abondante', 'Récolte abondante'],
    "Pecheur": ['Pêche abondante', 'Récolte abondante'],
    "Percepteur": ['Percepteurs avides', 'Percepteurs zélés'],
    "Point d'Experience": ["Points d'expérience", 'Expérience du Kolizéum', 'Expérience des quêtes', 'Butin et XP dans la Maison Fantôme', 'Butin et XP sur tous les Bouftous', 'Butin et XP sur les pirates', 'Butin et XP sur les créatures marines', 'Butin et XP en slip'],
    "Quete": ['Expérience des quêtes', 'Quête répétable', 'Quêtes et kamas'],
}

/*
const type_message = [
    "Apparition des ressources                                                 Expérience des métiers",
    "Apparition des ressources et des Archimonstres            Expérience des quêtes",
    "Apparition des étoiles                                                        Expérience du Kolizéum",
    "Bois abondant                                                                     Fabrication intensive",
    "Bonta et Brâkmar                                                                Fabrique Féérique",
    "Butin                                                                                    Familiers Frénétiques",
    "Butin et XP dans la Maison Fantôme                                Gibier abondant",
    "Butin et XP en slip                                                              Kolizétons",
    "Butin et XP sur les créatures marines                              Minerai abondant",
    "Butin et XP sur les pirates                                                Objets de qualité",
    "Butin et XP sur tous les Bouftous                                      Percepteurs avides",
    "Butin frigostien                                                          Percepteurs zélés",
    "Bénédiction de Miss Triste                                        Points d'expérience",
    "Bénédiction du Fin Patraque                                       Pêche abondante",
    "Cadeaux Surprises                                                 Quête répétable",
    "Cadeaux surprises                                                  Quêtes et kamas",
    "Challenge supplémentaire                                         Récolte abondante",
    "Challenges augmentés                                            Tarif réduit",
    "Cueillette abondante                                            Vitalité débordante",
    "Expérience Robillesque                                            Économie d'ingrédients",
    "Expérience amoureuse                                             Élevage de Dragodindes",
    "Étoiles défilantes",
];
*/

module.exports = {
    empty_message,
    failure_message,
    type_message,
    help_message,
}
