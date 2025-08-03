declare global {
  interface Window {
    SpeechRecognition?: typeof window.SpeechRecognition;
    webkitSpeechRecognition?: typeof window.webkitSpeechRecognition;
  }
}

// Fix for third-party module lacking types
declare module 'papaparse';
declare module 'file-saver';


// Prevent TypeScript from treating this file as a module
export {};
