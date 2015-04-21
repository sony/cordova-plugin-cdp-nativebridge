/**
 * @file CDPGate.m
 * @brief Implementation file for CDP NativeBridge Gate class.
 */

#import "CDPGate.h"

@implementation CDPGate {
    CDPGateContext* _currentContext;
    NSMutableDictionary* _cancelableTask;
}

//////////////////////////////////////////////////////
// Initialzier

- (id) init
{
    self = [super init];
    if (self) {
        _currentContext = nil;
        _cancelableTask = [@{} mutableCopy];
    }
    return self;
}

//////////////////////////////////////////////////////
// public methods

/**
 * invoke instance method.
 *
 * @param method  [in] method name
 * @param args    [in] arguments
 * @param context [in] NativeBridge Gate context object
 * @return message object
 */
- (NSDictionary*) invokeWithMethod:(NSString*)method andArgs:(NSArray*)args andContext:(CDPGateContext*)context
{
    // TODO:
    return nil;
}

@end