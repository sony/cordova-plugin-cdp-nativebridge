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
    NSString* msg = [NSString stringWithFormat:@"arg1: %@, arg2: %@, arg3: %@, 日本語でOK: %@"
                     , arg1, (arg2 ? @"true" : @"false"), arg3, (arg4[@"ok"] ? @"true" : @"false")];
    [self returnParams:msg];
}

@end
