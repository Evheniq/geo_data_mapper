import {open, readFile} from 'fs/promises';
const textJson = await readFile(
    new URL('../resources/mappedGeoData.json', import.meta.url)
)
const data = await JSON.parse(
    textJson.toString()
);

class DefaultCalculator{
    constructor(data, compareDateItems) {
        this.data = data

        this.compareDateItems = compareDateItems
        this.result = {}
    }

    calc(selector){
        for (const item of this.data){
            const splitedDateSelector = item.date.split(".")
            let currentDateSelector = [];
            for (const compareItem of this.compareDateItems){
                currentDateSelector.push(splitedDateSelector[compareItem])
            }

            const currentDateSelectorString = currentDateSelector.join(".")

            if (this.result[currentDateSelectorString]) {
                this.result[currentDateSelectorString]["count"] = this.result[currentDateSelectorString]["count"] + 1;
                this.result[currentDateSelectorString]["sum"] = this.result[currentDateSelectorString]["sum"] + item.data[selector];
                this.result[currentDateSelectorString]["result"] = this.result[currentDateSelectorString]["count"] / this.result[currentDateSelectorString]["sum"];
            } else {
                this.result[currentDateSelectorString] = {}
                this.result[currentDateSelectorString]["count"] = 1;
                this.result[currentDateSelectorString]["sum"] = item.data[selector];
                this.result[currentDateSelectorString]["result"] = item.data[selector];
            }
        }
    }

    async saveExtractedData(path){
        let fileHandle = await open(, 'w');
        await fileHandle.writeFile(JSON.stringify(this.result));
        console.log("Json saved!")
    }
}

const monthly = new DefaultCalculator(data, [1, 2])
monthly.calc("air_temperature")
console.log(
    monthly.result
)