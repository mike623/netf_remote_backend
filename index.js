const express = require("express");

const config = require("./config.json");
const app = express();
const { serve, goTo } = require("./app");
const { launch } = require("./chromeLaunch");


(async () => {
  try {
    const browser = await launch();

    const pages = await browser.pages();
    const page = pages[0];

    // Open login page and login
    await page.goto("https://www.netflix.com/ie/login");
    const url = await page.url();

    if (!/browse/.test(url)) {
      await page.type("#id_userLoginId", config.username);
      await page.type("#id_password", config.password);
      await page.keyboard.press("Enter");
      await page.waitForNavigation();

      // Click the user account
      await page.click(
        `.profile:nth-child(${config.profilePos}) .profile-icon`
      );
      await page.waitForNavigation();
    }

    await serve(app, page);
  } catch (e) {
    console.log(e);
  }
})();
