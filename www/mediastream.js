/* global cordova:false */
/* globals window, Promise */

var exec = cordova.require('cordova/exec'),
    utils = cordova.require('cordova/utils'),
    flagConstraints = 0,
    flagDevices = 0;

var mediaDevices = {};
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
	if(flagConstraints !== 0) {
       exec(success, null, 'MediaStream', 'getSupportedConstraints', []);
    }

    flagConstraints = 1;
    return supportedConstraints;
};

mediaDevices.enumerateDevices = function() {
    var devices = {};

    var success = function(device) {
       console.log(device.devices);
       devices = device.devices ;
    };

    if(flagDevices !== 0){
        exec(success, null, 'MediaStream', 'enumerateDevices', []);
    }

    flagDevices = 1;
    return devices;
    //	return new Promise(function(resolve,reject){
    // });
};


mediaDevices.getUserMedia = function(constraints) {
    exec(null, null, 'MediaStream', 'getUserMedia', constraints);

    //	return new Promise(function(resolve,reject){

    // });
};

module.exports = mediaDevices;
