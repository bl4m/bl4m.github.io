const solarCanvas = document.getElementById('solarCanvas');
const solarCtx = solarCanvas.getContext('2d');

let width, height;
let centerX, centerY;

function resizeSolarCanvas() {
  width = solarCanvas.width = solarCanvas.offsetWidth;
  height = solarCanvas.height = solarCanvas.offsetHeight;
  centerX = width / 2;
  centerY = height / 2;
}
window.addEventListener('resize', resizeSolarCanvas);
resizeSolarCanvas();

// Orbital values
let angleEarth = 0;
let angleMoon = 0;
const earthOrbitRadius = 150;
const moonOrbitRadius = 40;
const speedEarth = 0.01;
const speedMoon = 0.05;

function drawDot(x, y, radius, color) {
  solarCtx.beginPath();
  solarCtx.arc(x, y, radius, 0, 2 * Math.PI);
  solarCtx.fillStyle = color;
  solarCtx.fill();
}

function drawOrbit(x, y, r) {
  solarCtx.beginPath();
  solarCtx.arc(x, y, r, 0, 2 * Math.PI);
  solarCtx.strokeStyle = 'rgba(0,0,0,0.2)';
  solarCtx.stroke();
}

function drawSolarSystem() {
  solarCtx.clearRect(0, 0, width, height);

  // Orbits
  drawOrbit(centerX, centerY, earthOrbitRadius);

  // Sun (center)
  drawDot(centerX, centerY, 10, 'orange');

  // Earth
  const earthX = centerX + Math.cos(angleEarth) * earthOrbitRadius;
  const earthY = centerY + Math.sin(angleEarth) * earthOrbitRadius;
  drawDot(earthX, earthY, 6, 'blue');

  // Moon orbit
  drawOrbit(earthX, earthY, moonOrbitRadius);

  // Moon
  const moonX = earthX + Math.cos(angleMoon) * moonOrbitRadius;
  const moonY = earthY + Math.sin(angleMoon) * moonOrbitRadius;
  drawDot(moonX, moonY, 3, 'gray');

  angleEarth += speedEarth;
  angleMoon += speedMoon;

  requestAnimationFrame(drawSolarSystem);
}

drawSolarSystem();
