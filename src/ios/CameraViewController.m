//
//  CameraViewController.m
//  Custom Camera
//
//  Created by Chris Leversuch on 30/06/2016.
//  Copyright © 2016 Brightec. All rights reserved.
//

#import "CameraViewController.h"
#import <AVFoundation/AVFoundation.h>


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
@end


@implementation CameraViewController

#pragma mark -
#pragma mark Lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];

    // Initialize the capture queue
    self.captureQueue = [[NSOperationQueue alloc] init];
    
    [self.cancelButton setTitle:[_imageCaptureInterface pluginLocalizedString:@"Cancel"] forState:UIControlStateNormal];

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
        self.session.sessionPreset = AVCaptureSessionPresetPhoto;
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
        AVCaptureStillImageOutput *stillOutput = [[AVCaptureStillImageOutput alloc] init];
        stillOutput.outputSettings = @{AVVideoCodecKey: AVVideoCodecJPEG};
        [self.session addOutput:stillOutput];
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

                                            if (!imageDataSampleBuffer || error) return;

                                            NSData *imageData = [AVCaptureStillImageOutput jpegStillImageNSDataRepresentation:imageDataSampleBuffer];

                                            UIImage *image = [UIImage imageWithCGImage:[[[UIImage alloc] initWithData:imageData] CGImage]
                                                                                 scale:1.0f
                                                                           orientation:[self currentImageOrientation]];

                                            [self handleImage:image];
                                        }];

}


/**
 *  @brief Do something with the image that's been taken (camera) / chosen (photo album)
 *
 *  @param image The image
 */
- (void)handleImage:(UIImage *)image
{
    NSLog(@"in handle image");
    [self.imageCaptureInterface receiveImage:image];
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}


- (IBAction)takePhotoButtonWasTouched:(UIButton *)sender
{
    [self takePicture];
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
