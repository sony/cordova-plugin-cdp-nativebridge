/**
 * @file CDPGate.m
 * @brief Implementation file for CDP NativeBridge Gate class.
 */

#import "CDPGate.h"
#import "CDPMessageUtils.h"

@implementation CDPGate {
    CDPMethodContext* _currentContext;
    NSMutableDictionary* _cancelableTask;
}

#define TAG @"[CDPGate][Native]"

//////////////////////////////////////////////////////
// Initialzier

/**
 * initializer
 *
 * @param plugin     [in] Plugin instance
 */
- (id)initWithPlugin:(CDVPlugin*)plugin
{
    self = [super init];
    if (self) {
        self.webView = plugin.webView;
        self.viewController = plugin.viewController;
        self.commandDelegate = plugin.commandDelegate;
        _currentContext = nil;
        _cancelableTask = [@{} mutableCopy];
    }
    return self;
}

//////////////////////////////////////////////////////
// public methods

/**
 * invoke instance method entry.
 *
 * @param method  [in] method name
 * @param args    [in] arguments
 * @param context [in] NativeBridge Gate context object
 * @return message object
 */
- (NSDictionary*) invokeWithMethod:(NSString*)method andArgs:(NSArray*)args andContext:(CDPMethodContext*)context
{
    if (context.compatible) {
        return [self invokeAsCordovaCompatibleWithMethod:method andArgs:args andContext:context];
    } else {
        return [self invokeAsNativeBridgeWithMethod:method andArgs:args andContext:context];
    }
}

/**
 * return params.
 * this method semantic is return statement.
 * this method is accessible only from method called thread.
 *
 * @param [in] returned parameter.
 */
- (void) returnParams:(NSObject*)params
{
    @synchronized (self) {
        if (_currentContext && [[self getCurrentThreadId] isEqualToString:_currentContext.threadId]) {
            _currentContext.needSendResult = NO;
            [CDPMessageUtils sendSuccessResultWithContext:_currentContext
                                                andResult:[CDPMessageUtils makeMessaggeWithTaskId:_currentContext.taskId andParams:@[params]]];
        } else {
            NSLog(@"%@ Calling returnParams is permitted only from method entry thread.", TAG);
        }
    }
}

//////////////////////////////////////////////////////
// private methods

/**
 * compatible invoke instance method.
 *
 * @param method  [in] method name
 * @param args    [in] arguments
 * @param context [in] NativeBridge Gate context object
 * @return message object
 */
- (NSDictionary*) invokeAsCordovaCompatibleWithMethod:(NSString*)method andArgs:(NSArray*)args andContext:(CDPMethodContext*)context
{
    // 2 args. the context assigned second arg. (no-lable)
    NSString* methodName = [NSString stringWithFormat:@"%@::", context.methodName];
    SEL normalSelector = NSSelectorFromString(methodName);
    if ([self respondsToSelector:normalSelector]) {
        CDVInvokedUrlCommand* command = [[CDVInvokedUrlCommand alloc] initWithArguments:args
                                                                             callbackId:context.callbackId
                                                                              className:context.className
                                                                             methodName:method];
        // disable warning: (this is safe way.)
        // http://captainshadow.hatenablog.com/entry/20121114/1352834276
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
        [self performSelector:normalSelector withObject:command withObject:context];
#pragma clang diagnostic pop
        return nil;
    } else {
        return [CDPMessageUtils makeMessaggeWithCode:CDP_NATIVEBRIDGE_ERROR_METHOD_NOT_FOUND
                                          andMessage:[NSString stringWithFormat:@"%@ method not found. method: %@", TAG, method]
                                           andTaskId:context.taskId];
    }
}

/**
 * Native Bridge extended invoke instance method.
 *
 * @param method  [in] method name
 * @param args    [in] arguments
 * @param context [in] NativeBridge Gate context object
 * @return message object
 */
- (NSDictionary*) invokeAsNativeBridgeWithMethod:(NSString*)method andArgs:(NSArray*)args andContext:(CDPMethodContext*)context
{
    SEL selector = NSSelectorFromString([self buildMethodSelectorStringFrom:method andArgs:args]);
    if ([self respondsToSelector:selector]) {
        NSMethodSignature* signature = [self methodSignatureForSelector:selector];
        NSInvocation* invocation = [NSInvocation invocationWithMethodSignature:signature];
        [invocation retainArguments];
        [invocation setSelector:selector];

        for (int i = 0; i < [args count]; i++) {
            id arg = args[i];
            if ([NSStringFromClass([arg class]) isEqualToString:@"__NSCFBoolean"]) {
                BOOL argBool = [args[i] boolValue];
                [invocation setArgument:&argBool atIndex:i + 2];
            } else {
                [invocation setArgument:&arg atIndex:i + 2];
                
            }
        }
        
        @synchronized (self) {
            _currentContext = context;
            [invocation invokeWithTarget:self];
            if (_currentContext.needSendResult) {
                [CDPMessageUtils sendSuccessResultWithContext:context andTaskId:context.taskId];
            }
            _currentContext = nil;
        }
        return nil;
    } else {
        return [CDPMessageUtils makeMessaggeWithCode:CDP_NATIVEBRIDGE_ERROR_METHOD_NOT_FOUND
                                          andMessage:[NSString stringWithFormat:@"%@ method not found. method: %@", TAG, method]
                                           andTaskId:context.taskId];
    }
}

/**
 * build selector string.
 *
 * @param method  [in] method name
 * @param args    [in] arguments
 * @return selector string
 */
- (NSString*) buildMethodSelectorStringFrom:(NSString*)method andArgs:(NSArray*)args
{
    NSString* selector = method;
    for (int i = 0; i < [args count]; i++) {
        selector = [selector stringByAppendingString:@":"];
    }
    return selector;
}

/**
 * get current thread id string
 */
- (NSString*) getCurrentThreadId
{
    return [NSString stringWithFormat:@"%@", [NSThread currentThread]];
}

@end