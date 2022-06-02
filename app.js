const fs = require("fs");
const express = require('express')
const path = require("path");

const {port} = JSON.parse(fs.readFileSync(path.join(__dirname, "options.json"), {encoding: "utf8"}));
const svUtil = require(path.join(__dirname, "js", "svUtil.js"));

const app = express()

process.title = "vcl_info_site";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render("index", {svSettings: svUtil.getSettings(), isOnline: !!svUtil.getServerState()});
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
  console.log("Started vtxServerPanel.");
});