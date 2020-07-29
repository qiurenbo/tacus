export class _MediaRecorder {
  mediaRecorder = null;
  chunks = [];
  config = {
    mimeType: "audio/webm;codecs=opus",
  };

  cb = null;

  get state() {
    return this.mediaRecorder.state;
  }

  constructor(stream, config) {
    if (config.mimeType) {
      this.config.mimeType = config.mimeType;
    }

    if (!MediaRecorder.isTypeSupported(this.config.mimeType)) {
      throw new Error("Unsupported MIME Type.");
    }

    console.log(this.config);
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: this.config.mimeType,
    });

    this.addListeners();
  }

  addListeners() {
    this.mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };

    this.mediaRecorder.onstop = (e) => {
      const blob = new Blob(this.chunks, { type: this.config.mimeType });
      this.chunks = [];
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
      this.cb = cb;
      this.mediaRecorder.resume();
    }
  }

  stop(cb) {
    if (this.state === "recording" || this.state === "paused") {
      this.cb = cb;
      this.mediaRecorder.stop();
    }
  }
}
