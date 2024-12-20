package com.moyasarsdk;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RTNDeviceLanguage extends ReactContextBaseJavaModule {

    private RTNDeviceLanguageImpl implementation;

    public RTNDeviceLanguage(ReactApplicationContext reactContext) {
        super(reactContext);

        this.implementation = new RTNDeviceLanguageImpl();
    }

    @Override
    public String getName() {
        return RTNDeviceLanguageImpl.NAME;
    }

    @Nullable
    @ReactMethod
    public String getPreferredLanguage() {
        // Most likely we need to use promises here, but we don't need it since it is handeled in JS for the old arch
        return implementation.getPreferredLanguage(getReactApplicationContext());
    }
}