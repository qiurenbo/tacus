const { Tacus } = require("../index");

describe("Public functions should work", () => {
  var tacus;
  beforeEach(() => {
    tacus = new Tacus();
    tacus._options.bufferSize = 10;
    tacus._options.sampleRate = 16000;
  });

  it("setOptions should work", () => {
    tacus.setOptions({ bufferSize: 4096, sampleRate: 22050 });

    expect(tacus._options.bufferSize).toBe(4096);

    expect(tacus._options.sampleRate).toBe(22050);
  });
});

describe("Internal private functions should work", () => {
  var tacus;

  beforeEach(() => {
    tacus = new Tacus();
    tacus._options.bufferSize = 10;
    tacus._options.sampleRate = 16000;
  });

  it("_flatPCM32fSamples should work", () => {
    tacus._PCM32fSamplesNoFlat = [];
    tacus._PCM32fSamplesNoFlat.push(
      new Float32Array([
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
      ])
    );

    tacus._PCM32fSamplesNoFlat.push(
      new Float32Array([
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
      ])
    );

    tacus._flatPCM32fSamples();

    expect(tacus._PCM32fSamples).toEqual(
      new Float32Array([
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
        0.10140491276979446,
        0.10089323669672012,
        0.001589527353644371,
        0.0026708287186920643,
        0.0007670150371268392,
        0.0007421635091304779,
        -0.00007858132448745891,
        -0.0012955882120877504,
        -0.00200575846247375,
        -0.004212718922644854,
      ])
    );
  });

  it("_convertPCM32f2PCM16i should work", () => {
    tacus._PCM32fSamples = new Float32Array([
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
      0.10140491276979446,
      0.10089323669672012,
      0.001589527353644371,
      0.0026708287186920643,
      0.0007670150371268392,
      0.0007421635091304779,
      -0.00007858132448745891,
      -0.0012955882120877504,
      -0.00200575846247375,
      -0.004212718922644854,
    ]);

    tacus._convertPCM32f2PCM16i();

    expect(tacus._PCM16iSamples).toEqual(
      new Int16Array([
        46,
        29,
        52,
        87,
        25,
        24,
        -2,
        -42,
        -65,
        -138,
        3322,
        3305,
        52,
        87,
        25,
        24,
        -2,
        -42,
        -65,
        -138,
      ])
    );
  });

  it("_convertPCM16i2WAV should work", () => {
    tacus._PCM16iSamples = new Int16Array([
      46,
      29,
      52,
      87,
      25,
      24,
      -2,
      -42,
      -65,
      -138,
      3322,
      3305,
      52,
      87,
      25,
      24,
      -2,
      -42,
      -65,
      -138,
    ]);
    tacus._convertPCM16i2WAV();

    expect(tacus._PCM16iDataView.byteLength).toBe(84);

    var wav = new Uint8Array(tacus._PCM16iDataView.buffer);

    var fixture = new Uint8Array([
      0x52,
      0x49,
      0x46,
      0x46,
      0x4c,
      0x00,
      0x00,
      0x00,
      0x57,
      0x41,
      0x56,
      0x45,
      0x66,
      0x6d,
      0x74,
      0x20,
      0x10,
      0x00,
      0x00,
      0x00,
      0x01,
      0x00,
      0x01,
      0x00,
      0x80,
      0x3e,
      0x00,
      0x00,
      0x00,
      0x7d,
      0x00,
      0x00,
      0x02,
      0x00,
      0x10,
      0x00,
      0x64,
      0x61,
      0x74,
      0x61,
      0x28,
      0x00,
      0x00,
      0x00,
      0x2e,
      0x00,
      0x1d,
      0x00,
      0x34,
      0x00,
      0x57,
      0x00,
      0x19,
      0x00,
      0x18,
      0x00,
      0xfe,
      0xff,
      0xd6,
      0xff,
      0xbf,
      0xff,
      0x76,
      0xff,
      0xfa,
      0x0c,
      0xe9,
      0x0c,
      0x34,
      0x00,
      0x57,
      0x00,
      0x19,
      0x00,
      0x18,
      0x00,
      0xfe,
      0xff,
      0xd6,
      0xff,
      0xbf,
      0xff,
      0x76,
      0xff,
    ]);
    expect(wav).toEqual(fixture);
  });
});
