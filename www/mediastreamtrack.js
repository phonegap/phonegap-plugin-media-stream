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
/* globals Promise, cordova */
var exec = cordova.require('cordova/exec');

var MediaStreamTrack = function (track) {
    var that = this;
    var success = function (settings) {
        console.log('settings: ' + JSON.stringify(settings));
        that._settings = settings;
    };

    exec(success, null, 'Stream', 'getSettings', [track.id]);

    this.kind = track.kind;
    this.id = track.id;
    this.label = track.label;
    this.enabled = track.enabled;
    this.muted = track.muted;
    this.readyState = track.readyState;
    this._settings = {};
};

MediaStreamTrack.prototype.clone = function () {
    var guid = function () {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return (
            s4() +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            s4() +
            s4()
        );
    };

    var clonedTrack = new MediaStreamTrack(this);
    clonedTrack.id = guid();
    return clonedTrack;
};

MediaStreamTrack.prototype.stop = function () {
    this.readyState = 'ended';
};

MediaStreamTrack.prototype.getCapabilities = function () {
    return {};
};

MediaStreamTrack.prototype.getConstraints = function () {
    return {};
};

MediaStreamTrack.prototype.getSettings = function () {
    return this._settings;
};

MediaStreamTrack.prototype.applyConstraints = function (contraints) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
};

module.exports = MediaStreamTrack;
