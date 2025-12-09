const TRANSITION_MS = 300;

const FLAVORS = [
    { name: 'morango', color: '#EA3D41' },
    { name: 'abacate', color: '#2D5643' },
    { name: 'laranja', color: '#E7A043' }
];

let activeIndex = 0;
let currentSlide = 0;
let currentHistorySlide = 0;
let map = null;

function updateActiveFlavor(index) {
    const footer = document.querySelector('.dynamic-footer');
    const textContent = document.querySelector('.text-content');
    footer.setAttribute('data-active', FLAVORS[index].name);
    textContent.setAttribute('data-active', FLAVORS[index].name);
}

document.documentElement.classList.remove('js-loading');

function activateItem(index) {
    document.querySelectorAll('.item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    updateActiveFlavor(index);
}

const list = document.querySelectorAll('.item');
const next = document.getElementById('next');
const prev = document.getElementById('prev');

next.onclick = () => {
    activeIndex = activeIndex >= list.length - 1 ? 0 : activeIndex + 1;
    setTimeout(() => activateItem(activeIndex), 10);
};

prev.onclick = () => {
    activeIndex = activeIndex <= 0 ? list.length - 1 : activeIndex - 1;
    setTimeout(() => activateItem(activeIndex), 10);
};

const loginOverlay = document.getElementById('loginOverlay');
const signupOverlay = document.getElementById('signupOverlay');
const loginButton = document.getElementById('loginButton');
const closeLogin = document.getElementById('closeLogin');
const closeSignup = document.getElementById('closeSignup');
const createAccount = document.getElementById('createAccount');
const loginFromSignup = document.getElementById('loginFromSignup');

const hideOverlay = (overlay) => {
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    setTimeout(() => overlay.classList.add('hidden'), TRANSITION_MS);
};

const showOverlay = (overlay) => {
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
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

const slides = document.querySelectorAll('.beverage-carousel .slide');

function rotateBeverages() {
    slides.forEach(s => s.classList.remove('active', 'prev', 'next'));
    slides[currentSlide].classList.add('active');
    
    const nextIndex = (currentSlide + 1) % slides.length;
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    slides[nextIndex].classList.add('next');
    slides[prevIndex].classList.add('prev');
    
    currentSlide = nextIndex;
}

setInterval(rotateBeverages, 3000);
rotateBeverages();

const historySlides = document.querySelectorAll('.history-slide');

function rotateHistory() {
    historySlides.forEach(slide => slide.classList.remove('active'));
    historySlides[currentHistorySlide].classList.add('active');
    currentHistorySlide = (currentHistorySlide + 1) % historySlides.length;
}

setInterval(rotateHistory, 1200);
rotateHistory();

function initMap() {
    if (!document.getElementById('world-map')) return;

    const isMobile = window.innerWidth <= 768;
    const zoomLevel = isMobile ? 2 : 3;

    map = L.map('world-map').setView([-23.5505, -46.6333], zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
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

function resizeMap() {
    if (map) {
        const container = document.getElementById('world-map');
        if (container) {
            const width = container.clientWidth;
            container.style.height = `${Math.min(width, 400)}px`;
            map.invalidateSize();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    updateActiveFlavor(activeIndex);

    window.addEventListener('resize', resizeMap);
    resizeMap();

    const btnNovidades = document.getElementById('btnNovidades');
    if (btnNovidades) {
        btnNovidades.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlay(loginOverlay);
            setTimeout(() => {
                const emailInput = document.getElementById('email-login');
                if (emailInput) emailInput.focus();
            }, 200);
        });
    }
});
