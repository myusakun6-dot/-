(function () {
  const clockEl = document.getElementById('clock');
  const alarmInput = document.getElementById('alarm-time');
  const setBtn = document.getElementById('set-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const statusEl = document.getElementById('status');

  let alarmTime = null;
  let ringing = false;
  let audioCtx = null;
  let gainNode = null;
  let oscillator = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateClock() {
    const now = new Date();
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    clockEl.textContent = `${hh}:${mm}:${ss}`;

    if (alarmTime && !ringing) {
      const current = `${hh}:${mm}`;
      if (current === alarmTime && now.getSeconds() === 0) {
        triggerAlarm();
      }
    }
  }

  function triggerAlarm() {
    ringing = true;
    statusEl.textContent = 'アラーム！';
    statusEl.className = 'status ringing';
    cancelBtn.disabled = false;
    startBeep();
  }

  function startBeep() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.4;
    gainNode.connect(audioCtx.destination);

    function beepOnce() {
      if (!ringing) return;
      oscillator = audioCtx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      oscillator.connect(gainNode);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
      oscillator.onended = () => {
        if (ringing) setTimeout(beepOnce, 700);
      };
    }
    beepOnce();
  }

  function stopAlarm() {
    ringing = false;
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
  }

  setBtn.addEventListener('click', () => {
    const val = alarmInput.value;
    if (!val) {
      alert('アラームの時刻を選択してください');
      return;
    }
    stopAlarm();
    alarmTime = val;
    statusEl.textContent = `${val} にアラームをセットしました`;
    statusEl.className = 'status active';
    cancelBtn.disabled = false;
  });

  cancelBtn.addEventListener('click', () => {
    stopAlarm();
    alarmTime = null;
    statusEl.textContent = 'アラームをキャンセルしました';
    statusEl.className = 'status';
    cancelBtn.disabled = true;
  });

  setInterval(updateClock, 1000);
  updateClock();
})();
