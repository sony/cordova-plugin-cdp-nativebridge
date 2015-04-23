/**
 * @file CDPGateContext.h
 * @brief Interface definition file for CDP NativeBridge Gate Context class.
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface CDPMethodContext : NSObject

@property (nonatomic, weak) UIWebView* webView;
@property (nonatomic, weak) UIViewController* viewController;
@property (nonatomic, weak) id <CDVCommandDelegate> commandDelegate;
@property (nonatomic, readonly) NSString* callbackId;
@property (nonatomic, readonly) NSString* className;
@property (nonatomic, readonly) NSString* methodName;
@property (nonatomic, readonly) NSString* objectId;
@property (nonatomic, readonly) NSString* taskId;
@property (nonatomic, readonly) BOOL compatible;
@property (nonatomic, readonly) NSString* threadId;
@property (atomic, readwrite) BOOL needSendResult;

/**
 * initializer
 *
 * @param plugin     [in] Plugin instance
 * @param callbackId [in] callback ID
 * @param execInfo   [in] execute information object
 */
- (id)initWithPlugin:(CDVPlugin*)plugin andCallbackId:(NSString*)callbackId andExecInfo:(NSDictionary*)execInfo;

@end