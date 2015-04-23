/**
 * @file CDPGate.h
 * @brief Interface definition file for CDP NativeBridge Gate class.
 */

#import <Foundation/Foundation.h>
#import "CDPMethodContext.h"

@interface CDPGate : NSObject

//////////////////////////////////////////////////////
// Initialzier

/**
 * initializer
 */
- (id) init;

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
- (NSDictionary*) invokeWithMethod:(NSString*)method andArgs:(NSArray*)args andContext:(CDPMethodContext*)context;

/**
 * return params.
 * this method semantic is return statement.
 * this method is accessible only from method entry thread.
 *
 * @param [in] returned parameter.
 */
- (void) returnParams:(NSObject*)params;

@end
