/**
 * BODA EVA & JUAN CARLOS - JAVASCRIPT DE INTERACCIÓN
 * Incluye: Apertura de Sobre, Reproductor de Música, Contador Regresivo,
 * Generador de Calendario .ICS, Modal de Confirmación WhatsApp y Pétalos Flotantes.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos principales
  const envelopeScreen = document.getElementById('envelope-screen');
  const btnOpenEnvelope = document.getElementById('btn-open-envelope');
  const waxSealWrapper = document.getElementById('wax-seal-wrapper');
  
  const bgAudio = document.getElementById('bg-audio');
  const musicFloating = document.getElementById('music-control-floating');
  
  // 1. APERTURA DE SOBRE E INICIO DE MÚSICA
  function openInvitation() {
    if (envelopeScreen) {
      envelopeScreen.classList.add('opened');
      setTimeout(() => {
        envelopeScreen.style.display = 'none';
      }, 1000);
    }
    
    // Iniciar música
    if (bgAudio) {
      bgAudio.play().then(() => {
        musicFloating.classList.add('playing');
      }).catch(err => {
        console.log('Autoplay prevenido por navegador, listo para clic manual:', err);
      });
    }
  }

  if (btnOpenEnvelope) {
    btnOpenEnvelope.addEventListener('click', openInvitation);
  }
  if (waxSealWrapper) {
    waxSealWrapper.addEventListener('click', openInvitation);
  }

  // 2. CONTROLADOR DE MÚSICA FLOTANTE
  if (musicFloating && bgAudio) {
    musicFloating.addEventListener('click', () => {
      if (bgAudio.paused) {
        bgAudio.play().then(() => {
          musicFloating.classList.add('playing');
        }).catch(e => console.error(e));
      } else {
        bgAudio.pause();
        musicFloating.classList.remove('playing');
      }
    });

    bgAudio.addEventListener('play', () => {
      musicFloating.classList.add('playing');
    });

    bgAudio.addEventListener('pause', () => {
      musicFloating.classList.remove('playing');
    });
  }

  // 3. CONTADOR REGRESIVO
  // Fecha objetivo: Sábado 28 de Noviembre de 2026 a las 17:00:00 (Hora de Guatemala UTC-6)
  const weddingDate = new Date('2026-11-28T17:00:00-06:00').getTime();

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. AGENDAR EN CALENDARIO (Descarga de archivo .ICS y Google Calendar)
  const btnCalendar = document.getElementById('btn-add-calendar');
  if (btnCalendar) {
    btnCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Boda Eva y Juan Carlos//Invitacion Digital//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:boda-eva-juancarlos-20261128@tadi.gt',
        'DTSTAMP:20261013T120000Z',
        'DTSTART:20261128T230000Z', // 17:00 UTC-6 = 23:00 UTC
        'DTEND:20261129T080000Z',
        'SUMMARY:Nuestra Boda - Eva y Juan Carlos',
        'DESCRIPTION:Ceremonia religiosa: Iglesia San Lucas Evangelista (17:00 hrs). Recepción: Casa Toribia, San Lucas Sacatepéquez (18:30 hrs). ¡Te esperamos!',
        'LOCATION:Iglesia San Lucas Evangelista, San Lucas Sacatepéquez, Guatemala',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Boda_Eva_y_Juan_Carlos.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // 5. ANIMACIÓN DE PÉTALOS DE ROSA FLOTANTES (CANVAS)
  initPetals();
});

function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth || 480;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // Paleta de pétalos: Vino tinto, blanco marfil, rubor sutil
  const petalColors = [
    'rgba(101, 0, 30, 0.55)',   // Vino tinto
    'rgba(132, 24, 52, 0.45)',  // Borgoña claro
    'rgba(255, 248, 240, 0.7)',  // Blanco marfil
    'rgba(223, 190, 122, 0.5)'   // Oro suave
  ];

  const totalPetals = 22;
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = 9 + Math.random() * 11;
      this.speedY = 0.8 + Math.random() * 1.4;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.04;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.7;
      this.angle += this.angularSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Dibujar forma de pétalo orgánico
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.75, -this.size * 0.6, this.size * 0.75, this.size * 0.6, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.75, this.size * 0.6, -this.size * 0.75, -this.size * 0.6, 0, -this.size);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < totalPetals; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
