var utils = require('../utils/index.js');
var getMinutes = utils.getMinutes;
var getHours = utils.getHours;
var phi = 0.61803;

// Settings.
var config = {
  fontSize: 49,
  minutes: (new Date()).getMinutes(),
  offset: 0,
  start: 0,
  tickSize: 10,
  visibleHours: 2
};

function getRuler(start, end, divs) {
  var array = [];
  var i;

  for (i = start; i <= end; i += end / divs) {
    array.push(Math.round(i));
  }

  return array;
}

function drawTick(ctx, cx, cy, length) {
  // Find the end points.
  var x2 = cx;
  var y2 = cy - length;

  ctx.lineCap = 'square';
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';

  // Begin drawing.
  ctx.beginPath();

  // Move to the center point, then draw the line.
  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawHoursText(ctx, x, i) {
  var hour = getHours(i - 1, 'hours');

  ctx.fillStyle = 'white';
  ctx.font = config.fontSize + 'px Roboto-subset';
  ctx.textAlign = 'center';
  ctx.fillText(hour, x, config.fontSize / 4);
}

function drawHoursTicks(ctx, width, height) {
  var now = new Date();
  var visibleHours = config.visibleHours;
  var tickSize = config.tickSize;
  var offset = config.offset;
  var start = width * now.getMinutes() / 60 / 2 * -1;
  var end = (width + offset) * visibleHours;

  var rulerHalfhour = getRuler(start, end, 4 * visibleHours);
  var rulerMinute = getRuler(start, end, 24 * visibleHours);
  var rulerHour = getRuler(start, end, 2 * visibleHours);
  var y = height * phi;

  rulerMinute.forEach(function(x, i) {
    if (i % 6 === 0) return;

    drawTick(ctx, x, y, tickSize / -2);
  });

  rulerHalfhour.forEach(function(x, i) {
    if (i % 4 === 0) return;
    if (i % 2 === 0) return;

    drawTick(ctx, x, y, tickSize * -1);
  });

  rulerHour.forEach(function(x) {
    drawTick(ctx, x, y - 30, tickSize * -4.5);
  });

  rulerHour.forEach(function(x, i) {
    drawHoursText(ctx, x, i);
  });
}

function drawHand(ctx, width, height) {
  var cx = width * 0.5;
  var y = height * 0.78;
  var length = height * phi + config.tickSize * 1.5;
  var color = 'white';

  // Configure how we want to draw the hand
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;

  // Begin drawing.
  ctx.beginPath();

  // Move to the center point, then draw the line.
  ctx.moveTo(cx, y);
  ctx.lineTo(cx, length);
  ctx.stroke();
}

function drawMinutesText(ctx, width, height) {
  var text = getMinutes();

  ctx.fillStyle = 'white';
  ctx.font = '21px Roboto';
  ctx.textAlign = 'center';

  // Minutes text content.
  ctx.fillText(text, width / 2, height * 0.82);
}

function buid(rocky) {
  rocky.on('draw', function(event) {
    var ctx = event.context;

    // Determine the width and height of the display.
    var width = ctx.canvas.unobstructedWidth;
    var height = ctx.canvas.unobstructedHeight;

    // Clear the screen
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    drawHoursTicks(ctx, width, height);
    drawHand(ctx, width, height);
    drawMinutesText(ctx, width, height);
  });

  rocky.on('minutechange', function() {
    // Request the screen to be redrawn on next pass.
    rocky.requestDraw();
  });
}

module.exports = buid;
