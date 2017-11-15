/* globals require, describe, it, expect, spyOn */

/*!
 * Module dependencies.
 */

var cordova = require('./helper/cordova');
var mediaDevices = require('../www/mediadevices');
var MediaStream = require('../www/mediastream');
var MediaStreamTrack = require('../www/mediastreamtrack');

var mockStream = { id: 'ack', audioTracks: [], videoTracks: [] };
var mockTrack = {
    kind: 'audio',
    id: 'ack',
    label: 'Internal microphone',
    enabled: true,
    muted: false,
    readyState: 'live'
};

/*!
 * Specification.
 */

describe('phonegap-plugin-media-stream', function () {
    describe('mediaDevices', function () {
        it('mediaDevices should exist', function () {
            expect(mediaDevices).toBeDefined();
            expect(typeof mediaDevices).toBe('object');
            expect(mediaDevices.enumerateDevices).toBeDefined();
            expect(typeof mediaDevices.enumerateDevices).toBe('function');
            expect(mediaDevices.getSupportedConstraints).toBeDefined();
            expect(typeof mediaDevices.getSupportedConstraints).toBe(
                'function'
            );
            expect(mediaDevices.getUserMedia).toBeDefined();
            expect(typeof mediaDevices.getUserMedia).toBe('function');
        });
    });

    describe('mediaStream', function () {
        it('mediaStream constructor', function () {
            var stream = new MediaStream(mockStream);

            expect(stream).toBeDefined();
            expect(typeof stream).toBe('object');
            expect(stream.id).toEqual('ack');
            expect(stream.active).toEqual(false);
            expect(stream.getAudioTracks).toBeDefined();
            expect(typeof stream.getAudioTracks).toBe('function');
            expect(stream.getAudioTracks().length).toBe(0);
            expect(stream.getVideoTracks).toBeDefined();
            expect(typeof stream.getVideoTracks).toBe('function');
            expect(stream.getVideoTracks().length).toBe(0);
            expect(stream.getTracks).toBeDefined();
            expect(typeof stream.getTracks).toBe('function');
            expect(stream.getTracks().length).toBe(0);
            expect(stream.getTrackById).toBeDefined();
            expect(typeof stream.getTrackById).toBe('function');
            expect(stream.addTrack).toBeDefined();
            expect(typeof stream.addTrack).toBe('function');
            expect(stream.removeTrack).toBeDefined();
            expect(typeof stream.removeTrack).toBe('function');
            expect(stream.clone).toBeDefined();
            expect(typeof stream.clone).toBe('function');
        });
    });

    describe('MediaStreamTrack', function () {
        it('MediaStreamTrack constructor', function () {
            var track = new MediaStreamTrack(mockTrack);

            expect(track).toBeDefined();
            expect(typeof track).toBe('object');
            expect(track.kind).toEqual('audio');
            expect(track.id).toEqual('ack');
            expect(track.label).toEqual('Internal microphone');
            expect(track.enabled).toEqual(true);
            expect(track.muted).toEqual(false);
            // expect(track.onmute).toEqual('');
            // expect(track.onunmute).toEqual('');
            // expect(track.onended).toEqual('');
            expect(track.readyState).toEqual('live');
            expect(track.clone).toBeDefined();
            expect(typeof track.clone).toBe('function');
            expect(track.stop).toBeDefined();
            expect(typeof track.stop).toBe('function');
            expect(track.getCapabilities).toBeDefined();
            expect(typeof track.getCapabilities).toBe('function');
            expect(track.getConstraints).toBeDefined();
            expect(typeof track.getConstraints).toBe('function');
            expect(track.getSettings).toBeDefined();
            expect(typeof track.getSettings).toBe('function');
            expect(track.applyConstraints).toBeDefined();
            expect(typeof track.applyConstraints).toBe('function');
        });

        it('mediaStreamTrack.clone', function () {
            var track = new MediaStreamTrack(mockTrack);
            var clonedTrack = track.clone();
            expect(clonedTrack.id).toNotBe(track.id);
            expect(clonedTrack).toBeDefined();
            expect(typeof clonedTrack).toBe('object');
            expect(clonedTrack.kind).toEqual(track.kind);
            expect(clonedTrack.label).toEqual(track.label);
            expect(clonedTrack.enabled).toEqual(track.enabled);
            expect(clonedTrack.muted).toEqual(track.muted);
            expect(clonedTrack.readyState).toEqual(track.readyState);
            expect(clonedTrack.clone).toBeDefined();
            expect(typeof clonedTrack.clone).toBe('function');
            expect(clonedTrack.stop).toBeDefined();
            expect(typeof clonedTrack.stop).toBe('function');
            expect(clonedTrack.getCapabilities).toBeDefined();
            expect(typeof clonedTrack.getCapabilities).toBe('function');
            expect(clonedTrack.getConstraints).toBeDefined();
            expect(typeof clonedTrack.getConstraints).toBe('function');
            expect(clonedTrack.getSettings).toBeDefined();
            expect(typeof clonedTrack.getSettings).toBe('function');
            expect(clonedTrack.applyConstraints).toBeDefined();
            expect(typeof clonedTrack.applyConstraints).toBe('function');
        });

        it('mediaStreamTrack.stop', function () {
            var track = new MediaStreamTrack(mockTrack);
            track.stop();
            expect(track.readyState).toBe('ended');
        });
        xit('mediaStreamTrack.getCapabilities', function () {
            var track = new MediaStreamTrack(mockTrack);
            var capabilities = track.getCapabilities();
            expect(capabilities.width).toBeDefined();
            expect(capabilities.width.max).toBeDefined();
            expect(capabilities.width.min).toBeDefined();
            expect(typeof capabilities.width.min).toBe('number');
            expect(typeof capabilities.width.max).toBe('number');
            expect(capabilities.height).toBeDefined();
            expect(capabilities.height.max).toBeDefined();
            expect(capabilities.height.min).toBeDefined();
            expect(typeof capabilities.height.min).toBe('number');
            expect(typeof capabilities.height.max).toBe('number');
            expect(capabilities.aspectRatio).toBeDefined();
            expect(capabilities.aspectRatio.max).toBeDefined();
            expect(capabilities.aspectRatio.min).toBeDefined();
            expect(typeof capabilities.aspectRatio.min).toBe('number');
            expect(typeof capabilities.aspectRatio.max).toBe('number');
            expect(capabilities.frameRate).toBeDefined();
            expect(capabilities.frameRate.max).toBeDefined();
            expect(capabilities.frameRate.min).toBeDefined();
            expect(typeof capabilities.frameRate.min).toBe('number');
            expect(typeof capabilities.frameRate.max).toBe('number');
            expect(capabilities.volume).toBeDefined();
            expect(capabilities.volume.max).toBeDefined();
            expect(capabilities.volume.min).toBeDefined();
            expect(typeof capabilities.volume.min).toBe('number');
            expect(typeof capabilities.volume.max).toBe('number');
            expect(capabilities.sampleRate).toBeDefined();
            expect(capabilities.sampleRate.max).toBeDefined();
            expect(capabilities.sampleRate.min).toBeDefined();
            expect(typeof capabilities.sampleRate.min).toBe('number');
            expect(typeof capabilities.sampleRate.max).toBe('number');
            expect(capabilities.sampleSize).toBeDefined();
            expect(capabilities.sampleSize.max).toBeDefined();
            expect(capabilities.sampleSize.min).toBeDefined();
            expect(typeof capabilities.sampleSize.min).toBe('number');
            expect(typeof capabilities.sampleSize.max).toBe('number');
            expect(capabilities.latency).toBeDefined();
            expect(capabilities.latency.max).toBeDefined();
            expect(capabilities.latency.min).toBeDefined();
            expect(typeof capabilities.latency.min).toBe('number');
            expect(typeof capabilities.latency.max).toBe('number');
            expect(capabilities.channelCount).toBeDefined();
            expect(capabilities.channelCount.max).toBeDefined();
            expect(capabilities.channelCount.min).toBeDefined();
            expect(typeof capabilities.channelCount.min).toBe('number');
            expect(typeof capabilities.channelCount.max).toBe('number');
            expect(capabilities.deviceId).toBeDefined();
            expect(typeof capabilities.deviceId).toBe('string');
            expect(capabilities.groupId).toBeDefined();
            expect(typeof capabilities.groupId).toBe('string');
            expect(capabilities.facingMode).toBeDefined();
            expect(capabilities.facingMode.exact).toBeDefined();
            expect(capabilities.facingMode.ideal).toBeDefined();
            expect(typeof capabilities.facingMode.exact).toBe('string');
            expect(typeof capabilities.facingMode.ideal).toBe('string');
            expect(capabilities.echoCancellation).toBeDefined();
            expect(capabilities.echoCancellation.exact).toBeDefined();
            expect(capabilities.echoCancellation.ideal).toBeDefined();
            expect(typeof capabilities.echoCancellation.exact).toBe('boolean');
            expect(typeof capabilities.echoCancellation.ideal).toBe('boolean');
            expect(capabilities.noiseSuppression).toBeDefined();
            expect(capabilities.noiseSuppression.exact).toBeDefined();
            expect(capabilities.noiseSuppression.ideal).toBeDefined();
            expect(typeof capabilities.noiseSuppression.exact).toBe('boolean');
            expect(typeof capabilities.noiseSuppression.ideal).toBe('boolean');
            expect(capabilities.autoGainControl).toBeDefined();
            expect(capabilities.autoGainControl.exact).toBeDefined();
            expect(capabilities.autoGainControl.ideal).toBeDefined();
            expect(typeof capabilities.autoGainControl.exact).toBe('boolean');
            expect(typeof capabilities.autoGainControl.ideal).toBe('boolean');
        });

        xit('mediaStreamTrack.getSettings', function () {
            var track = new MediaStreamTrack(mockTrack);
            var settings = track.getSettings();
            expect(typeof settings).toBe('object');
            expect(settings.width).toBeDefined();
            expect(typeof settings.width).toBe('number');
            expect(settings.height).toBeDefined();
            expect(typeof settings.height).toBe('number');
            expect(settings.aspectRatio).toBeDefined();
            expect(typeof settings.aspectRatio).toBe('number');
            expect(settings.frameRate).toBeDefined();
            expect(typeof settings.frameRate).toBe('number');
            expect(settings.volume).toBeDefined();
            expect(typeof settings.volume).toBe('number');
            expect(settings.sampleRate).toBeDefined();
            expect(typeof settings.sampleRate).toBe('number');
            expect(settings.sampleSize).toBeDefined();
            expect(typeof settings.sampleSize).toBe('number');
            expect(settings.latency).toBeDefined();
            expect(typeof settings.latency).toBe('number');
            expect(settings.channelCount).toBeDefined();
            expect(typeof settings.channelCount).toBe('number');
            expect(settings.deviceId).toBeDefined();
            expect(typeof settings.deviceId).toBe('string');
            expect(settings.groupId).toBeDefined();
            expect(typeof settings.groupId).toBe('string');
            expect(settings.facingMode).toBeDefined();
            expect(typeof settings.facingMode).toBe('string');
            expect(settings.echoCancellation).toBeDefined();
            expect(typeof settings.echoCancellation).toBe('boolean');
            expect(settings.noiseSuppression).toBeDefined();
            expect(typeof settings.noiseSuppression).toBe('boolean');
            expect(settings.autoGainControl).toBeDefined();
            expect(typeof settings.autoGainControl).toBe('boolean');
        });

        xit('mediaStreamTrack.getConstraints', function () {
            var track = new MediaStreamTrack(mockTrack);
            var constraints = track.getConstraints();
            expect(constraints.width).toBeDefined();
            expect(constraints.width.exact).toBeDefined();
            expect(constraints.width.ideal).toBeDefined();
            expect(typeof constraints.width.ideal).toBe('number');
            expect(typeof constraints.width.exact).toBe('number');
            expect(constraints.height).toBeDefined();
            expect(constraints.height.exact).toBeDefined();
            expect(constraints.height.ideal).toBeDefined();
            expect(typeof constraints.height.ideal).toBe('number');
            expect(typeof constraints.height.exact).toBe('number');
            expect(constraints.aspectRatio).toBeDefined();
            expect(constraints.aspectRatio.exact).toBeDefined();
            expect(constraints.aspectRatio.ideal).toBeDefined();
            expect(typeof constraints.aspectRatio.ideal).toBe('number');
            expect(typeof constraints.aspectRatio.exact).toBe('number');
            expect(constraints.frameRate).toBeDefined();
            expect(constraints.frameRate.exact).toBeDefined();
            expect(constraints.frameRate.ideal).toBeDefined();
            expect(typeof constraints.frameRate.ideal).toBe('number');
            expect(typeof constraints.frameRate.exact).toBe('number');
            expect(constraints.volume).toBeDefined();
            expect(constraints.volume.exact).toBeDefined();
            expect(constraints.volume.ideal).toBeDefined();
            expect(typeof constraints.volume.ideal).toBe('number');
            expect(typeof constraints.volume.exact).toBe('number');
            expect(constraints.sampleRate).toBeDefined();
            expect(constraints.sampleRate.exact).toBeDefined();
            expect(constraints.sampleRate.ideal).toBeDefined();
            expect(typeof constraints.sampleRate.ideal).toBe('number');
            expect(typeof constraints.sampleRate.exact).toBe('number');
            expect(constraints.sampleSize).toBeDefined();
            expect(constraints.sampleSize.exact).toBeDefined();
            expect(constraints.sampleSize.ideal).toBeDefined();
            expect(typeof constraints.sampleSize.ideal).toBe('number');
            expect(typeof constraints.sampleSize.exact).toBe('number');
            expect(constraints.facingMode).toBeDefined();
            expect(constraints.facingMode.exact).toBeDefined();
            expect(constraints.facingMode.ideal).toBeDefined();
            expect(typeof constraints.facingMode.exact).toBe('string');
            expect(typeof constraints.facingMode.ideal).toBe('string');
            expect(constraints.echoCancellation).toBeDefined();
            expect(constraints.echoCancellation.exact).toBeDefined();
            expect(constraints.echoCancellation.ideal).toBeDefined();
            expect(typeof constraints.echoCancellation.exact).toBe('boolean');
            expect(typeof constraints.echoCancellation.ideal).toBe('boolean');
            expect(constraints.noiseSuppression).toBeDefined();
            expect(constraints.noiseSuppression.exact).toBeDefined();
            expect(constraints.noiseSuppression.ideal).toBeDefined();
            expect(typeof constraints.noiseSuppression.exact).toBe('boolean');
            expect(typeof constraints.noiseSuppression.ideal).toBe('boolean');
            expect(constraints.autoGainControl).toBeDefined();
            expect(constraints.autoGainControl.exact).toBeDefined();
            expect(constraints.autoGainControl.ideal).toBeDefined();
            expect(typeof constraints.autoGainControl.exact).toBe('boolean');
            expect(typeof constraints.autoGainControl.ideal).toBe('boolean');
            expect(constraints.latency).toBeDefined();
            expect(constraints.latency.exact).toBeDefined();
            expect(constraints.latency.ideal).toBeDefined();
            expect(typeof constraints.latency.ideal).toBe('number');
            expect(typeof constraints.latency.exact).toBe('number');
            expect(constraints.channelCount).toBeDefined();
            expect(constraints.channelCount.exact).toBeDefined();
            expect(constraints.channelCount.ideal).toBeDefined();
            expect(typeof constraints.channelCount.ideal).toBe('number');
            expect(typeof constraints.channelCount.exact).toBe('number');
            expect(constraints.deviceId).toBeDefined();
            expect(constraints.deviceId.exact).toBeDefined();
            expect(constraints.deviceId.ideal).toBeDefined();
            expect(typeof constraints.deviceId.exact).toBe('string');
            expect(typeof constraints.deviceId.ideal).toBe('string');
            expect(constraints.groupId).toBeDefined();
            expect(constraints.groupId.exact).toBeDefined();
            expect(constraints.groupId.ideal).toBeDefined();
            expect(typeof constraints.groupId.exact).toBe('string');
            expect(typeof constraints.groupId.ideal).toBe('string');
        });

        xit('mediaStreamTrack.applyConstraints', function () {
            var track = new MediaStreamTrack(mockTrack);
            var p = track.applyConstraints();
            expect(p).toBeDefined();
            expect(typeof p === 'object').toBe(true);
        });
    });
});
