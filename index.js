var two, group;
var currentCommand = '';
var commands = {
  'CIRCLE': makeCircle,
  'RECTANGLE': makeRectangle,
  'SQUARE': makeSquare,
  'ROTATE': rotate
}
var animationState = {
  'ROTATE': {
    inProgress: false,
    startFrame: 0,
    duration: 300,
    angle: 0
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  let elem = document.getElementById('container');
  two = new Two({ fullscreen: true }).appendTo(elem);

  two.bind('update', frameCount => {
    if (currentCommand in commands) {
      commands[currentCommand]();
      currentCommand = '';
      document.getElementById('command').innerHTML = currentCommand;
    }
  }).play();
});

document.onkeydown = processInput;

function processInput(event) {
  event = event || window.event;
  if (event.keyCode === 8) {
    // backspace
    currentCommand = currentCommand.slice(0, -1);
  } else {
    // TODO: make sure that this is a letter, not a symbol
    let currentCharacter = String.fromCharCode(event.which);
    currentCommand += currentCharacter;
  }
  document.getElementById('command').innerHTML = currentCommand;
}

function makeCircle() {
  const radius = Math.floor(Math.random() * (two.height / 2 - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * radius)) + radius;
  const y = Math.floor(Math.random() * (two.height - 2 * radius)) + radius;
  let circle = two.makeCircle(x, y, radius);
  circle.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
}

function makeRectangle() {
  const width = Math.floor(Math.random() * (two.width - 10)) + 10;
  const height = Math.floor(Math.random() * (two.height - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * width)) + width;
  const y = Math.floor(Math.random() * (two.height - 2 * height)) + height;
  let rect = two.makeRectangle(x, y, width, height);
  rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
}

function makeSquare() {
  const max = Math.floor(Math.random() * (two.height - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * max)) + max;
  const y = Math.floor(Math.random() * (two.height - 2 * max)) + max;
  let rect = two.makeRectangle(x, y, max, max);
  rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
}

function rotate() {
  let state = animationState['ROTATE'];
  if (state.angle === 2 * Math.PI) {
    state.inProgress = false;
  }
  if (state.inProgress) {
    group.rotation += t * 4 * Math.PI;
  }
}