/**
 * @file CDPGateContext.m
 * @brief Implementation file for CDP NativeBridge Gate Context class.
 */

#import "CDPGateContext.h"

@implementation CDPGateContext {
    NSString* _callbackId;
    NSString* _className;
    NSString* _methodName;
    NSString* _objectId;
    NSString* _taskId;
    BOOL _compatible;
    NSString* _threadId;
    BOOL _needSendResult;
}

//////////////////////////////////////////////////////
// Initialzier

- (id)initWithPlugin:(CDVPlugin*)plugin andCallbackId:(NSString*)callbackId andExecInfo:(NSDictionary*)execInfo;
{
    self = [super init];
    if (self) {
        self.webView = plugin.webView;
        self.viewController = plugin.viewController;
        self.commandDelegate = plugin.commandDelegate;
        _callbackId = callbackId;
        _className = execInfo[@"feature"][@"ios"][@"packageInfo"];
        _methodName = execInfo[@"method"] ? execInfo[@"method"] : nil;
        _objectId = execInfo[@"objectId"];
        _taskId = execInfo[@"taskId"] ? execInfo[@"taskId"] : nil;
        _compatible = execInfo[@"compatible"] ? [execInfo[@"compatible"] boolValue] : NO;
        _threadId = [NSString stringWithFormat:@"%@", [NSThread currentThread]];
        _needSendResult = YES;
    }
    return self;
}


@end
