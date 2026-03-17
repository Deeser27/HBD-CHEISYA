const navLeft = document.getElementById('navLeft');
const navRight = document.getElementById('navRight');
function updateNavZones() {
  const interactiveScenes = [2, 3, 4, 5, 6];
  const shouldDisable = interactiveScenes.includes(currentScene);

  navLeft.classList.toggle('disabled', shouldDisable);
  navRight.classList.toggle('disabled', shouldDisable);
}

const music = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');

const pinDialog = document.getElementById('pinDialog');
const pinInput = document.getElementById('pinInput');
const pinDots = document.getElementById('pinDots');
const pinMessage = document.getElementById('pinMessage');
const pinCard = document.getElementById('pinCard');
const lockTime = document.getElementById('lockTime');
const lockDate = document.getElementById('lockDate');

const galleryModal = document.getElementById('galleryModal');
const galleryPreview = document.getElementById('galleryPreview');
const galleryCaption = document.getElementById('galleryCaption');
const galleryTrack = document.getElementById('galleryTrack');
const galleryDots = document.getElementById('galleryDots');
const galleryInfo = document.getElementById('galleryInfo');

const storyProgress = document.getElementById('storyProgress');
const storyMeta = document.getElementById('storyMeta');
const sceneStage = document.getElementById('sceneStage');
const scenes = Array.from(document.querySelectorAll('.scene'));

const letterContainer = document.getElementById('letterContainer');
const btnLetterNext = document.getElementById('btnLetterNext');

const candleStatus = document.getElementById('candleStatus');
const btnCandleNext = document.getElementById('btnCandleNext');

const pickGrid = document.getElementById('pickGrid');
const pickStatus = document.getElementById('pickStatus');
const loveMeterFill = document.getElementById('loveMeterFill');
const btnPickNext = document.getElementById('btnPickNext');

let isPlaying = false;
let hasUnlocked = false;
let currentScene = 0;
let pinValue = '';
let blownCandles = 0;
let selectedReasons = new Set();
let openedPhotos = new Set();
let touchStartX = 0;
let touchStartY = 0;

const CORRECT_PIN = '270806';

const metaText = [
  'Tekan tombol untuk mulai',
  'Tap kanan untuk lanjut baca',
  'Swipe foto dengan halus',
  'Padamkan semua lilin',
  'Pilih 3 yang paling cocok',
  'Pencet tombol yang benar 😜',
  'Halaman terakhir buat kamu'
];

const letterParts = [
  'Selamat ulang tahun yaaa, sayangku Cheisya Aqila. 🥺💖',
  'Hari ini aku cuma pengen kamu tahu kalau kamu itu spesial banget buat aku.',
  'Bukan cuma karena hari ini hari lahirmu, tapi karena kamu bikin banyak hal terasa lebih indah, lebih hangat, dan lebih berarti anjay kwkwkwk',
  'Semoga di umur kamu yang baru ini, semua hal baik datang pelan-pelan ke hidup kamu.',
  'Semoga kamu selalu sehat, hatinya dijaga, langkahnya dimudahkan, dan semua doa-doa kecil yang kamu simpan diam-diam bisa satu per satu jadi nyata.',
  'Aku bersyukur banget punya kamu. Makasih ya sayang, sudah hadir, bertahan, dan jadi diri kamu yang manis, kuat, dan berharga itu.',
  'Hari ini kamu wajib bahagia. Dan semoga bukan cuma hari ini, tapi seterusnya juga. 🤍✨'
];

const galleryImages = [
  { src: 'foto1.jpeg', title: 'Foto 1', caption: '🤍' },
  { src: 'foto2.jpeg', title: 'Foto 2', caption: ' 🌷' },
  { src: 'foto3.jpeg', title: 'Foto 3', caption: ' ✨' },
  { src: 'foto4.jpeg', title: 'Foto 4', caption: ' 💖' },
  { src: 'foto5.jpeg', title: 'Foto 5', caption: ' 🎀' },
  { src: 'foto6.jpeg', title: 'Foto 6', caption: ' 📸' }
];

let letterIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  buildProgress();
  renderGallery();
  updateProgress();
  updateMeta();
  updateNavZones();
  updateLockScreenTime();
  setInterval(updateLockScreenTime, 1000);
  bindSwipe();
  bindPickCards();
});

pinDialog.addEventListener('cancel', (e) => e.preventDefault());
galleryModal.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeGallery();
});

function updateLockScreenTime() {
  const now = new Date();
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  lockTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  lockDate.textContent = `${hari[now.getDay()]}, ${now.getDate()} ${bulan[now.getMonth()]}`;
}

