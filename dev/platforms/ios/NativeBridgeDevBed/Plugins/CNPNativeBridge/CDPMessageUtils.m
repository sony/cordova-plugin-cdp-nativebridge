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
    return nil;
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
    return nil;
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
    return nil;
}

/**
 * send success result
 *
 * @param context [in] Gate context object
 * @param result  [in] result message object
 */
+ (void) sendSuccessResultWithContext:(CDPGateContext*)context andResult:(NSDictionary*)result
{
    
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