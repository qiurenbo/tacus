"use strict";
import { _MediaRecorder } from "./media-recorder/media-recorder";
import { _CompatibleAudio } from "./audio-context/compatible/compatible-recorder";

class fast {
  recorder;

  config = {
    method: "AudioContext",
    mimeType: "audio/wav",

    // same as https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
    bufferLen: 4096,
    numberOfInputChannels: 1,
    numberOfOutputChannels: 1,

    // same as https://developer.mozilla.org/en-US/docs/Web/API/AudioContextOptions
    latencyHint: "interactive",
    sampleRate: 16000,

    bitDepth: 16,
  };

  constructor(config) {
    Object.assign(this.config, config);
  }

  open() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(
        (stream) => {
          if (this.config.method === "MediaRecorder") {
            this.recorder = new _MediaRecorder(stream);
          } else if (this.config.method === "AudioContext") {
            this.recorder = new _CompatibleAudio(stream, this.config);
          } else {
            throw new Error("Unsupported method.");
          }
        },
        () => {
          throw new Error("Authorization failed.");
        }
      );
    } else {
      throw new Error("Unsupported Browser.");
    }
  }

  start() {
    this.recorder.start();
  }

  stop(cb) {
    this.recorder.stop(cb);
  }

  pause() {
    this.recorder.pause();
  }

  clear() {
    this.recorder.clear();
  }

  resume(cb) {
    this.recorder.resume(cb);
  }

  export(type, isBob = true, cb) {
    this.recorder.export(type, isBob, cb);
  }
}

export default fast;
