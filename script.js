const TRANSITION_MS = 300;

// === Carrossel Principal ===
const list = document.querySelectorAll('.item');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
let active = 0;

// === Atualiza rodapé dinâmico ===
function updateFooter(activeIndex) {
    const footer = document.querySelector('.dynamic-footer');
    const colors = ['morango', 'abacate', 'laranja'];
    footer.setAttribute('data-active', colors[activeIndex]);
}

next.onclick = () => {
    const activeOld = document.querySelector('.item.active');
    if (activeOld) activeOld.classList.remove('active');
    active = active >= list.length - 1 ? 0 : active + 1;
    list[active].classList.add('active');
    updateFooter(active);
};

prev.onclick = () => {
    const activeOld = document.querySelector('.item.active');
    if (activeOld) activeOld.classList.remove('active');
    active = active <= 0 ? list.length - 1 : active - 1;
    list[active].classList.add('active');
    updateFooter(active);
};

// === Overlays ===
const loginOverlay = document.getElementById('loginOverlay');
const signupOverlay = document.getElementById('signupOverlay');
const loginButton = document.getElementById('loginButton');
const closeLogin = document.getElementById('closeLogin');
const closeSignup = document.getElementById('closeSignup');
const createAccount = document.getElementById('createAccount');
const loginFromSignup = document.getElementById('loginFromSignup');

const hideOverlay = (overlay) => {
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, TRANSITION_MS);
};

const showOverlay = (overlay) => {
    overlay.classList.remove('hidden');
    // small timeout to ensure CSS transition (if present) will run
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
};

loginButton.addEventListener('click', () => showOverlay(loginOverlay));
closeLogin.addEventListener('click', () => hideOverlay(loginOverlay));
closeSignup.addEventListener('click', () => hideOverlay(signupOverlay));

createAccount.addEventListener('click', (e) => {
    e.preventDefault();
    hideOverlay(loginOverlay);
    setTimeout(() => showOverlay(signupOverlay), TRANSITION_MS);
});

loginFromSignup.addEventListener('click', (e) => {
    e.preventDefault();
    hideOverlay(signupOverlay);
    setTimeout(() => showOverlay(loginOverlay), TRANSITION_MS);
});

// === Carrossel de Bebidas (3D em todas as telas) ===
const slides = document.querySelectorAll('.beverage-carousel .slide');
const textContent = document.querySelector('.text-content');
let currentSlide = 0;

const drinkData = [
    { name: 'morango', color: '#EA3D41' },
    { name: 'abacate', color: '#2D5643' },
    { name: 'laranja', color: '#E7A043' }
];

function rotateBeverages() {
    slides.forEach(s => {
        s.classList.remove('active', 'prev', 'next');
        void s.offsetWidth;
    });
    
    slides[currentSlide].classList.add('active');
    
    const nextIndex = (currentSlide + 1) % slides.length;
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    slides[nextIndex].classList.add('next');
    slides[prevIndex].classList.add('prev');
    
    textContent.setAttribute('data-active', drinkData[currentSlide].name);
    currentSlide = nextIndex;
}

setInterval(rotateBeverages, 3000);
rotateBeverages();

// === Carrossel Automático da História (1.2s) ===
const historySlides = document.querySelectorAll('.history-slide');
let currentHistorySlide = 0;

function rotateHistory() {
    historySlides.forEach(slide => slide.classList.remove('active'));
    historySlides[currentHistorySlide].classList.add('active');
    currentHistorySlide = (currentHistorySlide + 1) % historySlides.length;
}

setInterval(rotateHistory, 1200);
rotateHistory();

// === Mapa-Múndi Responsivo ===
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('world-map')) {
        const isMobile = window.innerWidth <= 768;
        const zoomLevel = isMobile ? 2 : 3;
        
        const map = L.map('world-map').setView([-23.5505, -46.6333], zoomLevel);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        const iconSize = isMobile ? [40, 40] : [32, 32];
        const customIcon = L.divIcon({
            html: `<div style="
                width: ${iconSize[0]}px;
                height: ${iconSize[1]}px;
                background: #EA3D41;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(234, 61, 65, 0.4);
                border: 3px solid white;
                font-size: ${isMobile ? '1.2rem' : '1rem'};
            ">📍</div>`,
            className: '',
            iconSize: iconSize,
            iconAnchor: [iconSize[0]/2, iconSize[1]/2]
        });
        
        L.marker([-23.5505, -46.6333], { icon: customIcon })
            .addTo(map)
            .bindPopup('Drink Animate<br>Av. Paulista, 1000')
            .openPopup();
    }
    
    // Inicializa rodapé
    updateFooter(active);

    // === Liga botão "Novidades" para abrir login ===
    const btnNovidades = document.getElementById('btnNovidades');
    if (btnNovidades) {
        btnNovidades.addEventListener('click', (e) => {
            e.preventDefault();
            // abre o overlay de login usando a função já existente
            showOverlay(loginOverlay);
            // opcional: você pode focar o campo de email automaticamente
            const emailInput = document.getElementById('email-login');
            if (emailInput) {
                setTimeout(() => emailInput.focus(), 200);
            }
        });
    }
});
