import {open, readFile, mkdir} from 'fs/promises';
import {existsSync} from "fs";
import headers from "../resources/data/headersFormatted.js";
const textJson = await readFile(
    new URL('../resources/data/mappedGeoData.json', import.meta.url)
)
const data = await JSON.parse(
    textJson.toString()
);

class GeoParamsCalculatorFactory{
    create(type, data){
        if (!existsSync("results")){
            mkdir("results/")
        }

        const pathToSave = "results/" + type

        if (!existsSync(pathToSave)){
            mkdir(pathToSave)
        }

        if (type === "monthly") {
            return new GeoParamsCalculator(data, [1, 2], pathToSave);
        } else if(type === "annual daily"){
            return new GeoParamsCalculator(data, [0, 1], pathToSave);
        } else if (type === "annual monthly") {
            return new GeoParamsCalculator(data, [1], pathToSave);
        }
    }
}

class GeoParamsCalculator{
    constructor(data, compareDateItems, pathToSave) {
        this.data = data;
        this.compareDateItems = compareDateItems;
        this.pathToSave = pathToSave;
    }

    calc(selector){
        const storage = {};
        let result = [];

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

            if (storage[currentDateSelectorString]) {
                const currentResultSlot = storage[currentDateSelectorString];
                currentResultSlot["count"] = currentResultSlot["count"] + 1;
                currentResultSlot["sum"] = currentResultSlot["sum"] + item.data[selector];
            } else {
                storage[currentDateSelectorString] = {};
                const currentResultSlot = storage[currentDateSelectorString];
                currentResultSlot["count"] = 1;
                currentResultSlot["sum"] = item.data[selector];
            }
        }

        for (const item of Object.keys(storage)){
            if (avg) {
                result.push(storage[item]["sum"] / storage[item]["count"]);
                continue;
            }
            result.push(storage[item]["sum"]);
        }

        // this.saveData(result, this.pathToSave + "/" + selector + ".json");
        this.saveData(storage, this.pathToSave + "/" + selector + ".json");
    }

    async saveData(data, path){
        let fileHandle = await open(path, 'w');
        await fileHandle.writeFile(JSON.stringify(data));
        console.log("Json saved: ", path);
    }
}

const calcFactory = new GeoParamsCalculatorFactory()

const monthly = calcFactory.create("monthly", data)
const annual_daily = calcFactory.create("annual daily", data)
const annual_monthly = calcFactory.create("annual monthly", data)

for(const headTitle of headers){
    monthly.calc(headTitle)
    annual_daily.calc(headTitle)
    annual_monthly.calc(headTitle)
}
