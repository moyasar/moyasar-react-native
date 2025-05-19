package com.moyasarsdk;

import androidx.annotation.Nullable;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.ReactPackage;
import com.facebook.react.uimanager.ViewManager;
import com.moyasarsdk.samsungpay.SamsungPayButtonFragmentManager;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;
import java.util.List;
import com.moyasarsdk.Logger;

public class RTNMoyasarPackage extends TurboReactPackage implements ReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        Logger.d("MoyasarSDK", "getModule");

        if (name.equals(RTNDeviceLanguageImpl.NAME)) {
            return new RTNDeviceLanguage(reactContext);
        } else {
            return null;
        }
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        Logger.d("MoyasarSDK", "createViewManagers");
        return Collections.singletonList(new RTNSamsungPayButtonFragment(reactContext));
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        Logger.d("MoyasarSDK", "getReactModuleInfoProvider");

        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;

            moduleInfos.put(
                RTNDeviceLanguageImpl.NAME,
                new ReactModuleInfo(
                    RTNDeviceLanguageImpl.NAME,
                    RTNDeviceLanguageImpl.NAME,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true, // hasConstants
                    false, // isCxxModule
                    isTurboModule // isTurboModule
                )
            );
            return moduleInfos;
        };
    }
}