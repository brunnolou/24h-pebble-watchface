/**
 * Fraction to radian.
 */

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}

/**
 * Get hours.
 */

function getHours(hours) {
  var now = new Date();

  now.setTime(now.getTime() + (hours * 60 * 60 * 1000));

  return (now.getHours() < 10 ? '0' : '') + now.getHours();
}

/**
 * Get minutes.
 */

function getMinutes() {
  var now = new Date();

  return (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
}

/**
 * Exports.
 */

module.exports = {
  fractionToRadian: fractionToRadian,
  getHours: getHours,
  getMinutes: getMinutes
};
