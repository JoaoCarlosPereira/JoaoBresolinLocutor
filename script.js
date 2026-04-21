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

    // 4. Contact Form Handling
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

    // 6. Canvas Sound Waves Animation
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let waves = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initWaves();
        }

        window.addEventListener('resize', resize);

        function initWaves() {
            waves = [
                {
                    amplitude: 50,
                    period: 0.01,
                    phase: 0,
                    speed: 0.02,
                    color: 'rgba(255, 77, 77, 0.15)',
                    lineWidth: 2
                },
                {
                    amplitude: 70,
                    period: 0.005,
                    phase: 0,
                    speed: -0.015,
                    color: 'rgba(255, 140, 0, 0.1)',
                    lineWidth: 3
                },
                {
                    amplitude: 30,
                    period: 0.02,
                    phase: 0,
                    speed: 0.03,
                    color: 'rgba(255, 77, 77, 0.1)',
                    lineWidth: 1
                }
            ];
        }

        function drawWave(wave) {
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = wave.lineWidth;

            for (let x = 0; x < width; x++) {
                // Combina múltiplas ondas senoidais para um efeito mais orgânico
                const y = height / 2 + 
                          Math.sin(x * wave.period + wave.phase) * wave.amplitude +
                          Math.sin(x * 0.002 + wave.phase * 0.5) * (wave.amplitude * 0.5);
                ctx.lineTo(x, y);
            }

            ctx.stroke();
            wave.phase += wave.speed;
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Desenha várias camadas de ondas em posições diferentes
            waves.forEach((wave, index) => {
                // Desenha a mesma onda em alturas diferentes para preencher o fundo
                const originalAmplitude = wave.amplitude;
                
                // Centro
                drawWave(wave);
                
                // Topo
                ctx.save();
                ctx.translate(0, -height * 0.25);
                wave.amplitude = originalAmplitude * 0.7;
                drawWave(wave);
                ctx.restore();
                
                // Base
                ctx.save();
                ctx.translate(0, height * 0.25);
                wave.amplitude = originalAmplitude * 0.7;
                drawWave(wave);
                ctx.restore();

                wave.amplitude = originalAmplitude;
            });

            requestAnimationFrame(animate);
        }

        resize();
        animate();
    }

    // Apply reveal to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    // Custom CSS for observer
    const style = document.createElement('style');
    style.textContent = `
        .reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});