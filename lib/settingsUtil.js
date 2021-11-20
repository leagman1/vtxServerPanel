module.exports = {
    parseSettingsToJSON: parseSettingsToJSON,
    writeSettingsFromJSON: writeSettingsFromJSON
}

const {path} = JSON.parse(require("options.json"));
const {readFileSync, writeFileSync} = require("fs");

// regex: \[[a-zA-Z]*\]|.*=.*
// -> [ABC] und a=b

function parseSettingsToJSON(){
    var settingsData = readSettingsFile().match(/\[[a-zA-Z]*\]|.*=.*/g);

    var settingCategories = [];

    for(let i = 0; i< settingsData.length; i++){

    }
}

function writeSettingsFromJSON(){

}

function readSettingsFile(){
    var gameINI = path + "xxx";
    return readFileSync(gameINI, "utf8");
}

function writeSettingsFile(data){
    var gameINI = path + "xxx";
    writeFileSync(gameINI, data, "utf8");
}