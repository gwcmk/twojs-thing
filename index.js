var two, group;
var currentCommand = '';
var commands = {
  'CIRCLE': makeCircle,
  'RECTANGLE': makeRectangle
}

document.addEventListener("DOMContentLoaded", function(event) {
  var elem = document.getElementById('container');
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
  let radius = Math.floor(Math.random() * (100 - 50)) + 50;
  let x = Math.floor(Math.random() * (two.width - radius)) + radius;
  let y = Math.floor(Math.random() * (two.height - radius)) + radius;
  let circle = two.makeCircle(x, y, radius);
  circle.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
}

function makeRectangle() {
  let width = Math.floor(Math.random() * (two.width - 10)) + 10;
  let height = Math.floor(Math.random() * (two.height - 10)) + 10;
  let x = Math.floor(Math.random() * (two.width - width)) + width;
  let y = Math.floor(Math.random() * (two.height - height)) + height;
  let rect = two.makeRectangle(x, y, width, height);
  rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
}