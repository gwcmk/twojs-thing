var two, group;
var currentCommand = '';
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
    duration: 300,
    angle: 0
  }
};
Two.Resolution = 32;

let squished = false;

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
}

function makeRectangle() {
  const width = Math.floor(Math.random() * (two.width - 10)) + 10;
  const height = Math.floor(Math.random() * (two.height - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * width)) + width;
  const y = Math.floor(Math.random() * (two.height - 2 * height)) + height;
  let rect = two.makeRectangle(x, y, width, height);
  rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;

  two.scene.noStroke();
}

function makeSquare() {
  const max = Math.floor(Math.random() * (two.height - 10)) + 10;
  const x = Math.floor(Math.random() * (two.width - 2 * max)) + max;
  const y = Math.floor(Math.random() * (two.height - 2 * max)) + max;
  let rect = two.makeRectangle(x, y, max, max);
  rect.fill = `#${(Math.random()*0xFFFFFF<<0).toString(16)}`;


  two.scene.noStroke();
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

// function reset () {
//   for (const child of two.scene.children) {
//     // Shift the blob slightly
//     // const translation = [
//     //   two.width / 2,
//     //   two.height / 2
//     // ];
//     // child.translation.set(...translation);

//     // "Unsquish"
//     squished = false;

//     const vertices = child.vertices;

//     for (let i = 0; i < vertices.length; i += 1) {
//       const v = vertices[i];
//       const percent = (i + 1) / vertices.length;
//       const theta = percent * Math.PI * 2;
//       const radius = Math.random() * two.height / 5 + two.height / 12;

//       const vNext = [
//         two.height / 3 * Math.cos(theta),
//         two.height / 3 * Math.sin(theta),
//       ];
//       v.set(...vNext);

//       const dest = [
//         radius * Math.cos(theta),
//         radius * Math.sin(theta),
//       ];
//       v.destination = new Two.Vector(...dest);

//       v.step = Math.sqrt(Math.random()) + 2;
//     }
//   }
// }

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
  // Squish if it isn't already
  // if (!squished) {
  //   for (const child of two.scene.children) {
  //     const vertices = child.vertices;
  //     for (const v of vertices) {
  //       const dest = v.destination;

  //       if (v.equals(dest)) {
  //         squished = true;
  //         break;
  //       }

  //       v.x += (dest.x - v.x) * 0.125;
  //       v.y += (dest.y - v.y) * 0.125;
  //     }
  //   }

  //   return;
  // }

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
