import Brain from "./brain";
export default class Peon {
  self = null;

  cb = null;

  // setState index.js to change state
  setState = null;

  // notify core js
  notify = null;

  constructor() {
    this.self = new Worker(
      URL.createObjectURL(
        new Blob([`(${Brain.toString()})()`], {
          type: "application/javascript",
        })
      )
    );

    this.self.onmessage = (e) => {
      if (typeof this.cb == "function") {
        this.cb(e.data.blob);
      } else {
        throw Error("Callback should be a function.");
      }

      if (typeof this.setState == "function") {
        this.setState();
      }
    };
  }

  record(buffer) {
    this.self.postMessage({
      cmd: "record",
      buffer,
    });
  }

  init(config) {
    this.self.postMessage({
      cmd: "init",
      config,
    });
  }

  export(type, cb, setState) {
    this.cb = cb;
    this.setState = setState;
    this.self.postMessage({
      cmd: "export",
      type,
    });
  }

  release() {
    this.self.postMessage({
      cmd: "release",
    });
  }
}
