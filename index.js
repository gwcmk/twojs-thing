var two, group;
var currentCommand = '';
var lastCommand = '';
var commands = {
  'CIRCLE': makeCircle,
  'RECTANGLE': makeRectangle,
  'SQUARE': makeSquare,
  'ROTATE': rotate,
  'SQUISH': squish,
  'CLEAR': clear,
};
var animationState = {
  'ROTATE': {
    inProgress: false,
    startFrame: 0,
    duration: 60,
    angle: 0
  }
};
Two.Resolution = 32;

const COLORS = [
  '#33D7E0',
  '#8DC400',
  '#BDC400',
  '#FDD532',
  '#FCA132',
  '#F69434',
  '#33ABE0',
  '#E92530',
  '#E8255F',
  '#33D7E0',
  '#F46333',
  '#C516CE',
  '#DB237F',
  '#DB237F',
  '#DB237F',
];

let squished = false;

document.addEventListener("DOMContentLoaded", function(event) {
  let elem = document.getElementById('container');
  two = new Two({ fullscreen: true }).appendTo(elem);

  two.bind('update', frameCount => {
    if (currentCommand in commands) {
      commands[currentCommand](frameCount);
      const listItem = document.createElement('li');
      listItem.innerHTML = currentCommand;

      currentCommand = '';
      document.getElementById('command').innerHTML = currentCommand;

      const history = document.getElementById('command-history');
      history.insertBefore(listItem, history.firstChild);
    }

    // continue each animation in progress
    for (command in animationState) {
      if (animationState[command].inProgress) {
        commands[command](frameCount);
      }
    }
  }).play();
});

document.onkeydown = processInput;

function processInput(event) {
  event = event || window.event;
  const key = event.keyCode;

  // Handle alphabetic keypresses
  if (key >= 65 && key <= 90) {
    // TODO: make sure that this is a letter, not a symbol
    let currentCharacter = String.fromCharCode(event.which);
    currentCommand += currentCharacter;
  } else if (key === 8) {
    // Backspace
    currentCommand = currentCommand.slice(0, -1);
  } else {
    // Ignore all others
    event.stopPropagation();
    return false;
  }

  document.getElementById('command').innerHTML = currentCommand;
}

function makeCircle(currentFrame) {
  const radius = Math.floor(Math.random() * (two.height / 2 - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * radius)) + radius;
  const y = Math.floor(Math.random() * (two.height - 2 * radius)) + radius;
  let circle = two.makeCircle(x, y, radius);
  // circle.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
  circle.fill = COLORS[Math.round(COLORS.length * Math.random())];

  const vertices = circle.vertices;

  for (let i = 0; i < vertices.length; i += 1) {
    const v = vertices[i];
    const percent = (i + 1) / vertices.length;
    const theta = percent * Math.PI * 2;
    const radius = Math.random() * two.height / 3 + two.height / 6;

    const vNext = [
      two.height / 3 * Math.cos(theta),
      two.height / 3 * Math.sin(theta),
    ];
    v.set(...vNext);

    const dest = [
      radius * Math.cos(theta),
      radius * Math.sin(theta),
    ];
    v.destination = new Two.Vector(...dest);

    v.step = Math.sqrt(Math.random()) + 2;
  }

  two.scene.noStroke();
}

function clear () {
  two.clear();
  document.getElementById('command-history').innerHTML = '';
}

function makeRectangle(currentFrame) {
  const width = Math.floor(Math.random() * (two.width - 10)) + 10;
  const height = Math.floor(Math.random() * (two.height - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * width)) + width;
  const y = Math.floor(Math.random() * (two.height - 2 * height)) + height;
  let rect = two.makeRectangle(x, y, width, height);
  // rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
  rect.fill = COLORS[Math.round(COLORS.length * Math.random())];


  two.scene.noStroke();
}

function makeSquare(currentFrame) {
  const max = Math.floor(Math.random() * (two.height - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * max)) + max;
  const y = Math.floor(Math.random() * (two.height - 2 * max)) + max;
  let rect = two.makeRectangle(x, y, max, max);
  // rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
  rect.fill = COLORS[Math.round(COLORS.length * Math.random())];

  two.scene.noStroke();
}

function rotate(currentFrame) {
  let state = animationState['ROTATE'];
  if (!state.inProgress) {
    // first call
    state.inProgress = true;
    state.startFrame = currentFrame;
    state.angle = 0;
  }
  state.angle += (1 / state.duration) * Math.PI;
  two.scene.children.forEach(c => {
    c.rotation += (1 / state.duration) * Math.PI;
    let percentage = ((currentFrame - state.startFrame) / state.duration);
    c.scale = Math.pow(percentage, 2) * (percentage - 2) + 1;
  });

  if (state.angle >= 2 * Math.PI) {
    state.inProgress = false;
    two.scene.children.forEach(c => {
      c.rotation = 0;
      c.scale = 1;
    });
  }
}

function squish () {
  for (const child of two.scene.children) {
    const vertices = child.vertices;

    if (vertices.length > 4) {
      for (const v of vertices) {
        const dest = v.destination;

        if (v.equals(dest)) {
          squished = true;
          break;
        }

        v.x += (dest.x - v.x) * 0.5;
        v.y += (dest.y - v.y) * 0.5;
      }
    }
  }
}
