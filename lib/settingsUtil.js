module.exports = {
    parseSettingsToJSON: parseSettingsToJSON,
    writeSettingsFromJSON: writeSettingsFromJSON
}

const {readFileSync, writeFileSync} = require("fs");
const options = JSON.parse(readFileSync("options.json", {encoding: "utf8"}));

if(options.os == "windows"){
    var URLGameINI = options.path + "Saved/Config/WindowsServer/Game.ini";
} else if(options.os == "linux"){
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

function writeSettingsFromJSON(settings){
    var settingsString = "";

    settings.forEach(function stringifyCategories(category){
        settingsString += "[" + category.name + "]\n";

        category.settings.forEach(function stringifySettings(setting){
            settingsString += setting.name + "=" + setting.value + "\n";
        })

        settingsString += "\n"; // for readability
    });

    writeSettingsFile(settingsString);

    return true;
}

function readSettingsFile(){
    var testPath = options.path + "Saved/Config/WindowsServer/Game_test.ini";

    return readFileSync(testPath, "utf8");
}

function writeSettingsFile(data){
    var testPath = options.path + "Saved/Config/WindowsServer/Game_test.ini";
    writeFileSync(testPath, data, "utf8");
    // URLGameINI
}

function getSettingDisplayName(settingNameRaw){
    return settingNameRaw.split(/(?=[A-Z])/).join(" ");
}