// import { encodeRAW2WAV, mergeBuffers } from "./encoder";

/**
 * AudioProcessor is a web worker for parse raw recording data.
 * It is used as a inline worker.
 */
export default function audioProcessor() {
  let sampleRate = 16000;

  let numberOfOutputChannels = 1;

  // an 2-D array buffer to store raw recording data which is floating data.
  let rawData = [];

  // used to calculate the length of raw buffer
  let rawLength = 0;

  let bitDepth = 16;

  // onmessage must be a global variable
  self.onmessage = (event) => {
    console.log("i am worker, receive:" + event.data.cmd);
    switch (event.data.cmd) {
      case "init":
        initialize(event.data.config);
        break;
      case "record":
        fillRAWData(event.data.buffer);
        break;
      case "stop":
        // reset();
        break;
      case "exportBlob":
        if (event.data.type === "wav") {
          exportWAVBlob();
        }
        break;
      case "clear":
        clear();
        break;
      case "release":
        self.close();
        break;
    }
  };

  const exportWAVBlob = () => {
    let buffers = [];
    for (let channel = 0; channel < numberOfOutputChannels; channel++) {
      buffers.push(mergeBuffers(rawData[channel], rawLength));
    }

    // Now only support single channel output
    const raw = buffers[0];
    const wav = encodeRAW2WAV(
      raw,
      sampleRate,
      numberOfOutputChannels,
      bitDepth
    );
    const blob = new Blob([wav], { type: "audio/wav" });

    postMessage({ cmd: "exportWAVBlob", blob });
  };

  const initialize = (config) => {
    sampleRate = config.sampleRate;
    bitDepth = config.bitDepth;
    numberOfOutputChannels = config.numberOfOutputChannels;

    for (let channel = 0; channel < numberOfOutputChannels; channel++) {
      rawData[channel] = [];
    }
  };

  const fillRAWData = (rawPieceBuffer) => {
    test = [];
    test[0] = [];
    for (let channel = 0; channel < numberOfOutputChannels; channel++) {
      rawData[channel].push(rawPieceBuffer[channel]);
    }

    rawLength += rawPieceBuffer[0].length;
    // console.log(rawLength);
  };

  const clear = () => {
    sampleRate = null;
    numberOfOutputChannels = 1;
    rawData = [];
    rawLength = 0;
  };

  /**
   * Write string to output data.
   * @param output
   * @param offset
   * @param string
   */
  const writeString = (output, offset, string) => {
    for (var i = 0; i < string.length; i++) {
      output.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  /**
   * By default raw format is an 32 bits (float32) array. Down sample the audio by half,
   * we can get PCM audio
   * @param {output data} output
   * @param {offset from output data} offset
   * @param {raw format - a 32 bit(float32) array} raw
   */
  const encodeRAW2PCM = (output, offset, raw) => {
    for (var i = 0; i < raw.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, raw[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  };

  const encodeRAW2WAV = (raw, sampleRate, numberOfOutputChannels, bitDepth) => {
    // console.log(raw, sampleRate, numberOfOutputChannels, bitDepth);
    let buffer = new ArrayBuffer(44 + raw.length * 2);
    let view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, "RIFF");
    /* RIFF chunk length */
    view.setUint32(4, 36 + raw.length * 2, true);
    /* RIFF type */
    writeString(view, 8, "WAVE");
    /* format chunk identifier */
    writeString(view, 12, "fmt ");
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numberOfOutputChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numberOfOutputChannels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, raw.length * 2, true);

    // floatTo16BitPCM(view, 44, raw);
    encodeRAW2PCM(view, 44, raw);

    return view;
  };

  const mergeBuffers = (rawData, rawDataLength) => {
    let result = new Float32Array(recLength);
    let offset = 0;
    for (let i = 0; i < rawData.length; i++) {
      result.set(rawData[i], offset);
      offset += rawData[i].length;
    }
    return result;
  };
}
