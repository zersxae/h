// Import'ları kaldırıyoruz
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import confetti from 'canvas-confetti';

// gsap.registerPlugin(ScrollTrigger);

// AOS başlatma
AOS.init({
    duration: 1000,
    once: true
});

// Kalp animasyonları
const createHearts = () => {
    const container = document.querySelector('.hearts-container');
    const heartSymbols = ['❤️', '💖', '💕', '💗', '💓'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 15000);
    }, 300);
};

// Hero Animasyonları
const heroAnimation = () => {
    const tl = gsap.timeline();
    
    tl.to('.hero__title', {
        opacity: 1,
        y: 0,
        duration: 1
    })
    .to('.hero__subtitle', {
        opacity: 1,
        y: 0,
        duration: 1
    }, '-=0.5')
    .to('#startButton', {
        opacity: 1,
        y: 0,
        duration: 1
    }, '-=0.5');
};

// Scroll Animasyonları
const initScrollAnimations = () => {
    gsap.utils.toArray('.story__section').forEach(section => {
        gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            }
        });
    });
};

// Adım gösterme fonksiyonu
const showStep = (stepId) => {
    // Tüm adımları gizle
    document.querySelectorAll('.story__step').forEach(step => {
        step.classList.remove('active');
    });
    
    // İstenen adımı göster
    const currentStep = document.getElementById(stepId);
    if (currentStep) {
        currentStep.classList.add('active');
    }
};

// Başlangıç butonu için event listener
const initStartButton = () => {
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
            // İlk adımı göster
            showStep('step1');
            
            // Story bölümüne smooth scroll
            document.querySelector('.story').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Konfeti efekti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        });
    }
};

// İleri butonları için event listener
const initNextButtons = () => {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn--next')) {
            const nextStepId = e.target.dataset.next;
            showStep(nextStepId);
        }
    });
};

// Kaçan hayır butonu
const initNoButton = () => {
    const noButton = document.getElementById('noButton');
    let clickCount = 0;
    if (noButton) {
        const moveButton = () => {
            clickCount++;
            // Butonun ekrandan çıkmaması için sınırları belirle
            const maxX = window.innerWidth - noButton.offsetWidth - 20; // 20px margin
            const maxY = window.innerHeight - noButton.offsetHeight - 20;
            
            // Random pozisyon hesapla ama ekran sınırları içinde
            const x = Math.min(Math.max(20, Math.random() * maxX), maxX);
            const y = Math.min(Math.max(20, Math.random() * maxY), maxY);
            
            noButton.style.position = 'fixed';
            noButton.style.left = `${x}px`;
            noButton.style.top = `${y}px`;
            
            // İkinci tıklamada özel mesaj
            if (clickCount >= 2) {
                const message = document.createElement('div');
                message.className = 'forgive-message';
                message.innerHTML = `
                    <div class="forgive-message__title">🥺 Aşkım Ne Yapmaya Çalışıyorsun?</div>
                    <div class="forgive-message__text">Lütfen 'Hayır' Deme, Beni Çok Üzüyorsun...</div>
                `;
                document.body.appendChild(message);
                
                // Kalp efekti ekle
                createHeartRain();
                
                // Mesajı 3 saniye sonra kaldır
                setTimeout(() => message.remove(), 3000);
                
                // Hayır butonunu daha hızlı hareket ettir
                noButton.style.transition = 'all 0.2s ease';
            }
        };
        
        noButton.addEventListener('mouseover', moveButton);
        noButton.addEventListener('click', moveButton);
    }
};

