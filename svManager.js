const util = require("./lib/svUtil.js");
const fs = require("fs");

var options = JSON.parse(fs.readFileSync("options.json", {encoding: "utf8"}));

module.exports = {
    serverCommand: serverCommand,
    serverState: getServerState
}

function serverCommand(type){
    return util[type + "Function" + options.os]();
}

function getServerState(){
    return Number(!!util["discoverFunction" + options.os]());
}