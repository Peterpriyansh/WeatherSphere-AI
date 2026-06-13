function initVoiceSearch(onTranscript) {
  const btn = document.getElementById("voiceBtn");
  if (!btn) return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    btn.disabled = true;
    btn.title = "Voice search not supported";
    btn.textContent = "×";
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let listening = false;

  btn.addEventListener("click", () => {
    if (listening) {
      recognition.stop();
      return;
    }
    recognition.start();
  });

  recognition.onstart = () => {
    listening = true;
    btn.classList.add("recording");
    btn.title = "Listening...";
  };

  recognition.onend = () => {
    listening = false;
    btn.classList.remove("recording");
    btn.title = "Voice search";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    if (typeof onTranscript === "function") onTranscript(transcript);
  };

  recognition.onerror = () => {
    listening = false;
    btn.classList.remove("recording");
  };

  return recognition;
}

window.AtmosVoice = {
  initVoiceSearch
};