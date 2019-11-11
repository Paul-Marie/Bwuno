#!/usr/bin/env python3

import requests
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

if __name__ == "__main__":
    for month in range(1, 13):
        print("month: {}".format(month), file=stderr)
        for day in range(1, 32):
            print("\tday: {}".format(day), file=stderr)
            date = "2019-{}-{}".format(month if month > 9 else "0" + str(month),
                                          day if day > 9 else "0" + str(day))
            url = "{}{}{}".format(base_url, date, sufix)
            r = requests.get(url)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                meryde_image = str(soup.find(id="almanax_boss_image").img)
                content = soup.find_all(class_="mid")[2]
                bonus_description = str(soup.find(class_="more")).split("<div class=\"more\">")[1].split("<div class=\"more-infos\">")[0].strip()
                bonus_type = str(content).split("<span class=\"picto\"></span>")[1].split("<div class=\"more\">")[0].strip()[8:]
                meryde_name = soup.find(class_="more-infos")
                soup = BeautifulSoup(str(content), 'html.parser')
                offrande = soup.find(class_="fleft").text.strip()
                offrande_image = str(content.img).split(" ")[1].split("\"")[1]
                almanax[date] = {
                    "Meryde_Name": meryde_name.p.text[19:],
                    "Meryde_Image": meryde_image[10:][::-1][3:][::-1],
                    "Bonus_Description": remove_tags(bonus_description),
                    "Bonus_Type": bonus_type,
                    "Offrande_Name": offrande[12:][::-1][39:][::-1],
                    "Offrandre_Quantity": offrande[10:].split(" ")[0],
                    "Offrandre_Image": offrande_image,
                }
                #print(dumps(almanax[date], ensure_ascii=False))
print(dumps(almanax, ensure_ascii=False))
