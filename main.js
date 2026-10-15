// Scroll-scrubbed video backgrounds (engine pattern from the scroll-world skill):
// blob-load each clip (always seekable, any server), seek-coalescing, play->pause priming,
// video revealed only once a real frame has painted. No scroll listeners: IntersectionObserver
// gates a rAF loop. The scrub is driven by the user's own scroll, so it also runs under
// prefers-reduced-motion (only the autonomous animations are disabled in CSS).
const clamp = (v) => Math.min(1, Math.max(0, v));

const scrubs = [...document.querySelectorAll('[data-scrub]')].map((el) => ({
  el, video: el.querySelector('video'), stage: el.querySelector('.scrub__stage'), bar: el.querySelector('.hero__bar i'),
  target: 0, current: 0, live: false, ready: false,
}));

// data-span="N": video plays over N viewport-heights of scroll (keeps speed when the section is shorter).
// data-fade="f": stage fades out from fraction f of the section's scroll to its end; playback continues.
const progress = (el) => {
  const r = el.getBoundingClientRect();
  const span = el.dataset.span ? el.dataset.span * innerHeight : r.height - innerHeight;
  return clamp(-r.top / span);
};
const sectionFraction = (el) => {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / (r.height - innerHeight));
};

const prime = (v) => { try { const p = v.play(); p && p.then(() => v.pause()).catch(() => {}); } catch {} };

scrubs.forEach(async (s) => {
  const v = s.video;
  v.muted = true; v.playsInline = true; v.preload = 'auto';
  v.addEventListener('loadeddata', () => { s.ready = true; prime(v); });
  try {                                                  // blob = seekable even without Range support
    const blob = await (await fetch(v.querySelector('source').src)).blob();
    v.src = URL.createObjectURL(blob);
  } catch { v.load(); }                                  // file:// : keep the plain <source>
});

let raf = 0;
function tick() {
  let busy = false;
  for (const s of scrubs) {
    if (!s.live) continue;
    busy = true;
    s.target = progress(s.el);
    s.current += (s.target - s.current) * 0.18;          // ease toward target; hides seek stutter
    if (Math.abs(s.target - s.current) < 0.0005) s.current = s.target;
    if (s.el.dataset.fade) {
      const f0 = +s.el.dataset.fade;
      s.stage.style.opacity = 1 - clamp((sectionFraction(s.el) - f0) / (1 - f0));
    }
    if (s.bar) s.bar.style.transform = `scaleY(${s.current})`;
    const v = s.video;
    if (!s.ready || v.seeking || !v.duration) continue;  // never queue a seek while one is pending
    const t = s.current * v.duration * 0.999;
    if (Math.abs(v.currentTime - t) > 0.008) v.currentTime = t;
  }
  raf = busy ? requestAnimationFrame(tick) : 0;
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) scrubs.find((s) => s.el === e.target).live = e.isIntersecting;
  if (!raf) raf = requestAnimationFrame(tick);
}, { rootMargin: '10% 0px' });
scrubs.forEach((s) => io.observe(s.el));

// ---- reveal ----
const rv = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); }
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal').forEach((el) => rv.observe(el));

// ---- nav: active link + mobile menu ----
const links = [...document.querySelectorAll('.nav__links a')];
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    links.forEach((a) => a.toggleAttribute('aria-current', a.hash === '#' + e.target.id));
    links.forEach((a) => { if (a.getAttribute('aria-current') === '') a.setAttribute('aria-current', 'true'); });
  }
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main > section[id]').forEach((s) => spy.observe(s));

const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('nav-links');
const setMenu = (open) => {
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.firstElementChild.className = open ? 'ph-bold ph-x' : 'ph-bold ph-list';
};
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
