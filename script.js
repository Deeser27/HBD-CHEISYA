const music = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const typeElement = document.getElementById('typingText');
const progressElement = document.getElementById('typingProgress');
const candleStatus = document.getElementById('candleStatus');

const pinDialog = document.getElementById('pinDialog');
const pinInput = document.getElementById('pinInput');
const pinDots = document.getElementById('pinDots');
const pinMessage = document.getElementById('pinMessage');
const pinCard = document.getElementById('pinCard');
const lockTime = document.getElementById('lockTime');
const lockDate = document.getElementById('lockDate');

const galleryGrid = document.getElementById('galleryGrid');
const galleryModal = document.getElementById('galleryModal');
const galleryPreview = document.getElementById('galleryPreview');
const galleryCaption = document.getElementById('galleryCaption');

let isPlaying = false;
let hasStarted = false;
let charIndex = 0;
let blownCandles = 0;
let pinValue = '';

const CORRECT_PIN = '270806';

const textToType = `Selamat ulang tahun ya, sayangku Cheisya Aqila. 🥺💖

Hari ini aku cuma pengen kamu tahu kalau kamu itu spesial banget buat aku. Bukan cuma karena hari ini hari lahirmu, tapi karena kamu adalah salah satu alasan kenapa banyak hal terasa lebih indah, lebih hangat, dan lebih berarti.

Semoga di umur kamu yang baru ini, semua hal baik datang pelan-pelan ke hidup kamu. Semoga kamu selalu sehat, hatinya dijaga, langkahnya dimudahkan, dan semua doa-doa kecil yang kamu simpan diam-diam bisa satu per satu jadi nyata.

Aku tahu aku mungkin nggak selalu sempurna, tapi satu hal yang pasti: aku bersyukur banget punya kamu. Makasih ya, sayang, sudah hadir, sudah bertahan, dan sudah jadi Cheisya Aqila yang manis, kuat, dan berharga itu.

Hari ini, kamu wajib bahagia.
Dan semoga bukan cuma hari ini, tapi seterusnya juga. 🤍✨`;

const galleryImages = [
  { src: 'foto1.jpg', caption: 'Foto favorit aku yang ini 🤍' },
  { src: 'foto2.jpg', caption: 'Cantik banget di foto ini 🌷' },
  { src: 'foto3.jpg', caption: 'Momen kecil yang aku suka ✨' },
  { src: 'foto4.jpg', caption: 'Kalau senyum gini aku kalah 💖' },
  { src: 'foto5.jpg', caption: 'Lucu, manis, dan spesial 🎀' },
  { src: 'foto6.jpg', caption: 'Simpan banyak foto favorit di sini 📸' }
];

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  renderGallery();
  updateLockScreenTime();
  setInterval(updateLockScreenTime, 1000);
});

pinDialog.addEventListener('cancel', (e) => {
  e.preventDefault();
});

galleryModal.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeGallery();
});

function updateLockScreenTime() {
  const now = new Date();
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const jam = String(now.getHours()).padStart(2, '0');
  const menit = String(now.getMinutes()).padStart(2, '0');

  lockTime.textContent = `${jam}:${menit}`;
  lockDate.textContent = `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]}`;
}

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const emojis = ['💖', '✨', '🎂', '🎉', '🌷', '🤍', '🎈'];

  particlesContainer.innerHTML = '';

  for (let i = 0; i < 18; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
    particle.style.fontSize = (Math.random() * 1 + 0.9) + 'rem';
    particlesContainer.appendChild(particle);
  }
}

function openPinGate() {
  resetPin();
  pinDialog.showModal();
  setTimeout(() => pinInput.focus(), 100);
}

function resetPin() {
  pinValue = '';
  pinInput.value = '';
  pinMessage.textContent = 'Hint: format DDMMYY yaa';
  pinMessage.className = 'pin-message';
  updatePinDots();
}

function updatePinDots() {
  const dots = pinDots.querySelectorAll('span');
  dots.forEach((dot, index) => {
    dot.classList.toggle('filled', index < pinValue.length);
  });
}

