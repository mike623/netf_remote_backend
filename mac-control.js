var applescript = require("applescript");

const getVol = () => {
  const q =
    "output volume of (get volume settings) & output muted of (get volume settings)";
  return exec(q);
};

const setVol = (value) => {
  const q = `set volume output volume ${value} without output muted --100%`;
  return exec(q);
};

const mute = () => {
  const q = `set volume with output muted`;
  return exec(q);
};
const unmute = () => {
  const q = `set volume without output muted`;
  return exec(q);
};

const exec = (q) =>
  new Promise((rr, rj) =>
    applescript.execString(q, (err, v) => (err ? rj(err) : rr(v)))
  );

exports.getVol = getVol;
exports.setVol = setVol;
exports.mute = mute;
exports.unmute = unmute;
