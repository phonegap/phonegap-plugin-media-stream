//
//  CameraViewController.m
//  Custom Camera
//
//  Created by Chris Leversuch on 30/06/2016.
//  Copyright © 2016 Brightec. All rights reserved.
//

#import "CameraViewController.h"
#import <AVFoundation/AVFoundation.h>
#import "UIImage+DrawBlock.h"


@interface CameraViewController () <UINavigationControllerDelegate, UIImagePickerControllerDelegate>
@property (weak, nonatomic) IBOutlet UIView *bottomBarView;
@property (weak, nonatomic) IBOutlet UIView *cameraContainerView;
@property (weak, nonatomic) IBOutlet UIButton *takePhotoButton;
@property (weak, nonatomic) IBOutlet UIButton *cancelButton;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *cameraViewBottomConstraint;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *bottomBarHeightConstraint;
@property (strong, nonatomic) UIVisualEffectView *blurView;
@property (nonatomic, strong) AVCaptureSession *session;
@property (nonatomic, strong) UIView *capturePreviewView;
@property (nonatomic, strong) AVCaptureVideoPreviewLayer *capturePreviewLayer;
@property (nonatomic, strong) NSOperationQueue *captureQueue;
@property (nonatomic, assign) UIImageOrientation imageOrientation;
@property (assign, nonatomic) AVCaptureFlashMode flashMode;
@property (nonatomic, assign) BOOL videoStarted;
@end


@implementation CameraViewController

#pragma mark -
#pragma mark Lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];

    // Initialize the capture queue
    self.captureQueue = [[NSOperationQueue alloc] init];
    [self.cancelButton setTitle:[_mediaStreamInterface pluginLocalizedString:@"Cancel"] forState:UIControlStateNormal];

    // Initialise the blur effect used when switching between cameras
    UIBlurEffect *effect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleLight];
    self.blurView = [[UIVisualEffectView alloc] initWithEffect:effect];

    // Listen for orientation changes so that we can update the UI
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(orientationChanged:)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil];

    // 3.5" and 4" devices have a smaller bottom bar
    if (CGRectGetHeight([UIScreen mainScreen].bounds) <= 568.0f) {
        self.bottomBarHeightConstraint.constant = 91.0f;
        [self.bottomBarView layoutIfNeeded];
    }

    // 3.5" devices have the top and bottom bars over the camera view
    if (CGRectGetHeight([UIScreen mainScreen].bounds) == 480.0f) {
        self.cameraViewBottomConstraint.constant = -CGRectGetHeight(self.bottomBarView.frame);
        [self.cameraContainerView layoutIfNeeded];
    }

    [self updateOrientation];
}


- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    [self enableCapture];
}


- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];

    [self.captureQueue cancelAllOperations];
    [self.capturePreviewLayer removeFromSuperlayer];
    for (AVCaptureInput *input in self.session.inputs) {
        [self.session removeInput:input];
    }
    for (AVCaptureOutput *output in self.session.outputs) {
        [self.session removeOutput:output];
    }
    [self.session stopRunning];
    self.session = nil;
}


- (void)viewDidLayoutSubviews
{
    [super viewDidLayoutSubviews];

    self.capturePreviewLayer.frame = self.cameraContainerView.bounds;
}


- (BOOL)prefersStatusBarHidden
{
    return YES;
}


- (BOOL)shouldAutorotate
{
    // We'll rotate the UI elements manually.
    // The downside of this is that the device is technically always in portrait
    // which means that the Control Center always pulls up from the edge with
    // the home button even when the device is landscape
    return NO;
}


- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}


#pragma mark -
#pragma mark Accessors

- (void)setFlashMode:(AVCaptureFlashMode)flashMode
{
    _flashMode = flashMode;


}

/**
 *  @brief Rotate the UI elements based on the device orientation. Animated
 */
- (void)updateOrientation
{
    UIDeviceOrientation deviceOrientation = [UIDevice currentDevice].orientation;

    CGFloat angle;
    switch (deviceOrientation) {
        case UIDeviceOrientationPortraitUpsideDown:
            angle = M_PI;
            break;

        case UIDeviceOrientationLandscapeLeft:
            angle = M_PI_2;
            break;

        case UIDeviceOrientationLandscapeRight:
            angle = - M_PI_2;
            break;

        default:
            angle = 0;
            break;
    }

    [UIView animateWithDuration:.3 animations:^{
        self.takePhotoButton.transform = CGAffineTransformMakeRotation(angle);
        self.cancelButton.transform = CGAffineTransformMakeRotation(angle);
    }];
}


#pragma mark -
#pragma mark Helpers

- (void)enableCapture
{
    if (self.session) return;

    NSBlockOperation *operation = [self captureOperation];
    operation.completionBlock = ^{
        [self operationCompleted];
    };
    operation.queuePriority = NSOperationQueuePriorityVeryHigh;
    [self.captureQueue addOperation:operation];
}


