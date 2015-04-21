/**
 * @file CDPMessageUtils.h
 * @brief Interface definition file for CDP NativeBridge message utility class.
 */

#import <Foundation/Foundation.h>
#import "CDPGateContext.h"

static const NSInteger RETURN_SUCCESS_OK                = 0x0000;
static const NSInteger RETURN_SUCCESS_PROGRESS          = 0x0001;
static const NSInteger RETURN_ERROR_FAIL                = 0x0002;
static const NSInteger RETURN_ERROR_CANCEL              = 0x0003;
static const NSInteger RETURN_ERROR_INVALID_ARG         = 0x0004;
static const NSInteger RETURN_ERROR_NOT_IMPLEMENT       = 0x0005;
static const NSInteger RETURN_ERROR_NOT_SUPPORT         = 0x0006;
static const NSInteger RETURN_ERROR_INVALID_OPERATION   = 0x0007;
static const NSInteger RETURN_ERROR_CLASS_NOT_FOUND     = 0x0008;
static const NSInteger RETURN_ERROR_METHOD_NOT_FOUND    = 0x0009;

@interface CDPMessageUtils : NSObject

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
                             andParams:(NSObject*)params,...;


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
                             andParams:(NSObject*)params,...;

/**
 * make return message object
 * helper function
 *
 * @param taskId    [in] task ID
 * @param params... [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessaggeWithTaskId:(NSString*)taskId
                                andParams:(NSObject*)params,...;

/**
 * send success result
 *
 * @param context [in] Gate context object
 * @param result  [in] result message object
 */
+ (void) sendSuccessResultWithContext:(CDPGateContext*)context andResult:(NSDictionary*)result;

/**
 * send success result
 * helper function
 *
 * @param context [in] Gate context object
 * @param taskId  [in] task ID
 */
+ (void) sendSuccessResultWithContext:(CDPGateContext*)context andTaskId:(NSString*)taskId;

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
                         andMessage:(NSString*)message;

@end
