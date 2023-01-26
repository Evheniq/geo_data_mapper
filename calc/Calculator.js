import {open, readFile} from 'fs/promises';
import headers from "../resources/data/headersFormatted";
const textJson = await readFile(
    new URL('../resources/mappedGeoData.json', import.meta.url)
)
const data = await JSON.parse(
    textJson.toString()
);

class GeoParamsCalculatorFactory{
    create(type, data){
        if (type === "monthly") {
            return new GeoParamsCalculator(data, [1, 2], type);
        } else if(type === "annual daily"){
            return new GeoParamsCalculator(data, [0, 1], type);
        } else if (type === "annual monthly") {
            return new GeoParamsCalculator(data, [1], type);
        }
    }
}

class GeoParamsCalculator{
    constructor(data, compareDateItems, pathToSave) {
        this.data = data;
        this.compareDateItems = compareDateItems;
        this.pathToSave = pathToSave;

        this.result = {};
    }

    calc(selector){
        let avg = false;
        if (["air_temperature", "discharge_observed", "discharge_simulated", "soil_water"].includes(selector)){
            avg = true;
        }

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

        this.saveData(this.result, this.pathToSave + "/" + selector + ".json")
    }

    async saveData(data, path){
        let fileHandle = await open(path, 'w');
        await fileHandle.writeFile(JSON.stringify(data));
        console.log("Json saved!")
    }
}

const calcFactory = new GeoParamsCalculatorFactory()

const monthly = calcFactory.create("monthly", data)
const annual_daily = calcFactory.create("annual daily", data)
const annual_monthly = calcFactory.create("annual monthly", data)

// for(const headTitle of headers){
//     monthly.calc(headTitle)
// }

monthly.calc("air_temperature")
console.log(
    "calc:", monthly.result
)