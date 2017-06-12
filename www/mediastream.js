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
        utils = cordova.require('cordova/utils'),
        newID = '';
    /**
     * This class contains information about the getUserMedia API.
     * @constructor
     */
    var MediaStream = function(tracks) {
        // newTrackID();
        //  this.id = newTrackID();
        this.audioTracks = tracks.audioTracks;
        this.videoTracks = tracks.videoTracks;
        this.tracks = tracks;
        this.onaddTrack = function() {};
        this.onremoveTrack = function() {};
        //this.active = true;
    };

    MediaStream.prototype.getAudioTracks = function() {
        return this.audioTracks;
    };
    MediaStream.prototype.getVideoTracks = function() {
        return this.videoTracks;
    };
    MediaStream.prototype.getTracks = function() {
        return this.videoTracks.concat(this.audioTracks);
    };
    MediaStream.prototype.addTrack = function(trck) {
        var flag = true;
        if (trck.kind === 'video') {
            var tracks = this.videoTracks;
        } else {
            var tracks = this.audioTracks;
        }
        for (var i = 0; i < tracks.length; i++) {
            if (tracks[i].id === trck.id) {
                return;
            }
        }
        if (flag === true) {

            if (trck.kind === 'video') {
                this.videoTracks = this.videoTracks.concat(trck);
                this.onaddTrack();
            } else if (trck.kind === 'audio') {
                this.audioTracks = this.audioTracks.concat(trck);
                this.onaddTrack();
            }
        }
    };
    MediaStream.prototype.removeTrack = function(trck) {
        var tracks;
        if (trck.kind === 'video') {
            tracks = this.videoTracks;
            for (var i = 0; i < tracks.length; i++) {
                if (tracks[i].id === trck.id) {
                    this.videoTracks.splice(i, 1);
                    this.onremoveTrack();
                }
            }

        } else if (trck.kind === 'audio') {
            tracks = this.audioTracks;
            for (var i = 0; i < tracks.length; i++) {
                if (tracks[i].id === trck.id) {
                    this.audioTracks.splice(i, 1);
                    this.onremoveTrack();
                }
            }

        }
    };
    MediaStream.prototype.getTrackbyId = function(id) {
        var tracks = this.videoTracks.concat(this.audioTracks);
        for (var i = 0; i < tracks.length; i++) {
            if (tracks[i].id === id) {
                return tracks[i];
            }
        }
    };
    MediaStream.prototype.clone = function() {
        var stream = new MediaStream(this.tracks);
        return stream;
    };
    function newTrackID() {
        var success = function(result) {
            return result.id;
        };
        exec(success, null, 'Stream', 'createID', []);
    }


    module.exports = MediaStream;
