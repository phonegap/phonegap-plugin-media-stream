/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

@import AVFoundation;

#import "CDVMediaStream.h"


@implementation CDVMediaStream

//@synthesize devices,videoDeviceDiscoverySession;

- (void)enumerateDevices:(CDVInvokedUrlCommand*)command
{
    
    //  NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    NSMutableArray *array = [[NSMutableArray alloc] initWithCapacity:10];
    NSArray *devices = [AVCaptureDevice devices];
    for (AVCaptureDevice *device in devices) {
        NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithCapacity:5];
        NSLog(@"%@", device.deviceType);
        NSLog(@"%@", device.description);
        [dict setObject:device.deviceType forKey:@"kind"];
        [dict setObject:device.description forKey:@"label"];
        [dict setObject:@"undefined" forKey:@"deviceID"];
        [dict setObject:@"undefined" forKey:@"groupID"];
        [array addObject:dict];
    }
    
    NSMutableDictionary* enumDevices = [NSMutableDictionary dictionaryWithCapacity:2];
    [enumDevices setObject:array forKey:@"devices"];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:enumDevices];
    [result setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    
    
}

- (void)getSupportedConstraints:(CDVInvokedUrlCommand*)command
{
    
    
    int count = 0;
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    NSMutableDictionary* supportedConstraints = [NSMutableDictionary dictionaryWithCapacity:8];
    for (AVCaptureDevice *device in devices) {
        if ([device position] == AVCaptureDevicePositionFront) {
            count+=1;
        }
        if ([device position] == AVCaptureDevicePositionBack ) {
            count+=1;
        }
    }
    
    // can be supported in certain width-height combinations only.
    // can be determined/set using AVCaptureSessionPreset
    [supportedConstraints setObject:[NSNumber numberWithBool:YES] forKey:@"width"];
    [supportedConstraints setObject:[NSNumber numberWithBool:YES] forKey:@"height"];
    
    
    if(count > 1)
    {
        [supportedConstraints setObject:[NSNumber numberWithBool:YES] forKey:@"facingMode"];
    }
    
    // only certain values are supported
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"aspectRatio"];
    
    //allows range of frame rates ; the spec says any value can be specified.
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"frameRate"];
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"volume"];
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"sampleRate"];
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"sampleSize"];
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"echoCancellation"];
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"latency"];
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"channelCount"];
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"deviceId"];
    [supportedConstraints setObject:[NSNumber numberWithBool:NO] forKey:@"groupId"];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:supportedConstraints];
    [result setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    
}

- (void)getUserMedia:(CDVInvokedUrlCommand*)command
{
    
    //still in works
    
    AVCaptureSession *session = [[AVCaptureSession alloc] init];
    AVCaptureDevice *videoDevice = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if (videoDevice)
    {
        NSError *error;
        AVCaptureDeviceInput *videoInput = [AVCaptureDeviceInput deviceInputWithDevice:videoDevice error:&error];
        if (!error)
        {
            if ([session canAddInput:videoInput])
            [session addInput:videoInput];
            else
            NSLog(@"Couldn't add video input");
        }
        else
        {
            NSLog(@"Couldn't create video input");
        }
    }
    
    AVCaptureVideoPreviewLayer *previewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:session];
    
    [previewLayer setVideoGravity:AVLayerVideoGravityResizeAspectFill];
    // how to set video on index.html
    
    AVCaptureVideoDataOutput *videoOutput = [[AVCaptureVideoDataOutput alloc] init];
    videoOutput.videoSettings = nil;
    [session addOutput:videoOutput];
    [session startRunning];
    
    // Planning to use AVCaptureMovileFileOutput method startRecordingToOutputFileURL to start recording a URL and then pass that URL to the js layer and bind it as a source to the video element.
    
    // A different exec call for stopping the video recording ?
    
}


@end
