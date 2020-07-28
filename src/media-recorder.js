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
      console.log(e.data);
    };

    this.mediaRecorder.onstop = (e) => {
      const blob = new Blob(this.chunks, {
        type: "audio/ogg; codecs=opus",
      });
      this.chunks = [];
      const url = window.URL.createObjectURL(blob);
      this.cb(url);
    };
  }

  start() {
    if (this.state !== "recording") {
      this.mediaRecorder.start();
    }
  }

  stop(cb) {
    if (this.state === "recording") {
      this.cb = cb;
      this.mediaRecorder.stop();
    }
  }
}
