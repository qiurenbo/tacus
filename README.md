# Psittacus

[![npm](https://badgen.net/npm/v/psittacus)](https://www.npmjs.com/package/psittacus)
[![gzip size](https://badgen.net/badgesize/gzip/https://cdn.jsdelivr.net/npm/psittacus@0.1.1/dist/psittacus.min.js)](https://cdn.jsdelivr.net/npm/psittacus@0.1.1/dist/psittacus.min.js)
[![Build Status](https://travis-ci.com/qiurenbo/psittacus.svg?branch=master)](https://travis-ci.com/qiurenbo/psittacus)
[![install size](https://packagephobia.com/badge?p=psittacus@0.1.1)](https://packagephobia.com/result?p=psittacus@0.1.1)
[![dep](https://badgen.net/david/dep/qiurenbo/psittacus?label=deps)](https://david-dm.org/qiurenbo/psittacus)
[![downloads](https://badgen.net/npm/types/psittacus)](https://www.npmjs.com/package/psittacuss)
[![](https://data.jsdelivr.com/v1/package/npm/psittacus/badge)](https://www.jsdelivr.com/package/npm/psittacus)

<!-- TOC -->

- [Psittacus](#psittacus)
- [Instruction](#instruction)
- [Preparation](#preparation)
  - [Audio Format](#audio-format)
  - [Sample Rate](#sample-rate)
  - [Bit Depth](#bit-depth)
  - [Bit Rate](#bit-rate)
  - [Channels](#channels)
- [MediaRecorder VS AudioContext](#mediarecorder-vs-audiocontext)
  - [MediaRecorder](#mediarecorder)
    - [Audio Information](#audio-information)
  - [AudioContext](#audiocontext)
    - [Reference](#reference)
- [Quick Start](#quick-start)
- [Installation](#installation)
  - [Use npm](#use-npm)
  - [Use script](#use-script)
    - [Local](#local)
    - [CDN](#cdn)
  - [Usage](#usage)
- [API](#api)
  - [constructor([config])](#constructorconfig)
  - [start()](#start)
  - [stop()](#stop)
  - [pause()](#pause)
  - [resume()](#resume)
  - [export(audioType, callback)](#exportaudiotype-callback)

<!-- /TOC -->

# Instruction

psittacus is a simple library to recorder audio in browser.

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

# MediaRecorder VS AudioContext

By default, psittacus use AudioContext as default. This is because. :point_down:

## MediaRecorder

- there’s no bitrate control

- there’s no sample rate or audio quality control

- .webm files (with Vorbis/Opus audio and VP8/VP9 video) will have to be converted before they playback on virtually anything else other than the browsers they were recorded in

[HTML5’s Media Recorder API in Action on Chrome and Firefox](https://blog.addpipe.com/mediarecorder-api/)

### Audio Information

There is a table made by [Remus Negrota](https://blog.addpipe.com/mediarecorder-api/).

| name        | CHROME 49+ | CHROME 52+ | FIREFOX 30 AND UP |
| ----------- | ---------- | ---------- | ----------------- |
| Container   | webm       | webm       | webm              |
| Audio codec | Opus       | Opus       | Vorbis            |
| Sample rate | 48kHz      | 48kHz      | 44.1 kHz          |

webm is an open source format that contains video compressed with VP8 or VP9 codecs and audio compressed with Vorbis or Opus codecs. The format is usually used for media content on web pages and it is supported by all the popular web-browser.

## AudioContext

Audio context can let user to control the sample rate and bit rate in recording.
For compatibility and flexibility, psittacus use [ScriptProcessorNode](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode) instead [AudioWorkletProcessor](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor) by default.

### Reference

[MDN-MediaStreamAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)

[MDN-AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)

# Quick Start

psittacus is an simple library for web recording. You only
have to learn six methods: open, start, pause, resume, stop, clear.

# Installation

## Use npm

```
npm i psittacus
```

import it as ES6 module

```
import Psittacus from 'psittacus'
```

## Use script

### Local

```
<script src="/path/to/psittacus.js"></script>
```

You can download the latest version from [here](https://github.com/qiurenbo/psittacus/releases).

### CDN

```
<script src="https://cdn.jsdelivr.net/npm/psittacus@0.1.1/dist/psittacus.min.js"></script>
```

## Usage

```
let psittacus = new Psittacus();

psittacus.start();

psittacus.stop();

psittacus.export('wav',async (blob)=>{
    const url = URL.createObjectURL(object);

    // Use <audio></audio> to play it.
    audio.src = url;

    // Get binary data of audio
    const binary = await blob.arrayBuffer()
})
```

See [examples](./example) for more details.

# API

## constructor([config])

Initialize a psittacus instance.

**config** 
| **parameter** | **description**    | **type**                                            |
| ------------- | ------------------ | --------------------------------------------------- |
| method        | core audio api     | "AudioContext"                                      |
| bufferSize    | buffer size        | 256 \| 512 \| 1024 \| 2048 \| 4096 \| 8192 \| 16384 |
| sampleRate    | sample rate        | 8000 \| 16000 \| 22050 \| 24000 \| 44100 \| 48000   |
| bitDepth      | bits of per sample | 8 \|16                                              |


**example**:

```
const psittacus = new Psittacus();
```

## start()

Start Recording.

**example**:

```
psittacus.start();
```

## stop()

Stop Recording.

**example**:

```
psittacus.stop()
```


## pause()

Pause Recording.

**example**:

```
psittacus.pause();
```

## resume()

Resume Recording.

**example**:

```
psittacus.resume();
```

## export(audioType, callback)

Export specified format audio.

**config** 
| **parameter** | **description**   | **type**       |
| ------------- | ----------------- | -------------- |
| audioType     | export audio type | 'wav'\|'pcm'   |
| callback      | get a blob object | function(blob) |


**example**

```
psittacus.export('wav',cb);
```
