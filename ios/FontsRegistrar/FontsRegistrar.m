#import <Foundation/Foundation.h>
#import <CoreText/CoreText.h>

@interface MoyasarFontRegistrar : NSObject
@end

@implementation MoyasarFontRegistrar

+ (void)load {
  // Locates the bundle (packaged via resource_bundles)
  NSBundle *base = [NSBundle bundleForClass:self];
  NSURL *bundleURL = [base URLForResource:@"react-native-moyasar-sdk" withExtension:@"bundle"];
  NSBundle *resBundle = bundleURL ? [NSBundle bundleWithURL:bundleURL] : base;

  NSArray<NSString *> *fontFiles = @[
    @"ReadexPro-Regular",
    @"ReadexPro-Medium",
  ];

  for (NSString *file in fontFiles) {
    NSURL *url = [resBundle URLForResource:file withExtension:@"ttf"];
    if (!url) { continue; }
    CFErrorRef error = NULL;
    CTFontManagerRegisterFontsForURL((__bridge CFURLRef)url,
                                     kCTFontManagerScopeProcess,
                                     &error);
#ifdef DEBUG
    if (error) {
      CFStringRef desc = CFErrorCopyDescription(error);
      NSLog(@"[MoyasarFontRegistrar] Failed to register font %@: %@", file, desc);
      if (desc) CFRelease(desc);
      CFRelease(error);
    }
#endif
  }
}

@end