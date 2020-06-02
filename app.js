const bp = require("body-parser");
var morgan = require('morgan')
const { getVol, mute, setVol } = require("./mac-control");

async function goTo(page, url) {
  await page.goto(url);
  await page.waitForSelector("a[data-uia='play-button']");
  await page.click(`a[data-uia='play-button']`);
  await page.waitForNavigation();
  await page.waitFor(3000);
}

async function serve(app, page) {
  app.use(morgan('tiny'));
  app.use(bp.json());
  app.get("/go", async (req, res) => {
    const { url } = req.query;
    await goTo(page, url);
    res.send("ok");
  });
  app.get("/send/:key", async (req, res) => {
    page.keyboard.press(req.params.key);
    res.send("ok");
  });
  app.get("/vol", async (req, res) => {
    try {
      const [vol, isMute] = await getVol();
      console.log({ vol });
      res.send(vol + "");
    } catch (e) {
      res.send(e);
      console.log(e);
    }
  });
  app.post("/vol", async (req, res) => {
    try {
      const { value } = req.body;
      await setVol(value);
      res.send("ok");
    } catch (e) {
      res.send(e);
      console.log(e);
    }
  });
  app.post("/vol/mute", async (req, res) => {
    try {
      const [vol, isMute] = getVol();
      if (isMute) await unmute();
      else await mute();
      res.send("ok");
    } catch (e) {
      res.send(e);
      console.log(e);
    }
  });
  app.listen(3000, () => {
    console.log("go");
  });
}

exports.serve = serve;
exports.goTo = goTo;
