export class _MediaRecorder {
  mediaRecorder = null;
  chunks = [];
  cb = null;

  get state() {
    return this.mediaRecorder.state;
  }

  constructor(stream) {
    this.mediaRecorder = new MediaRecorder(stream);

    this.addListeners();
  }

  addListeners() {
    this.mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    this.mediaRecorder.onstop = (e) => {
      const blob = new Blob(this.chunks);
      const url = window.URL.createObjectURL(blob);
      this.cb(url);
    };
  }

  start() {
    if (this.state === "inactive") {
      this.mediaRecorder.start();
    }
  }

  pause() {
    if (this.state === "recording") {
      mediaRecorder.pause();
      // recording paused
    }
  }

  resume() {
    if (this.state === "paused") {
      this.mediaRecorder.resume();
    }
  }

  stop(cb) {
    if (this.state === "recording" || this.state === "paused") {
      this.cb = cb;
      this.mediaRecorder.stop();
    }
  }

  clear() {
    this.chunks = [];
  }
}