- (NSBlockOperation *)captureOperation
{
    NSBlockOperation *operation = [NSBlockOperation blockOperationWithBlock:^{
        self.session = [[AVCaptureSession alloc] init];
        self.session.sessionPreset = AVCaptureSessionPresetMedium;
        AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
        if([self.camDirection isEqualToString:@"frontcamera"]){
            device = [self frontCamera];
        }
        _flashMode = (AVCaptureFlashMode)self.flashModeValue;
        NSError *error = nil;

        AVCaptureDeviceInput *input = [AVCaptureDeviceInput deviceInputWithDevice:device error:&error];
        if (!input) return;

        [self.session addInput:input];

        // Turn on point autofocus for middle of view
        [device lockForConfiguration:&error];
        if (!error) {
            if ([device isFlashModeSupported:self.flashMode]) {
                device.flashMode = self.flashMode;
            } else if( [device isFlashModeSupported:AVCaptureFlashModeOff]){
                device.flashMode = AVCaptureFlashModeOff;
                self.flashMode = device.flashMode;
            }
        }
        [device unlockForConfiguration];

        self.capturePreviewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:self.session];
        self.capturePreviewLayer.frame = self.cameraContainerView.bounds;
        self.capturePreviewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;

        // Still Image Output
        if([self.task isEqualToString:@"imageCapture"]){
            AVCaptureStillImageOutput *stillOutput = [[AVCaptureStillImageOutput alloc] init];
            stillOutput.outputSettings = @{AVVideoCodecKey: AVVideoCodecJPEG};
            [self.session addOutput:stillOutput];

        }

        // Video output
        if([self.task isEqualToString:@"mediaRecorder"]){
            movieOutput = [[AVCaptureMovieFileOutput alloc] init];
            Float64 totalSeconds = self.time /1000 ;
            int32_t timeScale = 30;
            CMTime maxDuration = CMTimeMakeWithSeconds(totalSeconds, timeScale);
            movieOutput.maxRecordedDuration = maxDuration;
            [self.session addOutput:movieOutput];
            if(self.isAudio){
            AVCaptureDevice *audioDevice = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeAudio];
            AVCaptureDeviceInput * audioInput = [AVCaptureDeviceInput deviceInputWithDevice:audioDevice error:nil];
            [self.session addInput:audioInput];
            }

        }
    }];
    return operation;
}


- (void)operationCompleted
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (!self.session) return;
        self.capturePreviewView = [[UIView alloc] initWithFrame:CGRectZero];
#if TARGET_IPHONE_SIMULATOR
        self.capturePreviewView.backgroundColor = [UIColor redColor];
#endif
        [self.cameraContainerView addSubview:self.capturePreviewView];
        //[self.capturePreviewView autoPinEdgesToSuperviewEdges];
        [self.capturePreviewView.layer addSublayer:self.capturePreviewLayer];
        self.videoStarted = NO;
        [self.session startRunning];
        if ([[self currentDevice] hasFlash]) {
            [self updateFlashlightState];
        }
    });
}


- (void)updateFlashlightState
{
    if (![self currentDevice]) return;
    AVCaptureDevice *device = [self currentDevice];
    NSError *error = nil;
    BOOL success = [device lockForConfiguration:&error];
    if (success) {
        device.flashMode = self.flashMode;
    }
    [device unlockForConfiguration];
}


- (AVCaptureDevice *)currentDevice
{
    return [(AVCaptureDeviceInput *)self.session.inputs.firstObject device];
}


- (AVCaptureDevice *)frontCamera
{
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    for (AVCaptureDevice *device in devices) {
        if (device.position == AVCaptureDevicePositionFront) {
            return device;
        }
    }
    return nil;
}


- (UIImageOrientation)currentImageOrientation
{
    UIDeviceOrientation deviceOrientation = [[UIDevice currentDevice] orientation];
    UIImageOrientation imageOrientation;

    AVCaptureDeviceInput *input = self.session.inputs.firstObject;
    if (input.device.position == AVCaptureDevicePositionBack) {
        switch (deviceOrientation) {
            case UIDeviceOrientationLandscapeLeft:
                imageOrientation = UIImageOrientationUp;
                break;

            case UIDeviceOrientationLandscapeRight:
                imageOrientation = UIImageOrientationDown;
                break;

            case UIDeviceOrientationPortraitUpsideDown:
                imageOrientation = UIImageOrientationLeft;
                break;

            default:
                imageOrientation = UIImageOrientationRight;
                break;
        }
    } else {
        switch (deviceOrientation) {
            case UIDeviceOrientationLandscapeLeft:
                imageOrientation = UIImageOrientationDownMirrored;
                break;

            case UIDeviceOrientationLandscapeRight:
                imageOrientation = UIImageOrientationUpMirrored;
                break;

            case UIDeviceOrientationPortraitUpsideDown:
                imageOrientation = UIImageOrientationRightMirrored;
                break;

            default:
                imageOrientation = UIImageOrientationLeftMirrored;
                break;
        }
    }

    return imageOrientation;
}


