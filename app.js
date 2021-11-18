const express = require('express')
const app = express()
const port = 3000
const svManager = require("./lib/svManager.js");

app.set("view engine", "pug");

app.get('/', (req, res) => {
  res.render("index", {title: "What up, dude!", message: "Oh hi, Mark!"});
})

app.post("/rs", (req, res) => {
    svManager.test();
    res.send("ye");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
