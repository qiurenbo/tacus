import audioProcessor from "./audio-processor";

// function worker() {
//   onmessage = (event) => {
//     console.log("i am worker, receive:" + event.data.cmd);
//     postMessage({ result: "message from worker" });
//   };
// }
/**
 * Reference by https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
 */
export class _CompatibleAudio {
  // audio context
  audioContext = null;

  // a blob url for audio
  url = null;

  /**
   * The read-only context property of the AudioNode interface returns the associated BaseAudioContext,
   * that is the object representing the processing graph the node is participating in.
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/context
   */
  context = null;

  /**
   * The createScriptProcessor() method of the BaseAudioContext interface creates a ScriptProcessorNode used
   * for direct audio processing.
   * Return A ScriptProcessorNode.
   * https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode
   * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
   */
  node = null;

  // State is used for record the state of audio recorder. You can use 'inactive' and 'recording' and 'suspending'.
  state = "inactive";

  // web worker to parse audio
  worker = null;

  config = null;

  // Callback to be executed when worker post message to main thread.
  cb = null;
  constructor(stream, config) {
    this.config = config;
    // console.log(this.config);
    this.worker = this.createWorker(audioProcessor);
    this.worker.onmessage = (e) => {
      console.log(e.data);

      if (typeof this.cb == "function") {
        this.cb(e.data.blob);
      }
    };
    this.worker.postMessage({
      cmd: "init",
      config: this.config,
    });

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    this.audioContext = new AudioContext({
      latencyHint: this.config.latencyHint,
      sampleRate: this.config.sampleRate,
    });
    /**
     * Creates a MediaStreamAudioSourceNode associated with a MediaStream representing an audio stream
     * which may come from the local computer microphone or other sources.
     * source is a MediaStreamAudioDestinationNode which is inherits from AudioNode
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioDestinationNode
     * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode
     */
    const source = this.audioContext.createMediaStreamSource(stream);

    this.context = source.context;

    /**
     * As of the August 29 2014 Web Audio API spec publication, this feature has been marked as deprecated, and
     * was replaced by AudioWorklet.
     */
    this.node = this.context.createScriptProcessor(
      this.config.bufferLen,
      this.config.numberOfInputChannels,
      this.config.numberOfOutputChannels
    );

    // Prepare for audio processing
    this.registerProcessor();

    /**
     * Input stream connect to processor node.
     * Processor node connect to destination.
     * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect
     */

    source.connect(this.node);

    this.node.connect(this.context.destination);

    this.audioContext.suspend();
  }

  registerProcessor() {
    /**
     * The audioprocess event of the ScriptProcessorNode interface is fired when an input buffer of a script
     * processor is ready to be processed.
     * https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/audioprocess_event
     */
    this.node.onaudioprocess = (e) => {
      /**
       * We use audio context to suspend input stream process. This state judgement is unused.
       * But we can use state to track the state of audio context
       */

      if (this.state === "inactive" || this.state === "suspending") return;

      this.worker.postMessage({
        cmd: "record",
        buffer: this.fillBuffer(e),
      });
    };
  }

  /**
   * Filling Buffer by adding recording audio piece with channel sequences.
   * @param e event store recording audio data
   * @return buffer
   */
  fillBuffer(e) {
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

  start() {
    if (this.state === "inactive") {
      this.state = "recording";
      this.audioContext.resume();
    }
  }

  stop() {
    if (this.state === "recording") {
      this.state = "inactive";
      this.audioContext.suspend();
    }
    this.worker.postMessage({
      cmd: "stop",
    });
  }

  pause() {
    if (this.state === "recording") {
      this.state = "suspending";
      this.audioContext.suspend();
    }
  }

  resume() {
    if (this.state === "suspending") {
      this.state = "recording";
      this.audioContext.resume();
    }
  }

  clear() {
    if (this.state === "inactive") {
      this.worker.postMessage({ cmd: "clear" });
    }
  }

  export(type, cb) {
    this.cb = cb;
    this.worker.postMessage({
      cmd: "export",
      type,
    });
  }

  release() {
    this.worker.postMessage({
      cmd: "release",
    });
    this.audioContext.close();
  }

  createWorker(f) {
    return new Worker(
      URL.createObjectURL(
        new Blob([`(${f.toString()})()`], { type: "application/javascript" })
      )
    );
  }
}
