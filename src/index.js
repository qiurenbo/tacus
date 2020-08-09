"use strict";
import { AudioContextRecorder } from "./audio-context";

class Fast {
  recorder;

  constructor(config) {
    this.recorder = new AudioContextRecorder(config);
  }

  setConfig(config) {
    this.recorder.setConfig(config);
  }

  start() {
    this.recorder.start();
  }

  stop() {
    this.recorder.stop();
  }

  pause() {
    this.recorder.pause();
  }

  resume() {
    this.recorder.resume();
  }

  export(audioType, cb) {
    this.recorder.export(audioType, cb);
  }
}

export default Fast;
