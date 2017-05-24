/* global cordova:false */
/* globals window, Promise */

var exec = cordova.require('cordova/exec'),
    utils = cordova.require('cordova/utils');


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

   		return supportedConstraints;

   };

   mediaDevices.enumerateDevices = function() {

   	return new Promise(function(resolve,reject){

	});
   };


   mediaDevices.getUserMedia = function(constraints) {

   	return new Promise(function(resolve,reject){

	});
   };


module.exports = mediaDevices;

};
};
