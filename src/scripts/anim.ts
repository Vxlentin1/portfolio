// ============================================================
// Animation layer — GSAP (ScrollTrigger) + Lenis smooth scroll.
// Fully disabled under prefers-reduced-motion.
// ============================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function initAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Button click feedback works regardless of motion preference (it's a
  // discrete press, not continuous motion) — but skip the keyframe if reduced.
  if (!reduce) initButtonPress();

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
