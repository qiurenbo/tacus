"use strict";
import { _MediaRecorder } from "./media-recorder";
class fast {
  recorder;
  config = { method: "MediaRecorder" };

  constructor(config) {
    this.config = config || this.config;
  }

  open() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(
        (stream) => {
          if (this.config.method === "MediaRecorder") {
            this.recorder = new _MediaRecorder(stream);
          } else if (this.config.method === "AudioContext") {
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
}

export default fast;
