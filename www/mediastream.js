/* global cordova:false */
/* globals window, Promise */

var exec = cordova.require('cordova/exec'),
    utils = cordova.require('cordova/utils'),
    flagConstraints = true,
    flagDevices = true;

var mediaDevices = {
    _devices: null
};

var supportedConstraints = {
    'width' : true ,
    'height': true ,
    'aspectRatio' : true ,
    'frameRate': true ,
    'facingMode' : true ,
    'volume': true ,
    'sampleRate' : true ,
    'sampleSize': true ,
    'echoCancellation' : true ,
    'latency': true ,
    'channelCount' : true ,
    'deviceId': true ,
    'groupId': true
};

mediaDevices.getSupportedConstraints = function() {
    var success = function(constraints) {
        console.log('constraints: ' + JSON.stringify(constraints));
        supportedConstraints = constraints;
    };

    // assign new values returned from native ios ; until then default values returned
	if(flagConstraints) {
       exec(success, null, 'MediaStream', 'getSupportedConstraints', []);
    }

    flagConstraints = false;
    return supportedConstraints;
};

mediaDevices.enumerateDevices = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        var success = function(device) {
            flagDevices = false;
            console.log('success ' + device.devices);
            that._devices = device.devices ;
            resolve(that._devices);
        };

        if(flagDevices){
            exec(success, null, 'MediaStream', 'enumerateDevices', []);
        } else {
            resolve(that._devices);
        }
    });
};


mediaDevices.getUserMedia = function(constraints) {
    return new Promise(function(resolve,reject){
        var success = function(getMediaTracks){
            console.log('mediatrack' + getMediaTracks);
            resolve(getMediaTracks);
            }
            var args = [constraints];
            exec(success, null, 'MediaStream', 'getUserMedia', args);

     });
};

module.exports = mediaDevices;
