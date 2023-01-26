import data from "./data/dataDirty.js";
import headersUnformated from "./data/headersFormatted.js";
import {open} from 'fs/promises';

class Extractor{
    constructor(stringSrc, pathToSave) {
        this.result = [];
        this.headers = headersUnformated;

        this.stringSrc = stringSrc;
        this.pathToSave = pathToSave;
    }

    async dataMapping() {
        const arrLines = this.stringSrc.split("\n")

        for (let line=0; line<arrLines.length; line++) {

            const lineSliced = arrLines[line].replace(" ", "").split("\t");
            this.result.push({
                date: lineSliced[0],
                data: {}
            });

            for (let item=1; item<lineSliced.length; item++) {
                this.result[line]["data"][this.headers[item - 1]] = parseFloat(lineSliced[item]);
            }
        }
        console.log("Mapped:", this.result);
        await this.saveMappedData();
    }

    async saveMappedData(){
        let fileHandle = await open(this.pathToSave, 'w');
        await fileHandle.writeFile(JSON.stringify(this.result));
        console.log("Json saved!");
    }
}

const test = new Extractor(data, "./mappedGeoData.json");
await test.dataMapping();
