import * as year     from "../../resources/year.json";
import * as settings from "../../resources/config.json";
import * as moment   from 'moment';
import      request  from 'async-request';

moment.locale('fr');

declare global {
  interface String {
    epur(): string;
  }
  interface Object {
    isCommand(): boolean;
  }
}

// Declare the `epur()` method on String
String.prototype.epur = function () {
  return this?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

Object.prototype.isCommand = function () {
  return false;
};

// FIXME: delete it
// TODO: to replace by triche regexp
export const formatDate = (sentence: string[]): string =>
  ((sentence.map((elem: string) =>
    elem.split("-").map((item: string) =>
      `${item.length === 1 ? '0' : ''}${item}`
    )
  )).map((elem: string[]) =>
    (elem.map((tmp: string) =>
      tmp.split("/").map((item: string) =>
        `${item.length === 1 ? '0' : ''}${item}`
      ).join(" ")
    )).join(" ")
  )).map((elem: string) =>
    `${elem.length === 1 ? '0' : ''}${elem}`
  ).join(" ");


const getAverageOfDay = (array: any[], date: string): number => {
  const days: any = array.filter((hour: any) => hour.date.includes(date));
  const result: number[] = days.map((day: any) => (day.unit + (day.decade / 10) + (day.hundred / 100)) / 3);
  return result.reduce((a, b) => a + b, 0) / result.length;
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
export const getAlmanax = (bonus_types: string[]): string[] =>
  Object.keys(year).filter((key: string) => bonus_types.indexOf(year[key].BonusType) >= 0).map((key: string) =>
    `🔸 __**\`${moment(key, "YYYY-MM-DD", 'fr').format("DD MMMM")}\`**__: ${year[key].BonusDescription}\n`
  );


// Return all almanax's objects where `item_name` is the offander
export const getList = (item_name: string): any[] => (
  Object.keys(year).filter((key: string) => year[key].OfferingName.epur() === item_name).map((key: string) => year[key])
);

// Return all almanax of day from a string
export const getDate = (requested_date: string): any[] => {
  const accepted_format: string[] = [
    "DD/MM", "DD-MM", "DD MM", "DD MMM", "DD MMMM", "DD/MM/YYYY",
    "DD-MM-YYYY", "DD MM YYYY", "DD MMM YYYY", "DD MMMM YYYY"];
  return accepted_format.map((format: string) => {
    const date: moment.Moment = moment(requested_date, format, 'fr', true);
    return date.isValid() && year[date.format("2022-MM-DD")];
  }).filter(_ => _);
}

// Return the number of day between today and the requested date
export const getRemainingDay = (almanax_date: string): number => {
  const date: moment.Moment = moment();
  const searched_date: moment.Moment = moment({
    y: parseInt(date.format("YYYY")),
    M: parseInt(almanax_date.split("-")[1]) - 1, 
    D: parseInt(almanax_date.split("-")[2])
  });
  (date > searched_date) && searched_date.add(1, "year");
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
