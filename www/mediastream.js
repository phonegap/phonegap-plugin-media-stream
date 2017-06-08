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
/* globals Promise cordova */

var exec = cordova.require('cordova/exec'),
    utils = cordova.require('cordova/utils');

/**
 * This class contains information about the getUserMedia API.
 * @constructor
 */
var MediaStream = function(tracks) {
    this.id = '';
    this.audioTracks = tracks.audioTracks;
    this.videoTracks = tracks.videoTracks;
    this.active = true;
};

MediaStream.prototype.getAudioTracks = function() {
    return this.audioTracks;

};
MediaStream.prototype.getVideoTracks = function() {
    return this.videoTracks;

};
MediaStream.prototype.getTracks = function() {
    return this.audioTracks.concat(this.videoTracks);
};

module.exports = MediaStream;
