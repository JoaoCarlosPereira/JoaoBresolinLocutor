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

    // Apply to sections
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
