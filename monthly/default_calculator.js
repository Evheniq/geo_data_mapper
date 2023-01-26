import {open, readFile} from 'fs/promises';
const textJson = await readFile(
    new URL('../resources/mappedGeoData.json', import.meta.url)
)
const data = await JSON.parse(
    textJson.toString()
);

class GeoParamsCalculatorFactory{
    create(type, data){
        if(type === "annual daily"){
            return new GeoParamsCalculator(data, [0, 1]);
        }
    }
}

class GeoParamsCalculator{
    constructor(data, compareDateItems) {
        this.data = data;

        this.compareDateItems = compareDateItems;
        this.result = {};
    }

    calc(selector){
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
                currentResultSlot["result"] = currentResultSlot["count"] / currentResultSlot["sum"];
            } else {
                this.result[currentDateSelectorString] = {};
                const currentResultSlot = this.result[currentDateSelectorString];
                currentResultSlot["count"] = 1;
                currentResultSlot["sum"] = item.data[selector];
                currentResultSlot["result"] = item.data[selector];
            }
        }

        // this.saveData(this.result, "")
    }

    async saveData(data, path){
        let fileHandle = await open(path, 'w');
        await fileHandle.writeFile(JSON.stringify(this.result));
        console.log("Json saved!")
    }
}

// const monthly = new GeoParamsCalculator(data, [1, 2])
const calcFactory = new GeoParamsCalculatorFactory()
const monthly = calcFactory.create("annual daily", data)

monthly.calc("air_temperature")
console.log(
    monthly.result
)