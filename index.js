const express  = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const PORT = process.env.PORT || 5018;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/print", (req, res) => {
    console.log(req.body);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));