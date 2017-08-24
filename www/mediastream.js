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
/* globals Promise */

/**
 * This class contains information about the getUserMedia API.
 * @constructor
 */
var MediaStream = function (tracks) {
    this.id = tracks.id;
    this.audioTracks = [];
    if (tracks.audioTracks) {
        this.audioTracks = tracks.audioTracks;
    }
    this.videoTracks = [];
    if (tracks.videoTracks) {
        this.videoTracks = tracks.videoTracks;
    }
    this.onaddTrack = function () {};
    this.onremoveTrack = function () {};
    // this.active = true;
};

MediaStream.prototype.getAudioTracks = function () {
    return this.audioTracks;
};

MediaStream.prototype.getVideoTracks = function () {
    return this.videoTracks;
};

MediaStream.prototype.getTracks = function () {
    return this.videoTracks.concat(this.audioTracks);
};

MediaStream.prototype.addTrack = function (trck) {
    var tracks;
    if (trck.kind === 'video') {
        tracks = this.videoTracks;
    } else {
        tracks = this.audioTracks;
    }

    for (var i = 0; i < tracks.length; i++) {
        if (tracks[i].id === trck.id) {
            return;
        }
    }

    if (trck.kind === 'video') {
        this.videoTracks = this.videoTracks.concat(trck);
        this.onaddTrack();
    } else if (trck.kind === 'audio') {
        this.audioTracks = this.audioTracks.concat(trck);
        this.onaddTrack();
    }

};

MediaStream.prototype.removeTrack = function (trck) {
    var tracks;
    if (trck.kind === 'video') {
        tracks = this.videoTracks;
        for (var i = 0; i < tracks.length; i++) {
            if (tracks[i].id === trck.id) {
                this.videoTracks.splice(i, 1);
                this.onremoveTrack();
                return;
            }
        }

    } else if (trck.kind === 'audio') {
        tracks = this.audioTracks;
        for (var j = 0; j < tracks.length; j++) {
            if (tracks[j].id === trck.id) {
                this.audioTracks.splice(j, 1);
                this.onremoveTrack();
                return;
            }
        }

    }
};

MediaStream.prototype.getTrackbyId = function (id) {
    var tracks = this.videoTracks.concat(this.audioTracks);
    for (var i = 0; i < tracks.length; i++) {
        if (tracks[i].id === id) {
            return tracks[i];
        }
    }
};

MediaStream.prototype.clone = function () {
    var guid = function () {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
    };

    var video;
    if (this.videoTracks) {
        video = JSON.parse(JSON.stringify(this.videoTracks));
        for (var i = 0; i < video.length; i++) {
            video[i].id = guid();
        }
    }

    var audio;
    if (this.audioTracks) {
        audio = JSON.parse(JSON.stringify(this.audioTracks));
        for (var j = 0; j < audio.length; j++) {
            audio[j].id = guid();
        }
    }

    return new MediaStream({
        id: guid(),
        audioTracks: audio,
        videoTracks: video
    });
};

module.exports = MediaStream;
