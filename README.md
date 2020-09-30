# Tacus

[![npm](https://badgen.net/npm/v/tacus)](https://www.npmjs.com/package/tacus)
[![gzip size](https://badgen.net/badgesize/gzip/https://cdn.jsdelivr.net/npm/tacus@0.1.1/dist/tacus.min.js)](https://cdn.jsdelivr.net/npm/tacus@0.1.1/dist/tacus.min.js)
[![Build Status](https://travis-ci.com/qiurenbo/tacus.svg?branch=master)](https://travis-ci.com/qiurenbo/tacus)
[![install size](https://packagephobia.com/badge?p=tacus@0.1.1)](https://packagephobia.com/result?p=tacus@0.1.1)
[![dep](https://badgen.net/david/dep/qiurenbo/tacus?label=deps)](https://david-dm.org/qiurenbo/tacus)
[![downloads](https://badgen.net/npm/types/tacus)](https://www.npmjs.com/package/tacuss)
[![](https://data.jsdelivr.com/v1/package/npm/tacus/badge)](https://www.jsdelivr.com/package/npm/tacus)

<!-- TOC -->

- [Tacus](#tacus)
- [Features](#features)
- [Instruction](#instruction)
- [Quick Start](#quick-start)
- [Installation](#installation)
    - [Use npm](#use-npm)
    - [Use script](#use-script)
        - [Local](#local)
        - [CDN](#cdn)
    - [Usage](#usage)
- [API](#api)
    - [constructor[config]](#constructorconfig)
    - [start](#start)
    - [stop](#stop)
    - [pause](#pause)
    - [resume](#resume)
    - [download](#download)

<!-- /TOC -->

# Features

- Easy. Use only 5 API to do every thing about recording and playing.

# Instruction

Tacus is a simple library to recorder audio in browser.

# Quick Start

Tacus is an simple library for web recording. You only
have to learn six methods: open, start, pause, resume, stop, clear.

# Installation

## Use npm

```
npm i tacus
```

import it as ES6 module

```
import tacus from 'tacus'
```

## Use script

### Local

```
<script src="/path/to/tacus.js"></script>
```

You can download the latest version from [here](https://github.com/qiurenbo/tacus/releases).

### CDN

```
<script src="https://cdn.jsdelivr.net/npm/tacus@0.1.1/dist/tacus.min.js"></script>
```

## Usage

```
let tacus = new tacus();

tacus.start();

tacus.stop();
```

See [examples](./example) for more details.

# API

## constructor([config])

Initialize a Tacus instance.

**config**
| **parameter** | **description** | **type** |
| ------------- | ------------------ | ------------------------------- |
| bufferSize | buffer size | 256 \| 512 \| 1024 \| 2048 \| 4096 \| 8192 \| 16384 |
| sampleRate | sample rate | 8000 \| 16000 \| 22050 \| 24000 \| 44100 \| 48000 |

**example**:

```
const tacus = new Tacus();
```

## start()

Start recording or playing.

**example**:

```
tacus.start();
```

## stop()

Stop recording or playing.

**example**:

```
tacus.stop()
```

## pause()

Pause recording or playing.

**example**:

```
tacus.pause();
```

## resume()

Resume recording or playing.

**example**:

```
tacus.resume();
```

## download

download audio.

**example**:

```
tacus.download();
```
