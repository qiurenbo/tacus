"use strict";
import { _CompatibleAudio } from "./audio-context";

class fast {
  recorder;

  constructor(config) {
    this.recorder = new _CompatibleAudio(config);
  }

  setConfig() {
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

  clear() {
    this.recorder.clear();
  }

  resume() {
    this.recorder.resume();
  }

  export(type, isBob = true, cb) {
    this.recorder.export(type, isBob, cb);
  }
}

export default fast;
