import request from 'async-request';
import * as year from "../../resources/year.json";
import * as settings from "../../resources/config.json";
import * as moment from 'moment';

moment.locale('fr');

// TODO to replace by triche regexp
export const formatDate = (sentence: string[]) => {
    return ((sentence.map((elem: string) => {
        return elem.split("-").map((item: string) => {
            return (item.length === 1) ? "0" + item : item;
        })
    })).map((elem: string[]) => {
        return (elem.map((tmp: string ) => {
            return tmp.split("/").map((item: string) => {
                return (item.length === 1) ? "0" + item : item;
            }).join(" ");
        })).join(" ");
    })).map((elem: string) => {
        return (elem.length === 1) ? "0" + elem : elem;
    }).join(" ");
}

const getAverageOfDay = (array: any[], date: string): number => {
    const days: any = array.filter((hour: any) => hour.date.includes(date));
    const result: number[] = days.map((day: any) => (day.unit + (day.decade / 10) + (day.hundred / 100)) / 3);
    return result.reduce((a,b) => a + b, 0) / result.length;
};

// Return the mean price of last 7 days of an item
export const getPrice = async (item_id: number, server_id: number = 2): Promise<string> => {
    try {
        const url: string = settings.dt_price.api_url;
        const response: any = await request(`${url}/${server_id}/${item_id}`);
        if (response.statusCode === 200) {
            const data: any = JSON.parse(response.body);
            const current_date: moment.Moment = moment();
            const date: string = moment().subtract(7, 'd').format("YYYY-MM-DD");
            const tmp: number = getAverageOfDay(data, current_date.format("YYYY-MM-DD"));
            const current_price: number = tmp || getAverageOfDay(data, current_date.subtract(1, 'd').format("YYYY-MM-DD"));
            const week_price: number = getAverageOfDay(data, date);
            return ((current_price - week_price) / week_price * 100).toFixed(2);
        }
    } catch (err) {
        return '0';
    }
}

// Return all almanax's date with the requested bonus's type
export const getAlmanax = (bonus_types: string[]) => {
    return Object.keys(year).map(key => {
        if (bonus_types.indexOf(year[key].Bonus_Type) >= 0) {
            const date: moment.Moment = moment(key, "YYYY-MM-DD", 'fr');
            return `**${date.format("DD MMMM")}**: ${year[key].Bonus_Description}\n`;
        }
    }).filter((item: any) => {
        return item !== undefined;
    });
}

// Return all almanax's objects where `item_name` is the offander
export const getList = (item_name: string) => {
    return Object.keys(year).map((key: string) => {
        const epured: string = year[key].Offrande_Name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (epured === item_name)
            return year[key];
    }).filter((item: any) => {
        return item !== undefined;
    });
}

// Return all almanax of day from a string
export const getDate = (requested_date: string) => {
    const accepted_format: string[] = [
        "DD/MM", "DD-MM", "DD MM", "DD MMM", "DD MMMM", "DD/MM/YYYY",
        "DD-MM-YYYY", "DD MM YYYY", "DD MMM YYYY", "DD MMMM YYYY"];
    return accepted_format.map((format: string) => {
        const date: moment.Moment = moment(requested_date, format, 'fr', true);
        if (date.isValid())
            return year[date.format("2020-MM-DD")];
    }).filter((item: any) => {
        return item !== undefined;
    });
}

// Return the number of day between today and the requested date
export const getRemainingDay = (almanax_date: string) => {
    const current_date: Date = new Date();
    const date: moment.Moment = moment([current_date.getFullYear(), current_date.getMonth(), current_date.getDate()]);
    let searched_date: moment.Moment = moment([current_date.getFullYear(), Number(almanax_date.split("-")[1]) - 1, almanax_date.split("-")[2]]);
    if (date > searched_date)
        searched_date = moment([current_date.getFullYear() + 1, Number(almanax_date.split("-")[1]) - 1, almanax_date.split("-")[2]]);
    const diff: number = date.diff(searched_date, 'days');
    return Math.abs(Math.trunc(diff));
}

// Return main element from target' statistics
export const getElement = (stats: any[], lvl: string): string => {
    const level: number = Number(lvl);
    const getTotal = (name: string) => Number(stats.filter((elem: any) => elem.name === name)[0].total);
    const round = (nbr: number) => Math.round((nbr + Number.EPSILON) * 100) / 100;
    if (level >= 180 && getTotal("Initiative") < 1000)
        return "*no stuff*";
    const list: any = {
        "terre": getTotal("Force"), "feu": getTotal("Intelligence"), "eau": getTotal("Chance"),
        "air": getTotal("Agilité"), "multi": getTotal("Puissance"), "sasa": getTotal("Puissance"),
        "retrait": round(getTotal("Retrait PA") / 200)
    };
    const max: number = round(list.multi) + Math.max(...(Object.values(list) as number[]));
    const result: string[] = [];
    for (const name in list) {
        // TODO just in case we must had other value to own a more accurate element
        if (!["retrait"].some(elem => name.includes(elem)))
            list[name] = round((list[name] + round(list["multi"] * 0.8)) / max);
        if (list[name] >= 0.7)
            result.push(name);
    }
    return `*${result.join(' / ')}*`;
}
