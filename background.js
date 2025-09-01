const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let w, h;
let particles = [];
const count = 100;
const maxDist = 120;

const mouse = { x: null, y: null };

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
document.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // bounce off edges
    if (this.x <= 0 || this.x >= w) this.vx *= -1;
    if (this.y <= 0 || this.y >= h) this.vy *= -1;

    // repel from mouse
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const angle = Math.atan2(dy, dx);
        const repelStrength = (100 - dist) * 0.05;
        this.vx += Math.cos(angle) * repelStrength;
        this.vy += Math.sin(angle) * repelStrength;
      }
    }

    // velocity damping
    this.vx *= 0.95;
    this.vy *= 0.95;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#aaa';
    ctx.fill();
  }
}

for (let i = 0; i < count; i++) {
  particles.push(new Particle());
}

function connect(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dist = dx * dx + dy * dy;
  if (dist < maxDist * maxDist) {
    const alpha = 1 - dist / (maxDist * maxDist);
    ctx.strokeStyle = `rgba(170,170,170,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h);

  for (const p of particles) {
    p.update();
    p.draw();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      connect(particles[i], particles[j]);
    }
  }

  requestAnimationFrame(animate);
}
animate();
