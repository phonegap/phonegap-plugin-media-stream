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

    @synthesize video;

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

- (void)createID:(CDVInvokedUrlCommand*)command
{
    NSString *uuid = [[NSUUID UUID] UUIDString];
    NSMutableDictionary *newID = [NSMutableDictionary dictionaryWithCapacity:2];
    [newID setObject:uuid forKey:@"id"];

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:newID];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getSupportedConstraints:(CDVInvokedUrlCommand*)command
{


    int count = 0;
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    NSMutableDictionary* supportedConstraints = [NSMutableDictionary dictionaryWithCapacity:10];
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
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getUserMedia:(CDVInvokedUrlCommand*)command
{

    // find constraints
    //pass content

    NSMutableDictionary * dict = command.arguments[0];
    NSString *facingMode = @"";
    NSLog(@"%@", dict[@"audio"]);
    NSLog(@"%@", dict[@"video"]);


    BOOL audio = [[dict valueForKey:@"audio"] boolValue];
    
    if(![dict objectForKey:@"video"]) {
        video = NO;
    }
    else {
        if([dict valueForKey:@"video"] != (void*)kCFBooleanTrue && [dict valueForKey:@"video"] != (void*)kCFBooleanFalse){
            if([[[dict valueForKey:@"video"] valueForKey:@"facingMode"]  isEqual: @"user"])
            {
                //facingMode is user
                video = YES;
                facingMode = @"user";
            }
            else if([[[dict valueForKey:@"video"] valueForKey:@"facingMode"]  isEqual: @"environment"])
            {
                //facingMode is environment
                video = YES;
                facingMode = @"environment";
            }
        }
        else {
            video = [[dict valueForKey:@"video"] boolValue];
        }
    }
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    NSMutableArray *arrayVideo = [[NSMutableArray alloc] initWithCapacity:10];
    NSArray *audioDevices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeAudio];
    NSMutableArray *arrayAudio = [[NSMutableArray alloc] initWithCapacity:10];
    NSMutableDictionary *userMedia = [NSMutableDictionary dictionaryWithCapacity:10];
    if(video == YES){
        for (AVCaptureDevice *device in devices) {
            NSMutableDictionary *videoTracks = [NSMutableDictionary dictionaryWithCapacity:5];
            NSString *uuid = [[NSUUID UUID] UUIDString];

            //intend to pass the camera requested in constraints by the user

            if(device.position == AVCaptureDevicePositionFront){
                [videoTracks setObject:uuid forKey:@"id"];
                [videoTracks setObject:@"video" forKey:@"kind"];
                [videoTracks setObject:@"frontcamera" forKey:@"description"];
                if([facingMode isEqualToString: @"user"] || [facingMode isEqualToString: @""]){
                    [arrayVideo addObject:videoTracks];
                }
            }
            else{
                [videoTracks setObject:uuid forKey:@"id"];
                [videoTracks setObject:@"video" forKey:@"kind"];
                [videoTracks setObject:@"rearcamera" forKey:@"description"];
                if([facingMode isEqualToString: @"environment"] || [facingMode isEqualToString: @""]){
                    [arrayVideo addObject:videoTracks];
                }
            }

        }
        [userMedia setObject:arrayVideo forKey:@"videoTracks"];
    }
    if(audio == YES){

        for (AVCaptureDevice *device in audioDevices) {
            NSMutableDictionary *audioTracks = [NSMutableDictionary dictionaryWithCapacity:5];
            NSString *uuid = [[NSUUID UUID] UUIDString];
            [audioTracks setObject:uuid forKey:@"id"];
            [audioTracks setObject:@"audio" forKey:@"kind"];
            [audioTracks setObject:device.deviceType forKey:@"description"];
            [arrayAudio addObject:audioTracks];
        }
        [userMedia setObject:arrayAudio forKey:@"audioTracks"];
    }

    NSString *uuid = [[NSUUID UUID] UUIDString];
    [userMedia setObject:uuid forKey:@"id"];

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:userMedia];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];


}


@end
