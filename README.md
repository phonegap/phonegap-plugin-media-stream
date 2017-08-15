# phonegap-plugin-media-stream [![Build Status](https://travis-ci.org/phonegap/phonegap-plugin-media-stream.svg)](https://travis-ci.org/phonegap/phonegap-plugin-media-stream)
------------------------

This plugin provides an implementation of the [W3C Media Capture API](https://w3c.github.io/mediacapture-main/) which allows authorized web applications to access streams from the device's audio and video capturing interfaces, i.e. to use the data available from the camera and the microphone. The streams exposed by the API can be bound directly to the HTML <audio> or <video> elements or read and manipulated in the code, including further more specific processing via [Image Capture API](https://w3c.github.io/mediacapture-image/), [Media Recorder API](https://w3c.github.io/mediacapture-record/MediaRecorder.html) or [Real-Time Communication](https://w3c.github.io/webrtc-pc/).


## Installation

    phonegap plugin add phonegap-plugin-media-stream

    phonegap plugin add https://github.com/phonegap/phonegap-plugin-media-stream.git

## The `mediaDevices` Object

The mediaDevices object has the following methods:

- [getUserMedia(optional MediaStreamConstraints constraints)](https://github.com/phonegap/phonegap-plugin-media-stream#getusermediaoptional-mediastreamconstraints-constraints)
- [getSupportedConstraints()](https://github.com/phonegap/phonegap-plugin-media-stream#getsupportedconstraints)

### getUserMedia(optional MediaStreamConstraints constraints)

The `getUserMedia` method call prompts the user for permission to capture audio or video input. The method returns a promise that when resolved returns a `MediaStream` object. You can constrain what type of media streams are return by passing in an option `MediaStreamConstraints` object.

#### Example

```
navigator.mediaDevices.getUserMedia({
    'audio': true,
    'video': {
        facingMode: 'user'
    }
}).then(function(mediaStream) {
  // do something with the media stream
});
```

### getSupportedConstraints()

The `getSupportedConstraints` method returns an object which describes which constraints the device supports. You can check the constraints before making a call to `getUserMedia` to make sure that the functionality you want is supported.

#### Example

```
var constraints = navigator.mediaDevices.getSupportedConstraints();
console.log(constraints);
```

## Quirks

The iOS implementation that this plugin provides does not allow you to attach the returned `MediaStream` object to a `audio` or `video` tag. Rather you will use the `MeidaStream` object to get a `MediaStreamTrack` to pass to the Image (see [phonegap-plugin-image-capture](https://github.com/phonegap/phonegap-plugin-image-capture)) or Audio capture API.

## [Contributing](.github/CONTRIBUTING.md)

## [LICENSE](LICENSE)
