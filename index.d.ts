export class Tacus {
  constructor(options?: { bufferSize?: number; sampleRate?: number });

  start(): void;

  stop(): void;

  pause(): void;

  resume(): void;

  play(): void;

  exportWAV(): void;

  download(): void;
}
