/**
 * Reference by https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
 */
export class _AudioContext {
  // a buffer for audio processor
  chunks = [];

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
   * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createScriptProcessor
   */
  node = null;

  // State is used for record the state of audio recorder. You can use 'inactive' and 'recording' and 'suspending'.
  state = "inactive";

  constructor(stream, config) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    /**
     * Creates a MediaStreamAudioSourceNode associated with a MediaStream representing an audio stream
     * which may come from the local computer microphone or other sources.
     * source is a MediaStreamAudioDestinationNode which is inherits from AudioNode
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioDestinationNode
     * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode
     */
    const source = new AudioContext(
      this.config.context
    ).createMediaStreamSource(stream);

    this.context = source.context;
    this.worker = new Worker("worker.js");
    /**
     * As of the August 29 2014 Web Audio API spec publication, this feature has been marked as deprecated, and
     * was replaced by AudioWorklet.
     */
    this.node = this.context.createScriptProcessor(
      this.config.processor.bufferLen,
      this.config.processor.numberOfInputChannels,
      this.config.processor.numberOfOutputChannels
    );

    source.connect(this.node);

    this.addListeners();
  }

  addListeners() {
    this.node.onaudioprocess = (e) => {
      if (!this.state === "inactive") return;

      var buffer = [];
      for (var channel = 0; channel < this.config.numChannels; channel++) {
        buffer.push(e.inputBuffer.getChannelData(channel));
      }
      this.worker.postMessage({
        command: "record",
        buffer: buffer,
      });
    };
  }

  start() {
    if (this.state !== "recording") {
      this.recorder.start();
    }
  }

  stop() {
    if (this.state === "recording") {
      this.recorder.stop();
    }
  }
}
