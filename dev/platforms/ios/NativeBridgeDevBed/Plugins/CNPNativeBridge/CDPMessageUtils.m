/**
 * @file CDPMessageUtils.m
 * @brief Implementation file for CDP NativeBridge plugin message utility class.
 */

#import "CDPMessageUtils.h"

#if !defined(_countof) && !defined(__cplusplus)
#define _countof(a) (sizeof(a) / sizeof(a[0]))
#endif

@implementation CDPMessageUtils

//////////////////////////////////////////////////////
// class methods

/**
 * make params info
 *
 * @param param [in] first param
 * @param args  [in] va_list args.
 * @return params array object
 */
+ (NSArray*) makeParams:(NSObject*)param withList:(va_list)args
{
    NSMutableArray* params = nil;
    if (param) {
        params = [@[] mutableCopy];
        [params addObject:param];
        id arg;
        while ((arg = va_arg(args, id))) {
            [params addObject:arg];
        }
    }
    
    return params;
}

/**
 * make return message object
 *
 * @param code       [in] result code
 * @param message    [in] message string
 * @param taskId     [in] task ID
 * @param paramsInfo [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessaggeWithCode:(NSInteger)code
                            andMessage:(NSString*)message
                             andTaskId:(NSString*)taskId
                         andParamsInfo:(NSArray*)params
{
    NSMutableDictionary* result = [@{} mutableCopy];
    
    NSString* name = [CDPMessageUtils resultCode2String:code]
    ? [self resultCode2String:code] : [NSString stringWithFormat:@"ERROR_CUSTOM:0x%x", (int)code];
    
    result[@"code"] = [NSNumber numberWithInt:code];
    result[@"name"] = name;
    if (message) {
        result[@"message"] = message;
    }
    if (params) {
        result[@"params"] = params;
    }
    
    return result;
}

/**
 * make return message object
 *
 * @param code      [in] result code
 * @param message   [in] message string
 * @param taskId    [in] task ID
 * @param params... [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessaggeWithCode:(NSInteger)code
                            andMessage:(NSString*)message
                             andTaskId:(NSString*)taskId
{
    return [self makeMessaggeWithCode:code andMessage:message andTaskId:taskId andParams:nil];
}

/**
 * make return message object
 *
 * @param code      [in] result code
 * @param message   [in] message string
 * @param taskId    [in] task ID
 * @param params... [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessaggeWithCode:(NSInteger)code
                            andMessage:(NSString*)message
                             andTaskId:(NSString*)taskId
                             andParams:(NSObject*)params,...
{
    NSDictionary* result = nil;

    {
        va_list args;
        va_start(args, params);
        NSArray* paramsInfo = [self makeParams:params withList:args];
        result = [self makeMessaggeWithCode:code andMessage:message andTaskId:taskId andParamsInfo:paramsInfo];
        va_end(args);
    }
    
    return result;
}

/**
 * make return message object
 * helper function
 *
 * @param message   [in] message string
 * @param taskId    [in] task ID
 * @return message object
 */
+ (NSDictionary*) makeMessaggeWithMessage:(NSString*)message
                                andTaskId:(NSString*)taskId
{
    return [self makeMessaggeWithMessage:message andTaskId:taskId andParams:nil];
}

/**
 * make return message object
 * helper function
 *
 * @param message   [in] message string
 * @param taskId    [in] task ID
 * @param params... [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessaggeWithMessage:(NSString*)message
                                andTaskId:(NSString*)taskId
                                andParams:(NSObject*)params,...
{
    NSDictionary* result = nil;
    
    {
        va_list args;
        va_start(args, params);
        
        // test
        if (params) {
//            int count_ = [args count];
            id arg = va_arg(args, id);
        }
        
        NSArray* paramsInfo = [self makeParams:params withList:args];
        result = [self makeMessaggeWithCode:RETURN_SUCCESS_OK andMessage:message andTaskId:taskId andParamsInfo:paramsInfo];
        va_end(args);
    }
    
    return result;
}

/**
 * make return message object
 * helper function
 *
 * @param taskId    [in] task ID
 * @return message object
 */
