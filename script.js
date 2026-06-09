/* ============================================
   PORTFOLIO — Valentin Moyse
   JavaScript: Particles, Animations, Navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========== Particle Canvas ==========
    const canvas = document.getElementById('particleCanvas');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '124, 58, 237' : '6, 182, 212';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= dx * force * 0.01;
                        this.y -= dy * force * 0.01;
                    }
                }

                // Wrap around
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistance = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        let isRunning = false;

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        }

        function startAnimation() {
            if (!isRunning) {
                isRunning = true;
                animateParticles();
            }
        }

        function stopAnimation() {
            isRunning = false;
            cancelAnimationFrame(animationId);
        }

        initParticles();
        startAnimation();

        // Pause the loop when the hero is scrolled out of view (saves CPU/battery)
        const hero = document.getElementById('hero');
        if (hero && 'IntersectionObserver' in window) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) startAnimation();
                    else stopAnimation();
                });
            }, { threshold: 0 });
            heroObserver.observe(hero);
        }

        // Pause when the browser tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAnimation();
            else startAnimation();
        });

        // Reinit on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeCanvas();
                initParticles();
            }, 200);
        });
    }

    // ========== Typing Effect ==========
    const typedElement = document.getElementById('typedText');
    const typedWords = [
        'Cybersécurité',
        'Infrastructure réseau',
        'Active Directory',
        'Administration systèmes',
        'Sécurisation des SI',
        'Cloud & DevOps'
    ];
    if (typedElement && prefersReducedMotion) {
        // Show a static label instead of animating
        typedElement.textContent = typedWords[0];
    } else if (typedElement) {
        const words = typedWords;
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeEffect() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typedElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typedElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        setTimeout(typeEffect, 1000);
    }

    // ========== Navigation ==========
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTop');

    // Scroll effects
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScrollY = scrollY;
    });

    // Back to top click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile nav toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');

            // Toggle overlay
            let overlay = document.querySelector('.nav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('nav-overlay');
                document.body.appendChild(overlay);
                overlay.addEventListener('click', closeNav);
            }
            overlay.classList.toggle('active');

            // Toggle body scroll
            const isOpen = navLinks.classList.contains('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    function closeNav() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ========== Scroll Reveal ==========
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Don't unobserve to allow re-animations if needed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ========== Counter Animation ==========
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animateCounter(target, count);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(element, target) {
        if (prefersReducedMotion) {
            element.textContent = target;
            return;
        }
        let current = 0;
        const increment = target / 40;
        const duration = 1500;
        const stepTime = duration / 40;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, stepTime);
    }

    // ========== Smooth scroll for anchor links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ========== Stagger animations for timeline items ==========
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // ========== Stagger for cert cards ==========
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.08}s`;
    });

    // ========== Stagger for skill tags ==========
    if (!prefersReducedMotion) {
    document.querySelectorAll('.skill-category').forEach(category => {
        const tags = category.querySelectorAll('.skill-tag');
        tags.forEach((tag, index) => {
            tag.style.transitionDelay = `${index * 0.03}s`;
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px) scale(0.95)';
        });
    });

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.skill-tag');
                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0) scale(1)';
                        tag.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                    }, index * 50);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category').forEach(el => {
        skillObserver.observe(el);
    });
    }

    // ========== Cybersécurité — plateformes ==========
    const cyberPlatforms = document.getElementById('cyberPlatforms');
    if (cyberPlatforms) {
        loadCyberPlatforms(cyberPlatforms);
    }
});

function formatPlatformNumber(value) {
    return new Intl.NumberFormat('fr-FR').format(value);
}

function renderPlatformStats(stats) {
    if (!stats.length) return '';
    return `
        <div class="platform-stats">
            ${stats.map(stat => `
                <div class="platform-stat">
                    <span class="platform-stat-value">${stat.value}</span>
                    <span class="platform-stat-label">${stat.label}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPlatformCard({ brand, modifier, username, profileUrl, avatar, stats }) {
    const initial = username.charAt(0).toUpperCase();
    const avatarHtml = avatar
        ? `<img class="platform-avatar" src="${avatar}" alt="Avatar ${brand} ${username}" width="80" height="80" loading="lazy">`
        : `<div class="platform-avatar-fallback" aria-hidden="true">${initial}</div>`;

    return `
        <article class="platform-card platform-card--${modifier}">
            <span class="platform-brand">${brand}</span>
            <div class="platform-avatar-wrap">${avatarHtml}</div>
            <h3 class="platform-username"><a href="${profileUrl}" target="_blank" rel="noopener">@${username}</a></h3>
            ${renderPlatformStats(stats)}
            <a href="${profileUrl}" target="_blank" rel="noopener" class="platform-link">
                Voir le profil
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
        </article>
    `;
}

function buildTryHackMeCard(data) {
    const stats = [];
    if (data.rankPercentile) {
        stats.push({ value: `Top ${data.rankPercentile}%`, label: 'Classement mondial' });
    }
    if (data.points != null) {
        stats.push({ value: formatPlatformNumber(data.points), label: 'Points' });
    }
    return renderPlatformCard({
        brand: 'TryHackMe',
        modifier: 'thm',
        username: data.username,
        profileUrl: data.profileUrl,
        avatar: data.avatar,
        stats
    });
}

function buildRootMeCard(data) {
    const stats = [];
    if (data.rank != null) {
        stats.push({ value: formatPlatformNumber(data.rank), label: 'Classement' });
    }
    if (data.score != null) {
        stats.push({ value: formatPlatformNumber(data.score), label: 'Score' });
    }
    return renderPlatformCard({
        brand: 'Root Me',
        modifier: 'rootme',
        username: data.username,
        profileUrl: data.profileUrl,
        avatar: data.avatar,
        stats
    });
}

async function loadCyberPlatforms(container) {
    try {
        const [thmRes, rootmeRes] = await Promise.all([
            fetch('data/tryhackme.json'),
            fetch('data/rootme.json')
        ]);

        if (!thmRes.ok || !rootmeRes.ok) throw new Error('Fichiers introuvables');

        const thm = await thmRes.json();
        const rootme = await rootmeRes.json();

        if (!thm.username || !rootme.username) throw new Error('Données invalides');

        if (!rootme.avatar && thm.avatar) {
            rootme.avatar = thm.avatar;
        }

        container.innerHTML = buildTryHackMeCard(thm) + buildRootMeCard(rootme);
    } catch {
        container.innerHTML = '<p class="cyber-error">Impossible de charger les profils. Réessayez plus tard.</p>';
    }
}
