cordova.define("phonegap-plugin-media-stream.mediastream", function(require, exports, module) {
/* global cordova:false */
/* globals window, Promise */

var exec = cordova.require('cordova/exec'),
    utils = cordova.require('cordova/utils');
    flagConstraints = 0;
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

   mediaDevices.getSupportedConstraints = function(){
   	
   	// assign new values returned from native ios ; until then default values returned

   		if(flagConstraints != 1)
               {
               exec(success, null, "MediaStream","getSupportedConstraints", []);
               var success = function(constraints) {
                console.log("constraints: " + JSON.stringify(constraints));
               supportedConstraints = constraints;
               }
               }
               return supportedConstraints;
               flagConstraints = 1;
               
   };

    mediaDevices.enumerateDevices = function() {
    var devices = {};
    if(flagDevices != 0){
    exec(success, null, "MediaStream","enumerateDevices", []);
    var success = function(device){
               console.log(device.devices);
               devices = device.devices ;
    }
    }
               return devices;
               flagDevices = 1;

   //	return new Promise(function(resolve,reject){

    // });
   };


   mediaDevices.getUserMedia = function(constraints) {
               
    exec(null,null,"MediaStream", "getUserMedia", constraints);

   //	return new Promise(function(resolve,reject){

    // });
   };


module.exports = mediaDevices;

});
