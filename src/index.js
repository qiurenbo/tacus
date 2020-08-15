import Core from "./core";
import createStore from "./manager";

export class Psittacus {
  core;
  store;

  constructor(config) {
    this.core = new Core(config);
    this.store = createStore(this.reducer);
  }

  reducer = (state = "stopped", action = { type: "stop" }) => {
    console.debug(state, action);
    switch (action.type) {
      case "play":
        if (state === "stopped" || state === "paused") {
          if (this.core.isRecorded) {
            this.core.play(() => {
              this.store.dispatch({ type: "stop" });
            });
            return "playing";
          } else {
            return "stopped";
          }
        }
        break;
      case "record":
        if (state === "stopped" || state === "paused") {
          this.core.record();
          return "recording";
        }
        break;
      case "stop":
        if (state === "recording") {
          this.core.stop();
          return "stopped";
        } else if (state === "playing") {
          return "stopped";
        } else if (state === "exporting") {
          return "stopped";
        }
        // only for init stopped state
        else if (state === "stopped") {
          return "stopped";
        }
        break;
      case "pause":
        if (state === "playing") {
          this.core.pausePlaying();
          return "playPaused";
        }
        if (state === "recording") {
          this.core.pauseRecording();
          return "recordPaused";
        }
        break;
      case "resume":
        if (state === "playPaused") {
          this.core.resumePlaying();
          return "playing";
        }
        if (state === "recordPaused") {
          this.core.resumeRecording();
          return "recording";
        }
        break;
      case "export":
        if (state === "stopped" || state === "paused") {
          this.core.export(action.payload.type, action.payload.cb, () => {
            this.store.dispatch({ type: "stop" });
          });
          return "exporting";
        }
        break;
      case "set":
        // setting not change the state
        if (state === "stopped") {
          this.core.setConfig(action.payload.config);
        }
        break;
    }

    return state;
  };

  record() {
    this.store.dispatch({ type: "record" });
  }

  play() {
    this.store.dispatch({ type: "play" });
  }

  stop() {
    this.store.dispatch({ type: "stop" });
  }

  pause() {
    this.store.dispatch({ type: "pause" });
  }

  resume() {
    this.store.dispatch({ type: "resume" });
  }

  export(type, cb) {
    this.store.dispatch({ type: "export", payload: { type, cb } });
  }

  setConfig(config) {
    this.store.dispatch({ type: "set", payload: { config } });
  }

  getState() {
    return this.store.getState();
  }
}
