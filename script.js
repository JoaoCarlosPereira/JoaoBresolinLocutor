document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Radio Player Logic
    const audio = document.getElementById('radio-audio');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const statusDot = document.getElementById('status-dot');
    const stationNameDisplay = document.getElementById('station-name');
    const stationBtns = document.querySelectorAll('.station-btn');
    
    let isPlaying = false;

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playIcon.setAttribute('data-lucide', 'play');
        } else {
            audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
            playIcon.setAttribute('data-lucide', 'pause');
        }
        isPlaying = !isPlaying;
        statusDot.classList.toggle('live', isPlaying);
        lucide.createIcons(); // Re-render icons
    }

    playBtn.addEventListener('click', togglePlay);

    stationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            const name = btn.getAttribute('data-name');

            // Update UI
            stationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            stationNameDisplay.textContent = name;

            // Change Source
            audio.src = url;
            if (isPlaying) {
                audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
            }
        });
    });

    // 3. Footer Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 4. Contact Form Handling (Prevent default and show alert)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! (Simulação)');
            contactForm.reset();
        });
    }

    // 5. Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 6. Canvas Background Animation
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let pulses = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#ff4d4d' : '#ff8c00';
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    class Pulse {
        constructor(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || Math.random() * canvas.height;
            this.radius = 0;
            this.maxRadius = Math.random() * 300 + 100;
            this.opacity = 0.3;
            this.speed = Math.random() * 2 + 1;
        }

        update() {
            this.radius += this.speed;
            this.opacity -= 0.002;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.strokeStyle = '#ff4d4d';
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect nearby particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = (1 - dist / 150) * 0.15;
                    ctx.stroke();
                }
            }
        });

        // Occasional random pulse
        if (Math.random() < 0.01 && pulses.length < 5) {
            pulses.push(new Pulse());
        }

        // Update and draw pulses
        pulses.forEach((pulse, index) => {
            pulse.update();
            pulse.draw();
            if (pulse.opacity <= 0) {
                pulses.splice(index, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
});
