//
//  CameraViewController.h
//  Custom Camera
//
//  Created by Chris Leversuch on 30/06/2016.
//  Copyright © 2016 Brightec. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CDVImageCapture.h"

@interface CameraViewController : UIViewController
@property (assign, nonatomic) NSString *camDirection;
@property (assign, nonatomic) NSInteger flashModeValue;
@property (strong,nonatomic) CDVImageCapture * imageCaptureInterface;
@end
