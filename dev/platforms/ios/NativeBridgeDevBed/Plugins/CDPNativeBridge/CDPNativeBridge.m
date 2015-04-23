/**
 * @file CDPNativeBridge.m
 * @brief Implementation file for CDP NativeBridge class.
 */

#import "CDPNativeBridge.h"
#import "CDPMethodContext.h"
#import "CDPGate.h"
#import "CDPMessageUtils.h"

@implementation CDPNativeBridge {
    NSMutableDictionary* _gates;
}

#define TAG @"[CDPNativeBridge][Native]"

//////////////////////////////////////////////////////
// Initialzier

- (CDVPlugin*)initWithWebView:(UIWebView *)theWebView
{
    self = [super initWithWebView:theWebView];
    if (self) {
        _gates = [@{} mutableCopy];
    }
    return self;
}

//////////////////////////////////////////////////////
// Plugin I/F

- (void) execTask:(CDVInvokedUrlCommand *)command
{
    NSDictionary* execInfo = command.arguments[0];
    
    CDPMethodContext* context = [[CDPMethodContext alloc] initWithPlugin:self andCallbackId:command.callbackId andExecInfo:execInfo];
    
    {
        // TODO: test
        NSDictionary* test1 = [CDPMessageUtils makeMessaggeWithMessage:@"test! test1" andTaskId:context.taskId];
        NSDictionary* test2 = [CDPMessageUtils makeMessaggeWithMessage:@"test! test2" andTaskId:context.taskId andParams:@[@1]];
        NSDictionary* test3 = [CDPMessageUtils makeMessaggeWithMessage:@"test! test2" andTaskId:context.taskId andParams:@[@1, @YES, @"test3"]];
        NSArray* arg1 = [CDPMessageUtils makeParams:@"test", @NO, @1.15, nil];
        NSLog(@"test finished.");
    }

    {
        NSArray* methodArgs = [self methodArguments:command.arguments];
        CDPGate* gate = [self getGateClassFromObjectId:context.objectId andClassName:context.className];
        if (!gate) {
            NSString* errorMsg = [NSString stringWithFormat:@"%@ class not found. class: %@", TAG, context.class];
            [CDPMessageUtils sendErrorResultWithContext:context andTaskId:context.taskId andCode:CDP_NATIVEBRIDGE_ERROR_CLASS_NOT_FOUND andMessage:errorMsg];
        } else {
            NSDictionary* errorResult = [gate invokeWithMethod:context.methodName andArgs:methodArgs andContext:context];
            if (errorResult) {
                [CDPMessageUtils sendErrorResultWithContext:context andResult:errorResult];
            }
        }
    }
}

- (void) cancelTask:(CDVInvokedUrlCommand *)command
{
    NSLog(@"cancelTask called.");
}

- (void) disposeTask:(CDVInvokedUrlCommand *)command
{
    NSLog(@"disposeTask called.");
}

//////////////////////////////////////////////////////
// private methods

//! slice method arguments.
- (NSArray*) methodArguments:(NSArray*)rawArgs
{
    if (1 < [rawArgs count]) {
        NSRange range;
        range.location = 1;
        range.length = [rawArgs count] - 1;
        return [rawArgs subarrayWithRange:range];
    } else {
        return @[];
    }
}

//! get CDPGate class from cache.
- (CDPGate*) getGateClassFromObjectId:(NSString*)objectId andClassName:(NSString*)className
{
    CDPGate* gate = _gates[objectId];
    if (!gate) {
        gate = [self createGateClassFromClassName:className];
        if (gate) {
            _gates[objectId] = gate;
        }
    }
    return gate;
}

//! create CDPGate class by class name.
- (CDPGate*) createGateClassFromClassName:(NSString*)className
{
    id obj = [[NSClassFromString(className) alloc] init];
    if (![obj isKindOfClass:[CDPGate class]]) {
        obj = nil;
        NSLog(@"%@ %@ class is not CDPGate class.", TAG, className);
    }
    return obj;
}

@end