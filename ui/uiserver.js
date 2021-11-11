const express = require('express');

const app = express();
const path = require("path");

const DIST_DIR = path.join(__dirname, "./dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");
app.use(express.json());
app.use(express.static('dist'));

app.listen(3000, function () { console.log('UI started on port 3000'); });

app.get("/", (req, res) => {
    res.sendFile(HTML_FILE, function(err){
       if(err){
          res.status(500).send(err);
       }
    });
 });