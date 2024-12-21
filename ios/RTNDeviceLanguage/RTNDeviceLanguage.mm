#import "RTNDeviceLanguage.h"
#include <Foundation/Foundation.h>

@implementation RTNDeviceLanguage

RCT_EXPORT_MODULE();

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeRTNDeviceLanguageSpecJSI>(params);
}
#endif

- (NSString *)getPreferredLanguage {
  // Most likely we need to use promises here for old arch, but we don't need it since it is handeled in JS for the old arch
  return [[[NSBundle mainBundle] preferredLocalizations] objectAtIndex:0];
}

@end