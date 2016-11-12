var two, group;
var currentCommand = '';
var commands = {
  'CIRCLE': makeCircle,
  'RECTANGLE': makeRectangle,
  'SQUARE': makeSquare,
  'ROTATE': rotate,
  'SQUISH': squish,
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

let squished = false;

document.addEventListener("DOMContentLoaded", function(event) {
  let elem = document.getElementById('container');
  two = new Two({ fullscreen: true }).appendTo(elem);

  reset();

  two.bind('update', frameCount => {
    if (currentCommand in commands) {
      commands[currentCommand](frameCount);
      currentCommand = '';
      document.getElementById('command').innerHTML = currentCommand;
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

function makeCircle(currentFrame) {
  const radius = Math.floor(Math.random() * (two.height / 2 - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * radius)) + radius;
  const y = Math.floor(Math.random() * (two.height - 2 * radius)) + radius;
  let circle = two.makeCircle(x, y, radius);
  circle.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
}

function makeRectangle(currentFrame) {
  const width = Math.floor(Math.random() * (two.width - 10)) + 10;
  const height = Math.floor(Math.random() * (two.height - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * width)) + width;
  const y = Math.floor(Math.random() * (two.height - 2 * height)) + height;
  let rect = two.makeRectangle(x, y, width, height);
  rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
}

function makeSquare(currentFrame) {
  const max = Math.floor(Math.random() * (two.height - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * max)) + max;
  const y = Math.floor(Math.random() * (two.height - 2 * max)) + max;
  let rect = two.makeRectangle(x, y, max, max);
  rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;
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

function reset () {
  for (const child of two.scene.children) {
    // Shift the blob slightly
    // const translation = [
    //   two.width / 2,
    //   two.height / 2
    // ];
    // child.translation.set(...translation);

    // "Unsquish"
    squished = false;

    const vertices = child.vertices;

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
  }
}

function squish () {
  // Squish if it isn't already
  if (!squished) {
    for (const child of two.scene.children) {
      const vertices = child.vertices;
      for (const v of vertices) {
        const dest = v.destination;

        if (v.equals(dest)) {
          squished = true;
          break;
        }

        v.x += (dest.x - v.x) * 0.125;
        v.y += (dest.y - v.y) * 0.125;
      }
    }

    return;
  }

  // Push it off the screen
//   let outside = true;

//   for (const v of vertices) {
//     v.y += v.step;
//     v.step *= 1.125;

//     if (v.y < two.height) {
//       outside = false;
//     }
//   }

//   if (outside) {
//     reset();
//   }
}
