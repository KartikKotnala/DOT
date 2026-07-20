import { ref } from 'vue';

export function useVoice(onTranscriptResult) {
  const isListening = ref(false);
  
  // Cross-browser prefix matching
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false; // Stops processing as soon as user stops talking
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => { isListening.value = true; };
    recognition.onend = () => { isListening.value = false; };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onTranscriptResult) {
        onTranscriptResult(transcript);
      }
    };
    
    recognition.onerror = (err) => {
      console.error("Speech detection error:", err);
      isListening.value = false;
    };
  }

  const startListening = () => {
    if (recognition && !isListening.value) {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Optional voice response back to user
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return { 
    isListening, 
    startListening, 
    speakText, 
    hasVoiceSupport: !!SpeechRecognition 
  };
}