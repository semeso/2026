/**
 * SEMESO 2026 - Animações e Efeitos Dinâmicos
 * JavaScript Puro: IntersectionObserver, Fundo Tecnológico em Canvas
 * com constelação intensa de bolinhas ao redor da logo, e microinterações.
 *
 * NOTA: A logo do SEMESO é estritamente preservada sem alterações ou animações próprias.
 */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================================
       1. Animações de Entrada ao Rolar a Página (IntersectionObserver)
       ========================================================================== */
    function initScrollReveal() {
        if (prefersReducedMotion) {
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade').forEach(el => {
                el.classList.add('is-revealed');
            });
            return;
        }

        // Aplicar estrategicamente classes de reveal em elementos-chave
        // NUNCA aplicar na logo (#logo, #logo img)
        const cards = document.querySelectorAll('.card:not(.reveal):not(.reveal-left):not(.reveal-right):not(.reveal-fade)');
        cards.forEach((card) => {
            card.classList.add('reveal');
        });

        // Títulos de seções
        const sectionTitles = document.querySelectorAll('.local-semeso, .org-section, #realizacao h2, #apoio h2');
        sectionTitles.forEach(title => {
            if (!title.classList.contains('reveal') && !title.classList.contains('reveal-left')) {
                title.classList.add('reveal-left');
            }
        });

        // Cards da equipe organizadora com atraso escalonado
        const orgCards = document.querySelectorAll('.org-card');
        orgCards.forEach((card, index) => {
            card.classList.add('reveal');
            const delayClass = 'delay-' + ((index % 4) + 1);
            card.classList.add(delayClass);
        });

        // Parágrafos principais da home page
        const homeParagraphs = document.querySelectorAll('article > p');
        homeParagraphs.forEach((p, index) => {
            if (index % 2 === 0) {
                p.classList.add('reveal');
            } else {
                p.classList.add('reveal-fade');
            }
        });

        // Configuração do IntersectionObserver (~15% de visibilidade)
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.15
        };

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade');
            targets.forEach(el => {
                // Prevenção explícita: nunca animar elementos da logo
                if (!el.closest('#logo')) {
                    revealObserver.observe(el);
                }
            });
        } else {
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade').forEach(el => {
                el.classList.add('is-revealed');
            });
        }
    }

    /* ==========================================================================
       2. Fundo Tecnológico em Canvas - Efeito Intenso de Bolinhas na Logo
       ========================================================================== */
    function initTechBackground() {
        const canvas = document.getElementById('tech-canvas');
        const container = document.getElementById('tech-canvas-container');
        if (!canvas || prefersReducedMotion) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let animationFrameId = null;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = container ? container.offsetHeight : 440;
        }
        resize();

        window.addEventListener('resize', () => {
            resize();
        }, { passive: true });

        // Desvanecer a transparência do container conforme o usuário desce a página
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            if (container) {
                const fadeDistance = 320; // 100% transparente a partir de 320px de scroll
                const opacity = Math.max(0, 1 - (scrollY / fadeDistance));
                container.style.opacity = opacity;
            }
        }, { passive: true });

        const isMobile = window.innerWidth < 768;

        // Paleta vibrante do SEMESO: Turquesa (#20f0cd), Ciano (#00f5d4) e Azul (#3B82F6)
        const colors = [
            'rgba(32, 240, 205, ',  // Turquesa principal brilhante
            'rgba(0, 245, 212, ',   // Ciano elétrico
            'rgba(59, 130, 246, ',  // Azul tech
            'rgba(99, 102, 241, '   // Índigo suave
        ];

        // Todas as bolinhas ficam concentradas EXCLUSIVAMENTE na região da logo/topo
        const nodeCount = isMobile ? 22 : 40;
        const nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * (height - 20) + 10,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.35,
                baseRadius: Math.random() * 2.2 + 2.0, // Bolinhas nítidas (2.0 a 4.2px)
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.03 + 0.015,
                colorBase: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.35 + 0.55, // Alta intensidade/opacidade (0.55 a 0.90)
                hasStub: Math.random() > 0.45,
                stubLength: Math.random() * 16 + 10,
                hasGlow: Math.random() > 0.35 // Halo luminoso
            });
        }

        const maxDist = isMobile ? 100 : 135;

        // Loop de Renderização
        function render() {
            ctx.clearRect(0, 0, width, height);

            // 1. Desenhar conexões / linhas entre bolinhas próximas
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const n1 = nodes[i];
                    const n2 = nodes[j];

                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const lineAlpha = (1 - (dist / maxDist)) * 0.36;
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.strokeStyle = `rgba(32, 240, 205, ${lineAlpha})`;
                        ctx.lineWidth = 1.0;
                        ctx.stroke();
                    }
                }
            }

            // 2. Atualizar e desenhar bolinhas, halos e circuitos
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];

                n.x += n.vx;
                n.y += n.vy;
                n.pulse += n.pulseSpeed;

                // Raio com pulsação suave
                const currentRadius = n.baseRadius + Math.sin(n.pulse) * 0.6;

                // Rebater suavemente nas bordas laterais e verticais do topo
                if (n.x < 0) { n.x = 0; n.vx *= -1; }
                else if (n.x > width) { n.x = width; n.vx *= -1; }

                if (n.y < 8) { n.y = 8; n.vy *= -1; }
                else if (n.y > height - 12) { n.y = height - 12; n.vy *= -1; }

                // Halo luminoso ao redor da bolinha (efeito glow)
                if (n.hasGlow) {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, currentRadius * 2.2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(32, 240, 205, 0.18)';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(n.x, n.y, currentRadius * 1.4, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(32, 240, 205, 0.28)';
                    ctx.fill();
                }

                // Bolinha principal
                ctx.beginPath();
                ctx.arc(n.x, n.y, Math.max(1, currentRadius), 0, Math.PI * 2);
                ctx.fillStyle = `${n.colorBase}${n.alpha})`;
                ctx.fill();

                // Traço de circuito eletrônico conectado à bolinha
                if (n.hasStub) {
                    const stubX = n.x + n.stubLength;
                    const stubY = n.y + (n.stubLength * 0.6);

                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(stubX, n.y);
                    ctx.lineTo(stubX, stubY);
                    ctx.strokeStyle = 'rgba(32, 240, 205, 0.22)';
                    ctx.lineWidth = 0.9;
                    ctx.stroke();

                    // Micro-ponto no fim do circuito
                    ctx.beginPath();
                    ctx.arc(stubX, stubY, 1.6, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(32, 240, 205, 0.55)';
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        }

        render();

        // Pausar animação quando a aba estiver oculta
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                render();
            }
        });
    }

    /* ==========================================================================
       3. Sanfona / Acordeão dos Cards (Preservação da Funcionalidade)
       ========================================================================== */
    function initCardAccordion() {
        document.querySelectorAll('.card-toggle').forEach((btn) => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.card');
                if (card) {
                    card.classList.toggle('active');
                }
            });
        });

        // Abertura automática ao carregar com âncora (#) na URL
        const hash = window.location.hash;
        if (hash) {
            try {
                const target = document.querySelector(hash);
                if (target && target.classList.contains('card')) {
                    target.classList.add('active');
                    setTimeout(() => {
                        const yOffset = -120;
                        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({
                            top: y,
                            behavior: 'smooth',
                        });
                    }, 400);
                }
            } catch (e) {
                // Hash inválido tratado silenciosamente
            }
        }
    }

    /* ==========================================================================
       Inicialização no DOMContentLoaded
       ========================================================================== */
    document.addEventListener('DOMContentLoaded', () => {
        initScrollReveal();
        initTechBackground();
        initCardAccordion();
    });

})();
