let timer;
let endTime;
let isRunning = false;
let remainingTime = 25 * 60; // default 25 menit

const display = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const setBtn = document.getElementById('set-time-btn');
const timeInput = document.getElementById('time-input');

// Menambahkan elemen audio untuk alarm
const alarmAudio = new Audio('alarm.mp3'); // Pastikan path-nya benar

// Tampilkan waktu ke layar
function updateDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Simpan ke localStorage
function saveTimer() {
  localStorage.setItem('endTime', endTime);
  localStorage.setItem('isRunning', isRunning);
}

// Load dari localStorage
function loadTimer() {
  const savedEnd = localStorage.getItem('endTime');
  const savedRunning = localStorage.getItem('isRunning') === 'true';

  if (savedEnd && savedRunning) {
    const diff = Math.round((parseInt(savedEnd) - Date.now()) / 1000);
    if (diff > 0) {
      remainingTime = diff;
      endTime = parseInt(savedEnd);
      startTimer(true); // true untuk memulai tanpa reset ulang
    } else {
      localStorage.clear(); // waktu habis
    }
  }
}

// Mulai timer
function startTimer(fromLoad = false) {
  if (isRunning && !fromLoad) return;

  isRunning = true;
  endTime = fromLoad ? endTime : Date.now() + remainingTime * 1000;
  saveTimer();
  updateDisplay(remainingTime);

  timer = setInterval(() => {
    const diff = Math.round((endTime - Date.now()) / 1000);

    if (diff >= 0) {
      remainingTime = diff;
      updateDisplay(diff);
    } else {
      clearInterval(timer);
      isRunning = false;
      remainingTime = 0;
      updateDisplay(0);
      localStorage.clear();

      // Mainkan suara alarm ketika waktu habis
      alarmAudio.play(); // Menjalankan suara alarm

      Swal.fire({
        title: '🎉 Waktu Habis!',
        html: 'Selamat Angga!<br>Kamu sudah menyelesaikan misinya ✨',
        icon: 'success',
        background: 'rgba(0, 0, 0)',
        color: '#fff',
        confirmButtonText: 'Mantap!',
        confirmButtonColor: '#4caf50',
        backdrop: `
          rgba(255, 255, 255, 0.4)
          center top
          no-repeat
        `,
        customClass: {
          popup: 'glass-alert'
        }
      });
    }
  }, 1000);
}

// Pause timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  saveTimer();
}

// Reset timer
function resetTimer() {
  pauseTimer();
  localStorage.clear();
  remainingTime = parseInt(timeInput.value) * 60;
  updateDisplay(remainingTime);
}

// Set timer baru
function setTimer() {
  pauseTimer();
  localStorage.clear();
  remainingTime = parseInt(timeInput.value) * 60;
  updateDisplay(remainingTime);
}

// Event listener
startBtn.addEventListener('click', () => startTimer());
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
setBtn.addEventListener('click', setTimer);

// Jalankan saat halaman dibuka
updateDisplay(remainingTime);
loadTimer(); // <== Ini penting untuk nge-load waktu jika ada
