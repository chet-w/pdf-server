const puppeteer = require("puppeteer");
const fs = require("fs");


const generateReport = async (url, level, subject) => {

    console.log(url, level, subject);

    const browser = await puppeteer.launch({
        defaultViewport: {
            height: 1080,
            width: 1920,
            deviceScaleFactor: 1.5,
        },
        headless: true,
        args: [
            "--allow-file-access-from-files",
            "--enable-local-file-accesses"
        ]
    });
    const page = await browser.newPage();
    await page.goto(url);
    if (level === "subtopic") {
        await generateSubtopicReport(page);
        Promise.resolve()
    }
    await browser.close();
};

const generateSubtopicReport = async page => {
    await page.waitForSelector("#topic-icon");
    // Get Topic Icon
    await grabElementAsImage("#topic-icon", "topic-icon", page);
    // Get Topic name
    const topicElement = await page.$("#topic-heading");
    const topicText = await page.evaluate(el => el.textContent, topicElement);
    // Get Subtopic name
    const subtopicElement = await page.$("#subtopic-heading");
    const subtopicText = await page.evaluate(el => el.textContent, subtopicElement);
    // Get Subtopic description
    const subtopicDescElement = await page.$("#subtopic-description");
    const subtopicDescText = await page.evaluate(el => el.textContent, subtopicDescElement);

    await grabElementAsImage("#prevalence-table", "indicator-table", page);

    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="http:localhost:5018/print.css" />
    <title>Subtopic report!</title>
</head>

<body>
    <section class="page cover-page">
        <article class="cover-content">
            <div class="logo-section">
                <img src="http:localhost:5018/print-imgs/kupe.svg" />
            </div>
            <div class="cover-title-section">
                <div class="topic-with-logo">
                    <img src="http:localhost:5018/topic-icon.png" />
                    <h1>${topicText}</h1>
                </div>
                <div class="subtopic-details">
                    <h2>${subtopicText}</h2>
                    <p>${subtopicDescText}</p>
                </div>
            </div>
        </article>
        <footer class="cover-footer">
            <div class="footer-border">
                <div class="footer-border-segment green"></div>
                <div class="footer-border-segment blue"></div>
                <div class="footer-border-segment orange"></div>
                <div class="footer-border-segment yellow"></div>
                <div class="footer-border-segment purple"></div>
            </div>
            <div class="footer-body">
                <img class="hpa-logo" src="http:localhost:5018/print-imgs/hpa.svg" />
                <img class="nz-govt" src="http:localhost:5018/print-imgs/nz-govt.svg" />
            </div>
        </footer>
    </section>

    <section class="page">
        <header class="page-header">
            <img class="kupe" src="http:localhost:5018/print-imgs/kupe.svg" />
            <img src="http:localhost:5018/print-imgs/hpa-color.svg" />
        </header>
        <article class="page-content">
            <div class="main-content">
                <div class="intro-text">
                    <h3>Prevalence for ${subtopicText}</h3>
                    <p>This table gives the percentage of the population affected (that is, the unadjusted prevalence in
                        the specified
                        population). Click on an indicator to find out more about it.</p>
                </div>
                <div class="selected-group">
                    <strong>Group:</strong> Total
                </div>
                <div class="table-section">
                    <img src="http:localhost:5018/indicator-table.png" />
                </div>
            </div>
            <div class="notes">
                <p class="source">Source: Health and Lifestyles Survey</p>
                <label>Notes:</label>
                <ul class="notes-list">
                    <li>Dashes indicate the data is not available.</li>
                    <li>For Total response this is due to the question/s not being asked in that survey wave.</li>
                    <li>For specific ethnicity totals, it may be due to the question not being asked or due to small
                        sample size.</li>
                </ul>
            </div>
        </article>
        <footer class="page-footer">
            <div class="footer-border">
                <div class="footer-border-segment green"></div>
                <div class="footer-border-segment blue"></div>
                <div class="footer-border-segment orange"></div>
                <div class="footer-border-segment yellow"></div>
                <div class="footer-border-segment purple"></div>
            </div>
            <div class="footer-body">
                <img class="hpa-logo" src="http:localhost:5018/print-imgs/hpa.svg" />
                <img class="nz-govt" src="http:localhost:5018/print-imgs/nz-govt.svg" />
            </div>
        </footer>
    </section>
</body>

</html>
    `;

    await page.goto(`data:text/html,${htmlContent}`, { waitUntil: 'networkidle2' });
    await page.pdf({
        path: `subtopic-report.pdf`,
        format: 'A4',
        printBackground: true
    });

    console.log("Done!")
};

const grabElementAsImage = async (selector, filename, page, padding = 0) => {
    const rect = await page.evaluate(selector => {
        const element = document.querySelector(selector);
        const { x, y, width, height } = element.getBoundingClientRect();
        return { left: x, top: y, width, height, id: element.id };
    }, selector);

    return await page.screenshot({
        path: `${filename}.png`,
        clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
        }
    });
}





module.exports.generateReport = generateReport;