function addPinDigit(digit) {
  if (pinValue.length >= 6) return;
  pinValue += digit;
  pinInput.value = pinValue;
  updatePinDots();

  if (pinValue.length === 6) {
    checkPin();
  }
}

function deletePin() {
  pinValue = pinValue.slice(0, -1);
  pinInput.value = pinValue;
  updatePinDots();
}

function clearPin() {
  pinValue = '';
  pinInput.value = '';
  updatePinDots();
}

function checkPin() {
  if (pinValue === CORRECT_PIN) {
    pinMessage.textContent = 'Yey benar, lanjut ya sayang 💖';
    pinMessage.className = 'pin-message success';

    setTimeout(() => {
      if (pinDialog.open) pinDialog.close();
      startJourney();
      createConfetti(28);
    }, 450);
  } else {
    pinMessage.textContent = 'Salahh, coba ingat lagi yaa 🥺';
    pinMessage.className = 'pin-message error';
    pinCard.classList.add('shake');

    setTimeout(() => {
      pinCard.classList.remove('shake');
      clearPin();
    }, 450);
  }
}

pinInput.addEventListener('input', (e) => {
  pinValue = e.target.value.replace(/\D/g, '').slice(0, 6);
  pinInput.value = pinValue;
  updatePinDots();

  if (pinValue.length === 6) {
    checkPin();
  }
});

document.addEventListener('keydown', (e) => {
  if (!pinDialog.open) return;

  if (/^\d$/.test(e.key)) {
    addPinDigit(e.key);
  } else if (e.key === 'Backspace') {
    deletePin();
  } else if (e.key === 'Escape') {
    e.preventDefault();
  }
});

function startJourney() {
  if (!hasStarted) {
    hasStarted = true;
    toggleMusic(true);
  }

  nextSection(2);
  typeWriter();
}

