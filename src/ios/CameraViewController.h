//
//  CameraViewController.h
//  Custom Camera
//
//  Created by Chris Leversuch on 30/06/2016.
//  Copyright © 2016 Brightec. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CDVMediaStream.h"
#import <AVFoundation/AVFoundation.h>

@interface CameraViewController : UIViewController <AVCaptureFileOutputRecordingDelegate>{
    AVCaptureMovieFileOutput *movieOutput;
}
@property (nonatomic, assign) BOOL isAudio;
@property (assign, nonatomic) NSString *camDirection;
@property (assign, nonatomic) Float64 time;
@property (assign, nonatomic) NSString *task;
@property (assign, nonatomic) NSInteger flashModeValue;
@property (strong,nonatomic) CDVMediaStream * mediaStreamInterface;
- (BOOL)fileExistsAtPath:(NSString *)path isDirectory:(BOOL *)isDirectory;
@end
