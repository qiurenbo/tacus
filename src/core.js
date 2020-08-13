import Peon from "./peon";
/**
 * Reference by https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
 */
export default class Core {
  // audio context
  context = null;

  // a blob url for audio
  url = null;

  /**
   * The read-only context property of the AudioNode interface returns the associated BaseAudioContext,
   * that is the object representing the processing graph the processNode is participating in.
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/context
   */
  context = null;

  // input stream node
  sourceNode = null;

  stream = null;

  /**
   * The createScriptProcessor() method of the BaseAudioContext interface creates a ScriptProcessorNode used
   * for direct audio processing.
   * Return A ScriptProcessorNode.
   * https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode
   * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
   */
  processNode = null;

  // web peon to parse audio
  peon = null;

  // audio blob
  blob = null;

  config = {
    method: "AudioContext",

    // same as https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
    // 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384
    bufferSize: 4096,
    numberOfInputChannels: 1,
    numberOfOutputChannels: 1,

    // same as https://developer.mozilla.org/en-US/docs/Web/API/AudioContextOptions
    latencyHint: "interactive",
    // 8000 | 16000 | 22050 | 24000 | 44100 | 48000
    sampleRate: 16000,

    bitDepth: 16,

    // audio url
    src: "",
  };

  constructor(config = null) {
    if (config) {
      this.setConfig(config);
    }

    // Create in inline web peon.
    this.peon = new Peon();

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }

  /**
   * input stream => sourceNode => processNode => destination
   */
  record() {
    this.peon.init(this.config);

    /**
     * The MediaDevices.getUserMedia() method prompts the user for permission to use a media input
     * which produces a MediaStream with tracks containing the requested types of media.
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
     */
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(
        (stream) => {
          /**
           * The MediaStream interface represents a stream of media content. A stream consists of several tracks
           * such as video or audio tracks.https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
           */

          this.stream = stream;

          this.context = new AudioContext({
            latencyHint: this.config.latencyHint,
            sampleRate: this.config.sampleRate,
          });

          /**
           * Creates a MediaStreamAudioSourceNode associated with a MediaStream representing an audio stream
           * which may come from the local computer microphone or other sourceNodes.
           * sourceNode is a MediaStreamAudioDestinationNode which is inherits from AudioNode
           * https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioDestinationNode
           * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode
           */
          this.sourceNode = this.context.createMediaStreamSource(this.stream);

          this.context = this.sourceNode.context;

          /**
           * As of the August 29 2014 Web Audio API spec publication, this feature has been marked as deprecated, and
           * was replaced by AudioWorklet.
           */
          this.processNode = this.context.createScriptProcessor(
            this.config.bufferSize,
            this.config.numberOfInputChannels,
            this.config.numberOfOutputChannels
          );

          /**
           * The audioprocess event of the ScriptProcessorNode interface is fired when an input buffer of a script
           * processor is ready to be processed.
           * https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/audioprocess_event
           */
          this.processNode.onaudioprocess = (e) => {
            this.peon.record(this.getInputBuffer(e));
          };

          /**
           * Input stream connect to processor processNode.
           * Processor processNode connect to destination.
           * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect
           */

          this.sourceNode.connect(this.processNode);

          // Output to destination
          this.processNode.connect(this.context.destination);
        },
        () => {
          throw new Error("Authorization failed.");
        }
      );
    } else {
      throw new Error("Unsupported Browser.");
    }
  }

  async play(setState) {
    const start = async () => {
      const buffer = await this.blob.arrayBuffer();
      const context = new AudioContext();

      // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
      const sourceNode = context.createBufferSource(); //

      context.decodeAudioData(buffer, (buffer) => {
        sourceNode.buffer = buffer;
        sourceNode.connect(context.destination);
        sourceNode.start(0);

        sourceNode.onended = () => {
          sourceNode.disconnect(context.destination);
          setState();
        };
      });
    };

    if (this.blob) {
      start(this.blob);
    } else {
      await new Promise((resolve, reject) => {
        let id = setInterval((cb) => {
          if (this.blob) {
            clearInterval(id);
            start(this.blob);
            resolve();
          }
        }, 50);
      });
    }
  }

  stop() {
    this.sourceNode && this.sourceNode.disconnect();
    this.processNode && this.processNode.disconnect();

    // https://stackoverflow.com/questions/26670677/remove-red-icon-after-recording-has-stopped/26671315
    if (this.stream && this.stream.getTracks) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.context && this.context.close();
    this.context = null;

    this.peon.export("wav", (blob) => {
      this.blob = blob;
      this.peon.init();
    });
  }

  pause() {
    if (this.processNode) {
      this.sourceNode.disconnect();
    } else {
      this.context.suspend();
    }
  }

  resume() {
    if (this.processNode) {
      this.sourceNode.connect(this.processNode);
    } else {
      this.context.resume();
    }
  }

  async export(type, cb, setState) {
    await new Promise((resolve, reject) => {
      let id = setInterval(() => {
        if (this.blob) {
          clearInterval(id);
          cb(this.blob);
          resolve();
        }
      }, 50);
    });
  }

  setConfig(config) {
    Object.assign(this.config, config);
  }

  /**
   * Get Buffer by adding recording audio piece with channel sequences.
   * @param e event store recording audio data
   * @return buffer
   */
  getInputBuffer(e) {
    const buffer = [];

    for (
      let channel = 0;
      channel < this.config.numberOfInputChannels;
      channel++
    ) {
      buffer.push(e.inputBuffer.getChannelData(channel));
    }

    return buffer;
  }
}
