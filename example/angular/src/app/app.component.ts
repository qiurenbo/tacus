import { Component } from "@angular/core";
import Psittacus from "../../../../dist/psittacus";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "recorder";

  config = {
    method: "AudioContext",
    bufferSize: 4096,
    sampleRate: 16000,
    bitDepth: 16,
  };

  recorder = new Psittacus(this.config);
  startOrStop = "Start";

  onStart() {
    if (this.startOrStop === "Start") {
      this.startOrStop = "Stop";
      this.recorder.start();
    } else {
      this.startOrStop = "Start";
      this.recorder.stop();
    }
  }

  onDownload() {
    this.recorder.export("wav", (blob) => {
      const downloadEl = document.createElement("a");
      downloadEl.innerHTML = "download";
      downloadEl.download = "audio.wav";
      downloadEl.href = URL.createObjectURL(blob);
      document.body.appendChild(downloadEl);
      downloadEl.click();
      document.body.removeChild(downloadEl);
    });
  }
}
