/**
 * @file SMPSimpleGate.m
 * @brief Sample for CDP NativeBridge plugin client.
 */

#import "../Plugins/CDPNativeBridge/CDPGate.h"

// this class is instantiated by refrection. need not the header file.
@interface SMPSimpleGate : CDPGate
@end

@implementation SMPSimpleGate

/**
 * cool method.
 */
- (void)coolMethod:(NSNumber*)arg1 :(BOOL)arg2 :(NSString*)arg3 :(NSDictionary*)arg4
{
    if (nil == arg1) {
        NSLog(@"arg1 is nil.");
    }
    if (arg2) {
        NSLog(@"arg2 is YES.");
    }
    if (nil == arg3) {
        NSLog(@"arg3 is nil.");
    }
    if (nil == arg4) {
        NSLog(@"arg4 is nil.");
    }
    NSLog(@"arg1: %@", arg1);
    NSLog(@"arg2: %@", [NSNumber numberWithBool:arg2]);
    NSLog(@"arg3: %@", arg3);
    NSLog(@"arg4: %@", arg4);
    // TODO:
}

@end
