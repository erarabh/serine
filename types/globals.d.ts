// types/globals.d.ts

export {};

declare global {
  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
  }

  interface SpeechRecognitionResult {
    0: SpeechRecognitionAlternative;
    length: number;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  interface SpeechRecognitionResultList {
    0: SpeechRecognitionResult;
    length: number;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }

  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}
