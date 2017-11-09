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
/* globals window, navigator, cordova, Promise */

var exec = cordova.require('cordova/exec');

var mediaDevices = {
    nativeMediaDevices: navigator.mediaDevices
};

mediaDevices.getSupportedConstraints = function () {
    return this.nativeMediaDevices.getSupportedConstraints();
};

mediaDevices.enumerateDevices = function () {
    return this.nativeMediaDevices.enumerateDevices();
};

mediaDevices.getUserMedia = function (constraints) {
    var mediaDevice = this.nativeMediaDevices;

    var audio = false;
    var video = false;

    if (typeof constraints.audio === 'object' || constraints.audio === true) {
        audio = true;
    }
    if (typeof constraints.video === 'object' || constraints.video === true) {
        video = true;
    }

    return new Promise(function (resolve, reject) {
        var success = function () {
            mediaDevice
                .getUserMedia(constraints)
                .then(function (stream) {
                    resolve(stream);
                })
                .catch(function (error) {
                    reject(error);
                });
        };
        var fail = function (error) {
            reject(error);
        };
        exec(success, fail, 'MediaStreams', 'getUserMedia', [audio, video]);
    });
};

module.exports = mediaDevices;
