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
var flagConstraints = true;
var flagDevices = true;

var mediaDevices = {
    _devices: null
};

var supportedConstraints = {
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
};

mediaDevices.getSupportedConstraints = function () {
    var success = function (constraints) {
        console.log('constraints: ' + JSON.stringify(constraints));
        supportedConstraints = constraints;
    };

    // assign new values returned from native ios ; until then default values returned
    if (flagConstraints) {
        exec(success, null, 'Stream', 'getSupportedConstraints', []);
    }

    flagConstraints = false;
    return supportedConstraints;
};

mediaDevices.enumerateDevices = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        var success = function (device) {
            flagDevices = false;
            console.log('success ' + device.devices);
            that._devices = device.devices;
            resolve(that._devices);
        };

        if (flagDevices) {
            exec(success, null, 'Stream', 'enumerateDevices', []);
        } else {
            resolve(that._devices);
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

module.exports = mediaDevices;
