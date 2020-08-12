import Core from "./core";
import createStore from "./manager";
export class Psittacus {
  core;
  store;
  state = "initializing";

  constructor(config) {
    this.core = new Core(config);
    this.store = createStore(this.reducer);
  }

  reducer = (state = "stopped", action = { type: "stopped" }) => {
    console.log(action);
    switch (action.type) {
      case "playing":
        if (state === "stopped" || state === "paused") {
          this.core.play();
          return action.type;
        }
        break;
      case "recording":
        if (state === "stopped" || state === "paused") {
          this.core.record();
          return action.type;
        }
        break;
      case "stopped":
        if (state === "playing" || state === "recording") {
          this.core.stop();
          return action.type;
        }
        break;
      case "paused":
        if (state === "playing" || state === "recording") {
          this.core.pause();
          return action.type;
        }
        break;
      case "exporting":
        if (state === "stopped" || state === "paused") {
          this.core.export(action.payload.type, action.payload.cb);
          return action.type;
        }
        break;
      case "setting":
        // setting not change the state
        if (state === "stopped") {
          this.core.setConfig(action.payload.config);
          return state;
        }
        break;
    }

    return state;
  };

  record() {
    this.store.dispatch({ type: "recording" });
  }

  play() {
    this.store.dispatch({ type: "playing" });
  }

  stop() {
    this.store.dispatch({ type: "stopped" });
  }

  pause() {
    this.store.dispatch({ type: "paused" });
  }

  export(type, cb) {
    this.store.dispatch({ type: "exporting", payload: { type, cb } });
  }

  setConfig(config) {
    this.store.dispatch({ type: "setting", payload: { config } });
  }
}