+ (NSDictionary*) makeMessaggeWithTaskId:(NSString*)taskId
{
    return [self makeMessaggeWithTaskId:taskId andParams:nil];
}

/**
 * make return message object
 * helper function
 *
 * @param taskId    [in] task ID
 * @param params... [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessaggeWithTaskId:(NSString*)taskId
                               andParams:(NSObject*)params,...
{
    NSDictionary* result = nil;
    
    {
        va_list args;
        va_start(args, params);
        NSArray* paramsInfo = [self makeParams:params withList:args];
        result = [self makeMessaggeWithCode:RETURN_SUCCESS_OK andMessage:nil andTaskId:taskId andParamsInfo:paramsInfo];
        va_end(args);
    }
    
    return result;
}

/**
 * send success result
 *
 * @param context [in] Gate context object
 * @param result  [in] result message object
 */
+ (void) sendSuccessResultWithContext:(CDPGateContext*)context andResult:(NSDictionary*)result
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
    [context.commandDelegate sendPluginResult:pluginResult callbackId:context.callbackId];
}

/**
 * send success result
 * helper function
 *
 * @param context [in] Gate context object
 * @param taskId  [in] task ID
 */
+ (void) sendSuccessResultWithContext:(CDPGateContext*)context andTaskId:(NSString*)taskId
{
    [self sendSuccessResultWithContext:context andResult:[self makeMessaggeWithTaskId:taskId andParams:nil]];
}

/**
 * send error result
 *
 * @param context [in] Gate context object
 * @param taskId  [in] task ID
 * @param code    [in] result code
 * @param message [in] message string
 */
+ (void) sendErrorResultWithContext:(CDPGateContext*)context
                          andTaskId:(NSString*)taskId
                            andCode:(NSInteger)code
                         andMessage:(NSString*)message
{
    [self sendErrorResultWithContext:context andResult:[self makeMessaggeWithCode:code andMessage:message andTaskId:taskId]];
}

/**
 * send error result
 *
 * @param context [in] Gate context object
 * @param result  [in] result message object
 */
+ (void) sendErrorResultWithContext:(CDPGateContext*)context andResult:(NSDictionary*)result
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:result];
    [context.commandDelegate sendPluginResult:pluginResult callbackId:context.callbackId];
}

//////////////////////////////////////////////////////
// private class methods

+ (NSString*) resultCode2String:(NSInteger)code
{
    @synchronized (self) {
        static struct {
            int code;
            const char* const msg;
        } _tbl[] = {
            { RETURN_SUCCESS_OK,                "RETURN_SUCCESS_OK"             },
            { RETURN_SUCCESS_PROGRESS,          "RETURN_SUCCESS_PROGRESS"       },
            { RETURN_ERROR_FAIL,                "RETURN_ERROR_FAIL"             },
            { RETURN_ERROR_CANCEL,              "RETURN_ERROR_CANCEL"           },
            { RETURN_ERROR_INVALID_ARG,         "RETURN_ERROR_INVALID_ARG"      },
            { RETURN_ERROR_NOT_IMPLEMENT,       "RETURN_ERROR_NOT_IMPLEMENT"    },
            { RETURN_ERROR_NOT_SUPPORT,         "RETURN_ERROR_NOT_SUPPORT"      },
            { RETURN_ERROR_INVALID_OPERATION,   "RETURN_ERROR_INVALID_OPERATION"},
            { RETURN_ERROR_CLASS_NOT_FOUND,     "RETURN_ERROR_CLASS_NOT_FOUND"  },
            { RETURN_ERROR_METHOD_NOT_FOUND,    "RETURN_ERROR_METHOD_NOT_FOUND" },
        };
        
        for (int i = 0; i < _countof(_tbl); i++) {
            if ((int)code == _tbl[i].code) {
                return [NSString stringWithCString:_tbl[i].msg encoding:NSUTF8StringEncoding];
            }
        }
        return nil;
    }
}

@end