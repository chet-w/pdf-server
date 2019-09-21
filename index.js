const express  = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const generateReport = require("./printer").generateReport;

const PORT = process.env.PORT || 5018;

const app = express();

const corsOptions = {
  origin: "https://kupe-clone.netlify.com"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post("/print", async (req, res) => {
    const { url, level, subject } = req.body;
    await generateReport(url, level, subject); 
    res.status(200).send("Done!");
});

app.get("/download", (req, res) => {
    console.log("downloading...")
    res.download("subtopic-report.pdf");
    
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));