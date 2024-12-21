package com.moyasarsdk;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;

import com.moyasarsdk.NativeRTNDeviceLanguageSpec;

public class RTNDeviceLanguage extends NativeRTNDeviceLanguageSpec {

    private RTNDeviceLanguageImpl implementation;

    public RTNDeviceLanguage(ReactApplicationContext reactContext) {
        super(reactContext);

        this.implementation = new RTNDeviceLanguageImpl();
    }

    @Override
    @NonNull
    public String getName() {
        return RTNDeviceLanguageImpl.NAME;
    }

    @Override
    @Nullable
    public String getPreferredLanguage() {
        return implementation.getPreferredLanguage(getReactApplicationContext());
    }
}