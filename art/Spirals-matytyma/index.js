/*******************
@title: Spirals
@author: matytyma
@snapshot: cover.png
*******************/

//---------------//
// CONFIGURATION //
//---------------//

// Seed for the random number generator
// Set to null for random seed
const SEED = null;

// Size of the drawing area
const SIZE = 50;

// Amount of curves to generate
const DENSITY = .5;

// Whether overlapping curves should be allowed
const ALLOW_OVERLAP = false;

// Eliminate true overlapping or close curves
// either 'equal' or 'close'; defaults to 'equal'
const ANTI_OVERLAP_TYPE = 'close';
const MIN_DISTANCE = .2;

//---------------//
//   ALGORITHM   //
//---------------//

setDocDimensions(SIZE, SIZE);

SEED && bt.setRandSeed(SEED);

const HALF = SIZE / 2;

function distance(x, y) {
  return Math.sqrt(x * x + y * y);
}

let points = [];

for (let x = -HALF; x < HALF; x++) {
  for (let y = -HALF; y < HALF; y++) {
    const dist = distance(x, y);
    if (dist > HALF) continue;
    if (bt.randInRange(0, dist) > DENSITY) continue;
    points.push([x, y]);
  }
}

points = points.sort((a, b) => { return distance(a[0], a[1]) - distance(b[0], b[1]) });

let lines = [];
let posX = 0;
let posY = 0;

for (let [x, y] of points) {
  let angle = Math.atan2(posY, posX);
  let toAngle = Math.atan2(y, x);

  const dist = distance(x, y);
  if (!ALLOW_OVERLAP) {
    if (ANTI_OVERLAP_TYPE == 'close') {
      if (dist - distance(posX, posY) < MIN_DISTANCE) continue;
    } else {
      if (dist == distance(posX, posY)) continue;
    }
  }
  
  const step = (toAngle - angle) / 100;
  for (let i = angle; angle < toAngle ? i < toAngle : i > toAngle; i += step) {
    const rotX = Math.cos(i) * dist;
    const rotY = Math.sin(i) * dist;

    lines.push([
      [posX, posY],
      [rotX, rotY]
    ]);
    posX = rotX;
    posY = rotY;
  }
}

drawLines(lines.map(l => { return l.map(p => { return [p[0] + HALF, p[1] + HALF] }) }));