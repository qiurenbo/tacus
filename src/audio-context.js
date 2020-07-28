export class _MediaRecorder {
  recorder = null;
  chunks = [];
  url = null;

  get state() {
    return this.recorder.state;
  }

  constructor(stream) {
    this.recorder = new AudioContext(stream);
    this.addListeners();
  }

  addListeners() {
    this.recorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    this.recorder.onstop = (e) => {
      const blob = new Blob(this.chunks, {
        type: "audio/ogg; codecs=opus",
      });
      this.chunks = [];
      this.url = window.URL.createObjectURL(blob);
    };
  }

  start() {
    if (this.state !== "recording") {
      this.recorder.start();
    }
  }

  stop() {
    if (this.state === "recording") {
      this.recorder.stop();
    }
  }
}
