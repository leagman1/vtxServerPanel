module.exports = {
    startServerLinux: startServerLinux,
    stopServerLinux: stopServerLinux,
    discoverServerLinux: discoverServerLinux,

    startServerWindows: startServerWindows,
    stopServerWindows: stopServerWindows,
    discoverServerWindows: discoverServerWindows,

    // develop these in case you have an auto-restart or other fancy stuff going, which needs to be handled; make sure to set them in options.json
    startServerCustom: startServerCustom,
    stopServerCustom: stopServerCustom
};

const fs = require('fs');
const cp = require('child_process');
const options = JSON.parse(fs.readFileSync("options.json", {encoding: "utf8"}));

// --------------------------
// default handlers

function startServerLinux(){
    console.log("Executing default server command handler, startServerLinux.");
}

function stopServerLinux(){
    console.log("Executing default server command handler, stopServerLinux.");
}

function discoverServerLinux(){
    console.log("Executing default server command handler, discoverServerLinux.");
}



function startServerWindows(){
    console.log("Executing default server command handler, startServerWindows.");

    var out = fs.openSync(options.path + 'vtxServerPanel_serverLog.log', 'a');
    var err = fs.openSync(options.path + 'vtxServerPanel_serverLog.log', 'a');

    var child = cp.spawn(options.path + "MCSServer.exe", [], { detached: true, stdio: [ 'ignore', out, err ] });
    child.unref();
}

function stopServerWindows(){
    console.log("Executing default server command handler, stopServerWindows.");
}

function discoverServerWindows(){
    console.log("Executing default server command handler, discoverServerWindows.");
}


// --------------------------
// custom handlers

function startServerCustom(){
    console.log("Executing custom server command handler, startServerCustom.");
}

function stopServerCustom(){
    console.log("Executing custom server command handler, stopServerCustom.");
}