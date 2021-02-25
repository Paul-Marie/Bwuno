import * as config from "../../resources/config.json";
import axios, { AxiosResponse } from 'axios';
import { parse, HTMLElement, Node } from 'node-html-parser';
import { promises as fs } from 'fs';

const version: string = process.env.API_VERSION || "1.49.5";
const encyclopedia: string = "https://www.dofus-touch.com/fr/mmorpg/encyclopedie";
const imageURL: string = "https://static.ankama.com/dofus-touch/www/game/items/200";
const suffix: string = "?game=dofustouch";
const uri: string = "http://www.krosmoz.com/fr/almanax";
const dates: Number[] = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const superTypes: any = {
    1: "equipements", 2: "armes", 3: "equipements", 4: "equipements",
    5: "equipements", 6: "consommables", 9: "ressources",
    10: "equipements", 11: "equipements", 12: "familiers",
};

// Retrieve informations from DT's API for the given `scope`
const getJSON = async (scope: string) => (
    (await axios.post(`https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=${version}`, {
        class: scope
    }, {
        headers: {
            'origin': 'file://',
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US',
            'content-type': 'application/json',
            'authority': 'earlyproxy.touch.dofus.com',
            'user-agent': 'Mozilla/5.0 (Linux; Android 7.0; Nexus 5X Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.106 Mobile Safari/537.36'
        }
    }) as AxiosResponse<any>).data
);

// Parse the page's body and build an object of data for the given `date`
const parseData = (date: string, items: any[], body: any) => {
    const root: HTMLElement = parse(body);
    const event: Node[] = root.querySelector('#almanax_event_image')?.childNodes;
    const content: Node[] = root.querySelectorAll('.mid')[2].childNodes;
    const meryde_image: Node[] = root.querySelector('#almanax_boss_image').childNodes;
    const meryde_description: Node[] = root.querySelector('#almanax_boss_desc').childNodes;
    const zodiac: Node[] = root.querySelector('.zodiac_more').childNodes;
    const offering: Node[] = root.querySelectorAll('.more-infos-content')[1].childNodes;
    const name: string = (offering.map(elem => elem.rawText).join(' ').replace(/\s+/g, ' ').trim().split(' ')).slice(2, -6).join(' ');
    const quantity: number = parseInt(offering.map(elem => elem.rawText).join('').replace(/\s+/g, ' ').trim().split(' ')[1])
    const item: any = items.find(item => item.name === name);
    const category: number = item?.type || 9;
    return {
        MerydeName: meryde_description.filter(node => node.nodeType === 1)[0].childNodes[0].rawText.trim(),
        MerydeDescription: (meryde_description.filter(node => node.nodeType === 3)[1] as any).rawText.replace(/\s+(\W)/g, "$1").trim(),
        MerydeImage: (meryde_image.filter(node => node.nodeType === 1)[0] as any).rawAttrs.split('"')[1],
        BonusDescription: content[3].childNodes.filter((elem: any) => elem.rawAttrs !== 'class="more-infos"').map((elem) => elem.rawText).join(' ').replace(/\s+(\W)/g, "$1").trim(),
        BonusType: content[2].rawText.split(':')[1].trim(),
        OfferingName: name,
        OfferingQuantity: quantity,
        OfferingImage: `${imageURL}/${item?.icon}.png`,
        OfferingURL: `${encyclopedia}/${superTypes[category]}/${item?.id}-${name.split(' ').join('-')}`,
        EventDescription: (event) ? root.querySelector('#almanax_event_desc').childNodes.slice(-1)[0].rawText.trim() : undefined,
        EventImage: (event) ? (root.querySelector('#almanax_event_image').childNodes[1] as any).rawAttrs.split('"')[1] : undefined,
        EventName: (event) ? root.querySelector('#almanax_event_desc').childNodes[1].rawText.trim() : undefined,
        ZodiacName: zodiac[1].childNodes[0].rawText,
        Date: date
    };
}

// Get all almanax's page for each date
const getAlmanaxs = async (items: any[]) => {
    const result = {};
    console.log("Fetching data...");
    await Promise.all([...Array(12)].map(async (_, month) => (
        await Promise.all([...Array(dates[month])].map(async (_, day) => {
            const formatNumber = (nbr: number) => `${((nbr + 1) < 10) ? '0' + (nbr + 1) : nbr + 1}`;
            const date: string = `2021-${formatNumber(month)}-${formatNumber(day)}`;
            const url: string = `${uri}/${date}${suffix}`;
            const response: AxiosResponse<any> = await axios.get(url);
            if (response.status === 200) {
                result[date] = parseData(date, items, response.data);
            } else
                console.error(`Invalid error code: ${response.status}`);
        }))
    )));
    return result;
};

// Download items and almanax list and make a static JSON of data
export default async () => {
    const data: any = await getJSON("Items");
    const types: any = await getJSON("ItemTypes");
    const items: any[] = Object.values(data).map((item: any) => ({
        id: item.id,
        name: item.nameId,
        icon: item.iconId,
        type: types[item.typeId].superTypeId
    }));
    const result: any = await getAlmanaxs(items);
    const json: string = JSON.stringify(result, null, 4);
    await fs.writeFile("./resources/year.json", json, "utf8");
    process.exit(0);
};
