declare global {
  interface Window {
    SpeechRecognition?: typeof window.SpeechRecognition;
    webkitSpeechRecognition?: typeof window.webkitSpeechRecognition;
  }
}

// Prevent TypeScript from treating this file as a module
export {};
