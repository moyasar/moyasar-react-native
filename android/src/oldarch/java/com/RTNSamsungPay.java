package com.moyasarsdk;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RTNSamsungPay extends ReactContextBaseJavaModule {

    private final RTNSamsungPayModuleImpl implementation;

    public RTNSamsungPay(ReactApplicationContext reactContext) {
        super(reactContext);

        this.implementation = new RTNSamsungPayModuleImpl();
    }

    @Override
    @NonNull
    public String getName() {
        return RTNSamsungPayModuleImpl.NAME;
    }

    @ReactMethod
    public void isSamsungPayAvailable(String serviceId, Promise promise) {
        implementation.isSamsungPayAvailable(getReactApplicationContext(), serviceId, promise);
    }
}
