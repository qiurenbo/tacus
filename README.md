# fast-recorder

fast-recorder is a simple library to recoder audio in browser.

## Usage

see (./example)[example]

## Docs
fast recorder use MediaRecorder and AudioContext as core recorder api. And use AudioContext as default API. This is because. :point_down:

### MediaRecorder

Although a simple and promising start, the Media Recording API still has some way to go before it can be used in a production environment:

there’s a lack of implementation and even initiative on major browsers like Safari and IE/Edge

there are no container or audio/video codec options
no sound in the Chrome implementation (audio recording works in Chrome 49)

**there’s no bitrate or picture quality control**

**there’s no sample rate or audio quality control**

**no support for .mp4, H.264 video and/or AAC audio**

**.webm files (with Vorbis/Opus audio and VP8/VP9 video) will have to be converted before they playback on virtually anything else other than the browsers they were recorded in**

all the recorded data is stored locally in the RAM, which limits the amount of video you can record to short video clips – as opposed to video recording solutions that rely on streaming the data

the standard’s pause() and resume() functions are not implemented yet

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