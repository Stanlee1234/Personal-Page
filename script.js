const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');
const indicator = document.querySelector('.tab-indicator');

function moveIndicator(btn) {
  indicator.style.width = btn.offsetWidth + 'px';
  indicator.style.left = btn.offsetLeft + 'px';
}

function switchTab(btn) {
  const target = btn.dataset.tab;
  tabBtns.forEach((b) => {
    b.classList.toggle('active', b === btn);
    b.setAttribute('aria-selected', b === btn);
  });
  panels.forEach((p) => {
    const isTarget = p.id === 'panel-' + target;
    p.classList.toggle('active', isTarget);
  });
  moveIndicator(btn);
}

tabBtns.forEach((btn) => btn.addEventListener('click', () => switchTab(btn)));

window.addEventListener('load', () => moveIndicator(document.querySelector('.tab-btn.active')));
window.addEventListener('resize', () => moveIndicator(document.querySelector('.tab-btn.active')));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      } else {
        e.target.classList.remove('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.card, .project-card').forEach((el) => {
  el.classList.add('fade-up');
  observer.observe(el);
});

document.querySelectorAll('.gallery-img').forEach((img) => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
});

const body = document.body;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!prefersReducedMotion && !isTouchDevice) {
  body.classList.add('custom-cursor-enabled');
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let ringX = targetX;
  let ringY = targetY;
  let dotX = targetX;
  let dotY = targetY;
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorDot = document.querySelector('.cursor-dot');
  let rafId = null;
  let lastMoveTime = performance.now();

  function animateGlow() {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    body.style.setProperty('--mx', `${currentX}px`);
    body.style.setProperty('--my', `${currentY}px`);

    ringX += (targetX - ringX) * 0.16;
    ringY += (targetY - ringY) * 0.16;
    dotX += (targetX - dotX) * 0.35;
    dotY += (targetY - dotY) * 0.35;

    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    const dotScale = body.classList.contains('cursor-down') ? 0.93 : 1;
    cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;

    const recentlyMoved = performance.now() - lastMoveTime < 70;
    const settled =
      Math.abs(targetX - ringX) < 0.15 &&
      Math.abs(targetY - ringY) < 0.15 &&
      Math.abs(targetX - dotX) < 0.15 &&
      Math.abs(targetY - dotY) < 0.15;

    if (recentlyMoved || !settled) {
      rafId = requestAnimationFrame(animateGlow);
    } else {
      rafId = null;
    }
  }

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    lastMoveTime = performance.now();
    if (!rafId) rafId = requestAnimationFrame(animateGlow);
  });

  window.addEventListener('pointerover', (e) => {
    const isInteractive = e.target.closest('a, button, .btn, .tab-btn');
    body.classList.toggle('cursor-hover', Boolean(isInteractive));
  });

  window.addEventListener('pointerdown', () => body.classList.add('cursor-down'));
  window.addEventListener('pointerup', () => body.classList.remove('cursor-down'));
  window.addEventListener('blur', () => body.classList.remove('cursor-down'));
}
