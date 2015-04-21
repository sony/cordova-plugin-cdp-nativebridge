/**
 * @file CNPNativeBridge.m
 * @brief Implementation file for CDP NativeBridge class.
 */

#import "CNPNativeBridge.h"

@implementation CNPNativeBridge

//////////////////////////////////////////////////////
// Plugin I/F

- (void) execTask:(CDVInvokedUrlCommand *)command
{
    // TODO:
    NSLog(@"execTask called.");
}

- (void) cancelTask:(CDVInvokedUrlCommand *)command
{
    NSLog(@"cancelTask called.");
}

- (void) disposeTask:(CDVInvokedUrlCommand *)command
{
    NSLog(@"disposeTask called.");
}

@end