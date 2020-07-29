# fast-recorder

fast-recorder is a simple library to recoder audio in browser.

## Usage

see [example](./example)

## Docs

fast recorder use MediaRecorder and AudioContext as core recorder api. And use AudioContext as default API. This is because. :point_down:

### MediaRecorder

- there’s no bitrate control

- there’s no sample rate or audio quality control

- .webm files (with Vorbis/Opus audio and VP8/VP9 video) will have to be converted before they playback on virtually anything else other than the browsers they were recorded in

[HTML5’s Media Recorder API in Action on Chrome and Firefox](https://blog.addpipe.com/mediarecorder-api/)

### constructor

Initialize a fast-recorder instance.

```
const recorder = new fast();
```

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

callback like callback(url)=>{}

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

## Reference

[MDN-MediaStreamAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)

[MDN-AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