- (void)takePicture
{
    AVCaptureStillImageOutput *output = self.session.outputs.lastObject;
    AVCaptureConnection *videoConnection = output.connections.lastObject;
    if (!videoConnection) return;

    [output captureStillImageAsynchronouslyFromConnection:videoConnection
                                        completionHandler:^(CMSampleBufferRef imageDataSampleBuffer, NSError *error) {

                                            if (!imageDataSampleBuffer || error) {
                                                [self.mediaStreamInterface receiveError];
                                            }
                                            else {
                                                NSData *imageData = [AVCaptureStillImageOutput jpegStillImageNSDataRepresentation:imageDataSampleBuffer];

                                                UIImage *image = [UIImage imageWithCGImage:[[[UIImage alloc] initWithData:imageData] CGImage]
                                                                                 scale:1.0f
                                                                           orientation:[self currentImageOrientation]];

                                                [self handleImage:image];
                                            }
                                        }];

}

- (void)takeVideo
{
    NSURL *outputURL = [self getStorageDirectory];
    __weak CameraViewController* weakSelf = self;
    [movieOutput startRecordingToOutputFileURL:outputURL recordingDelegate:weakSelf];

}
- (void)captureOutput:(AVCaptureFileOutput *)captureOutput
didFinishRecordingToOutputFileAtURL:(NSURL *)outputFileURL
      fromConnections:(NSArray *)connections
                error:(NSError *)error
{
    NSLog(@"didFinishRecordingToOutputFileAtURL");
    BOOL RecordedSuccessfully = YES;
    if ([error code] != noErr)
    {
        // A problem occurred: Find out if the recording was successful.
        id value = [[error userInfo] objectForKey:AVErrorRecordingSuccessfullyFinishedKey];
        if (value)
        {
            RecordedSuccessfully = [value boolValue];
        }
    }

    if (RecordedSuccessfully)
    {
        [self handleVideo:outputFileURL];
        NSLog(@"didFinishRecordingToOutputFileAtURL - success");
    }
    else {
        [self.mediaStreamInterface receiveError];
    }
}
- (NSURL*) getStorageDirectory
{
    NSError *err = nil;
    BOOL isDir;
    NSFileManager* fm = [NSFileManager defaultManager];
    NSArray *URLs = [fm URLsForDirectory:NSLibraryDirectory inDomains:NSUserDomainMask];
    NSURL *libraryDirectoryUrl = [URLs objectAtIndex:0];
    libraryDirectoryUrl = [libraryDirectoryUrl URLByAppendingPathComponent:@"NoCloud/"];
    BOOL exists = [fm fileExistsAtPath:libraryDirectoryUrl.path  isDirectory:&isDir];
    if (!exists)
    {
        [fm createDirectoryAtURL:libraryDirectoryUrl withIntermediateDirectories:YES attributes:nil error:&err];
        if(err != nil)
        {
            NSLog(@"%@", err);
        }
    }
    NSString *uuid = [[NSUUID UUID] UUIDString];
    uuid = [uuid stringByAppendingString:@".mov"];
    return [libraryDirectoryUrl URLByAppendingPathComponent:uuid];
}

/**
 *  @brief Do something with the image that's been taken (camera) / chosen (photo album)
 *
 *  @param image The image
 */
- (void)handleImage:(UIImage *)image
{
    NSLog(@"in handle image");
    [self.mediaStreamInterface receiveImage:image];
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

- (void)handleVideo:(NSURL *)outputURL
{
    NSLog(@"in handle video");

    // fire the stop event and return file path
    NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];
    [dict setObject:@"inactive" forKey:@"state"];
    [dict setObject:[outputURL absoluteString] forKey:@"url"];
    [self.mediaStreamInterface sendPluginResult:dict keepResult:NO];

    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}


- (IBAction)takePhotoButtonWasTouched:(UIButton *)sender
{
    if([self.task  isEqual: @"imageCapture"]){
        [self takePicture];
    }
    else {
        if(self.videoStarted == NO){
            self.videoStarted = YES;

            [self.takePhotoButton setBackgroundImage:[self innerRedCircle] forState:UIControlStateNormal];

            // fire the started event
            NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];
            [dict setObject:@"recording" forKey:@"state"];
            [self.mediaStreamInterface sendPluginResult:dict keepResult:YES];

            [self takeVideo];
        }
        else{
            self.videoStarted = NO;
            [movieOutput stopRecording];
        }
    }

}

- (UIImage *)innerRedCircle {
    static UIImage *_image = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _image = [UIImage imageWithSize:CGSizeMake(66.0f, 66.0f) drawBlock:^(CGContextRef context, CGSize size) {
            UIBezierPath *innerCirclePath = [UIBezierPath bezierPathWithOvalInRect:CGRectMake(8, 8, 50, 50)];
            [[UIColor redColor] setFill];
            [innerCirclePath fill];
        }];
    });
    return _image;
}

- (IBAction)cancelButtonWasTouched:(UIButton *)sender
{
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}


- (void)orientationChanged:(NSNotification *)sender
{
    [self updateOrientation];
}

@end
