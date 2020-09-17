var startAndStopBtn = document.getElementById("start-stop");
var pauseAndResumeBtn = document.getElementById("pause-resume");
var downloadBtn = document.getElementById("download");
var playBtn = document.getElementById("play");
var debugDIV = document.getElementById("debug");
var config = {
  bufferSize: 4096,
  sampleRate: 16000,
};

debugDIV.innerHTML = JSON.stringify(config);

var tacus = new Tacus();

window.onRecord = () => {
  var state = startAndStopBtn.innerHTML;
  switch (state) {
    case "Stop":
      startAndStopBtn.innerHTML = "Record";
      tacus.stop();

      break;

    case "Record":
      tacus.setOptions(config);
      startAndStopBtn.innerHTML = "Stop";
      tacus.start();

      break;
  }
};

window.onPause = () => {
  var state = pauseAndResumeBtn.innerHTML;
  switch (state) {
    case "Resume":
      pauseAndResumeBtn.innerHTML = "Pause";
      tacus.resume();
      break;

    case "Pause":
      pauseAndResumeBtn.innerHTML = "Resume";
      tacus.pause();
      break;
  }
};

window.onDownload = () => {
  tacus.download();
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
  tacus.play();
};
