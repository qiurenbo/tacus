import Processor from "./core/processor";
import SelfWorker from "./core/worker";
/**
 * Reference by https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
 */
export class Psittacus {
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

  // State is used for record the state of audio recorder. You can use 'inactive' and 'recording' and 'suspending'.
  state = "inactive";

  // web worker to parse audio
  worker = null;

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
  };

  constructor(config = null) {
    if (config) {
      this.setConfig(config);
    }

    // Create in inline web worker.
    this.worker = new SelfWorker(Processor);
  }

  /**
   * input stream => sourceNode => processNode => destination
   */
  start() {
    this.worker.init(this.config);

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

          // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
          window.AudioContext =
            window.AudioContext || window.webkitAudioContext;

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
            /**
             * We use audio context to suspend input stream process. This state judgement is unused.
             * But we can use state to track the state of audio context
             */

            if (this.state === "inactive" || this.state === "suspending")
              return;

            this.worker.record(this.getInputBuffer(e));
          };

          /**
           * Input stream connect to processor processNode.
           * Processor processNode connect to destination.
           * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect
           */

          this.sourceNode.connect(this.processNode);

          // Output to destination
          this.processNode.connect(this.context.destination);

          if (this.state === "inactive") {
            this.state = "recording";
            this.context.resume();
          }
        },
        () => {
          throw new Error("Authorization failed.");
        }
      );
    } else {
      throw new Error("Unsupported Browser.");
    }
  }

  stop() {
    if (this.state === "recording") {
      this.state = "inactive";
      this.sourceNode && this.sourceNode.disconnect();
      this.processNode && this.processNode.disconnect();

      // https://stackoverflow.com/questions/26670677/remove-red-icon-after-recording-has-stopped/26671315
      if (this.stream && this.stream.getTracks) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }

      this.context && this.context.close();
    }
  }

  pause() {
    if (this.state === "recording") {
      this.state = "suspending";
      this.context.suspend();
    }
  }

  resume() {
    if (this.state === "suspending") {
      this.state = "recording";
      this.context.resume();
    }
  }

  export(audioType, cb) {
    this.worker.export(audioType, cb);
  }

  release() {
    this.worker.release();
    this.context.close();
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
