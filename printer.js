const puppeteer = require("puppeteer");


const generateReport = async (url, level) => {
    const browser = await puppeteer.launch({
        defaultViewport: {
            height: 1080,
            width: 1920,
            deviceScaleFactor: 1.5,
        },
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);
    if(level === "subtopic") {
        await generateSubtopicReport(page);
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
    // Get Subtopic name
    const subtopicElement = await page.$("#subtopic-heading");
    const subtopicText = await page.evaluate(el => el.textContent, subtopicElement); 


    console.log({topicText, subtopicText, subtopicDescText});


    await grabElementAsImage("#prevalence-table", "indicator-table", page);
};

const grabElementAsImage = async (selector, filename, page, padding = 0) => {
    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
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