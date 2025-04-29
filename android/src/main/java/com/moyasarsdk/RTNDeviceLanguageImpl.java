package com.moyasarsdk;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.ReactApplicationContext;
import com.moyasarsdk.Logger;

public class RTNDeviceLanguageImpl {

    protected static final String NAME = "RTNDeviceLanguage";

    @Nullable
    public String getPreferredLanguage(ReactApplicationContext reactContext) {
        Logger.d("MoyasarSDK", "getPreferredLanguage");

        try {
            return reactContext.getResources().getConfiguration().locale.getLanguage();
        } catch (Exception e) {
            return null;
        }
    }
}