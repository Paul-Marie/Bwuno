#!/usr/bin/env python3


from sys import stderr
from json import dumps, loads
from unidecode import unidecode

encyclopedie = "https://www.dofus-touch.com/fr/mmorpg/encyclopedie/ressources/"
result = []

if __name__ == "__main__":
    fd = open("./resources/year.json")
    content = loads(fd.read())
    """
    for date in content:
        result.append(content[date]["Bonus_Type"])
    result = sorted(set(result))
    toto = 0
    for i in result:
        sentence = "\"" + i + "\","
        toto += len(sentence)
        print(sentence)
    print(toto)

    #print(result[int(len(result) / 2)])
    result = [result[:int(len(result) / 2)], result[int(len(result) / 2):]]
    result[0].append("")
    result[1].append("")
    #print(result)
    length = 0
    for i in result[0]:
        if len(i) > length:
            length = len(i)
    print(length)
    for i, j in zip(result[0], result[1]):
        sentence = "\"" + i
        while len(sentence) < 46:
            sentence += " "
        sentence += "    " + j + "\","
        print(sentence)

    result = {
        "Percepteur": ["Percepteurs avides", "Percepteurs zélés"],
        "Chasseur": ["Gibier abondant"],
        "Bucheron": ["Bois abondant", "Récolte abondante"],
        "Pecheur": ["Pêche abondante", "Récolte abondante"],
        "Mineur": ["Minerai abondant", "Récolte abondante"],
        "Metier": ["Apparition des ressources", "Apparition des ressources et des Archimonstres", "Fabrication intensive", "Fabrique Féérique", "Objets de qualité", "Récolte abondante", "Économie d'ingrédients", "Cueillette abondante", "Bonta et Brâkmar", "Récolte abondante"],
        "Economie Ingredients": ["Économie d'ingrédients"],
        "Etoile": ["Apparition des étoiles", "Étoiles défilantes"],
        "Butin": ["Butin", "Butin et XP dans la Maison Fantôme", "Butin frigostien", "Butin et XP sur tous les Bouftous", "Butin et XP sur les pirates", "Butin et XP sur les créatures marines", "Butin et XP en slip"],
        "Xp": ["Points d'expérience", "Expérience du Kolizéum", "Expérience des quêtes", "Butin et XP dans la Maison Fantôme", "Butin et XP sur tous les Bouftous", "Butin et XP sur les pirates", "Butin et XP sur les créatures marines", "Butin et XP en slip"],
        "Paysan": ["Récolte abondante"],
        "Craft": ["Objets de qualité", "Économie d'ingrédients", "Fabrication intensive", "Fabrique Féérique", "Bonta et Brâkmar"],
        "Challenge": ["Challenge supplémentaire", "Challenges augmentés"],
        "Benediction": ["Bénédiction de Miss Triste", "Bénédiction du Fin Patraque", "Vitalité débordante"],
        "Kolizeum": ["Expérience du Kolizéum", "Kolizétons"],
        "Familier": ["Familiers Frénétiques"],
        "Quete": ["Expérience des quêtes", "Quête répétable", "Quêtes et kamas"],
        "Elevage": ["Élevage de Dragodindes"],
    }
    for i in result:
        print("\"{}\": {},".format(i, result[i]))
    for date in content:
        if content[date]["Bonus_Type"] == "Percepteurs zélés" or content[date]["Bonus_Type"] == "Percepteurs avides":
            print(content[date]["Bonus_Description"])
    print('')
    for date in content:
        if content[date]["Bonus_Type"] == "" or content[date]["Bonus_Type"] == "Bois abondant":
            print(content[date]["Bonus_Description"])
    print('')
    for date in content:
        if content[date]["Bonus_Type"] == "Étoiles défilantes" or content[date]["Bonus_Type"] == "":
            print(content[date]["Bonus_Description"])
    print('')
    for date in content:
        if content[date]["Bonus_Type"] == "Récolte abondante" or content[date]["Bonus_Type"] == "":
            print(content[date]["Bonus_Description"])
    print('')
    for date in content:
        if content[date]["Bonus_Type"] == "Cueillette abondante" or content[date]["Bonus_Type"] == "":
            print(content[date]["Bonus_Description"])

    fd = open("./resources/zodiac.json")
    content = loads(fd.read())
    print(dumps(content, ensure_ascii=False), file=stderr)
    """
    item_list = open("/home/paul-marie/cookie-touch/data/interesting_items.txt").read().split("\n")
    item_list.pop()
    for day in content:
        for string in item_list:
            item = string.split(" - ")
            if content[day]["Offrande_Name"] == item[1]:
                item[1] = unidecode(item[1]).lower()
                content[day]["URL"] = encyclopedie + item[0] + "-" + "-".join(item[1].split())
                print(content[day]["URL"])
    print(dumps(content, ensure_ascii=False), file=stderr)
