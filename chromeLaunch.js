const chromeLauncher = require("chrome-launcher");
const tempWrite = require("temp-write");
const fs = require("fs");
const jsonfile = require("jsonfile");
const puppeteer = require("puppeteer-core");
const axios = require("axios");
const _fs = require("fs");
const _path = require("path");

exports.launch = async () => {
  let clResolve = require.resolve("chrome-launcher");
  if (clResolve) {
    clResolve = _path.join(_path.dirname(clResolve), "flags.js");
    if (_fs.existsSync(clResolve)) {
      let content = _fs.readFileSync(clResolve, "utf8");
      let newContent = content.replace(/^(\s+'--mute-audio')/gm, "//$1");
      if (content !== newContent)
        _fs.writeFileSync(clResolve, newContent, "utf8");
    }
  }
  const args = [];
  // args.push("--mute-audio");
  // args.push("--start-fullscreen");
  // args.push("--start-maximized");
  args.concat([
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
  ]);
  let chrome;
  try {
    chrome = jsonfile.readFileSync("./chrome.json");
    console.log("read from store");
  } catch {
    // Initializing a Chrome instance manually
    chrome = await chromeLauncher.launch({
      chromeFlags: args,
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
};
