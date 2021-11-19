const util = require("./util.js");
const fs = require("fs");

var options = JSON.parse(fs.readFileSync("options.json", {encoding: "utf8"}));

module.exports = {
    serverCommand: serverCommand,
    serverState: getServerState
}

function serverCommand(type){
    try {
        var fn = options[type + "Function"];
        return util[fn]();
    } catch(err) {
        console.error(err);
    }

    return false;
}

function getServerState(){
    var fn = options["discoverFunction"];

    return Number(!!util[fn]());
}