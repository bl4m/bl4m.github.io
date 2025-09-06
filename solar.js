const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let centerX, centerY;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = document.querySelector('section').offsetHeight;
  centerX = width / 2;
  centerY = height / 2;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load images
const sunImg = new Image();
const earthImg = new Image();
const moonImg = new Image();
sunImg.src = 'static/images/sun.png';
earthImg.src = 'static/images/earth.png';
moonImg.src = 'static/images/moon.jpg';

let angleEarth = 0;
let angleMoon = 0;
const earthOrbitRadius = 150;
const moonOrbitRadius = 40;
const speedEarth = 0.01;  // radians per frame
const speedMoon = 0.05;

function drawOrbit(x, y, r) {
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  // Draw orbits
  drawOrbit(centerX, centerY, earthOrbitRadius);

  // Sun at center
  const sunSize = 60;
  ctx.drawImage(sunImg, centerX - sunSize/2, centerY - sunSize/2, sunSize, sunSize);

  // Earth
  const earthX = centerX + Math.cos(angleEarth) * earthOrbitRadius;
  const earthY = centerY + Math.sin(angleEarth) * earthOrbitRadius;
  const earthSize = 30;
  ctx.drawImage(earthImg, earthX - earthSize/2, earthY - earthSize/2, earthSize, earthSize);

  // Earth's orbit path for Moon
  drawOrbit(earthX, earthY, moonOrbitRadius);

  // Moon
  const moonX = earthX + Math.cos(angleMoon) * moonOrbitRadius;
  const moonY = earthY + Math.sin(angleMoon) * moonOrbitRadius;
  const moonSize = 15;
  ctx.drawImage(moonImg, moonX - moonSize/2, moonY - moonSize/2, moonSize, moonSize);

  // Update angles
  angleEarth += speedEarth;
  angleMoon += speedMoon;

  requestAnimationFrame(draw);
}

// Wait for all images
let imagesLoaded = 0;
[sunImg, earthImg, moonImg].forEach(img => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) draw();
  };
});