function buildProgress() {
  storyProgress.innerHTML = scenes.map(() => `
    <div class="progress-segment"><span></span></div>
  `).join('');
}

function updateProgress() {
  const segments = storyProgress.querySelectorAll('.progress-segment');
  segments.forEach((segment, index) => {
    segment.classList.remove('done', 'current');
    if (index < currentScene) segment.classList.add('done');
    if (index === currentScene) segment.classList.add('current');
  });
}

function updateMeta() {
  storyMeta.textContent = metaText[currentScene] || '';
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

function applyViewTransition(updateFn) {
  if (document.startViewTransition) {
    document.startViewTransition(updateFn);
  } else {
    updateFn();
  }
}

function showScene(index) {
  if (index < 0 || index >= scenes.length) return;

  applyViewTransition(() => {
    scenes[currentScene].classList.remove('active');
    currentScene = index;
    scenes[currentScene].classList.add('active');
    updateProgress();
    updateMeta();
    updateNavZones();
  });

  if (currentScene === 6) {
    createConfetti(80);
    launchHeartRain(28);
  }
}

function storyNextTap() {
  if (currentScene === 0) {
    openPinGate();
    return;
  }

  if (currentScene === 1) {
    revealLetterLine();
    return;
  }

  if (currentScene === 2) {
    if (openedPhotos.size >= 2) {
      showScene(3);
    } else {
      pulseElement(galleryInfo);
      galleryInfo.textContent = 'Buka minimal 2 foto dulu yaa 💖';
    }
    return;
  }

  if (currentScene === 3) {
    if (blownCandles === 3) {
      showScene(4);
    } else {
      pulseElement(candleStatus);
    }
    return;
  }

  if (currentScene === 4) {
    if (selectedReasons.size >= 3) {
      showScene(5);
    } else {
      pulseElement(pickStatus);
    }
    return;
  }
}

function storyBack() {
  if (currentScene <= 0) return;
  showScene(currentScene - 1);
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
      pinDialog.close();
      unlockStory();
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

function unlockStory() {
  hasUnlocked = true;
  toggleMusic(true);
  showScene(1);
  if (letterIndex === 0) {
    revealLetterLine();
  }
  createConfetti(20);
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
  if (pinDialog.open) {
    if (/^\d$/.test(e.key)) addPinDigit(e.key);
    else if (e.key === 'Backspace') deletePin();
    else if (e.key === 'Escape') e.preventDefault();
    return;
  }

  if (e.key === 'ArrowRight') storyNextTap();
  if (e.key === 'ArrowLeft') storyBack();
});

function revealLetterLine() {
  if (currentScene !== 1) return;
  if (letterIndex >= letterParts.length) return;

  const line = document.createElement('div');
  line.className = 'letter-line';
  line.textContent = letterParts[letterIndex];
  letterContainer.appendChild(line);
  letterContainer.parentElement.scrollTop = letterContainer.parentElement.scrollHeight;
  letterIndex++;

  if (letterIndex >= letterParts.length) {
    btnLetterNext.classList.remove('hidden');
    storyMeta.textContent = 'Suratnya sudah selesai dibaca 💖';
  }
}

function renderGallery() {
  galleryTrack.innerHTML = galleryImages.map((item, index) => `
    <button class="gallery-card" onclick="openGallery(${index})">
      <img src="${item.src}" alt="${item.caption}">
      <strong>${item.title}</strong>
      <span>${item.caption}</span>
    </button>
  `).join('');

  galleryDots.innerHTML = galleryImages.map((_, index) => `
    <span class="${index === 0 ? 'active' : ''}"></span>
  `).join('');

  galleryTrack.addEventListener('scroll', updateGalleryDots);
}

function updateGalleryDots() {
  const cards = galleryTrack.querySelectorAll('.gallery-card');
  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth + 14;
  const index = Math.round(galleryTrack.scrollLeft / cardWidth);
  const dots = galleryDots.querySelectorAll('span');

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function openGallery(index) {
  const item = galleryImages[index];
  galleryPreview.src = item.src;
  galleryPreview.alt = item.caption;
  galleryCaption.textContent = item.caption;
  galleryModal.showModal();

  openedPhotos.add(index);
  if (openedPhotos.size >= 2) {
    galleryInfo.textContent = 'Yey, kamu sudah buka galeri kita ✨';
    document.getElementById('btnGalleryNext').classList.remove('hidden');
  } else {
    galleryInfo.textContent = `Sudah buka ${openedPhotos.size}/2 foto 💖`;
  }
}

function closeGallery() {
  if (galleryModal.open) galleryModal.close();
}

function blowCandle(element) {
  if (element.classList.contains('off')) return;

  element.classList.add('off');
  blownCandles++;

  const remaining = 3 - blownCandles;

  if (remaining > 0) {
    candleStatus.textContent = `Masih ada ${remaining} lilin yang menyala ✨`;
  } else {
    candleStatus.textContent = 'Yeyy, semua lilinnya padam. Semoga semua harapan kamu terkabul 🤍';
    btnCandleNext.classList.remove('hidden');
    createConfetti(32);
  }
}

function bindPickCards() {
  const cards = pickGrid.querySelectorAll('.pick-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const value = card.dataset.pick;

      if (card.classList.contains('active')) {
        card.classList.remove('active');
        selectedReasons.delete(value);
      } else {
        if (selectedReasons.size >= 3) return;
        card.classList.add('active');
        selectedReasons.add(value);
      }

      updatePickUI();
    });
  });
}

