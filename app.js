const fs = require("fs");
const {port} = JSON.parse(fs.readFileSync("options.json", {encoding: "utf8"}));
const svUtil = require("./lib/svUtil.js");

const express = require('express')
const app = express()

app.use(express.json());
app.set("view engine", "pug");

app.get('/', (req, res) => {
  var isOnline = svUtil.getServerState();
  console.log("Is server online?: " + isOnline);

  res.render("index", {svSettings: svUtil.getSettings(), isOnline: isOnline});
});

app.post("/sc", (req, res) => {
    console.log("Executing server command: " + req.body.command);

    var commandResult = false;

    try {
      commandResult = svUtil.serverCommand(req.body);
    } catch (err) {
      console.error(err);
    }

    res.json({commandResult: commandResult});
});

app.listen(port, () => {
  console.log(`Started vtxServerPanel.`)
});