function SyntheticRocky() {
  const context = document.getElementById('canvas').getContext('2d');

  context.canvas.unobstructedWidth = context.canvas.clientWidth;
  context.canvas.unobstructedHeight = context.canvas.clientHeight;
  context.lineCap = 'round';
  context.textBaseline = 'top';

  this.event = {
    context: context,
    date: new Date()
  }
}

SyntheticRocky.prototype.on = function(eventName, callback) {
  switch (eventName) {
    case 'minutechange':
    case 'secondchange':
      callback(this.event);

      setInterval(() => {
        callback(this.event);
      }, 1e3);
      break;

    case 'draw':
      this.draw = callback;
      break;
  }
}

SyntheticRocky.prototype.draw = function () {};
SyntheticRocky.prototype.postMessage = console.log;
SyntheticRocky.prototype.requestDraw = function() {
  this.draw(this.event);
}

const rocky = new SyntheticRocky();

// Require the code.
var app = require('../src/rocky/app.js');

// Init the app.
app(rocky);
