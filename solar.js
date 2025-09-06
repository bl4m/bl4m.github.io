const solarCanvas = document.getElementById('solarCanvas');
const solarCtx = solarCanvas.getContext('2d');
// draw orbits, etc...


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
sunImg.src = '/static/images/sun.png';
earthImg.src = '/static/images/earth.jpg';
moonImg.src = '/static/images/moon.jpg';
sunImg.onerror = () => console.error("Failed to load sun.png");
earthImg.onerror = () => console.error("Failed to load earth.jpg");
moonImg.onerror = () => console.error("Failed to load moon.jpg");

let angleEarth = 0;
let angleMoon = 0;
const earthOrbitRadius = 150;
const moonOrbitRadius = 40;
const speedEarth = 0.01;  // radians per frame
const speedMoon = 0.05;

function drawOrbit(x, y, r) {
  solarCtx.beginPath();
  solarCtx.strokeStyle = 'rgba(0,0,0,0.2)';
  solarCtx.lineWidth = 1;
  solarCtx.arc(x, y, r, 0, 2 * Math.PI);
  solarCtx.stroke();
}

function draw() {
  solarCtx.clearRect(0, 0, width, height);

  // Draw orbits
  drawOrbit(centerX, centerY, earthOrbitRadius);

  // Sun at center
  const sunSize = 60;
  solarCtx.drawImage(sunImg, centerX - sunSize/2, centerY - sunSize/2, sunSize, sunSize);

  // Earth
  const earthX = centerX + Math.cos(angleEarth) * earthOrbitRadius;
  const earthY = centerY + Math.sin(angleEarth) * earthOrbitRadius;
  const earthSize = 30;
  solarCtx.drawImage(earthImg, earthX - earthSize/2, earthY - earthSize/2, earthSize, earthSize);

  // Earth's orbit path for Moon
  drawOrbit(earthX, earthY, moonOrbitRadius);

  // Moon
  const moonX = earthX + Math.cos(angleMoon) * moonOrbitRadius;
  const moonY = earthY + Math.sin(angleMoon) * moonOrbitRadius;
  const moonSize = 15;
  solarCtx.drawImage(moonImg, moonX - moonSize/2, moonY - moonSize/2, moonSize, moonSize);

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
