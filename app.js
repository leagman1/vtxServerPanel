const express = require('express')
const app = express()
const port = 3000
const svManager = require("./lib/svManager.js");

app.use(express.json());
app.set("view engine", "pug");

app.get('/', (req, res) => {
  res.render("index", {svSettings: svManager.getSettings()});
})

app.post("/sc", (req, res) => {
    console.log("Executing server command: " + req.body.command);
    try {
      svManager.serverCommand(req.command);
    } catch (err) {
      console.error(err);
      res.json({statusCode: 400, statusText: err});
    }

    res.json({topkek: "lelelel"});
});

app.listen(port, () => {
  console.log(`Started vtxServerPanel.`)
})