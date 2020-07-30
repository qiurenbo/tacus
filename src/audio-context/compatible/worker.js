const { reset } = require("nodemon");

let sampleRate = null;

let numberOfOutputChannels = 1;

// an 2-D array buffer to store pcm recording data.
let pcmData = [];

// used to calculate the length of pcm buffer
let pcmLength = 0;
worker.onmessage = (event) => {
  switch (event.data.cmd) {
    case "init":
      initialize(event.data.config);
      break;
    case "recording":
      fillPCMData(event.data.buffer);
      break;
    case "stop":
      reset();
      break;
    case "release":
      self.close();
      break;
  }
};

const initialize = (config) => {
  sampleRate = config.sampleRate;
  numberOfOutputChannels = config.numberOfOutputChannels;
  for (let channel = 0; channel < numberOfOutputChannels; channel++) {
    pcmData[channel] = [];
  }
};

const fillPCMData = (pcmPieceBuffer) => {
  for (let channel = 0; channel < numberOfOutputChannels; channel++) {
    pcmData[channel].push(pcmPieceBuffer[channel]);
  }
  pcmLength += pcmPieceBuffer[0].length;
};

const reset = () => {
  sampleRate = null;
  numberOfOutputChannels = 1;
  pcmData = [];
  pcmLength = 0;
};
