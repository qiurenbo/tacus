import Psittacus from "psittacus";

describe("export wav should work", () => {
  it("wav header should be 44 bytes", (done) => {
    let config = {
      method: "AudioContext",
      bufferSize: 4096,
      sampleRate: 16000,
      bitDepth: 16,
    };

    let recorder = new Psittacus(config);

    recorder.start();

    recorder.stop();

    recorder.export("wav", (blob) => {
      expect(blob.size).toEqual(44);
      done();
    });
  });

  it("sample rate configuration should work", (done) => {
    let config = {
      method: "AudioContext",
      bufferSize: 4096,
      sampleRate: 16000,
      bitDepth: 16,
    };

    let recorder = new Psittacus(config);

    recorder.start();

    recorder.stop();

    recorder.export("wav", async (blob) => {
      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);
      expect(view.getUint32(24, true)).toEqual(16000);
      done();
    });

    config.sampleRate = 8000;

    recorder = new Psittacus(config);

    recorder.start();

    recorder.stop();

    recorder.export("wav", async (blob) => {
      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);
      expect(view.getUint32(24, true)).toEqual(8000);
      done();
    });
  });

  it("bitDepth configuration should work", (done) => {
    let config = {
      method: "AudioContext",
      bufferSize: 4096,
      sampleRate: 16000,
      bitDepth: 16,
    };

    let recorder = new Psittacus(config);

    recorder.start();

    recorder.stop();

    recorder.export("wav", async (blob) => {
      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);
      expect(view.getUint16(34, true)).toEqual(16);
      done();
    });

    config.bitDepth = 8;

    recorder = new Psittacus(config);

    recorder.start();

    recorder.stop();

    recorder.export("wav", async (blob) => {
      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);
      expect(view.getUint16(34, true)).toEqual(8);
      done();
    });
  });
});
