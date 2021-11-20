const svUtil = require("./lib/svUtil.js");
const settingsUtil = require("./lib/settingsUtil.js");
const fs = require("fs");

var options = JSON.parse(fs.readFileSync("options.json", {encoding: "utf8"}));

module.exports = {
    serverCommand: serverCommand,
}

function serverCommand(type){
    return svUtil[type + "Function" + options.os]();
}

function getServerState(){
    return Number(!!svUtil["discoverFunction" + options.os]());
}

function getSettings(){
    return settingsUtil.parseSettingsToJSON();
}

function setSettings(){

}