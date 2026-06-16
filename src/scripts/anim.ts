// ============================================================
// Animation layer — GSAP (ScrollTrigger) + Lenis smooth scroll.
// Fully disabled under prefers-reduced-motion.
// ============================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function initAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initClickSpark(); // direct user action — always active
  if (!reduce) {
    initButtonPress();
    initSpotlight();
  }

  if (reduce) {
    // Reveal everything immediately, no smooth scroll.
    document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll<HTMLElement>('.section-head .measure').forEach((m) => {
      m.style.transform = 'scaleX(1)';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ---------- Lenis smooth scroll ----------
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Smooth anchor navigation through Lenis
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -(navH + 12), duration: 1.2 });
    });
  });

  // ---------- Reveal: movement + grouped stagger ----------
  gsap.set('.reveal', { y: 30, opacity: 0 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        overwrite: true,
      }),
    once: true,
  });

  // ---------- Section measure lines "draw" in ----------
  gsap.utils.toArray<HTMLElement>('.section-head').forEach((head) => {
    const measure = head.querySelector('.measure');
    if (!measure) return;
    gsap.fromTo(
      measure,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: head, start: 'top 84%' },
      }
    );
  });

  // ---------- Parallax: hero network graph drifts on scroll ----------
  gsap.to('.hero__graph', {
    yPercent: 14,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // ---------- Parallax: section kicker numbers drift subtly ----------
  gsap.utils.toArray<HTMLElement>('.section-head .kicker').forEach((k) => {
    gsap.fromTo(
      k,
      { x: -14, opacity: 0.4 },
      {
        x: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: k, start: 'top 92%', end: 'top 60%', scrub: true },
      }
    );
  });

  // Keep triggers accurate once webfonts have loaded (layout shifts)
  if ('fonts' in document) {
    (document as any).fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

function initSpotlight() {
  document.querySelectorAll<HTMLElement>('.panel').forEach((panel) => {
    panel.addEventListener('mousemove', (e) => {
      const { left, top } = panel.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      panel.style.setProperty(
        '--panel-glow',
        `radial-gradient(280px at ${x}px ${y}px, rgba(94, 168, 255, 0.09), transparent 65%)`
      );
    });
    panel.addEventListener('mouseleave', () => {
      panel.style.removeProperty('--panel-glow');
    });
  });
}

function initClickSpark() {
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.btn');
    if (!btn) return;

    const COUNT = 10;
    const cx = e.clientX;
    const cy = e.clientY;

    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
      const dist = 28 + Math.random() * 22;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const size = 2 + Math.random() * 2.5;
      const alpha = 0.6 + Math.random() * 0.4;

      const el = document.createElement('span');
      el.style.cssText = [
        `position:fixed`,
        `left:${cx}px`,
        `top:${cy}px`,
        `width:${size}px`,
        `height:${size}px`,
        `background:rgba(94,168,255,${alpha.toFixed(2)})`,
        `pointer-events:none`,
        `z-index:9999`,
        `border-radius:1px`,
        `transform:translate(-50%,-50%) rotate(45deg)`,
        `will-change:transform,opacity`,
      ].join(';');
      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease-out';
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(45deg) scale(0.15)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 600);
    }
  });
}

function initButtonPress() {
  document.addEventListener('pointerdown', (e) => {
    const btn = (e.target as HTMLElement).closest('.btn');
    if (!btn) return;
    btn.classList.remove('is-pressed');
    void (btn as HTMLElement).offsetWidth; // reflow to restart the keyframe
    btn.classList.add('is-pressed');
  });
  document.addEventListener('animationend', (e) => {
    const t = e.target as HTMLElement;
    if (t.classList?.contains('is-pressed')) t.classList.remove('is-pressed');
  });
}
