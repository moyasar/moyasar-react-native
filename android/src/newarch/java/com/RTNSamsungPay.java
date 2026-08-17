package com.moyasarsdk;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;

import com.moyasarsdk.NativeRTNSamsungPaySpec;

public class RTNSamsungPay extends NativeRTNSamsungPaySpec {

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

    @Override
    public void isSamsungPayAvailable(String serviceId, Promise promise) {
        implementation.isSamsungPayAvailable(getReactApplicationContext(), serviceId, promise);
    }
}