function updatePickUI() {
  const count = selectedReasons.size;
  loveMeterFill.style.width = `${(count / 3) * 100}%`;

  if (count < 3) {
    pickStatus.textContent = `Pilih ${3 - count} lagi ya sayang 💌`;
    btnPickNext.classList.add('hidden');
  } else {
    const words = Array.from(selectedReasons).join(', ');
    pickStatus.textContent = `Iyaa, kamu memang ${words} buat aku 💖`;
    btnPickNext.classList.remove('hidden');
    createConfetti(16);
  }
}

function moveButton() {
  const btnNo = document.getElementById('btnNo');
  const container = document.querySelector('.response-area');

  const rect = container.getBoundingClientRect();
  const maxX = Math.max(rect.width - btnNo.offsetWidth - 10, 0);
  const maxY = Math.max(rect.height - btnNo.offsetHeight - 10, 0);

  btnNo.style.position = 'absolute';
  btnNo.style.left = `${Math.random() * maxX}px`;
  btnNo.style.top = `${Math.random() * maxY}px`;
}

function accepted() {
  showScene(6);
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
    confetti.style.animationDelay = Math.random() * 1.1 + 's';
    confettiContainer.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5200);
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

    setTimeout(() => item.remove(), 6000);
  }
}

function pulseElement(el) {
  el.classList.remove('tap-pulse');
  void el.offsetWidth;
  el.classList.add('tap-pulse');
}

function bindSwipe() {
  sceneStage.addEventListener('touchstart', (e) => {
    if (e.target.closest('.gallery-track')) return;
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  sceneStage.addEventListener('touchend', (e) => {
    if (e.target.closest('.gallery-track')) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = endX - touchStartX;
    const diffY = endY - touchStartY;

    if (Math.abs(diffY) > 80) return;

    if (diffX < -55) {
      storyNextTap();
    } else if (diffX > 55) {
      storyBack();
    }
  }, { passive: true });
}

function sendWA() {
  const phoneNumber = '6281234567890';
  const message = 'Makasii banyak yaa sayang udah bikinin aku web story ulang tahun secantik ini 🥺💖';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function replayJourney() {
  currentScene = 0;
  pinValue = '';
  blownCandles = 0;
  letterIndex = 0;
  selectedReasons = new Set();
  openedPhotos = new Set();

  scenes.forEach(scene => scene.classList.remove('active'));
  scenes[0].classList.add('active');

  updateProgress();
  updateMeta();

  letterContainer.innerHTML = '';
  btnLetterNext.classList.add('hidden');

  document.querySelectorAll('.candle').forEach(candle => {
    candle.classList.remove('off');
  });
  candleStatus.textContent = 'Masih ada 3 lilin yang menyala ✨';
  btnCandleNext.classList.add('hidden');

  document.querySelectorAll('.pick-card').forEach(card => {
    card.classList.remove('active');
  });
  loveMeterFill.style.width = '0%';
  pickStatus.textContent = 'Pilih 3 dulu ya sayang 💌';
  btnPickNext.classList.add('hidden');

  galleryInfo.textContent = 'Buka minimal 2 foto dulu yaa 💖';
  document.getElementById('btnGalleryNext').classList.add('hidden');
  galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
  updateGalleryDots();

  const btnNo = document.getElementById('btnNo');
  btnNo.style.position = 'relative';
  btnNo.style.left = 'auto';
  btnNo.style.top = 'auto';
}

