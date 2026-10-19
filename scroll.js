(() => {
  'use strict';
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll('.story-title,.story-copy,.gtaify-scene-content,.trailer-frame,.tweet-section,.section-top,.stats,.roadmap-sticky,.roadmap-phases li,.outro h2,.outro .button')];
  let observer;
  let ticking = false;
  const hero = document.querySelector('.hero');
  const band = document.querySelector('.city-band');
  const story = document.querySelector('.story');
  const gta = document.querySelector('.gtaify-scene');
  const road = document.querySelector('.roadmap-scroll');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress'; progress.setAttribute('aria-hidden','true');
  document.body.appendChild(progress);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function update() {
    ticking = false;
    const y = window.scrollY;
    const viewport = window.innerHeight;
    const total = root.scrollHeight - viewport;
    root.style.setProperty('--page-progress', total > 0 ? String(y / total) : '0');
    if (preference.matches) return;
    hero?.style.setProperty('--hero-drift', clamp(y * .16, 0, 180) + 'px');
    if (band) band.style.setProperty('--band-drift', clamp(-100 - (viewport - band.getBoundingClientRect().top) * .12, -550, 0) + 'px');
    if (story) story.style.setProperty('--watermark-drift', clamp((viewport - story.getBoundingClientRect().top) * .035, 0, 65) + 'px');
    if (gta) {
      const offset = viewport / 2 - (gta.getBoundingClientRect().top + gta.offsetHeight / 2);
      gta.style.setProperty('--gta-drift', clamp(offset * .12, -90, 90) + 'px');
      gta.style.setProperty('--outline-drift', clamp(offset * -.06, -80, 80) + 'px');
    }
    if (road) {
      const rect = road.getBoundingClientRect();
      road.style.setProperty('--road-progress', String(clamp((viewport * .65 - rect.top) / rect.height, 0, 1)));
    }
  }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function setup() {
    observer?.disconnect(); root.classList.remove('motion-ready');
    targets.forEach(el => el.classList.remove('reveal'));
    if (!preference.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('in-view'); observer.unobserve(entry.target);
        }
      }, { threshold:.12, rootMargin:'0px 0px -25px 0px' });
      targets.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
      root.classList.add('motion-ready');
    } else targets.forEach(el => el.classList.add('in-view'));
    queue();
  }
  window.addEventListener('scroll', queue, { passive:true });
  window.addEventListener('resize', queue, { passive:true });
  window.addEventListener('load', queue);
  preference.addEventListener('change', setup);
  setup();
})();
