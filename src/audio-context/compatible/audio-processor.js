// import { encodeRAW2WAV, flatRawData2D } from "./encoder";

/**
 * AudioProcessor is a web worker for parse raw recording data.
 * It is used as a inline worker.
 */
export default function audioProcessor() {
  let sampleRate = 16000;

  let numberOfOutputChannels = 1;

  /**
   * An 2D array buffer store multiple channels raw data. When recording, web audio api will fill an float 32 array with
   * specified size. When it full, it will notify a web worker with message 'record'. Then the web worker store this piece
   * in rawData2DInMultipleChannels.
   */
  let rawData2DInMultipleChannels = [];

  /**
   * Calculate the total number of float32 data in an single channel of raw data.
   * We use it to new a float32 array to
   */
  let numberOfFloat32InRawData2DInSingleChannel = 0;

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
      buffers.push(
        flatRawData2D(
          rawData2DInMultipleChannels[channel],
          numberOfFloat32InRawData2DInSingleChannel
        )
      );
    }

    // Now only support single channel output
    const rawDataWithFlatFloat32InSingleChannel = buffers[0];
    const wav = encodeRAW2WAV(
      rawDataWithFlatFloat32InSingleChannel,
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
      rawData2DInMultipleChannels[channel] = [];
    }
  };

  const fillRAWData = (rawPieceBuffer) => {
    test = [];
    test[0] = [];
    for (let channel = 0; channel < numberOfOutputChannels; channel++) {
      rawData2DInMultipleChannels[channel].push(rawPieceBuffer[channel]);
    }

    numberOfFloat32InRawData2DInSingleChannel += rawPieceBuffer[0].length;
    // console.log(numberOfFloat32InRawData2DInSingleChannel);
  };

  const clear = () => {
    sampleRate = null;
    numberOfOutputChannels = 1;
    rawData2DInMultipleChannels = [];
    numberOfFloat32InRawData2DInSingleChannel = 0;
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

  const encodeRAW2WAV = (rawDataWithFlatFloat32InSingleChannel) => {
    // console.log(raw, sampleRate, numberOfOutputChannels, bitDepth);

    const byteDepth = bitDepth / 8;
    const numberOfBytesInSingleChannel =
      rawDataWithFlatFloat32InSingleChannel.length * byteDepth;
    const byteRate = sampleRate * byteDepth;
    let buffer = new ArrayBuffer(44 + numberOfBytesInSingleChannel);
    let view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, "RIFF");
    /* RIFF chunk length */
    view.setUint32(4, 36 + numberOfBytesInSingleChannel, true);
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
    view.setUint32(28, byteRate, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numberOfOutputChannels * byteDepth, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, numberOfBytesInSingleChannel, true);

    encodeRAW2PCM(view, 44, rawDataWithFlatFloat32InSingleChannel);

    return view;
  };

  /**
   * FLat the 2D array.
   * @param {the float 32 array which represents the recording audio pieces in single channel} rawData2DInSingleChannel
   */
  const flatRawData2D = (rawData2DInSingleChannel) => {
    let result = new Float32Array(numberOfFloat32InRawData2DInSingleChannel);
    let offset = 0;

    for (let i = 0; i < rawData2DInSingleChannel.length; i++) {
      // Deconstruct the float 32 array and store it to result to flat the 2D array.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set
      result.set(rawData2DInSingleChannel[i], offset);
      offset += rawData2DInSingleChannel[i].length;
    }
    return result;
  };
}
