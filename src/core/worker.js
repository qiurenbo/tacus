export default class SelfWorker {
  worker = null;

  cb = null;

  constructor(f) {
    this.worker = new Worker(
      URL.createObjectURL(
        new Blob([`(${f.toString()})()`], { type: "application/javascript" })
      )
    );

    this.worker.onmessage = (e) => {
      if (typeof this.cb == "function") {
        this.cb(e.data.blob);
      } else {
        throw Error("Callback should be a function.");
      }
    };
  }

  record(buffer) {
    this.worker.postMessage({
      cmd: "record",
      buffer,
    });
  }

  init(config) {
    this.worker.postMessage({
      cmd: "init",
      config,
    });
  }

  export(audioType, cb) {
    this.cb = cb;
    this.worker.postMessage({
      cmd: "export",
      audioType,
    });
  }

  release() {
    this.worker.postMessage({
      cmd: "release",
    });
  }
}