function nextSection(id) {
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });

  const target = document.getElementById(`section${id}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function toggleMusic(forcePlay = false) {
  if (forcePlay || !isPlaying) {
    music.play().then(() => {
      isPlaying = true;
      musicIcon.className = 'fas fa-volume-up';
    }).catch(() => {
      musicIcon.className = 'fas fa-music';
    });
  } else {
    music.pause();
    isPlaying = false;
    musicIcon.className = 'fas fa-music';
  }
}

function typeWriter() {
  typeElement.innerHTML = '';
  progressElement.style.width = '0%';
  charIndex = 0;

  function type() {
    if (charIndex < textToType.length) {
      typeElement.innerHTML += textToType.charAt(charIndex);
      charIndex++;

      const progress = (charIndex / textToType.length) * 100;
      progressElement.style.width = progress + '%';

      const randomSpeed = Math.random() * 25 + 18;
      setTimeout(type, randomSpeed);
    } else {
      document.getElementById('nextBtn2').classList.remove('hidden');
    }
  }

  type();
}

function blowCandle(element) {
  if (element.classList.contains('off')) return;

  element.classList.add('off');
  blownCandles++;

  const remaining = 3 - blownCandles;

  if (remaining > 0) {
    candleStatus.innerHTML = `Masih ada ${remaining} lilin yang menyala ✨`;
  } else {
    candleStatus.innerHTML = 'Yeyy, semua lilinnya sudah padam. Semoga semua harapan kamu terkabul ya, sayang 🤍';
    document.getElementById('nextBtn3').classList.remove('hidden');
    createConfetti(35);
  }
}

function renderGallery() {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = galleryImages.map((item, index) => `
    <button class="gallery-item" onclick="openGallery(${index})">
      <img src="${item.src}" alt="${item.caption}">
      <span>Foto ${index + 1}</span>
    </button>
  `).join('');
}

function openGallery(index) {
  const item = galleryImages[index];
  galleryPreview.src = item.src;
  galleryPreview.alt = item.caption;
  galleryCaption.textContent = item.caption;
  galleryModal.showModal();
}

function closeGallery() {
  if (galleryModal.open) galleryModal.close();
}

function checkAnswer(element) {
  const feedback = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('nextBtn6');
  const options = document.querySelectorAll('.option');

  options.forEach(opt => {
    opt.style.pointerEvents = 'none';
  });

  if (element.dataset.answer === 'correct') {
    element.classList.add('correct');
    feedback.innerHTML = 'Tepat banget. Hari ini memang harinya Cheisya Aqila, pacar aku yang paling aku sayang. 💖';
    feedback.className = 'feedback success';
    nextBtn.classList.remove('hidden');
    createConfetti(20);
  } else {
    element.classList.add('wrong');
    feedback.innerHTML = 'Hehe salah. Coba lagi ya, jawabannya yang paling cantik dan paling spesial itu.';
    feedback.className = 'feedback error';

    setTimeout(() => {
      element.classList.remove('wrong');
      options.forEach(opt => {
        opt.style.pointerEvents = 'auto';
      });
      feedback.innerHTML = '';
      feedback.className = 'feedback';
    }, 1400);
  }
}

function moveButton() {
  const btnNo = document.getElementById('btnNo');
  const container = document.querySelector('.response-buttons');

  const containerRect = container.getBoundingClientRect();
  const maxX = Math.max(containerRect.width - btnNo.offsetWidth - 10, 0);
  const maxY = Math.max(containerRect.height - btnNo.offsetHeight - 10, 0);

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  btnNo.style.position = 'absolute';
  btnNo.style.left = `${randomX}px`;
  btnNo.style.top = `${randomY}px`;
}

function accepted() {
  nextSection(8);
  createConfetti(120);
  launchHeartRain(40);

  music.pause();
  setTimeout(() => {
    music.currentTime = 0;
    music.play().catch(() => {});
    isPlaying = true;
    musicIcon.className = 'fas fa-volume-up';
  }, 300);
}

function createConfetti(amount = 80) {
  const confettiContainer = document.getElementById('confettiContainer');
  const emojis = ['🎉', '💖', '✨', '🎂', '🌷', '🤍', '🎈'];

  for (let i = 0; i < amount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.fontSize = (Math.random() * 1.2 + 1) + 'rem';
    confetti.style.animationDuration = (Math.random() * 2.5 + 3) + 's';
    confetti.style.animationDelay = Math.random() * 1.2 + 's';
    confettiContainer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 5200);
  }
}

function launchHeartRain(amount = 30) {
  const heartRain = document.getElementById('heartRain');
  const emojis = ['💖', '🤍', '✨', '🌷'];

  for (let i = 0; i < amount; i++) {
    const item = document.createElement('div');
    item.className = 'falling-heart';
    item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    item.style.left = Math.random() * 100 + '%';
    item.style.fontSize = (Math.random() * 1 + 1) + 'rem';
    item.style.animationDuration = (Math.random() * 2.5 + 3.5) + 's';
    item.style.animationDelay = Math.random() * 1.5 + 's';
    heartRain.appendChild(item);

    setTimeout(() => {
      item.remove();
    }, 6000);
  }
}

function sendWA() {
  const phoneNumber = '6281234567890';
  const message = 'Makasii banyak yaa sayang udah bikinin aku web ulang tahun secantik ini 🥺💖';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

function replayJourney() {
  blownCandles = 0;
  charIndex = 0;
  pinValue = '';

  document.querySelectorAll('.candle').forEach(candle => {
    candle.classList.remove('off');
  });

  const nextBtn2 = document.getElementById('nextBtn2');
  const nextBtn3 = document.getElementById('nextBtn3');
  const nextBtn6 = document.getElementById('nextBtn6');
  const feedback = document.getElementById('quizFeedback');
  const btnNo = document.getElementById('btnNo');

  nextBtn2.classList.add('hidden');
  nextBtn3.classList.add('hidden');
  nextBtn6.classList.add('hidden');

  feedback.innerHTML = '';
  feedback.className = 'feedback';

  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.remove('correct', 'wrong');
    opt.style.pointerEvents = 'auto';
  });

  candleStatus.innerHTML = 'Masih ada 3 lilin yang menyala ✨';

  btnNo.style.position = 'relative';
  btnNo.style.left = 'auto';
  btnNo.style.top = 'auto';

  nextSection(1);
}
