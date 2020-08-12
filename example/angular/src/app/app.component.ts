import { Component } from "@angular/core";
import Psittacus from "../../../../dev/psittacus";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "recorder";
  audioSrc;
  config = {
    method: "AudioContext",
    bufferSize: 4096,
    sampleRate: 16000,
    bitDepth: 16,
  };

  recorder = new Psittacus(this.config);
  startOrStop = "Start";

  constructor(private sanitizer: DomSanitizer) {}
  onStart() {
    if (this.startOrStop === "Start") {
      this.startOrStop = "Stop";
      this.recorder.start();
      this.audioSrc = "";
    } else {
      this.startOrStop = "Start";
      this.recorder.stop();
      this.recorder.export("wav", (blob) => {
        this.audioSrc = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(blob)
        );
      });
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
