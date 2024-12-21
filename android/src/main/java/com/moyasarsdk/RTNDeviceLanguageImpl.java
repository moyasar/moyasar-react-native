package com.moyasarsdk;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReactApplicationContext;

public class RTNDeviceLanguageImpl {

    protected static final String NAME = "RTNDeviceLanguage";

    @Nullable
    public String getPreferredLanguage(ReactApplicationContext reactContext) {
        try {
            return reactContext.getResources().getConfiguration().locale.getLanguage();
        } catch (Exception e) {
            return null;
        }
    }
}