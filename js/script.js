// ==========================================================================
// SCRIPT DEFINITIVO INTERACTIVO - REFACTORIZADO POR BOTÓN (SILENCIO MANUAL)
// ==========================================================================

const audioEspera = document.getElementById('audio-wait');
const audioTransicion = document.getElementById('audio-transition');

// Inicialización global al cargar cualquier página
window.addEventListener('DOMContentLoaded', () => {
    if (audioEspera) {
        audioEspera.play().catch(() => console.log("Música de espera aguardando interacción."));
    }
    
    if (document.body.classList.contains('teatro-body')) {
        iniciarContadorAbstraccion();
        
        if (typeof inyectarBurbujaCaine === 'function') inyectarBurbujaCaine();
        if (typeof configurarGlitchPrecios === 'function') configurarGlitchPrecios();
        
        // Vincular botón de mutación manual
        const botonAbstraer = document.getElementById('btn-abstraer-manual');
        if (botonAbstraer) {
            botonAbstraer.addEventListener('click', ejecutarMutacionElenco);
        }
    }
});

// ==========================================================================
// 1. MOCIÓN DE LA BOCA Y TRANSICIÓN DE DIAPOSITIVAS (index.html)
// ==========================================================================
function iniciarEspectaculo() {
    const jawTop = document.querySelector('.jaw-top');
    const jawBottom = document.querySelector('.jaw-bottom');
    const clickText = document.querySelector('.click-text');
    
    if (!jawTop || !jawBottom) return;

    if (clickText) clickText.style.display = 'none';
    if (audioEspera) audioEspera.pause();
    
    if (audioTransicion) {
        audioTransicion.volume = 0.15;
        audioTransicion.play().catch(err => console.log("Audio bloqueado: ", err));
    }

    jawTop.style.transform = 'translateY(-100%)';
    jawBottom.style.transform = 'translateY(100%)';

    setTimeout(() => {
        const introScreen = document.getElementById('intro-screen');
        const slideScreen = document.getElementById('slide-transition');
        
        if (introScreen) introScreen.style.display = 'none';
        if (slideScreen) {
            slideScreen.style.display = 'flex';
            
            const slides = document.querySelectorAll('.slide');
            if (slides.length > 0) {
                const tiempoPorSlide = audioTransicion && audioTransicion.duration ? (audioTransicion.duration * 1000) / slides.length : 8000;
                reproducirDiapositivasSincronizadas(slides, 0, tiempoPorSlide);
            }
        }
    }, 1200);
}

function reproducirDiapositivasSincronizadas(slides, index, tiempoEspera) {
    if (index >= slides.length) {
        window.speechSynthesis.cancel();
        window.location.href = 'home.html';
        return;
    }

    slides.forEach(s => s.style.display = 'none');
    slides[index].style.display = 'block';

    window.speechSynthesis.cancel();
    const lectura = new SpeechSynthesisUtterance(slides[index].innerText);
    lectura.lang = 'es-ES';
    lectura.rate = 0.9;
    lectura.pitch = 1.1;

    window.speechSynthesis.speak(lectura);

    setTimeout(() => {
        reproducirDiapositivasSincronizadas(slides, index + 1, tiempoEspera);
    }, tiempoEspera);
}

// ==========================================================================
// 2. BURBUJA DE TEXTO INTERACTIVA DE CAINE
// ==========================================================================
const frasesCaine = [
    "¡Increíble elección! ¡Tus dientes van a brillar más que un render en 4K!",
    "¡Cuidado con el vacío digital, pero sobre todo... ¡con las caries!",
    "¡Una limpieza profunda mantendrá tus texturas completamente puras!",
    "¡No te preocupes, mi asistente Bubble no muerde... muy seguido!",
    "¡Estupendo! Agendaremos esto en el registro central antes de que pierdas la cordura."
];

