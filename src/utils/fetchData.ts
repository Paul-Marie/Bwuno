import * as config from "../../resources/config.json";
import axios, { AxiosResponse } from 'axios';
import { parse, HTMLElement, Node } from 'node-html-parser';

const version: string = process.env.API_VERSION || "1.49.5";
const encyclopedia: string = "https://www.dofus-touch.com/fr/mmorpg/encyclopedie/ressources";
const imageURL: string = "https://static.ankama.com/dofus-touch/www/game/items/200";
const suffix: string = "?game=dofustouch";
const uri: string = "http://www.krosmoz.com/fr/almanax";
const dates: Number[] = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

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

const parseData = (date: string, items: any[], body: any) => {
    const root: HTMLElement = parse(body);
    const event: Node[] = root.querySelector('#almanax_event_image')?.childNodes;
    const content: Node[] = root.querySelectorAll('.mid')[2].childNodes;
    const meryde_image: Node[] = root.querySelector('#almanax_boss_image').childNodes;
    const meryde_description: Node[] = root.querySelector('#almanax_boss_desc').childNodes;
    const zodiac: Node[] = root.querySelector('.zodiac_more').childNodes;
    const offering: Node[] = root.querySelector('.more-infos-content').childNodes;
    const name: string = (offering.map(elem => elem.rawText).join(' ').replace(/\s+/g, ' ').trim().split(' ')).slice(2, -6).join(' ');
    const quantity: number = parseInt(offering.map(elem => elem.rawText).join('').replace(/\s+/g, ' ').trim().split(' ')[1])
    //console.dir((event) ? root.querySelector('#almanax_event_desc').childNodes.map(elem => elem.rawText).join(' ').replace(/\s+/g, ' ').trim() : null, { depth: 5 });
    //console.dir((event) ? root.querySelector('#almanax_event_desc').childNodes[1].rawText.trim() : null, { depth: 3 });
    //console.dir(event) ? (root.querySelector('#almanax_event_image').childNodes[1] as any).rawAttrs.split('"')[1] : undefined),
    //console.dir(zodiac, { depth: 3 });
    //console.log(content[3].childNodes.filter((elem: any) => elem.rawAttrs !== 'class="more-infos"').map((elem) => `${elem.rawText}`).join(' ').replace(/\s+(\W)/g, "$1").trim())
    //console.dir(offering, { depth: 3 });
    //console.log(name, quantity);
    const category: number = items.find(item => {
        //console.dir(offering, { depth: 3 })
        console.log([ item.name, name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") ]);
        return item.name === name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    }).type;
    console.log(category)
    /*console.log({
        Meryde_Name: meryde_description.filter(node => node.nodeType === 1)[0].childNodes[0].rawText.trim(),
        Meryde_Description: (meryde_description.filter(node => node.nodeType === 3)[1] as any).rawText.trim(),
        Meryde_Image: (meryde_image.filter(node => node.nodeType === 1)[0] as any).rawAttrs.split('"')[1],
        Bonus_Description: content[3].childNodes.filter((elem: any) => elem.rawAttrs !== 'class="more-infos"').map((elem) => elem.rawText).join(' ').replace(/\s+(\W)/g, "$1").trim(),
        Bonus_Type: content[2].rawText.split(':')[1].trim(),
        Offrande_Name: name,
        Offrande_Quantity: quantity,
        Offrande_Image: '',
        Offrande_URL: '',
        Event_Name: (event) ? root.querySelector('#almanax_event_desc').childNodes[1].rawText.trim() : undefined,
        Event_Description: (event) ? root.querySelector('#almanax_event_desc').childNodes.slice(-1)[0].rawText.trim() : undefined,
        Event_Image: (event) ? (root.querySelector('#almanax_event_image').childNodes[1] as any).rawAttrs.split('"')[1] : undefined,
        Zodiac_Name: zodiac[1].childNodes[0].rawText,
        Date: date
    });*/
    return {
        Meryde_Name: meryde_description.filter(node => node.nodeType === 1)[0].childNodes[0].rawText.trim(),
        Meryde_Description: (meryde_description.filter(node => node.nodeType === 3)[1] as any).rawText.split('"')[1],
        Meryde_Image: (meryde_image.filter(node => node.nodeType === 1)[0] as any).rawAttrs.trim(),
        Bonus_Description: content[3].childNodes.filter((elem: any) => elem.rawAttrs !== 'class="more-infos"').map((elem) => elem.rawText).join(' ').replace(/\s+(\W)/g, "$1").trim(),
        Bonus_Type: content[2].rawText.split(':')[1].trim(),
        Offrande_Name: name,
        Offrande_Quantity: quantity,
        Offrande_Image: '',
        Offrande_URL: '',
        Event_Description: (event) ? root.querySelector('#almanax_event_desc').childNodes.slice(-1)[0].rawText.trim() : undefined,
        Event_Image: (event) ? (root.querySelector('#almanax_event_image').childNodes[1] as any).rawAttrs.split('"')[1] : undefined,
        Event_Name: (event) ? root.querySelector('#almanax_event_desc').childNodes[1].rawText.trim() : undefined,
        Zodiac_Name: zodiac[1].childNodes[0].rawText,
        Date: date
    };
}

const getAlmanaxs = (items: any[]) => {
    const result = {};
    [...Array(12)].map((_, month) => (
        [...Array(dates[month])].map(async (_, day) => {
            const formatNumber = (nbr: number) => `${((nbr + 1) < 10) ? '0' + (nbr + 1) : nbr + 1}`;
            const date: string = `2021-${formatNumber(month)}-${formatNumber(day)}`;
            const url: string = `${uri}/${date}${suffix}`;
            const response: AxiosResponse<any> = await axios.get(url);
            if (response.status === 200) {
                result[date] = parseData(date, items, response.data);
                console.log(response.status)
            } else
                console.error(`Invalid error code: ${response.status}`);
        })
    ));
};

// Download items and almanax list and make a static JSON of data
export default async () => {
    const data: any = await getJSON("Items");
    const types: any = await getJSON("ItemTypes");
    const items: any[] = Object.values(data).map((item: any) => ({ id: item.id, name: item.nameId, type: types[item.typeId].superTypeId }));
    const result: any = getAlmanaxs(items);
    //process.exit(0);
};
