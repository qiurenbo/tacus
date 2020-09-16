const { Tacus } = require("../index");
tacus = new Tacus();

var noFlat = new Float32Array(10);

noFlat.set([
  0.0014049103483557701,
  0.0008932355558499694,
  0.001589527353644371,
  0.0026708287186920643,
  0.0007670150371268392,
  0.0007421635091304779,
  -0.00007858132448745891,
  -0.0012955882120877504,
  -0.00200575846247375,
  -0.004212718922644854,
]);

tacus._PCM32fSamplesNoFlat = [];
tacus._PCM32fSamplesNoFlat.push(noFlat);

var noFlat2 = new Float32Array(10);
noFlat2.set([
  0.1014049103483557701,
  0.1008932355558499694,
  0.001589527353644371,
  0.0026708287186920643,
  0.0007670150371268392,
  0.0007421635091304779,
  -0.00007858132448745891,
  -0.0012955882120877504,
  -0.00200575846247375,
  -0.004212718922644854,
]);
tacus._PCM32fSamplesNoFlat.push(noFlat2);
tacus._options.bufferSize = 10;

console.log("tacus._PCM32fSamplesNoFlat");
console.log(tacus._PCM32fSamplesNoFlat);

tacus._flatPCM32fSamples();

console.log("tacus._PCM32fSamples");
console.log(tacus._PCM32fSamples);

tacus._convertPCM32f2PCM16i();
tacus._convertPCM16i2WAV();

const dataview = tacus._PCM16iArrayBuffer;

console.log(dataview);
