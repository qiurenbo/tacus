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
    console.log(s < 0 ? s * 0x8000 : s * 0x7fff);

    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
};

const encodeRAW2WAV = (raw, sampleRate, numberOfOutputChannels, bitDepth) => {
  const byteDepth = bitDepth / 8;
  let buffer = new ArrayBuffer(44 + raw.length * byteDepth);
  let output = new DataView(buffer);

  /* RIFF identifier */
  writeString(output, 0, "RIFF");
  /* RIFF chunk length */
  output.setUint32(4, 36 + raw.length * byteDepth, true);
  /* RIFF type */
  writeString(output, 8, "WAVE");
  /* format chunk identifier */
  writeString(output, 12, "fmt ");
  /* format chunk length */
  output.setUint32(16, 16, true);
  /* sample format (raw) */
  output.setUint16(20, 1, true);
  /* channel count */
  output.setUint16(22, numberOfOutputChannels, true);
  /* sample rate */
  output.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block which is numberOfOutputChannels * byteDepth align) */
  output.setUint32(28, numberOfOutputChannels * sampleRate * byteDepth, true);
  /* block align (channel count * bytes per sample) */
  output.setUint16(32, numberOfOutputChannels * byteDepth, true);
  /* bits per sample */
  output.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(output, 36, "data");
  /* data chunk length */
  output.setUint32(40, numberOfOutputChannels * raw.length * byteDepth, true);

  encodeRAW2PCM(output, 44, raw);

  return output;
};

const mergeBuffers = (recBuffers, recLength) => {
  let result = new Float32Array(recLength);
  let offset = 0;
  for (let i = 0; i < recBuffers.length; i++) {
    result.set(recBuffers[i], offset);
    offset += recBuffers[i].length;
  }
  return result;
};

export { encodeRAW2WAV, mergeBuffers };
