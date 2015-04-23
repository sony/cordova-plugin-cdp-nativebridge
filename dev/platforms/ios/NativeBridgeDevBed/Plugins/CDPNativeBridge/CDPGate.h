/**
 * @file CDPGate.h
 * @brief Interface definition file for CDP NativeBridge Gate class.
 */

#import <Foundation/Foundation.h>
#import "CDPMethodContext.h"

@interface CDPGate : NSObject

@property (nonatomic, weak) UIWebView* webView;
@property (nonatomic, weak) UIViewController* viewController;
@property (nonatomic, weak) id <CDVCommandDelegate> commandDelegate;

//////////////////////////////////////////////////////
// Initialzier

/**
 * initializer
 *
 * @param plugin [in] plugin instance
 */
- (id)initWithPlugin:(CDVPlugin*)plugin;

//////////////////////////////////////////////////////
// public methods

/**
 * invoke instance method.
 *
 * @param context [in] method context object
 * @return message object
 */
- (NSDictionary*) invokeWithContext:(CDPMethodContext*)context;

/**
 * return params.
 * this method semantic is return statement.
 * this method is accessible only from method entry thread.
 *
 * @param [in] returned parameter.
 */
- (void) returnParams:(NSObject*)params;

@end
