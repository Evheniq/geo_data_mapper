import data from "./data.js";
import headersUnformated from "./headersUnformated.js";
import fs from 'fs';

function stringReplacerSpacesToUnderscore(arrStr){
    const result = []
    for (let item of arrStr){
        result.push(item.replace("(", "").replace(")", "").replace(" ", "_").replace(" ", "_").replace(" ", "_").toLowerCase())
    }
    console.log("headers", result)
    return result
}

class Extractor{
    constructor(stringSrc, pathToSave) {
        this.result = {}
        this.headers = stringReplacerSpacesToUnderscore(headersUnformated)

        this.stringSrc = stringSrc;
        this.pathToSave = pathToSave;
    }

    dataMapping(){
        const arrLines = this.stringSrc.split("\n")

        for (let line=0; line < arrLines.length-14975; line++){

            const lineSliced = arrLines[line].replace(" ", "").split("\t");
            console.log("lineSliced", lineSliced)
            this.result[lineSliced[0]] = {}

            for(let item=1; item < lineSliced.length; item++) {
                let itemNotParsed = parseFloat(lineSliced[item])
                console.log("itemNotParsed", itemNotParsed)

                let itemParsed = parseFloat(lineSliced[item])
                console.log("itemParsed", itemParsed)
                this.result[lineSliced[0]][this.headers[item-1]] = itemParsed;
            }
        }

        console.log(this.result)
        fs.writeFile("./test.txt", "123")
    }
}


const test = new Extractor(data, "test")
test.dataMapping()