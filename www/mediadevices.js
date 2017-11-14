/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/
/* globals Promise, cordova, MediaStream */
var exec = cordova.require('cordova/exec');
var channel = require('cordova/channel');
var flagConstraints = true;
var flagDevices = true;
var mediaDevices = {
    _devices: [],
    _supportedConstraints: {
        width: true,
        height: true,
        aspectRatio: true,
        frameRate: true,
        facingMode: true,
        volume: true,
        sampleRate: true,
        sampleSize: true,
        echoCancellation: true,
        latency: true,
        channelCount: true,
        deviceId: true,
        groupId: true
    }
};

mediaDevices.getSupportedConstraints = function () {
    var successConstraints = function (constraints) {
        mediaDevices._supportedConstraints = constraints;
        flagConstraints = false;
    };
    if (!flagConstraints) {
        return this._supportedConstraints;
    } else {
        exec(successConstraints, null, 'Stream', 'getSupportedConstraints', []);
    }
};

mediaDevices.enumerateDevices = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        var successDevices = function (device) {
            mediaDevices._devices = device.devices;
            flagDevices = false;
        };
        if (!flagDevices) {
            resolve(that._devices);
        } else {
            exec(successDevices, null, 'Stream', 'enumerateDevices', []);
        }
    });
};

mediaDevices.getUserMedia = function (constraints) {
    return new Promise(function (resolve, reject) {
        if (
            constraints === undefined ||
            (constraints.audio === false && constraints.video === false)
        ) {
            var err = new Error();
            err.message =
                'Failed to execute getUserMedia on MediaDevices: At least one of audio and video must be requested';
            reject(err);
        } else {
            var success = function (getMediaTracks) {
                var stream = new MediaStream(getMediaTracks);
                resolve(stream);
            };
            exec(success, null, 'Stream', 'getUserMedia', [constraints]);
        }
    });
};

channel.onCordovaReady.subscribe(function () {
    var successConstraints = function (constraints) {
        mediaDevices._supportedConstraints = constraints;
        flagConstraints = false;
    };
    var successDevices = function (device) {
        mediaDevices._devices = device.devices;
        flagDevices = false;
    };
    exec(successConstraints, null, 'Stream', 'getSupportedConstraints', []);
    exec(successDevices, null, 'Stream', 'enumerateDevices', []);
});

module.exports = mediaDevices;