// Evet butonu için event listener
const initYesButton = () => {
    const yesButton = document.getElementById('yesButton');
    if (yesButton) {
        yesButton.addEventListener('click', () => {
            showStep('final');
            createHeartRain();
            
            // Büyük konfeti patlaması
            const duration = 15 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { 
                startVelocity: 30, 
                spread: 360, 
                ticks: 60, 
                zIndex: 0,
                shapes: ['star', 'circle']
            };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { 
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#ff1f5a', '#ffd4e0', '#ffffff', '#ffd700', '#ff69b4']
                }));
                confetti(Object.assign({}, defaults, { 
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#ff1f5a', '#ffd4e0', '#ffffff', '#ffd700', '#ff69b4']
                }));
            }, 250);

            // Mesaj göster
            const message = document.createElement('div');
            message.className = 'forgive-message';
            message.innerHTML = `
                <div class="forgive-message__title">💝 Teşekkür Ederim Canım 💝</div>
                <div class="forgive-message__text">Seni Çok Seviyorum</div>
            `;
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 5000);
        });
    }
};

// Kalp yağmuru efekti
const createHeartRain = () => {
    const container = document.createElement('div');
    container.className = 'heart-rain';
    document.body.appendChild(container);
    
    const heartSymbols = ['❤️', '💖', '💕', '💗', '💓'];
    const numberOfHearts = 50;
    
    for (let i = 0; i < numberOfHearts; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'rain-heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            container.appendChild(heart);
            
            heart.addEventListener('animationend', () => {
                heart.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            });
        }, i * 100);
    }
};

// Yüzen kalpler animasyonu
const createFloatingHearts = () => {
    const container = document.querySelector('.floating-hearts');
    if (container) {
        const heartSymbols = ['❤️', '💖', '💕', '💗', '💓'];
        
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            container.appendChild(heart);
            
            heart.addEventListener('animationend', () => {
                heart.remove();
            });
        };
        
        setInterval(createHeart, 300);
    }
};

// Müzik kontrolü
const initMusicPlayer = () => {
    const music = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const progressBar = document.querySelector('.progress');
    
    // Sayfa yüklendiğinde direkt başlat
    const playMusic = () => {
        if (music.paused) {
            music.play();
            musicToggle.classList.add('playing');
        }
    };
    
    // Sayfa yüklendiğinde çalmayı dene
    playMusic();
    
    // Kullanıcı etkileşimi olduğunda tekrar dene (bazı tarayıcılar için)
    document.addEventListener('click', playMusic, { once: true });
    
    // Progress bar güncelleme
    music.addEventListener('timeupdate', () => {
        const progress = (music.currentTime / music.duration) * 100;
        progressBar.style.width = progress + '%';
    });
    
    musicToggle.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicToggle.classList.add('playing');
        } else {
            music.pause();
            musicToggle.classList.remove('playing');
        }
    });
};

// Balon animasyonu
const createBalloons = () => {
    const container = document.querySelector('.floating-balloons');
    const balloonEmojis = ['🎈', '🎊', '🎉'];
    
    setInterval(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + 'vw';
        balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
        container.appendChild(balloon);
        
        balloon.addEventListener('animationend', () => balloon.remove());
    }, 2000);
};

// Pasta mumları üfleme
const initCakeInteraction = () => {
    const blowButton = document.getElementById('blowCandles');
    if (blowButton) {
        blowButton.addEventListener('click', () => {
            // Konfeti patlaması
            confetti({
                particleCount: 150,
                spread: 180,
                origin: { y: 0.8 }
            });
            
            // Dilek tutma mesajı
            const message = document.createElement('div');
            message.className = 'forgive-message';
            message.innerHTML = `
                <div class="forgive-message__title">✨ Dileğin Kabul Olsun ✨</div>
                <div class="forgive-message__text">Ben senin için hep mutluluk diliyorum</div>
            `;
            document.body.appendChild(message);
            
            setTimeout(() => message.remove(), 3000);
        });
    }
};

