import { namespaceWrapper } from "@_koii/namespace-wrapper";
import os from "os";
import puppeteer from "puppeteer-core"
import PCR from 'puppeteer-chromium-resolver';

export async function task(roundNumber: number): Promise<void> {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
    // you can optionally return this value to be used in debugging
    const options = await getOptions();
    const stats = await PCR(options);
    const browser = await puppeteer.launch({
      // headless: false,
      executablePath: stats.executablePath,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    await page.goto('https://www.sticksoma.com/?utm_source=koiitask&utm_medium=koiitask');
    // Get page Title
    const title = await page.title();
    console.log('Page Title:', title);
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Get all the clickable elements
    const clickableElements = await page.$$('a');
    console.log('Clickable Elements:', clickableElements.length);
    // Click on the random clickable element
    const randomIndex = Math.floor(Math.random() * clickableElements.length);
    if (clickableElements[randomIndex]){
      await clickableElements[randomIndex].click();
    }

    // Wait for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    const newTitle = await page.title();
    console.log('New Page Title:', newTitle);
    
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    // Wait for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Simulate a scroll
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 30000));
    console.log(`Thanks for running the Attention Booster Task!`);
    await namespaceWrapper.storeSet("value", title);
    await browser.close();
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}

async function getOptions(): Promise<{ revision: string; detectionPath: string; download: boolean }> {
  let revision;

  if (os.platform() === 'darwin') {
    if (os.arch() === 'arm64') {
      // Apple Silicon (M1/M2) Mac
      revision = '1398047'; // Replace with the correct revision number for Mac_Arm
    } else {
      // Intel-based Mac
      revision = '1398623'; // Replace with the correct revision number for Mac
    }
  } else {
    switch (os.platform()) {
      case 'linux':
        revision = '1398043';
        break;
      case 'win32': // Windows
        revision = '1398050';
        break;
      default:
        throw new Error('Unsupported platform');
    }
  }

  return {
    revision, // Chromium revision based on OS
    detectionPath: './.chromium-browser-snapshots', // Path to store Chromium
    download: true, // Automatically download Chromium
  };
};