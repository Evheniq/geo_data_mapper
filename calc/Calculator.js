import {open, readFile} from 'fs/promises';
const textJson = await readFile(
    new URL('../resources/mappedGeoData.json', import.meta.url)
)
const data = await JSON.parse(
    textJson.toString()
);

class GeoParamsCalculatorFactory{
    create(type, data){
        if (type === "monthly") {
            return new GeoParamsCalculator(data, [1, 2]);
        } else if(type === "annual daily"){
            return new GeoParamsCalculator(data, [0, 1]);
        } else if (type === "annual monthly") {
            return new GeoParamsCalculator(data, [1]);
        }
    }
}

class GeoParamsCalculator{
    constructor(data, compareDateItems) {
        this.data = data;

        this.compareDateItems = compareDateItems;
        this.result = {};
    }

    calc(selector, avg=false){
        for (const item of this.data){
            const splitDateSelector = item.date.split(".");
            let currentDateSelector = [];
            for (const compareItem of this.compareDateItems){
                currentDateSelector.push(splitDateSelector[compareItem])
            }

            const currentDateSelectorString = currentDateSelector.join(".");

            if (this.result[currentDateSelectorString]) {
                const currentResultSlot = this.result[currentDateSelectorString];
                currentResultSlot["count"] = currentResultSlot["count"] + 1;
                currentResultSlot["sum"] = currentResultSlot["sum"] + item.data[selector];
            } else {
                this.result[currentDateSelectorString] = {};
                const currentResultSlot = this.result[currentDateSelectorString];
                currentResultSlot["count"] = 1;
                currentResultSlot["sum"] = item.data[selector];
            }
        }

        if (avg) {
            for (const item of Object.keys(this.result)){
                this.result[item]["avg"] = this.result[item]["sum"] / this.result[item]["count"];
            }
        }
    }

    async saveData(data, path){
        let fileHandle = await open(path, 'w');
        await fileHandle.writeFile(JSON.stringify(this.result));
        console.log("Json saved!")
    }
}

const calcFactory = new GeoParamsCalculatorFactory()

const monthly = calcFactory.create("monthly", data)
const annual_daily = calcFactory.create("annual daily", data)
const annual_monthly = calcFactory.create("annual monthly", data)

monthly.calc("air_temperature", false)
console.log(
    "calc:", monthly.result
)

annual_daily.calc("air_temperature")
console.log(
    "annual_daily:", annual_daily.result
)

annual_monthly.calc("air_temperature", true)
console.log(
    "annual_monthly:", annual_monthly.result
)