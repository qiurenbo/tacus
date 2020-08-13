import { Psittacus } from "../src";
import "./style.css";
const startAndStopBtn = document.getElementById("start-stop");
const pauseAndResumeBtn = document.getElementById("pause-resume");
const downloadBtn = document.getElementById("download");
const playBtn = document.getElementById("play");
let config = {
  method: "AudioContext",
  bufferSize: 4096,
  sampleRate: 16000,
  bitDepth: 16,
};

let psittacus = new Psittacus();

let blob;
let binary;

window.onStart = () => {
  const state = startAndStopBtn.innerHTML;
  switch (state) {
    case "Stop":
      startAndStopBtn.innerHTML = "Start";
      psittacus.stop();
      pauseAndResumeBtn.disabled = true;
      downloadBtn.disabled = false;
      playBtn.disabled = false;
      psittacus.export("wav", (_blob) => {
        blob = _blob;
      });

      break;

    case "Start":
      psittacus.setConfig(config);
      startAndStopBtn.innerHTML = "Stop";
      psittacus.record();
      pauseAndResumeBtn.disabled = false;
      downloadBtn.disabled = true;
      playBtn.disabled = true;

      break;
  }
};

window.onPause = () => {
  const state = pauseAndResumeBtn.innerHTML;
  switch (state) {
    case "Resume":
      pauseAndResumeBtn.innerHTML = "Pause";
      psittacus.resume();
      break;

    case "Pause":
      pauseAndResumeBtn.innerHTML = "Resume";
      psittacus.pause();
      break;
  }
};

window.onDownload = () => {
  const downloadEl = document.createElement("a");
  downloadEl.style = "display: none";
  downloadEl.innerHTML = "download";
  downloadEl.download = "audio.wav";
  console.log(blob);
  downloadEl.href = URL.createObjectURL(blob);
  document.body.appendChild(downloadEl);
  downloadEl.click();
  document.body.removeChild(downloadEl);
  downloadBtn.disabled = true;
};

window.onBitDepthChange = (event) => {
  config.bitDepth = event.target.value;
  debugDIV.innerHTML = JSON.stringify(config);
};

window.onSampleRateChange = (event) => {
  config.sampleRate = event.target.value;
  debugDIV.innerHTML = JSON.stringify(config);
};

window.onBufferSizeChange = (event) => {
  config.bufferSize = event.target.value;
  debugDIV.innerHTML = JSON.stringify(config);
};

window.onPlay = (event) => {
  psittacus.play();
};
