/* globals require, describe, it, expect */

/*!
 * Module dependencies.
 */

var cordova = require('./helper/cordova');
var mediaDevices = require('../www/mediadevices');

/*!
 * Specification.
 */

describe('phonegap-plugin-media-stream', function () {
    it('mediaDevices should exist', function () {
        expect(mediaDevices).toBeDefined();
        expect(typeof mediaDevices).toBe('object');
        expect(mediaDevices.enumerateDevices).toBeDefined();
        expect(typeof mediaDevices.enumerateDevices).toBe('function');
        expect(mediaDevices.getSupportedConstraints).toBeDefined();
        expect(typeof mediaDevices.getSupportedConstraints).toBe('function');
        expect(mediaDevices.getUserMedia).toBeDefined();
        expect(typeof mediaDevices.getUserMedia).toBe('function');

    });
});
