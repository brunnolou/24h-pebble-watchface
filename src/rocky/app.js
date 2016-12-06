var utils = require('../utils/index.js');
var getMinutes = utils.getMinutes;
var getHours = utils.getHours;
var phi = 0.61803;

// Settings.
var config = {
  fontSize: 49,
  minutes: (new Date()).getMinutes(),
  scale: 2,
  scaleActive: false,
  minuteScale: 2,
  start: 0,
  tickSize: 10,
  visibleHoursCount: 2
};

// var dat = require('dat-gui');
// var gui = new dat.GUI();
// var controllers = [];
// controllers.push(gui.add(config, 'minutes', 0, 60).step(1));
// controllers.push(gui.add(config, 'scale', 0.5, 4));
// controllers.push(gui.add(config, 'minuteScale', 0.5, 4).step(0.5));
// controllers.push(gui.add(config, 'scaleActive'));

function getRuler(start, end, divs) {
  var array = [];
  var i;

  for (i = start; i <= end; i += end / divs) {
    array.push(Math.round(i));
  }

  return array;
}

function drawTick(ctx, cx, cy, length, color) {
  // Find the end points.
  var x2 = cx;
  var y2 = cy + length;

  ctx.lineCap = 'square';
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;

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
  var fullWidth = width * config.scale;
  var visibleHoursCount = config.visibleHoursCount;
  var tickSize = config.tickSize;
  var minutesInTheMiddle = (new Date()).getMinutes() / 60 / (config.minuteScale) * -1;
  var start = fullWidth * minutesInTheMiddle - fullWidth / (config.scale * 2);
  var end = fullWidth * visibleHoursCount * (config.scaleActive ? config.scale : 1);

  var rulerMinute = getRuler(start, end, 24 * visibleHoursCount);
  var rulerHour = getRuler(start, end, 2 * visibleHoursCount);

  var y = height * phi;

  rulerMinute.forEach(function(x, i) {
    var size = tickSize;
    var vPos = y;
    var color = 'white';

    // Minutes.
    if (i % 1 === 0) {
      size = tickSize * -1;
      vPos = y;
      color = '#aaa';
    }

    // Quarter.
    if (i % 3 === 0) {
      size = tickSize * -1;
      vPos = y;
      color = 'white';
    }

    if (i % 6 === 0) {
      size = tickSize * -2;
      vPos = y;
      color = 'white';
    }

    if (i % 12 === 0) {
      size = tickSize * -5;
      vPos = y * 1.14;
      color = 'white';
    }

    drawTick(ctx, x, vPos, size, color);
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

  // controllers.forEach((controller) => {
  //   controller.onChange(function() {
  //     rocky.requestDraw();
  //   });
  // })
}

module.exports = buid;
