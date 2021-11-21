const fs = require('fs');
const cp = require('child_process');
var settingsUtil = require("./settingsUtil.js");

const options = JSON.parse(fs.readFileSync("options.json", {encoding: "utf8"}));

// used for pipeing output of the server processes
var out;
var err;

module.exports = {
    serverCommand: serverCommand,
    getSettings: getSettings,
    getServerState: getServerState
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


// linux
function startServerLinux(){
    console.log("Executing default, start handler (Linux).");

    return true;
}

function stopServerLinux(){
    console.log("Executing default stop handler (Linux).");
}

function discoverServerLinux(){
    console.log("Executing default discover handler (Linux).");

    return true;
}

// windows
function startServerWindows(){
    console.log("Executing default start handler (Windows).");

    var PID = discoverServerWindows();

    if(!PID){
        try {
            out = fs.openSync(options.path + 'vtxServerPanel_serverLog.log', 'a');
            err = fs.openSync(options.path + 'vtxServerPanel_serverLog.log', 'a');
        
            var child = cp.spawn(options.path + "MCSServer.exe", [], {detached: true, stdio: [ 'ignore', out, err ] });
            child.unref();
        } catch(err) {
            console.log("Something went wrong when trying to start the server:\n\n" + err);

            return false;
        }
    }

    return true;
}

function stopServerWindows(){
    console.log("Executing default stop handler (Windows).");

    var PID = discoverServerWindows();

    if(PID){
        if(out){
            fs.close(out);
            fs.close(err);
        }

        try {
            cp.execSync("taskkill /PID " + PID);
        } catch (err) {
            console.log("Something went wrong when trying to stop the server:\n\n" + err);

            return false;
        }
    }

    return true;
}

function discoverServerWindows(){
    console.log("Executing default discover handler (Windows).");

    // wmic process get processid,executablepath | find "MCSServer"
    // WMIC path win32_process get Caption,Processid,Commandline

    var PID = false;

    try {
        var result = cp.execSync(`wmic process get processid,executablepath | find \"${options.path}Binaries\\Win64\\MCSServer.exe\"`);

        PID = result.toString().split(/\s/).filter(e => !!e)[1];
        console.log("Result: server running.");
    } catch (err){
        console.log("Result: server not running.");
        return false;
    }
    return PID;
}


// --------------------------
// custom handlers

function startServerCustom(){
    console.log("Executing custom start handler.");

    return true;
}

function stopServerCustom(){
    console.log("Executing custom stop handler.");

    return true;
}

function discoverServerCustom(){
    console.log("Executing custom discover handler.");

    return true;
}