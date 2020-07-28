# fast-recorder

fast-recorder is a simple library to recoder audio in browser

## Usage

see (./example)[example]

## Docs

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

## Reference
[MDN-MediaStreamAudioSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamAudioSourceNode)

[MDN-AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)