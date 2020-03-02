#!/usr/bin/env python3

import requests
from collections import OrderedDict
from bs4 import BeautifulSoup
from re import compile
from sys import stderr
from json import dumps

TAG_RE = compile(r'<[^>]+>')
def remove_tags(text):
    return TAG_RE.sub('', text)

base_url = "http://www.krosmoz.com/fr/almanax/"
sufix = "?game=dofustouch"
almanax = {}
max_date = [0, 32, 30, 32, 31, 32, 31, 32, 32, 31, 32, 31, 32]

if __name__ == "__main__":
    for month in range(1, 13):
        print("month: {}".format(month), file=stderr)
        for day in range(1, max_date[month]):
            print("\tday: {}".format(day), file=stderr)
            date = "2020-{}-{}".format(month if month > 9 else "0" + str(month),
                                          day if day > 9 else "0" + str(day))
            url = "{}{}{}".format(base_url, date, sufix)
            r = requests.get(url)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                event = soup.find(id="almanax_event")
                meryde_image = str(soup.find(id="almanax_boss_image").img)
                content = soup.find_all(class_="mid")[2]
                bonus_description = str(content).split("<div class=\"more\">")[1].split("<div class=\"more-infos\">")[0].strip()
                bonus_type = str(content).split("<span class=\"picto\"></span>")[1].split("<div class=\"more\">")[0].strip()[8:]
                meryde_name = soup.find(class_="more-infos")
                soup = BeautifulSoup(str(content), 'html.parser')
                offrande = soup.find(class_="fleft").text.strip()
                offrande_image = ""
                try:
                    offrande_image = str(content.img).split(" ")[1].split("\"")[1]
                except:
                    pass
                soup = BeautifulSoup(r.text, 'html.parser')
                zodiac = soup.find(class_="zodiac_more").text.strip()
                meryde_desc = soup.find(id="almanax_boss_desc").text.strip()
                almanax[date] = {
                    "Meryde_Name": meryde_name.p.text[19:],
                    "Meryde_Description": meryde_desc.split("\n")[1].strip(),
                    "Meryde_Image": meryde_image[10:][::-1][3:][::-1],
                    "Bonus_Description": remove_tags(bonus_description),
                    "Bonus_Type": bonus_type,
                    "Offrande_Name": offrande[12:][::-1][39:][::-1],
                    "Offrande_Quantity": offrande[10:].split(" ")[0],
                    "Offrande_Image": offrande_image,
                    "Zodiac_Name": zodiac.split("\n")[0],
                    "Date": date,
                }
                if event:
                    almanax[date]["Event_Name"] = event.text.strip().split("\n")[0].strip()
                    almanax[date]["Event_Description"] = event.text.strip().split("\n")[1].strip()
                    almanax[date]["Event_Image"] = str(event.img)[10:][::-1][3:][::-1]
                #for day in almanax.items():
                #    for key in day[1].keys():
                #        print("\t{}: [{}]".format(key, day[1][key]));
                """
                zodiac = soup.find(id="almanax_zodiac")
                almanax[zodiac.text.strip().split("\n")[0].split()[1]] = {
                    "Name": zodiac.text.strip().split("\n")[0],
                    "Description": zodiac.text.strip().split("\n")[2].strip(),
                    "Image": str(zodiac.img)[10:][::-1][3:][::-1]
                }
                #[print(key, ":", value) for (key, value) in sorted(almanax.items())]
                #print(sorted(almanax))
sorted(almanax.items())
print(dumps(dict(almanax.items()), ensure_ascii=False))
"""
print(dumps(almanax, ensure_ascii=False))
