<!-- TOC -->

- [Instruction](#instruction)
- [Preparation](#preparation)
    - [Audio Format](#audio-format)
    - [Sample Rate](#sample-rate)
    - [Bit Depth](#bit-depth)
    - [Bit Rate](#bit-rate)
    - [Channels](#channels)
- [Usage](#usage)
- [MediaRecorder VS AudioContext](#mediarecorder-vs-audiocontext)
    - [MediaRecorder](#mediarecorder)
        - [Audio Information](#audio-information)
    - [AudioContext](#audiocontext)
        - [Reference](#reference)
- [API](#api)
    - [constructorconfig](#constructorconfig)
        - [config](#config)
    - [open](#open)
    - [start](#start)
    - [stop](#stop)
    - [pause](#pause)
    - [resume](#resume)
    - [exportaudioType, callback](#exportaudiotype-callback)
        - [audioType](#audiotype)
        - [callback](#callback)

<!-- /TOC -->

# Instruction

fast-recorder is a simple library to recorder audio in browser.

# Preparation

Before use it, you should known some knowledge of Audio format.

## Audio Format

Common audio formats like wav, ogg, pcm, mp3 is a 'container' which means it is used to store codecs and data of audio.

## Sample Rate

The rate of capture and playback is called the sample rate.

## Bit Depth

The number of bits used to describe each sample is called the bit depth.

## Bit Rate

The number of bits transmitted per second is the bit rate.

```
 bitRate = bitDepth * sampleRate
```

https://www.presonus.com/learn/technical-articles/sample-rate-and-bit-depth

## Channels

Sound Channel refers to the independent audio signal which is collected or playback when the sound is recording or playback in different spatial position. Therefore, the number of channel is the amount of sound source when the sound is recording or the relevant speaker number when it is playback

https://www.gearbest.com/blog/how-to/6-types-of-sound-channels-2896

# Usage

fast-recorder is an simple library for web recording. You only
have to learn six methods: open, start, pause, resume, stop, clear.

See [examples](./example) for more details.

# MediaRecorder VS AudioContext

With fast-recorder, you can choose MediaRecorder or AudioContext as a core recorder api. By default, fast-recorder use AudioContext as default. This is because. :point_down:

## MediaRecorder

- there’s no bitrate control

- there’s no sample rate or audio quality control

- .webm files (with Vorbis/Opus audio and VP8/VP9 video) will have to be converted before they playback on virtually anything else other than the browsers they were recorded in

[HTML5’s Media Recorder API in Action on Chrome and Firefox](https://blog.addpipe.com/mediarecorder-api/)

### Audio Information

If you choose MediaRecorder as core API,something you must know before use it. There is a table made by [Remus Negrota](https://blog.addpipe.com/mediarecorder-api/)

| name        | CHROME 49+ | CHROME 52+ | FIREFOX 30 AND UP |
| ----------- | ---------- | ---------- | ----------------- |
| Container   | webm       | webm       | webm              |
| Audio codec | Opus       | Opus       | Vorbis            |
| Sample rate | 48kHz      | 48kHz      | 44.1 kHz          |

webm is an open source format that contains video compressed with VP8 or VP9 codecs and audio compressed with Vorbis or Opus codecs. The format is usually used for media content on web pages and it is supported by all the popular web-browser.

## AudioContext

Audio context can let user to control the sample rate and bit rate in recording.

fast-recorder use Web Audio API by default. For
compatibility and flexibility, fast-recorder use [ScriptProcessorNode](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode) instead [AudioWorkletProcessor](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor) by default.

### Reference

[MDN-MediaStreamAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)

[MDN-AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)

# API

## constructor(config)

Initialize a fast-recorder instance.

### config

```
{
  method: "AudioContext" | "MediaRecorder",
  type: "wav",
  bufferSize: 4096,
  sampleRate: 16000,
}
```

**example**:

```
const recorder = new fast({
    method: "AudioContext",
});
```

## open()

Get recorder authority of browser. It will block the main method of browsers.

**example**:

```
recorder.open();
```

## start()

Start Recording.

**example**:

```
recorder.start();
```

## stop()

Stop Recording.

**example**:

```
recorder.stop(cb)
```

`url` is an object url.

## pause()

Pause Recording.

**example**:

```
recorder.pause();
```

## resume()

Resume Recording.

**example**:

```
recorder.resume();
```

## export(audioType, callback)

Export specified format audio.

### audioType

'wav'|'pcm'


If isBlob is true, result in callback is blob, else is binary.

### callback

function(blob). Get a blob object.

**example**

```
recorder.export('wav',cb);
```
