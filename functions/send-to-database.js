const { supabase } = require("../utils/database");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const dotenv = require("dotenv").config();


const whatSite = 'https://nwdb.info/server-status';



exports.handler = async (event, context) => {


  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: chromium.true,
    ignoreHTTPSErrors: true,
});

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });


  const elementFound = async (ele) => {
    try {

      console.log("Element", ele);
      return await page.$eval(ele, (el) => el.innerText);
      
    } catch (error) {
      console.log(`Element ${ele} not found`);
      return ele = null
        // asOf = "N/A"
    }

  }

  try {
    
    await page.goto(whatSite);
    

    const screenshot = await page.screenshot();

    // let serverName = await elementFound('#svelte > div.container.mt-4.container-mb.my-auto.svelte-1d6did6 > div.container > div > div.item-table.table\! > div > section > article > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > span:nth-child(2)');
    let serverLocked = await elementFound("#svelte > div.container.mt-4.container-mb.my-auto.svelte-1d6did6 > div.container > div > div.item-table.table\! > div > section > article > table > tbody > tr:nth-child(22) > td:nth-child(2) > div > span:nth-child(4)");
    let serverOnlineCount = await elementFound("#svelte > div.container.mt-4.container-mb.my-auto.svelte-1d6did6 > div.container > div > div.item-table.table\! > div > section > article > table > tbody > tr:nth-child(22) > td:nth-child(6) > span");
    let serverQueue = await elementFound("#svelte > div.container.mt-4.container-mb.my-auto.svelte-1d6did6 > div.container > div > div.item-table.table\! > div > section > article > table > tbody > tr:nth-child(22) > td:nth-child(7)");
    // let asOf = "";

      // let numberInQueue = await elementFound('body > section:nth-child(1) > div > h2 > div:nth-child(1) > span');
  
      // let blizzETA = await elementFound('body > section:nth-child(1) > div > h2 > div:nth-child(2) > span')

  
      // let asOf = await elementFound('body > section:nth-child(1) > div > p');
      

    await browser.close();

    //   let queueUrl = "";
    //   if(screenshot) {

    //     const { data, error } = await supabase
    //     .storage
    //     .from('public')
    //     .upload('current-bene-queue.png', screenshot, {
    //       upsert: true,
    //       contentType: 'image/png'
    //     });
  
    //     if(error) {
    //       console.log(error);
    //     }

    //     if(data) {
    //       queueUrl = data.Key
    //       console.log(`Bucket url ${queueUrl}`);
    //   }
    // }

      const { data, error } = await supabase
      .from("new_world__queue")
      .update({
        updated_at: new Date().toISOString().toLocaleString('en-US'),
        queue_count: `${serverQueue ? serverQueue : 0}`,
        online_count: `${serverOnlineCount ? serverOnlineCount : 0}`,
        server_locked: `${serverLocked ? "Server Locked" : "Server Unlocked"}`
      })
      .match({
        id: 1
      })
      console.log("Data added to supabase");
      console.log(`Current Queue: ${serverQueue}, Online Count: ${serverOnlineCount}`);

    return {
      statusCode: 200,
      body: JSON.stringify(
        { 
          data
        })
    }


    } catch (error) {

    await browser.close();

    console.log(error);

    return {
        statusCode: 500,
        body: JSON.stringify({error: 'Failed'}),
    }
  }   
}