function inyectarBurbujaCaine() {
    if (document.getElementById('caine-bubble-container')) return;

    const bubbleHTML = `
        <div id="caine-bubble-container">
            <div class="caine-bubble-text" id="caine-text">¡Hola!</div>
            <img src="imagen/doctor-angulo.png" class="caine-bubble-avatar" alt="Caine Avatar">
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', bubbleHTML);

    const disparadores = document.querySelectorAll('.treatment-item, .btn-circus');
    disparadores.forEach(elemento => {
        elemento.addEventListener('click', (e) => {
            if (elemento.classList.contains('btn-circus') && !document.getElementById('patient-name').value) return;
            lanzarBurbujaCaine();
        });
    });
}

function lanzarBurbujaCaine() {
    const contenedor = document.getElementById('caine-bubble-container');
    const textoBox = document.getElementById('caine-text');
    if (!contenedor || !textoBox) return;

    const fraseAleatoria = frasesCaine[Math.floor(Math.random() * frasesCaine.length)];
    textoBox.innerText = fraseAleatoria;

    contenedor.classList.add('show');

    window.speechSynthesis.cancel();
    const vozBurbuja = new SpeechSynthesisUtterance(fraseAleatoria);
    vozBurbuja.lang = 'es-ES';
    vozBurbuja.rate = 1.1;
    window.speechSynthesis.speak(vozBurbuja);

    setTimeout(() => {
        contenedor.classList.remove('show');
    }, 4500);
}

// ==========================================================================
// 3. EFECTO GLITCH EN LOS PRECIOS
// ==========================================================================
function configurarGlitchPrecios() {
    const cajasPrecio = document.querySelectorAll('.precio-box');
    
    cajasPrecio.forEach(caja => {
        const precioReal = caja.getAttribute('data-precio');
        if (!precioReal) return;

        caja.addEventListener('mouseenter', () => {
            let iteraciones = 0;
            const intervalo = setInterval(() => {
                caja.innerText = "S/. " + (Math.random() * 900 + 100).toFixed(0) + " ¿¿?";
                iteraciones++;
                
                if (iteraciones >= 10) {
                    clearInterval(intervalo);
                    caja.innerText = "S/. " + precioReal;
                }
            }, 60);
        });
    });
}

// ==========================================================================
// 4. CONTADOR DE INACTIVIDAD GLOBAL AUTOMÁTICO (ABSTRACCIÓN POR TIEMPO)
// ==========================================================================
let tiempoInactivo;
let abstraidoGlobal = false;
const audioAbstraccion = new Audio('audio/abstraccion.mp3');

function iniciarContadorAbstraccion() {
    window.addEventListener('mousemove', resetearContador);
    window.addEventListener('keypress', resetearContador);
    window.addEventListener('click', resetearContador);
    window.addEventListener('scroll', resetearContador);

    resetearContador();
}

function resetearContador() {
    if (abstraidoGlobal) return;

    clearTimeout(tiempoInactivo);
    
    const overlay = document.getElementById('abstraction-overlay');
    if (overlay && overlay.getAttribute('data-manual') !== 'true') {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }

    if (overlay && overlay.getAttribute('data-manual') !== 'true') {
        audioAbstraccion.pause();
        audioAbstraccion.currentTime = 0;
    }

    tiempoInactivo = setTimeout(pantallaFinalAbstraccion, 120000); 
}

function pantallaFinalAbstraccion() {
    if (abstraidoGlobal) return;
    abstraidoGlobal = true;

    document.querySelectorAll('audio').forEach(a => a.pause());
    audioAbstraccion.play().catch(e => console.log(e));

    const overlay = document.getElementById('abstraction-overlay');
    if (overlay) {
        overlay.style.pointerEvents = 'all';
        overlay.style.transition = 'opacity 3s ease-in-out';
        overlay.style.opacity = '1';
    }

    setTimeout(() => {
        irAlVacioHTML();
    }, 3000);
}

// ==========================================================================
// 5. MECÁNICA EXCLUSIVA: MUTACIÓN MANUAL POR BOTÓN (TOTAL SILENCIO DE FONDO)
// ==========================================================================
let elElencoEstaCorrompido = false; 
let audioHoverActual = null;

function ejecutarMutacionElenco() {
    if (elElencoEstaCorrompido) return;
    elElencoEstaCorrompido = true;

    const boton = document.getElementById('btn-abstraer-manual');
    if (boton) boton.style.display = 'none';

    document.querySelectorAll('audio').forEach(a => a.pause());

    const overlay = document.getElementById('abstraction-overlay');
    if (overlay) {
        overlay.setAttribute('data-manual', 'true');
        overlay.style.pointerEvents = 'none'; 
        overlay.style.transition = 'opacity 3s ease-in-out';
        overlay.style.opacity = '0.3';
    }

    const integrantes = document.querySelectorAll('.staff-member');
    integrantes.forEach(tarjeta => {
        const tipoId = tarjeta.getAttribute('data-personaje');
        if (!tipoId) return; 

        const imagen = tarjeta.querySelector('img');
        const h3 = tarjeta.querySelector('h3');
        const desc = tarjeta.querySelector('.desc');
        const rol = tarjeta.querySelector('.rol');

        if (h3) {
            h3.innerHTML = `${h3.innerText} <span style="color: #9c27b0; text-shadow: 2px 2px #000; font-family: 'Bungee', sans-serif; font-size: 0.9rem; display: block; margin-top: 5px;">[ABSTRAÍDO]</span>`;
        }
        if (rol) {
            rol.style.color = '#4a148c';
            rol.style.textShadow = '1px 1px #000';
        }
        if (desc) {
            desc.innerText = "???";
            desc.style.color = "#7b1fa2";
            desc.style.fontWeight = "bold";
        }

        if (imagen) {
            if (tipoId === 'angulo') imagen.src = 'imagen/doctor-angulo-abstraido.png';
            if (tipoId === 'quispe') imagen.src = 'imagen/quispe-pomni-abstraido.png';
            if (tipoId === 'oliver') imagen.src = 'imagen/oliver-abstraido.png';
            if (tipoId === 'boza')   imagen.src = 'imagen/boza-abstraido.png';
            
            imagen.style.filter = "grayscale(20%) contrast(140%)";
            tarjeta.style.backgroundColor = "#12001a";
            tarjeta.style.borderColor = "#4a148c";
            tarjeta.style.boxShadow = "0 0 15px #9c27b0";
        }

        tarjeta.addEventListener('mouseenter', () => {
            if (!elElencoEstaCorrompido) return;

            if (audioHoverActual) {
                audioHoverActual.pause();
                audioHoverActual.currentTime = 0;
            }

            let rutaPista = '';
            if (tipoId === 'quispe') rutaPista = 'audio/musica-quispe.mp3';
            if (tipoId === 'boza')   rutaPista = 'audio/musica-boza.mp3';
            if (tipoId === 'oliver') rutaPista = 'audio/musica-oliver.mp3';
            if (tipoId === 'angulo') rutaPista = 'audio/musica-angulo.mp3';

            if (rutaPista !== '') {
                audioHoverActual = new Audio(rutaPista);
                audioHoverActual.volume = 0.85;
                audioHoverActual.play().catch(e => console.log("Audio bloqueado: ", e));
            }
        });

        tarjeta.addEventListener('mouseleave', () => {
            if (audioHoverActual) {
                audioHoverActual.pause();
                audioHoverActual.currentTime = 0;
            }
        });
    });
}