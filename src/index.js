"use strict";

class fast {
  mediaRecorder;
  chunks = [];
  audioURL = null;
  media = null;
  constructor() {}

  open() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(
        (stream) => {
          this.mediaRecorder = new MediaRecorder(stream);

          this.mediaRecorder.ondataavailable = (e) => {
            console.log("push data");
            this.chunks.push(e.data);
          };

          this.mediaRecorder.onstop = (e) => {
            console.log(this.chunks);
            const blob = new Blob(this.chunks, {
              type: "audio/ogg; codecs=opus",
            });
            this.chunks = [];
            this.audioURL = window.URL.createObjectURL(blob);
          };
        },
        () => {
          throw new Error("Authorization failed.");
        }
      );
    } else {
      throw new Error("Browser not support.");
    }
  }

  start() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "recording") {
      console.log("start");
      this.mediaRecorder.start();
    }
  }

  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      console.log("stop");
      this.mediaRecorder.stop();
    }
  }

  getAudio() {
    return this.audioURL;
  }
}
