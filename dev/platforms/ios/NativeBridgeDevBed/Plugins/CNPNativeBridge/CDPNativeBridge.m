/**
 * @file CDPNativeBridge.m
 * @brief Implementation file for CDP NativeBridge class.
 */

#import "CDPNativeBridge.h"
#import "CDPGateContext.h"
#import "CDPGate.h"

@implementation CDPNativeBridge {
    NSMutableDictionary* _gates;
}

NSString* const TAG = @"[CDPNativeBridge][Native] ";

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
    
    CDPGate* gate = [self getGateClassFromObjectId:context.objectId andClassName:context.className];
    if (!gate) {
        // TODO:
    }
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
        NSLog(@"%@%@ class is not CDPGate class.", TAG, className);
    }
    return nil;
}

@end