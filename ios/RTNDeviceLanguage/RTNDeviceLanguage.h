#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RTNMoyasarSpec.h>
#else
#import <React/RCTBridgeModule.h>
#endif

NS_ASSUME_NONNULL_BEGIN

#ifdef RCT_NEW_ARCH_ENABLED
@interface RTNDeviceLanguage : NSObject <NativeRTNDeviceLanguageSpec>
#else
@interface RTNDeviceLanguage : NSObject <RCTBridgeModule>
#endif

@end

NS_ASSUME_NONNULL_END
