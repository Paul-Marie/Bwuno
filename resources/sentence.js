const discord_url = "https://discord.gg/NvruPar";

const empty_message = [
    "Oh, il semble que tu ai oublié de mettre une action apres le `!bruno`. Tappe `!bruno help` pour voir la liste des commandes disponibles.",
    "Tu as encore oublié de préciser l'action apres `!bruno`. Comment suis je censé deviner ce que tu attends de moi?",
    "Bon, vu que tu essayes de m'énerver, je vais en Proftiter pour faire la PUB du serveur discord de mes créateurs sur ton serveur; Les autres n'hésitez pas à rejoindre ce serveur discord si jamais la spéculation vous intéresse :)\n" + discord_url,
    "Alright, puisque tu continues de me prendre pour un imbécile j'arrete de te repondre tant que tu ne diras que des bétises...",
];

const failure_message = [
    "Je n'est pas reconnu la commande, n'hésite pas a consulté l'aide: `!bruno help`",
    "Je n'ai toujours pas compris ta requete.",
    "Consulte l'aide avec `!bruno help`, je ne lis pas encore dans les pensées pour savoir ce que tu attends de moi !",
    "Bon, tu fais expres de me prendre pour un idiot, du coups je me permet de faire de la PUB sur ton serveur :)\nintéressé par la spéculation des offrandes d'almanax? Rejoins sans plus attendre le serveur discord de DT-Price!\n" + discord_url,
    "Okay, c'etait le fail de trop... Je te reparlerais quand tu me feras une vraie demande (Oui je te boude)."
];

const help_message = {
    color: 0x4E4EC8,
    thumbnail: { url: "https://cdn.discordapp.com/attachments/643158383104491545/643462146696413184/aide.png" },
    author: {
        name: "Bruno de DT-Price",
        icon_url: "https://cdn.discordapp.com/avatars/642935463048642570/39d03bf8899872de9ead0e871f6cfda6.png"
    },
    fields: [{
        name: "🔍 Affiche ce menu",
        value: "!bruno help",
    }, {
        name: "🔍 Liste la ou les dates ou l'item spécifié est l'offrande du jour",
        value: "!bruno item <Nom de l'Item>",
    }, {
        name: "🔍 Affiche les informations de l'almanax de la date spécifiée",
        value: "!bruno almanax <Date>",
    }, {
        name: "🔍 Liste tout les almanax du Type spécifié",
        value: "!bruno type <Type>",
    }, {
        name: "🔍 Renvoie la liste des types d'almanax disponibles pour le !bruno type <Type>",
        value: "!bruno list",
    }, {
        name: "🔍 Donne moi ta date d'anniversaire et je te donnerai ton signe astrologique du monde des 12!",
        value: "!bruno zodiac <Date>",
    }]
};

