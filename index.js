const express  = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const generateReport = require("./printer").generateReport;

const PORT = process.env.PORT || 5018;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post("/print", async (req, res) => {
    const { url, level, subject } = req.body;
    // const url = "http://localhost:8000/alcohol/alcohol-attitudes";
    // const level = "subtopic";
    await generateReport(url, level, subject); 
    res.status(200).send("Done!");
});

app.get("/download", (req, res) => {
    console.log("downloading...")
    res.download("subtopic-report.pdf");
    
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));