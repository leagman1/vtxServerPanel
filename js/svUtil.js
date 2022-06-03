const fs = require('fs');
const cp = require('child_process');
const path = require("path");

var settingsUtil = require(path.join(__dirname, "settingsUtil.js"));

const options = JSON.parse(fs.readFileSync("options.json", {encoding: "utf8"}));
options.path = options.path.split(/\\|\//).join(path.sep);

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
        return setSettings(rqBody.svSettings);
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
    console.log("Saving settings..", svSettings);

    var isRunning = getServerState();

    if(isRunning)
        return false;

    settingsUtil.writeSettingsFromJSON(svSettings);
    return true;
}


// --------------------------
// server command handlers


// Linux
function startServerLinux(){
    console.log("Executing default start handler (Linux).");

    if(!PID){
        try {
            out = fs.openSync(path.join(options.path, "Saved", "Logs", "vtxServerPanel_serverLog.log"), 'a');
            err = fs.openSync(path.join(options.path, "Saved", "Logs", "vtxServerPanel_serverLog.log"), 'a');

            var args = [
                options.svargs.map + "?game=" + options.svargs.gameMode,
                "-servername=" + options.svargs.servername,
            ];
        
            var child = cp.spawn(path.join(options.path, "Binaries", "Linux", "MCSServer"), args, {detached: true, stdio: [ 'ignore', out, err ]});
            child.unref();
            
        } catch(err) {
            console.log("Something went wrong when trying to start the server:\n\n" + err);

            return false;
        }
    }

    return true;
}

function stopServerLinux(){
    console.log("Executing default stop handler (Linux).");

    var PID = discoverServerLinux();

    if(PID){
        if(out){
            fs.close(out);
            fs.close(err);
        }

        try {
            cp.execSync("kill " + PID);
        } catch (err) {
            console.log("Something went wrong when trying to stop the server:\n\n" + err);

            return false;
        }
    }

    return true;
}

function discoverServerLinux(){
    console.log("Executing default discover handler (Linux).");

    var PID = false;

    try {
        var PIDs = cp.execSync("pgrep MCSServer").toString().split(/\s/g);
        
        for(let i = 0; i< PIDs.length; i++){
            if(cp.execSync("readlink /proc/" + PIDs[i] + "/exe").toString() == options.path + "/Binaries/Linux/MCSServer"){
                PID = PIDs[i];
                break;
            }
        }
        if(PID)
            console.log("Result: server running.");
    } catch (err){
        console.log("Result: server not running.");
        return false;
    }

    return PID;
}

// windows
function startServerWindows(){
    console.log("Executing default start handler (Windows).");

    var PID = discoverServerWindows();

    if(!PID){
        try {
            out = fs.openSync(path.join(options.path, "Saved", "Logs", "vtxServerPanel_serverLog.log"), 'a');
            err = fs.openSync(path.join(options.path, "Saved", "Logs", "vtxServerPanel_serverLog.log"), 'a');

            var args = [
                options.svargs.map + "?game=" + options.svargs.gameMode,
                "-servername=" + options.svargs.servername,
            ];
        
            var child = cp.spawn(path.join(options.path, "Binaries", "Win64", "MCSServer.exe"), args, {detached: true, stdio: [ 'ignore', out, err ] });
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

// custom
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