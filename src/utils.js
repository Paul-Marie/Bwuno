const moments = require('moment');
const fs = require('fs');

moments.locale('fr');

const getAlmanax = (bonus_types) => {
    const file = fs.readFileSync('./resources/year.json', "utf8")
    const object = JSON.parse(file);
    const result = Object.keys(object).map(key => {
        if (bonus_types.indexOf(object[key].Bonus_Type) >= 0) {
            const date = moments(key, "YYYY-MM-DD", 'fr');
            return "**" + date.format("DD MMMM") + "**: " + object[key].Bonus_Description + "\n";
        }
    }).filter(item => {
        return item !== undefined;
    });
    return result;
}

const getDates = (requested_date) => {
    const file = fs.readFileSync('./resources/year.json', "utf8")
    const object = JSON.parse(file);
    const accepted_format = ["DD/MM", "DD-MM", "DD MM", "DD MMM", "DD MMMM", "DD/MM/YYYY", "DD-MM-YYYY", "DD MM YYYY", "DD MMM YYYY", "DD MMMM YYYY"];
    return accepted_format.map(format => {
        const date = moments(requested_date, format, 'fr', true);
        console.log("format: " + format);
        if (date.isValid()) {
            return [object[date.format("2019-MM-DD")], date.format("2019-MM-DD")];
        }
    }).filter(item => {
        return item !== undefined;
    });
}

module.exports = {
    getAlmanax,
    getDates
}
