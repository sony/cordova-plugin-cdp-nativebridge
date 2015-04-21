/**
 * @file CDPMessageUtils.m
 * @brief Implementation file for CDP NativeBridge plugin message utility class.
 */

#import "CDPMessageUtils.h"

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

@end