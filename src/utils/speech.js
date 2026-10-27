// Web Speech Synthesis utility for native Korean pronunciation

let isSpeechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;
let selectedVoice = null;

const initVoices = () => {
  if (!isSpeechAvailable) return;
  const voices = window.speechSynthesis.getVoices();
  // Try to find a Korean voice
  selectedVoice = voices.find(v => v.lang === 'ko-KR' || v.lang.startsWith('ko')) || null;
};

if (typeof window !== 'undefined' && isSpeechAvailable) {
  initVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = initVoices;
  }
}

export const speakKorean = (text, rate = 0.88) => {
  if (!isSpeechAvailable || !text) return;

  // Clean text from markdown or special symbols
  const cleanText = text.replace(/[\*\_\[\]\(\)\-\~]/g, ' ').trim();
  if (!cleanText) return;

  try {
    window.speechSynthesis.cancel(); // Stop any currently playing audio
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = rate; // Slightly slower for language learners
    utterance.pitch = 1.0;

    if (!selectedVoice) {
      initVoices();
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

export const stopSpeech = () => {
  if (isSpeechAvailable) {
    window.speechSynthesis.cancel();
  }
};
