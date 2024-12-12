#import "RTNDeviceLanguage.h"
#include <Foundation/Foundation.h>

@implementation RTNDeviceLanguage

RCT_EXPORT_MODULE();

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeRTNDeviceLanguageSpecJSI>(params);
}

- (NSString *)getSystemLanguage { 
  NSLog(@"here native");
  return @"en";
}

@end
