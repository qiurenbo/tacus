<!-- TOC -->

- [Instruction](#instruction)
- [Preparation](#preparation)
  - [Audio Format](#audio-format)
  - [Sample Rate](#sample-rate)
  - [Bit Depth](#bit-depth)
  - [Bit Rate](#bit-rate)
  - [Channels](#channels)
- [Usage](#usage)
- [Docs](#docs)
  - [MediaRecorder](#mediarecorder)
    - [Audio Information](#audio-information)
    - [constructor](#constructor)
    - [Reference](#reference)
  - [AudioContext](#audiocontext)
    - [constructor](#constructor-1)
    - [Reference](#reference-1)
  - [Common API](#common-api)
    - [open](#open)
    - [start](#start)
    - [stop](#stop)
    - [pause](#pause)
    - [resume](#resume)

<!-- /TOC -->

# Instruction

fast-recorder is a simple library to recorder audio in browser.

# Preparation

Before use it, you should known Audio format.

## Audio Format

Common audio formats like wav, ogg, pcm, mp3 is a 'container' which is used to store codecs and audio information. Some formats may not contain codecs, but only contain the raw audio data, like wav and pcm.

## Sample Rate

The rate of capture and playback is called the sample rate.

## Bit Depth

The sample size—more accurately, the number of bits used to describe each sample—is called the bit depth or word length.

## Bit Rate

The number of bits transmitted per second is the bit rate.

https://www.presonus.com/learn/technical-articles/sample-rate-and-bit-depth

## Channels

Sound Channel refers to the independent audio signal which is collected or playback when the sound is recording or playback in different spatial position. Therefore, the number of channel is the amount of sound source when the sound is recording or the relevant speaker number when it is playback

https://www.gearbest.com/blog/how-to/6-types-of-sound-channels-2896

# Usage

see [example](./example)

# Docs

By fast-recorder, you can choose MediaRecorder or AudioContext as a core recorder api. By default, fast-recorder use AudioContext as default. This is because. :point_down:

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

### constructor

Initialize a fast-recorder instance.

As mentioned above, we can't control the output of MediaRecorder audio. So I don't provide a config to use it.

```
const recorder = new fast({
    method: "MediaRecorder",
});
```

### Reference

[MDN-MediaStreamAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)

[MDN-AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)

## AudioContext

fast-recorder use Web Audio API by default. For
compatibility, fast-recorder use [ScriptProcessorNode](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode) instead [AudioWorkletProcessor](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor) by default.

### constructor

Initialize a fast-recorder instance.

As mentioned above, we can't control the output of AudioContext audio. So we don't provide a config to use it.

```
const recorder = new fast({
    method: "AudioContext",
});
```

### Reference

[MDN-MediaStreamAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)

[MDN-AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)

## Common API

### open

Get recorder authority of browser.

```
recorder.open();
```

### start

Start Recording

```
recorder.start();
```

### stop

Stop Recording

```
recorder.stop(callback)
```

callback: function(url)

`url` is an object url.

### pause

Pause Recording

```
recorder.pause();
```

### resume

Resume Recording

```
recorder.resume();
```
