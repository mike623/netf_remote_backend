const chromeLauncher = require("chrome-launcher");
const tempWrite = require("temp-write");
const fs = require("fs");
const jsonfile = require("jsonfile");
const puppeteer = require("puppeteer-core");
const axios = require("axios");

exports.launch = async () => {
  try {
    let newFlags = chromeLauncher.Launcher.defaultFlags().filter(
      (flag) => flag !== "--mute-audio"
    );

    newFlags = newFlags.concat([
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ]);
    console.log({ newFlags });
    let chrome;
    try {
      chrome = jsonfile.readFileSync("./chrome.json");
      console.log("read from store");
    } catch {
      // Initializing a Chrome instance manually
      chrome = await chromeLauncher.launch({
        chromeFlags: newFlags,
        ignoreDefaultFlags: true,
      });
      jsonfile.writeFileSync("./chrome.json", chrome);
      console.log("temp store");
    }

    const response = await axios.get(
      `http://localhost:${chrome.port}/json/version`
    );
    const { webSocketDebuggerUrl } = response.data;

    // Connecting the instance using `browserWSEndpoint`
    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
    });

    return browser;
  } catch (e) {
    fs.unlinkSync('./chrome.json')
  }
};
