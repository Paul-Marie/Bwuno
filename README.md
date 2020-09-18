<img width="150" height="150" align="left" style="float: left; margin: 0 10px 0 0;" alt="Bwuno" src="https://i.imgur.com/VEvm3ch.png"/>

# Bwuno

[![](https://img.shields.io/badge/Ajouter-Bwuno-0199FE.svg?style=flat)](https://discord.com/oauth2/authorize?client_id=642935463048642570&scope=bot&permissions=469990567)
[![](https://img.shields.io/discord/556152877488406528.svg?logo=discord&colorB=7289DA)](https://discord.com/invite/NvruPar)
[![](https://discordbots.org/api/widget/status/642935463048642570.svg)](https://discordbots.org/bot/642935463048642570)
[![](https://img.shields.io/badge/discord.js-v12.3.1--dev-blue.svg?logo=npm)](https://github.com/discordjs)

> Bwuno aime les cawottes.

Bwuno est un bot discord spécialisé dans tout ce qui touche aux almanax et à la récupération d'information du site officiel du jeu [Dofus-Touch](https://dofus-touch.com).


## Fonctionalités

### Services

Bwuno t'offres c'est services (et pleins d'autres encore !):
*   📅 Poste les almanax le soir à minuit si le mode `auto` est activé
*   ⚙️ Customisation du serveur discord (prefix, serveur DT, langage, etc...)
*   😀 Les commandes sont agréable grace aux emojis utilisé

### Commandes

Bwuno proposes de nombreuses commandes, mais voici les plus importantes:

*   🎯 **almanax**: Permet de recuperer les informations de l'almanax en fonction d'une date ou d'une offrande
*   🔍 **whois**: Affiche les informations d'un joueur depuis le site officiel de dofus-touch
*   💰 **prefix**: Change le prefix de Bwuno pour ne plus avoir à utilisez `!bruno <command> [argument]`
*   🤖 **auto**: active le mode automatique et poster les almanax du jour à minuit sur ce serveur
*   💊 **type**: Liste toutes les dates d'almanax avec le bonus désiré (Economie d'ingrédient, bonus xp, etc...)

## Mais c'est un peu un remix de Kaelly-Touch non ?

Et bien non ! *c'est un bot discord à part entiere*. Le code source de kaelly-touch n'ont jamais été ne serait-ce que regardé par les créateurs de Bwuno.
Ils ont des commandes en commun car celle-ci était __prévu__ mais ne sont pas faite pareille.

Les quelques rares commande que Bwuno et Kaelly-Touch ont en commun sont plus **complète** chez Bwuno

**Example**: *(Kaelly à gauche et Bwuno à droite)*

<img align="left" style="float: center; margin: 0 10px 0 0;" src="https://i.imgur.com/5HgLgYB.png" height="400" width="350"/>
<img align="center" style="float: left; margin: 0 10px 0 0;" src="https://i.imgur.com/y02c7ap.png" height="400" width="350"/>
<img align="left" style="float: center; margin: 0 10px 0 0;" src="https://i.imgur.com/qA5pKJi.png" height="400" width="350"/>
<img align="center" style="float: left; margin: 0 10px 0 0;" src="https://i.imgur.com/cFT5kJU.png" height="400" width="350"/>
<img align="left" style="float: center; margin: 0 10px 0 0; margin-bottom: 100px;" src="https://i.imgur.com/v06HATS.png" height="300" width="350"/>
<img align="center" style="float: left; margin: 0 10px 0 0; margin-bottom: 100px;" src="https://i.imgur.com/F9DXhL8.png" height="400" width="350"/>


> Bwuno ne fait pas non plus tout ce que peut faire Kaelly-Touch et n'est pas disponible pour Dofus PC, donc hésitez pas à allez voir Kaelly-Touch

## Installation

⚠️ Cette partie est réserver aux développeur ou personnes souhaitant lancez Bwuno depuis leur machine,
Si vous souhaitez simplement l'utiliser sur ton serveur discord sans avoir à gerer l'hebergement et tout, [clique ici](https://discord.com/oauth2/authorize?client_id=642935463048642570&scope=bot&permissions=469990567)

```sh
git clone https://github.com/Paul-Marie/Bwuno
cd Bwuno/
```
Maintenant ouvrez le fichier `./resources/config.json` et remplissez les champs vide, tels que la partie `discord.token` ou vous devez mettre votre token de bot discord, puis ajoutez les images associez à votre futur bot dans les champs vide du champs `bruno`.

Assurez vous de posseder une version de [Node.JS](https://nodejs.org/fr/download/) suppérieur à 10,
Puis lancez votre bot avec [yarn](https://classic.yarnpkg.com/fr/docs/install/#debian-stable) ou [npm](https://nodejs.org/fr/download/) (au choix)
```sh
yarn;				# Sert à installer les paquets nécéssaire
yarn start ./utils/makeDB.ts;	# Creer la base de données en locale
yarn start;			# Lance le bot sur votre machine
```
Je vous recommande personellement d'utiliser [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) ou [screen](https://www.gnu.org/software/screen/screen.html) pour garder votre bot actif tout le temps.

## Liens

*   [Discord](https://discord.com/invite/NvruPar)
*   [Twitter](https://twitter.com/Bwuno)
*   [Github](https://github.com/Paul-Marie/Bwuno)

Faite péter les ⭐ pour contribuer au projet 😎.
