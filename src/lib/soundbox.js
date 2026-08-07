/**
 * UniPay Voice Soundbox & Audio Notification Utility
 */

export function playSoundboxVoice(message, lang = 'hi-IN') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = lang;
    utterance.rate = 0.95; // Clear natural speed
    utterance.pitch = 1.05; // Friendly soundbox tone
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Soundbox speech notice:', e.message);
  }
}

export function playBeepSound(type = 'success') {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (type === 'success') {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5 chime
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
    }

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

export function announceCreditSoundbox(amount, merchantName = '') {
  playBeepSound('success');
  setTimeout(() => {
    const speechText = `UniPay par ${amount.toLocaleString('en-IN')} rupaye praapt hue!`;
    playSoundboxVoice(speechText, 'hi-IN');
  }, 250);
}
