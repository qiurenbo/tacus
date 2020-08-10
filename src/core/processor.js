/**
 * AudioProcessor is a web worker for parse raw recording data.
 * It is used as a inline worker.
 */
export default function Processor() {
  let sampleRate = 16000;

  let numberOfOutputChannels = 1;

  /**
   * An 2D array buffer store multiple channels raw data. When recording, web audio api will fill an float 32 array with
   * specified size. When it full, it will notify a web worker with message 'record'. Then the web worker store this piece
   * in PCM32fSamplesInMultipleChannels.
   */
  let PCM32fSamplesInMultipleChannels = [];

  /**
   * Calculate the total number of float32 data in an single channel of raw data.
   * We use it to new a float32 array.
   */
  let numberOf32fInSingleChannel = 0;

  let bitDepth = 16;

  // onmessage must be a global variable
  self.onmessage = (event) => {
    // console.log("i am worker, receive:" + event.data.cmd);
    // console.log("numberOf32fInSingleChannel:" + numberOf32fInSingleChannel);
    switch (event.data.cmd) {
      case "init":
        init(event.data.config);
        break;
      case "record":
        fillPCM32fSamples(event.data.buffer);
        break;
      case "stop":
        break;
      case "export":
        if (event.data.audioType === "wav") {
          exportWAV();
        }
        break;
      case "release":
        self.close();
        break;
    }
  };

  const exportWAV = () => {
    let buffers = [];
    for (let channel = 0; channel < numberOfOutputChannels; channel++) {
      buffers.push(
        flatPCM32fSamples(
          PCM32fSamplesInMultipleChannels[channel],
          numberOf32fInSingleChannel
        )
      );
    }

    // Now only support single channel output
    const PCM32fInSingleChannel = buffers[0];
    const wav = encodePCM32f2WAV(PCM32fInSingleChannel);

    const blob = new Blob([wav], { type: "audio/wav" });
    postMessage({ cmd: "exportWAV", data: blob });
  };

  const init = (config) => {
    if (config.sampleRate) {
      sampleRate = config.sampleRate;
    }
    if (config.bitDepth) {
      bitDepth = +config.bitDepth;
    }

    if (config.numberOfOutputChannels) {
      numberOfOutputChannels = config.numberOfOutputChannels;
    }

    for (let channel = 0; channel < numberOfOutputChannels; channel++) {
      PCM32fSamplesInMultipleChannels[channel] = [];
    }
    numberOf32fInSingleChannel = 0;
  };

  const fillPCM32fSamples = (pcmFloatPiece) => {
    test = [];
    test[0] = [];
    for (let channel = 0; channel < numberOfOutputChannels; channel++) {
      PCM32fSamplesInMultipleChannels[channel].push(pcmFloatPiece[channel]);
    }

    numberOf32fInSingleChannel += pcmFloatPiece[0].length;
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
   */
  const writePCMData = (output, offset, PCM32fInSingleChannel) => {
    if (bitDepth === 16) {
      pcm = encodePCM32f2PCM16i(PCM32fInSingleChannel);
      writePCM16iToWAV(output, offset, pcm);
    } else if (bitDepth === 8) {
      // https://stackoverflow.com/questions/25352195/noise-after-converting-32-bit-float-pcm-to-unsigned-8-bit
      pcm = encodePCM32f2PCM8i(PCM32fInSingleChannel);
      write8iToWAVData(output, offset, pcm);
    } else {
      throw new Error("Unsupported bit depth");
    }
  };

  /**
   * Encode raw data to pcm data.
   * Map (-1,1) to (-32768, 32767).
   */
  const encodePCM32f2PCM16i = (PCM32fInSingleChannel) => {
    let pcm;
    let lowBoundary = 0x8000;
    let upBoundary = 0x7fff;

    pcm = new Int16Array(PCM32fInSingleChannel.length);

    for (var i = 0; i < PCM32fInSingleChannel.length; i++) {
      let s = Math.max(-1, Math.min(1, PCM32fInSingleChannel[i]));
      s = s < 0 ? s * lowBoundary : s * upBoundary;
      pcm[i] = s;
    }
    return pcm;
  };

  const encodePCM32f2PCM8i = (PCM32fInSingleChannel) => {
    let pcm;
    let lowBoundary = 0x80;
    let upBoundary = 0x7f;

    pcm = new Int32Array(PCM32fInSingleChannel.length);

    for (var i = 0; i < PCM32fInSingleChannel.length; i++) {
      let s = Math.max(-1, Math.min(1, PCM32fInSingleChannel[i]));
      s = s < 0 ? s * lowBoundary : s * upBoundary;
      pcm[i] = s;
    }
    return pcm;
  };

  const writePCM16iToWAV = (output, offset, pcm) => {
    for (var i = 0; i < pcm.length; i++, offset += 2) {
      output.setInt16(offset, pcm[i], true);
    }
  };

  const write8iToWAVData = (output, offset, pcm) => {
    for (var i = 0; i < pcm.length; i++, offset += 1) {
      output.setInt8(offset, pcm[i], true);
    }
  };

  const encodePCM32f2WAV = (PCM32fInSingleChannel) => {
    const byteDepth = bitDepth / 8;
    const byteRate = sampleRate * byteDepth;
    const numberOfBytesInSingleChannel =
      PCM32fInSingleChannel.length * byteDepth;

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
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, numberOfBytesInSingleChannel, true);

    writePCMData(view, 44, PCM32fInSingleChannel, bitDepth);

    return view;
  };

  /**
   * FLat the 2D array raw data.
   * @param pcmFloat2DInSingleChannel
   */
  const flatPCM32fSamples = (pcmFloat2DInSingleChannel) => {
    let result = new Float32Array(numberOf32fInSingleChannel);
    let offset = 0;

    for (let i = 0; i < pcmFloat2DInSingleChannel.length; i++) {
      // Deconstruct the float 32 array and store it to the 2D array.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set
      result.set(pcmFloat2DInSingleChannel[i], offset);
      offset += pcmFloat2DInSingleChannel[i].length;
    }
    return result;
  };
}