// Anıları sırayla gösterme
const initMemories = () => {
    const memories = document.querySelectorAll('.memory-text');
    let currentIndex = 0;

    const showNextMemory = () => {
        memories.forEach(memory => memory.classList.remove('active'));
        memories[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % memories.length;
    };

    setInterval(showNextMemory, 3000);
};

// Son dilek butonu için event listener
const initFinalWish = () => {
    const finalWishButton = document.getElementById('finalWishButton');
    if (finalWishButton) {
        finalWishButton.addEventListener('click', () => {
            // Büyük konfeti patlaması
            const duration = 20 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { 
                startVelocity: 45, 
                spread: 360, 
                ticks: 100, 
                zIndex: 0,
                shapes: ['star', 'heart']
            };

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                const particleCount = 75 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { 
                    particleCount,
                    origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 },
                    colors: ['#ff1f5a', '#ffd4e0', '#ffffff', '#ffd700', '#ff69b4']
                }));
            }, 200);

            // Özel mesaj göster
            const message = document.createElement('div');
            message.className = 'forgive-message';
            message.innerHTML = `
                <div class="forgive-message__title">💝 Benimle Evlenir misin? 💝</div>
                <div class="forgive-message__text">Hayatımın Sonuna Kadar Seninle Olmak İstiyorum</div>
            `;
            document.body.appendChild(message);
            
            setTimeout(() => message.remove(), 8000);
        });
    }
};

// Final butonu için event listener
const initFinaleButton = () => {
    const finaleButton = document.getElementById('finaleButton');
    if (finaleButton) {
        finaleButton.addEventListener('click', () => {
            // Büyük final efekti
            const duration = 30 * 1000; // 30 saniye
            const animationEnd = Date.now() + duration;
            
            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                // Çoklu konfeti patlaması
                confetti({
                    particleCount: 100,
                    spread: 360,
                    origin: { x: Math.random(), y: Math.random() - 0.2 },
                    colors: ['#ff1f5a', '#ffd4e0', '#ffffff', '#ffd700', '#ff69b4'],
                    ticks: 200,
                    shapes: ['star', 'heart']
                });
            }, 250);

            // Final mesajı
            const message = document.createElement('div');
            message.className = 'forgive-message';
            message.innerHTML = `
                <div class="forgive-message__title">💝 Seni Sonsuza Dek Seveceğim 💝</div>
                <div class="forgive-message__text">İyi ki Doğdun, İyi ki Varsın...</div>
            `;
            document.body.appendChild(message);
            
            // Ekstra kalp yağmuru
            createHeartRain();
            
            setTimeout(() => {
                message.remove();
                // Son mesaj
                const finalMessage = document.createElement('div');
                finalMessage.className = 'forgive-message';
                finalMessage.innerHTML = `
                    <div class="forgive-message__title">✨ Mutlu Yıllar ✨</div>
                    <div class="forgive-message__text">Seninle Nice Güzel Yaşlara...</div>
                `;
                document.body.appendChild(finalMessage);
                setTimeout(() => finalMessage.remove(), 5000);
            }, 8000);
        });
    }
};

// Sürpriz efektleri
const initSurprises = () => {
    const surpriseButton = document.getElementById('surpriseButton');
    const surpriseGallery = document.getElementById('surpriseGallery');
    let clickCount = 0;

    if (surpriseButton) {
        surpriseButton.addEventListener('click', () => {
            clickCount++;
            
            // Her tıklamada farklı sürprizler
            switch(clickCount) {
                case 1:
                    // Kalp yağmuru
                    createHeartRain();
                    break;
                case 2:
                    // Konfeti patlaması
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                    break;
                case 3:
                    // Sürpriz galeri
                    surpriseGallery.classList.add('active');
                    clickCount = 0;
                    break;
            }

            // Uçan kalpler efekti
            const heart = document.createElement('div');
            heart.className = 'surprise-heart';
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        });
    }
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    heroAnimation();
    initStartButton();
    initNextButtons();
    initNoButton();
    initYesButton();
    createFloatingHearts();
    initMusicPlayer();
    createBalloons();
    initCakeInteraction();
    initMemories();
    initFinalWish();
    initFinaleButton();
    initSurprises();
}); 