const zodiac_list = {
   "Le Bouftou": {
      Name: "♈ Le Bouftou",
      Description: "Les aventuriers nés sous le signe du Bouftou sont impulsifs. Au moindre obstacle, ils foncent dans le tas, tête baissée, quitte à se briser les cornes au passage. Ce caractère spontané les conduit parfois à commettre des actes qu’ils finissent par regretter. Nombreux sont ceux qui, en déshonorant leurs parents, sont devenus les Bouftons noirs de leur famille.",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/18/all_128_128.png"
   },
   "La Bworkette": {
      Name: "♑ La Bworkette",
      Description: "Les aventuriers nés sous le signe de la Bworkette sont souvent naïfs. Dotés d’un intellect limité, ils se font facilement embobiner par les gens malintentionnés. Mais lorsqu’ils s’aperçoivent de la supercherie, ils peuvent entrer dans une colère noire… et débiter toutes sortes d’insanités que même la Bworkette ne saurait prononcer !",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/10/all_128_128.png"
   },
   "Le Centoror": {
      Name: "♐ Le Centoror",
      Description: "Les aventuriers nés sous le signe du Centoror  sont des « taxeurs » nés. Entendez par là qu’ils ont une fâcheuse tendance à s’approprier les biens d’autrui. Leur devise : « Tout ce qui est à toi est à moi aussi, surtout si ça a de la valeur » ! Un trait de caractère qui, s’ils ont le malheur d’être en plus disciples d’Enutrof, en fait des grippe-sous de la pire espèce !",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/14/all_128_128.png"
   },
   "Le Chacha": {
      Name: "♌ Le Chacha",
      Description: "Les aventuriers nés sous le signe du Chacha sont des séducteurs invétérés qui utilisent leur charme naturel pour obtenir ce qu’ils désirent. Parce qu’ils le valent bien ! Mais ce n’est pas parce qu’ils font bouger leurs cheveux à tout va qu’ils en ont pour autant sous la crinière. Il suffit de gratter un peu pour voir qu’au fond ils sont aussi nus et démunis qu’une Larve Bleue.",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/22/all_128_128.png"
   },
   "Le Crustorail": {
      Name: "♋ Le Crustorail",
      Description: "Les aventuriers nés sous le signe du Crustorail sont de nature timide. Ils n’hésitent pas à se forger une carapace pour mieux se protéger des aléas de la vie. Préférant les chemins détournés aux lignes droites, ils évitent tant que possible toute situation susceptible de les mettre en danger.",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/21/all_128_128.png"
   },
   "Les Dopeuls": {
      Name: "♊ Les Dopeuls",
      Description: "Les aventuriers nés sous le signe des Dopeuls souffrent généralement d’un complexe d’infériorité. Ils se comparent sans cesse aux autres et les prennent souvent pour modèles. Très observateurs, ils n’hésitent donc pas à copier ceux qu’ils admirent, pour mieux les doubler ensuite.",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/20/all_128_128.png"
   },
   "Le Dragocampe": {
      Name: "♍ Le Dragocampe",
      Description: "Les aventuriers nés sous le signe du Dragocampe ont le courage dans le sang. Sauver la veuve et l’orphelin, pour eux, ça coule de source ! Une qualité fort honorable, à condition bien sûr de ne pas se laisser submerger. Car à force de vouloir à tout prix aider les opprimés, certains finissent inévitablement par avoir la tête sous l’eau…",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/15/all_128_128.png"
   },
   "Le Flaqueux": {
      Name: "♒ Le Flaqueux",
      Description: "Les aventuriers nés sous le signe du Flaqueux aiment les paradoxes. Au quotidien, ils évitent de se mouiller et cherchent à tout prix à fuir les conflits. Pourtant, il arrive parfois que leur orgueil les pousse à se lancer dans des actions imprudentes, comme affronter le Minotoror à mains nues ou dire à une Bworkette qu’elle manque de grâce.",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/16/all_128_128.png"
   },
   "Le Kilibriss": {
      Name: "♎ Le Kilibriss",
      Description: "Les aventuriers nés sous le signe du Kilibriss sont d’éternels insatisfaits. Quoi qu’ils fassent, ils chercheront toujours à avoir plus. Ils aiment être le centre d’attention (et de gravité !) de leur entourage, et ne manquent jamais une occasion de fanfaronner ou d’attirer les regards avec une pirouette.",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/11/all_128_128.png"
   },
   "Le Minotoror": {
      Name: "♉ Le Minotoror",
      Description: "Les aventuriers nés sous le signe du Minotoror sont de fortes têtes qui pensent que rien ne peut leur résister. À juste titre, d’ailleurs : même dans les situations les plus difficiles, ils n’hésitent pas à prendre le Minotoror par les cornes ! Voilà pourquoi ils s’aiment autant et peuvent passer des heures devant un miroir à s’astiquer les cornes !",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/19/all_128_128.png"
   },
   "Les Pichons": {
      Name: "♓ Les Pichons",
      Description: "Les aventuriers nés sous le signe des Pichons sont loin d’être des fortes têtes. Ils ont une fâcheuse tendance à se laisser porter par le courant, et ne sont que rarement maîtres de leurs propres décisions. Lorsque leurs compagnons agissent, ils les regardent avec des yeux de Pichons frits. Et à force de ne rien faire d’autre que buller, ils finissent toujours par se faire manger.",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/17/all_128_128.png"
   },
   "Le Scorbute": {
      Name: "♏ Le Scorbute",
      Description: "Les natifs du Scorbute sont de véritables petites pestes à l’intelligence venimeuse ! Dès qu’ils peuvent troubler l’ordre établi, ils accourent dare-dare. Ils bardent leurs conversations de petites piques assassines, et dardent leurs traits d’esprit vers leurs interlocuteurs dès qu’ils en ont l’occasion.",
      Image: "http://staticns.ankama.com/krosmoz/img/uploads/zodiac/12/all_128_128.png"
   }
};

const type_message = {
    "Alchimiste": ["Ceuillette abondante"],
    "Benediction": ['Bénédiction de Miss Triste', 'Bénédiction du Fin Patraque', 'Vitalité débordante'],
    "Bucheron": ['Bois abondant'],
    "Butin": ['Butin', 'Butin et XP dans la Maison Fantôme', 'Butin frigostien', 'Butin et XP sur tous les Bouftous', 'Butin et XP sur les pirates', 'Butin et XP sur les créatures marines', 'Butin et XP en slip'],
    "Challenge": ['Challenge supplémentaire', 'Challenges augmentés'],
    "Chasseur": ['Gibier abondant'],
    "Craft": ['Objets de qualité', "Économie d'ingrédients", 'Fabrication intensive', 'Fabrique Féérique', 'Bonta et Brâkmar'],
    "Economie d'Ingredients": ["Économie d'ingrédients"],
    "Elevage": ['Élevage de Dragodindes'],
    "Etoile": ['Apparition des étoiles', 'Étoiles défilantes'],
    "Familier": ['Familiers Frénétiques'],
    "Kolizeum": ['Expérience du Kolizéum', 'Kolizétons'],
    "Metier": ['Apparition des ressources', 'Apparition des ressources et des Archimonstres', 'Fabrication intensive', 'Fabrique Féérique', 'Objets de qualité', "Économie d'ingrédients", 'Bonta et Brâkmar'],
    "Mineur": ['Minerai abondant'],
    "Paysan": ['Récolte abondante'],
    "Pecheur": ['Pêche abondante'],
    "Percepteur": ['Percepteurs avides', 'Percepteurs zélés'],
    "Point d'Experience": ["Points d'expérience", 'Expérience du Kolizéum', 'Expérience des quêtes', 'Butin et XP dans la Maison Fantôme', 'Butin et XP sur tous les Bouftous', 'Butin et XP sur les pirates', 'Butin et XP sur les créatures marines', 'Butin et XP en slip'],
    "Quete": ['Expérience des quêtes', 'Quête répétable', 'Quêtes et kamas'],
}

module.exports = {
    empty_message,
    failure_message,
    type_message,
    help_message,
    zodiac_list
}
