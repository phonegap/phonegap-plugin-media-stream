/* globals require, describe, it, expect */

/*!
 * Module dependencies.
 */

var cordova = require('./helper/cordova');
var mediaDevices = require('../www/mediadevices');
var MediaStream = require('../www/mediastream');

var mockStream = { id: 'ack' };

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
            expect(stream.getVideoTracks).toBeDefined();
            expect(typeof stream.getVideoTracks).toBe('function');
            expect(stream.getTracks).toBeDefined();
            expect(typeof stream.getTracks).toBe('function');
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
});
