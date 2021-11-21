const fs = require('fs');
const cp = require('child_process');
var settingsUtil = require("./settingsUtil.js");
const { resourceUsage } = require('process');

const options = JSON.parse(fs.readFileSync("options.json", {encoding: "utf8"}));

module.exports = {
    serverCommand: serverCommand,
    getSettings: getSettings
};

var commandMap = {
    linux: {
        start: startServerLinux,
        stop: stopServerLinux,
        discover: discoverServerLinux
    },
    windows: {
        start: startServerWindows,
        stop: stopServerWindows,
        discover: discoverServerWindows
    },
    custom: {
        start: startServerCustom,
        stop: stopServerCustom,
        discover: discoverServerCustom
    }
}

function serverCommand(rqBody){
    var command = rqBody.command;

    if(command == "save") {
        return setSettings(rqBody.settings);
    } else if(options.custom) {
        return commandMap["custom"][command]();
    } else {
        return commandMap[options.os][command]();
    }  
}

function getServerState(){
    if(options.custom)
        return !!commandMap.custom.discover();
    else
        return !!commandMap[options.os].discover();
}

function getSettings(){
    return settingsUtil.parseSettingsToJSON();
}

function setSettings(svSettings){
    var isRunning = getServerState();

    if(isRunning)
        return false;

    settingsUtil.writeSettingsFromJSON(svSettings);
    return true;
}


// --------------------------
// default handlers

function startServerLinux(){
    console.log("Executing default, start handler (Linux).");
}

function stopServerLinux(){
    console.log("Executing default stop handler (Linux).");
}

function discoverServerLinux(){
    console.log("Executing default discover handler (Linux).");
}



function startServerWindows(){
    console.log("Executing default start handler (Windows).");

    var out = fs.openSync(options.path + 'vtxServerPanel_serverLog.log', 'a');
    var err = fs.openSync(options.path + 'vtxServerPanel_serverLog.log', 'a');

    var child = cp.spawn(options.path + "MCSServer.exe", [], { detached: true, stdio: [ 'ignore', out, err ] });
    child.unref();
}

function stopServerWindows(){
    console.log("Executing default stop handler (Windows).");
}

function discoverServerWindows(){
    console.log("Executing default discover handler (Windows).");

    // wmic process get processid,executablepath | find "MCSServer"
    // WMIC path win32_process get Caption,Processid,Commandline
}


// --------------------------
// custom handlers

function startServerCustom(){
    console.log("Executing custom start handler.");
}

function stopServerCustom(){
    console.log("Executing custom stop handler.");
}

function discoverServerCustom(){
    console.log("Executing custom discover handler.");
}