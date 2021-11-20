module.exports = {
    parseSettingsToJSON: parseSettingsToJSON,
    writeSettingsFromJSON: writeSettingsFromJSON
}

const {readFileSync, writeFileSync} = require("fs");
const options = JSON.parse(readFileSync("../options.json", {encoding: "utf8"}));

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

            var category = {displayName: getSettingDisplayName(currentLine), name: currentLine, settings: []};
        } else {

            let setting = {};

            if(currentLine.match(/=/g).length == 5){
                // it's the team mode RGBA color setting
                let settingRaw = currentLine.split("=");

                setting.displayName = "";
                setting.name = settingRaw[0];

                settingRaw.shift();

                setting.value = settingRaw.join("=");
            } else {
                // it's a regular setting
                let settingRaw = currentLine.split("=");

                setting.displayName = getSettingDisplayName(settingRaw[0]);
                setting.name = settingRaw[0];
                setting.value = settingRaw[1];
            }

            category.settings.push(setting);
        }

        // push the category only if it's not in the array already
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

function getSettingDisplayName(settingNameRaw){
    return settingNameRaw.split(/(?=[A-Z])/).join(" ");
}