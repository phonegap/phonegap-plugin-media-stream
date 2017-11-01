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
    });
});
