const solarCanvas = document.getElementById('solarCanvas');
const solarCtx = solarCanvas.getContext('2d');

let width, height;
let centerX, centerY;

// ==========================
// Background Dust
// ==========================
const dustCount = 100; // number of streaks
const dustParticles = [];
const systemOffsetY = -80; // negative = move up

function initDust() {
  dustParticles.length = 0;
  for (let i = 0; i < dustCount; i++) {
    const speedX = (Math.random() - 0.5) * 2;
    const speedY = (Math.random() - 0.5) * 2;
    dustParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 5 + 2, // length of the streak
      speedX,
      speedY,
      color: `rgba(150,150,150,${Math.random() * 0.5 + 0.3})` // light gray
    });
  }
}

function drawDust() {
  dustParticles.forEach(p => {
    solarCtx.beginPath();
    solarCtx.strokeStyle = p.color;
    solarCtx.lineWidth = 1;
    // draw line along the velocity direction
    solarCtx.moveTo(p.x, p.y);
    solarCtx.lineTo(p.x - p.speedX * p.length, p.y - p.speedY * p.length);
    solarCtx.stroke();

    // move particle
    p.x += p.speedX;
    p.y += p.speedY;

    // wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  });
}





// ==========================
// Canvas Resize
// ==========================
function resizeSolarCanvas() {
  width = solarCanvas.width = solarCanvas.offsetWidth;
  height = solarCanvas.height = solarCanvas.offsetHeight;
  centerX = width / 2;
  centerY = height / 2;

  initDust(); // initialize dust after canvas size is correct
}
window.addEventListener('resize', resizeSolarCanvas);
resizeSolarCanvas();

// ==========================
// Realistic Scaling Factor
// ==========================
const factor = 200;

// ==========================
// Orbital and Rotation Data
// ==========================
const earthOrbitalPeriod = 365.25;
const earthRotationPeriod = 1;
const moonOrbitalPeriod = 0.5;
const moonRotationPeriod = 27.3;
const sunRotationPeriod = 200;

const earthOrbitStep = (2 * Math.PI) / (earthOrbitalPeriod * factor);
const earthRotationStep = (2 * Math.PI) / (earthRotationPeriod * factor);
const moonOrbitStep = (2 * Math.PI) / (moonOrbitalPeriod * factor);
const moonRotationStep = (2 * Math.PI) / (moonRotationPeriod * factor);
const sunRotationStep = (2 * Math.PI) / (sunRotationPeriod * factor);

const earthOrbit = { rx: 300, ry: 200 };
const moonOrbitRadius = 80;

let angleEarthOrbit = 0;
let angleEarthRotation = 0;
let angleMoonOrbit = 0;
let angleSunRotation = 0;

// ==========================
// Image Assets
// ==========================
const sunImg = new Image();
const earthImg = new Image();
const moonImg = new Image();
const cloudsImg = new Image();
const bgImg = new Image();

sunImg.src = 'static/images/sun.png';
earthImg.src = 'static/images/earth.png';
moonImg.src = 'static/images/moon.png';
cloudsImg.src = 'static/images/clouds2.png';
bgImg.src = 'static/images/bg.png'; 
//solarCtx.imageSmoothingEnabled = false;

[sunImg, earthImg, moonImg, cloudsImg,bgImg].forEach(img => img.onerror = () => console.error(`Failed to load ${img.src}`));

// ==========================
// Drawing Helpers
// ==========================
function drawOrbitEllipse(x, y, rx, ry) {
  solarCtx.beginPath();
  solarCtx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
  solarCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  solarCtx.stroke();
}

function drawOrbitCircle(x, y, r) {
  solarCtx.beginPath();
  solarCtx.arc(x, y, r, 0, 2 * Math.PI);
  solarCtx.strokeStyle = 'rgba(255, 255, 255, 0.41)';
  solarCtx.stroke();
}

function drawRotatedImage(img, x, y, size, angle, fallbackColor) {
  if (img.complete && img.naturalWidth !== 0) {
    solarCtx.save();
    solarCtx.translate(x, y);
    solarCtx.rotate(angle);
    solarCtx.drawImage(img, -size/2, -size/2, size, size);
    solarCtx.restore();
  } else {
    solarCtx.beginPath();
    solarCtx.arc(x, y, size/2, 0, 2*Math.PI);
    solarCtx.fillStyle = fallbackColor;
    solarCtx.fill();
  }
}

// ==========================
// Draw System
// ==========================
function drawSolarSystem() {
  
  solarCtx.clearRect(0, 0, width, height);
  // Draw background image scaled
  if (bgImg.complete && bgImg.naturalWidth !== 0) {
    const scale = 0.5; // 50% of natural size — adjust this
    const bgWidth = bgImg.naturalWidth * scale;
    const bgHeight = bgImg.naturalHeight * scale;

    // Tile the scaled image across the canvas
    for (let x = 0; x < width; x += bgWidth) {
      for (let y = 0; y < height; y += bgHeight) {
        solarCtx.drawImage(bgImg, x, y, bgWidth, bgHeight);
      }
    }
  } else {
    // Fallback background
    solarCtx.fillStyle = 'black';
    solarCtx.fillRect(0, 0, width, height);
  }

  drawDust();

  // Move everything up by systemOffsetY
  const systemCenterY = centerY + systemOffsetY;

  drawOrbitEllipse(centerX, systemCenterY, earthOrbit.rx, earthOrbit.ry);

  drawRotatedImage(sunImg, centerX, systemCenterY, 200, angleSunRotation, 'orange');

  const earthX = centerX + Math.cos(angleEarthOrbit) * earthOrbit.rx;
  const earthY = systemCenterY + Math.sin(angleEarthOrbit) * earthOrbit.ry;
  drawRotatedImage(earthImg, earthX, earthY, 80, angleEarthRotation, 'blue');

  drawOrbitCircle(earthX, earthY, moonOrbitRadius);

  const moonX = earthX + Math.cos(angleMoonOrbit) * moonOrbitRadius;
  const moonY = earthY + Math.sin(angleMoonOrbit) * moonOrbitRadius;
  drawRotatedImage(moonImg, moonX, moonY,100, angleMoonOrbit, 'gray');

  angleEarthOrbit += earthOrbitStep;
  angleEarthRotation += earthRotationStep;
  angleMoonOrbit += moonOrbitStep;
  angleSunRotation += sunRotationStep;

  if (cloudsImg.complete && cloudsImg.naturalWidth !== 0) {
  const cloudsHeight = 200; // fixed height
  const scale = cloudsHeight / cloudsImg.naturalHeight; // scale factor
  const cloudsWidth = cloudsImg.naturalWidth * scale; // preserve aspect ratio
  const overlap = cloudsWidth * 0.3; // 30% overlap

  for (let x = 0; x < width; x += cloudsWidth - overlap) {
    solarCtx.drawImage(cloudsImg, x-50, height - cloudsHeight, cloudsWidth, cloudsHeight+10);
  }
}

  requestAnimationFrame(drawSolarSystem);
}
// ==========================
// Start After Image Load
// ==========================
let loaded = 0;
[sunImg, earthImg, moonImg].forEach(img => {
  img.onload = () => {
    loaded++;
    if (loaded === 3) drawSolarSystem();
  };
});

// Fallback
setTimeout(() => {
  if (loaded < 3) drawSolarSystem();
}, 3000);
