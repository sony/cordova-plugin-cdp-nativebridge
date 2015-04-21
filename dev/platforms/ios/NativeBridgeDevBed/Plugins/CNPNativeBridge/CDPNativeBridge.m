/**
 * @file CDPNativeBridge.m
 * @brief Implementation file for CDP NativeBridge class.
 */

#import "CDPNativeBridge.h"
#import "CDPGateContext.h"

@implementation CDPNativeBridge {
    NSMutableDictionary* _gates;
}

//////////////////////////////////////////////////////
// Initialzier

- (id)init
{
    self = [super init];
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
    NSArray* methodArgs = [self methodArguments:command.arguments];
    // TODO:
    
    CDPGateContext* context = [[CDPGateContext alloc] initWithPlugin:self andCallbackId:command.callbackId andExecInfo:execInfo];
    
    NSLog(@"execTask called.");
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

@end