import * as config from "../../resources/config.json";
import axios, { AxiosResponse } from 'axios';
import { parse, HTMLElement, Node } from 'node-html-parser';

const version: string = process.env.API_VERSION || "1.49.5";
const encyclopedia: string = "https://www.dofus-touch.com/fr/mmorpg/encyclopedie/ressources";
const suffix: string = "?game=dofustouch";
const uri: string = "http://www.krosmoz.com/fr/almanax";
const dates: Number[] = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

const getData = async () => (
    (await axios.post(`https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=${version}`, {
        class: "Items"
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

const parseData = (date: string, body: any) => {
    //const root: HTMLElement = parse(body);
    const root: HTMLElement = parse(body);
    const event: HTMLElement = root.querySelector('#almanax_event');
    const content: HTMLElement = root.querySelectorAll('.mid')[2];
    const meryde_image: HTMLElement = root.querySelector('#almanax_boss_image');
    const meryde: Node[] = root.querySelector('#almanax_boss').childNodes;
    console.log(meryde)
    //const bonus_description = content
    return {
        Meryde_Name: (meryde.filter(node => node.nodeType === 1)[0] as any).rawAttrs,
        Meryde_Description: '',
        Meryde_Image: (meryde_image.childNodes.filter(node => node.nodeType === 1)[0] as any).rawAttrs,
        Bonus_Description: '',
        Bonus_Type: '',
        Offrande_Name: '',
        Offrande_Quantity: '',
        Offrande_Image: '',
        Zodiac_Name: '',
        Date: date
    };
}

const formatData = async (data: any) => {
    let result = {};
    for (let month: number = 1; month <= 12; month++) {
        for (let day: number = 1; day <= dates[month - 1]; day++) {
            const date: string = `2021-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
            const url: string = `${uri}/${date}/${suffix}`;
            const response: any = await axios.get(url);
            if (response.status === 200) {
                result[date] = parseData(date, response.data);
                console.log(response.status)
            }
        }
    }
};

// Download items and almanax list and make a static JSON of data
export default async () => {
    const data: any = await getData();
    const result: any = formatData(data);
    //console.log(result);
    //process.exit(0);
};
