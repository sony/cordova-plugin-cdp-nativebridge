/**
 * @file SMPSimpleGate.m
 * @brief Sample for CDP NativeBridge plugin client.
 */

#import "../Plugins/CDPNativeBridge/CDPGate.h"

#define TAG @"[Sample][Native][SMPSimpleGate]"

// this class is instantiated by refrection. need not the header file.
@interface SMPSimpleGate : CDPGate
@end

@implementation SMPSimpleGate

/**
 * sample method:
 * cool method.
 */
- (void)coolMethod:(NSNumber*)arg1 :(BOOL)arg2 :(NSString*)arg3 :(NSDictionary*)arg4
{
    NSLog(@"%@ coolMethod, called.", TAG);
    
    NSString* msg = [NSString stringWithFormat:@"arg1: %@, arg2: %@, arg3: %@, 日本語でOK: %@"
                     , arg1, (arg2 ? @"true" : @"false"), arg3, (arg4[@"ok"] ? @"true" : @"false")];
    [self returnParams:msg];
}

/**
 * sample method:
 * void method.
 */
- (void) voidMethod
{
    NSLog(@"%@ voidMethod, called.", TAG);
}

/**
 * compatible check method:
 */
- (void) compatibleCheck:(CDVInvokedUrlCommand*)command
{
    NSLog(@"%@ compatibleCheck, called.", TAG);
    
    // command instance can down cast to context object.
    CDPMethodContext* context = (CDPMethodContext*)command;
    
    NSDictionary* argsInfo = @{
                               @"taskId": context.taskId,
                               @"arg1": command.arguments[0],
                               @"arg2": command.arguments[1],
                               @"arg3": command.arguments[2],
                               @"arg4": command.arguments[3],
                              };
    NSArray* message = @[context.taskId, argsInfo];

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:message];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

/**
 * compatible check method:
 */
- (void) threadMethod:(NSNumber*)arg1 :(BOOL)arg2 :(NSString*)arg3 :(NSDictionary*)arg4
{
    const CDPMethodContext* context = [self getContext];
    
    [self.commandDelegate runInBackground:^{
        [self notifyParams:context withParams:@[arg1, (arg2 ? @YES : @NO)]];
        [self notifyParams:context withParams:@[arg3, arg4]];
        NSString* msg = [NSString stringWithFormat:@"arg1: %@, arg2: %@, arg3: %@, 日本語でOK: %@"
                         , arg1, (arg2 ? @"true" : @"false"), arg3, (arg4[@"ok"] ? @"true" : @"false")];
        [self resolveParams:context withParams:@[msg]];
    }];
}

@end
