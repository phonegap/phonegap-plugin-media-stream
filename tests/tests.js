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
/* jshint jasmine: true */
/* global navigator, describe, it, expect, fail */
exports.defineAutoTests = function () {

    describe('Plugin conforms to w3c specs', function () {

        it('navigator.mediaDevices should exist', function () {
            expect(navigator.mediaDevices).toBeDefined();
            expect(typeof navigator.mediaDevices).toBe('object');
            expect(navigator.mediaDevices.enumerateDevices).toBeDefined();
            expect(typeof navigator.mediaDevices.enumerateDevices).toBe('function');
            // does not return ondevicechnge as defined
            // expect(navigator.mediaDevices.ondevicechange).toBeDefined();
            expect(navigator.mediaDevices.getSupportedConstraints).toBeDefined();
            expect(typeof navigator.mediaDevices.getSupportedConstraints).toBe('function');
            expect(navigator.mediaDevices.getUserMedia).toBeDefined();
            expect(typeof navigator.mediaDevices.getUserMedia).toBe('function');

        });

        it('enumerateDevices should return a promise with attributes', function (done) {
            try {
                var promise = navigator.mediaDevices.enumerateDevices();
                expect(typeof promise.then).toBe('function');
                promise.then(function (info) {
                    expect(info).toBeDefined();
                    expect(typeof info).toBe('object');
                    info.forEach(function (device) {
                        expect(device.deviceId).toBeDefined();
                        expect(device.kind).toBeDefined();
                        expect(device.label).toBeDefined();
                        expect(device.groupId).toBeDefined();
                        expect(typeof device.deviceId).toBe('string');
                        expect(typeof device.kind).toBe('string');
                        expect(typeof device.label).toBe('string');
                        expect(typeof device.groupId).toBe('string');
                    });
                    done();
                }, function (err) {
                    expect(err).toBeDefined();
                    fail(err);
                    done();
                });
            } catch (err) {
                fail(err);
                done();
            }

        });

        it('getSupportedConstraints should return a MediaTrackSupportedConstraints object', function () {

            var support = navigator.mediaDevices.getSupportedConstraints();
            expect(support.width).toBeDefined();
            expect(support.height).toBeDefined();
            expect(support.aspectRatio).toBeDefined();
            expect(support.frameRate).toBeDefined();
            expect(support.facingMode).toBeDefined();
            expect(support.volume).toBeDefined();
            expect(support.sampleRate).toBeDefined();
            expect(support.sampleSize).toBeDefined();
            expect(support.echoCancellation).toBeDefined();
            expect(support.latency).toBeDefined();
            expect(support.channelCount).toBeDefined();
            expect(support.deviceId).toBeDefined();
            expect(support.groupId).toBeDefined();
            expect(typeof support.width).toBe('boolean');
            expect(typeof support.height).toBe('boolean');
            expect(typeof support.aspectRatio).toBe('boolean');
            expect(typeof support.frameRate).toBe('boolean');
            expect(typeof support.facingMode).toBe('boolean');
            expect(typeof support.volume).toBe('boolean');
            expect(typeof support.sampleRate).toBe('boolean');
            expect(typeof support.sampleSize).toBe('boolean');
            expect(typeof support.echoCancellation).toBe('boolean');
            expect(typeof support.latency).toBe('boolean');
            expect(typeof support.channelCount).toBe('boolean');
            expect(typeof support.deviceId).toBe('boolean');
            expect(typeof support.groupId).toBe('boolean');

        });

        it('getUserMedia should return a promise with attributes', function (done) {
            try {
                var constraints = {
                    video: true
                };
                var promise = navigator.mediaDevices.getUserMedia(constraints);
                expect(typeof promise.then).toBe('function');
                promise.then(function (media) {
                    expect(media).toBeDefined();
                    expect(typeof media).toBe('object');
                    // media.getworks with android studio
                    expect(media.getVideoTracks()).toBeDefined();
                    expect(media.getAudioTracks()).toBeDefined();
                    expect(media.getTracks()).toBeDefined();
                    expect(media.id).toBeDefined();
                    expect(media.getTrackbyId()).toBeDefined();
                    expect(media.addTrack()).toBeDefined();
                    expect(media.removeTrack()).toBeDefined();
                    expect(media.onaddtrack).toBeDefined();
                    expect(media.onremovetrack).toBeDefined();
                    expect(media.clone()).toBeDefined();
                    expect(media.id).toBe('string');
                    var tracks = media.clone();
                    expect(tracks.id).toBeDefined();
                    expect(tracks.audioTracks).toBeDefined();
                    expect(tracks.videoTracks).toBeDefined();
                    expect(tracks.getTrackbyId()).toBeDefined();
                    expect(tracks.addTrack()).toBeDefined();
                    expect(tracks.removeTrack()).toBeDefined();
                    expect(tracks.onaddtrack).toBeDefined();
                    expect(tracks.onremovetrack).toBeDefined();
                    expect(tracks.clone()).toBeDefined();
                    expect(tracks.getVideoTracks()).toBeDefined();
                    expect(tracks.getAudioTracks()).toBeDefined();
                    expect(tracks.getTracks()).toBeDefined();

                    var videoTracks = media.getVideoTracks();
                    expect(videoTracks[0].label).toBeDefined();
                    expect(videoTracks[0].kind).toBeDefined();
                    expect(videoTracks[0].id).toBeDefined();
                    expect(videoTracks[0].enabled).toBeDefined();
                    expect(videoTracks[0].muted).toBeDefined();
                    expect(videoTracks[0].onmute).toBeDefined();
                    expect(videoTracks[0].onunmute).toBeDefined();
                    expect(videoTracks[0].readyState).toBeDefined();
                    expect(videoTracks[0].onended).toBeDefined();
                    // expect(videoTracks[0].stop).toBeDefined();
                    // expect(videoTracks[0].getCapabilities).toBeDefined();
                    // expect(videoTracks[0].getConstraints).toBeDefined();
                    // expect(videoTracks[0].getSettings).toBeDefined();
                    // expect(videoTracks[0].applyConstraints).toBeDefined();

                    var audioTracks = media.getAudioTracks();
                    expect(audioTracks[0].label).toBeDefined();
                    expect(audioTracks[0].kind).toBeDefined();
                    expect(audioTracks[0].id).toBeDefined();
                    expect(audioTracks[0].enabled).toBeDefined();
                    expect(audioTracks[0].muted).toBeDefined();
                    expect(audioTracks[0].onmute).toBeDefined();
                    expect(audioTracks[0].onunmute).toBeDefined();
                    expect(audioTracks[0].readyState).toBeDefined();
                    expect(audioTracks[0].onended).toBeDefined();
                    // expect(audioTracks[0].stop).toBeDefined();

                    var tracks2 = media.getTracks();
                    expect(tracks2[0].label).toBeDefined();
                    expect(tracks2[0].kind).toBeDefined();
                    expect(tracks2[0].id).toBeDefined();
                    expect(tracks2[0].enabled).toBeDefined();
                    expect(tracks2[0].muted).toBeDefined();
                    expect(tracks2[0].onmute).toBeDefined();
                    expect(tracks2[0].onunmute).toBeDefined();
                    expect(tracks2[0].readyState).toBeDefined();
                    expect(tracks2[0].onended).toBeDefined();
                    // expect(tracks[0].stop).toBeDefined();
                    done();
                }, function (err) {
                    expect(err).toBeDefined();
                    fail(err);
                    done();
                });
            } catch (err) {
                fail(err);
                done();
            }

        });

    });

};
