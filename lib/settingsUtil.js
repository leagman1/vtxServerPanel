module.exports = {
    parseSettingsToJSON: parseSettingsToJSON,
    writeSettingsFromJSON: writeSettingsFromJSON
}

const {readFileSync, writeFileSync} = require("fs");
const options = JSON.parse(readFileSync("options.json", {encoding: "utf8"}));

if(options.os == "Windows"){
    var URLGameINI = options.path + "Saved/Config/WindowsServer/Game.ini";
} else if(options.os == "Linux"){
    var URLGameINI = options.path + "Saved\\Config\\LinuxServer\\Game.ini";
}

function parseSettingsToJSON(){
    var settingsData = readSettingsFile().match(/\[[a-zA-Z]*\]|.*=.*/g);

    var regXCategory = /\[[a-zA-Z]*\]/;

    var settings = [];

    for(let i = 0; i< settingsData.length; i++){
        let currentLine = settingsData[i];

        if(regXCategory.test(currentLine)){
            currentLine = currentLine.replace("[", "").replace("]", "");

            var category = {name: currentLine, settings: []};
        } else {
            let settingRaw = currentLine.split("=");
            let setting = {displayName: "", name: settingRaw[0], value: settingRaw[1]};

            category.settings.push(setting);
        }

        // push category only if it's not in the array already
        if(!settings.some((e) => e.name == category.name)){
            settings.push(category);
        }
    }

    return settings;
}

function writeSettingsFromJSON(){
    var settingsString = "";
}

function readSettingsFile(){
    return readFileSync(URLGameINI, "utf8");
}

function writeSettingsFile(data){
    writeFileSync(URLGameINI, data, "utf8");
}