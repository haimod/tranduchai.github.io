/* ╔══════════════════════════════════════════╗
   ║  TRẦN ĐỨC HẢI — PORTFOLIO ENGINE        ║
   ║  GSAP · Canvas Particles · Interactive   ║
   ╚══════════════════════════════════════════╝ */

// ═══ BOOT SEQUENCE ═══
const bootMsgs = ['Initializing neural interface...', 'Loading WebGL shaders...', 'Compiling design tokens...', 'Mounting component tree...', 'Syncing particle network...', 'Building skill matrix...', 'Calibrating aurora mesh...', 'Establishing data links...', 'Rendering holographic UI...', 'System online. Welcome.'];
const bootBar = document.getElementById('bootBar'), bootText = document.getElementById('bootText'), boot = document.getElementById('boot');
let bi = 0;
function runBoot() {
    if (bi >= bootMsgs.length) { setTimeout(() => { boot.classList.add('done'); heroAnimate() }, 500); return }
    bootText.textContent = bootMsgs[bi]; bootBar.style.width = ((bi + 1) / bootMsgs.length * 100) + '%'; bi++;
    setTimeout(runBoot, 180 + Math.random() * 120);
}
runBoot();

// ═══ INTERACTIVE PARTICLES (Canvas) ═══
const cvs = document.getElementById('particles-canvas'), ctx = cvs.getContext('2d');
let pw, ph, mouse = { x: -999, y: -999 };
const particles = []; const PCOUNT = 100; const CONNECT_DIST = 120;

function pResize() { pw = cvs.width = innerWidth; ph = cvs.height = innerHeight }
pResize(); addEventListener('resize', pResize);
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY });

const pColors = ['rgba(0,232,255,', 'rgba(168,85,247,', 'rgba(34,217,142,', 'rgba(244,63,142,'];
class P {
    constructor() { this.reset() }
    reset() {
        this.x = Math.random() * pw; this.y = Math.random() * ph;
        this.vx = (Math.random() - .5) * .4; this.vy = (Math.random() - .5) * .4;
        this.r = Math.random() * 2 + .5; this.base = pColors[Math.floor(Math.random() * pColors.length)];
        this.a = Math.random() * .4 + .1;
    }
    update() {
        // Mouse repulsion
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { const f = (150 - dist) / 150 * .5; this.vx += dx / dist * f; this.vy += dy / dist * f }
        this.vx *= .99; this.vy *= .99;
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > pw) this.vx *= -1;
        if (this.y < 0 || this.y > ph) this.vy *= -1;
    }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = this.base + this.a + ')'; ctx.fill() }
}
for (let i = 0; i < PCOUNT; i++)particles.push(new P());

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < CONNECT_DIST) {
                const a = .12 * (1 - d / CONNECT_DIST);
                ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = particles[i].base + a + ')'; ctx.lineWidth = .5; ctx.stroke();
            }
        }
        // Connect to mouse
        const mdx = particles[i].x - mouse.x, mdy = particles[i].y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 200) {
            const a = .2 * (1 - md / 200);
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(0,232,255,' + a + ')'; ctx.lineWidth = .8; ctx.stroke();
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, pw, ph);
    particles.forEach(p => { p.update(); p.draw() });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ═══ MARQUEE DUPLICATION ═══
const marquee = document.getElementById('marquee');
marquee.innerHTML += marquee.innerHTML; // Double the content for seamless loop

// ═══ GSAP HERO ANIMATION ═══
gsap.registerPlugin(ScrollTrigger);
function heroAnimate() {
    const els = document.querySelectorAll('.hero__content > *');
    gsap.to(els, { opacity: 1, y: 0, duration: .8, stagger: .12, ease: 'power3.out' });
}

// GSAP section divider animation
gsap.utils.toArray('.section__line').forEach(line => {
    gsap.from(line, { scrollTrigger: { trigger: line, start: 'top 85%' }, width: 0, duration: 1.2, ease: 'power2.out' });
});

// GSAP parallax on hero rings
gsap.to('.hero__rings', { scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }, y: 200, opacity: 0, ease: 'none' });

// ═══ TYPING EFFECT ═══
const phrases = ['IT Engineer → Data Analyst', 'SQL · Python · Pipeline Engineering', 'Turning Raw Data into Business Insights', '{ code: true, data: true, impact: true }', 'System-Level Thinker · Data-Driven'];
let pi = 0, ci = 0, del = false;
const typed = document.getElementById('typed');
function typeLoop() {
    const c = phrases[pi];
    if (!del) { typed.textContent = c.slice(0, ++ci); if (ci === c.length) { del = true; return setTimeout(typeLoop, 2500) } return setTimeout(typeLoop, 45 + Math.random() * 25) }
    typed.textContent = c.slice(0, --ci); if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; return setTimeout(typeLoop, 400) }
    setTimeout(typeLoop, 20);
}
typeLoop();

// ═══ NAV ═══
const navbar = document.getElementById('navbar');
addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 60));
const navToggle = document.getElementById('navToggle'), navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Active link
const sects = document.querySelectorAll('section[id]'), linkMap = {};
navLinks.querySelectorAll('a').forEach(a => { linkMap[a.getAttribute('href').replace('#', '')] = a });
const navObs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting && linkMap[e.target.id]) { Object.values(linkMap).forEach(l => l.classList.remove('active')); linkMap[e.target.id].classList.add('active') } }) }, { rootMargin: '-40% 0px -55% 0px' });
sects.forEach(s => navObs.observe(s));

// ═══ SCROLL REVEAL ═══
const revealObs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); revealObs.unobserve(e.target) } }) }, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ═══ SKILL BARS ═══
const skillObs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; setTimeout(() => e.target.classList.add('active'), 1500); skillObs.unobserve(e.target) } }) }, { threshold: .3 });
document.querySelectorAll('.skill-item__fill').forEach(b => skillObs.observe(b));

// ═══ COUNTER ═══
const cObs = new IntersectionObserver(es => {
    es.forEach(e => {
        if (!e.isIntersecting) return; const el = e.target, t = +el.dataset.count, s = el.dataset.suffix || '', st = performance.now();
        function step(n) { const p = Math.min((n - st) / 2000, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + s; if (p < 1) requestAnimationFrame(step) }
        requestAnimationFrame(step); cObs.unobserve(el)
    })
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(c => cObs.observe(c));

// ═══ MOUSE GLOW ═══
const glow = document.getElementById('mouseGlow');
let gx = -500, gy = -500;
document.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY });
function updateGlow() { glow.style.left = gx + 'px'; glow.style.top = gy + 'px'; requestAnimationFrame(updateGlow) }
updateGlow();

// ═══ 3D CARD TILT ═══
document.querySelectorAll('.bento__card,.proj,.stat-card,.skill-panel').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px) scale(1.02)`;
        card.style.setProperty('--g-angle', Math.atan2(y, x) * (180 / Math.PI) + 180 + 'deg');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = '' });
});

// ═══ MAGNETIC BUTTONS ═══
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * .2}px,${y * .2}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = '' });
});

// ═══ YEAR ═══
document.getElementById('year').textContent = new Date().getFullYear();
