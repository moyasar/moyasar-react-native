package com.moyasarsdk

import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import android.view.ViewTreeObserver
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.moyasarsdk.Logger


public class RTNSamsungPayButtonFragmentManager(var reactContext: ReactApplicationContext) : ViewGroupManager<FrameLayout>() {
 
    override fun getName() = RTNSamsungPayButtonFragmentManagerImpl.REACT_CLASS

    /**
     * Return a FrameLayout which will later hold the Fragment
     */
    public override fun createViewInstance(reactContext: ThemedReactContext) = RTNSamsungPayButtonFragmentManagerImpl.createViewInstance(reactContext)

    /**
     * Handle "create" command id (called from JS) and call createFragment method
     */
    override fun receiveCommand(
        root: FrameLayout,
        commandId: String,
        args: ReadableArray?
    ) {
        Logger.d("MoyasarSDK", "receiveCommand")
        super.receiveCommand(root, commandId, args)

        RTNSamsungPayButtonFragmentManagerImpl.receiveCommand(
            root,
            commandId,
            args,
            reactContext
        )
    }

    @ReactProp(name = "merchantInfo")
    fun setMerchantInfo(view: FrameLayout, merchantInfoMap: ReadableMap?) {
        Logger.d("MoyasarSDK", "setMerchantInfo old arch")

        RTNSamsungPayButtonFragmentManagerImpl.setMerchantInfo(view, merchantInfoMap)
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
        return mapOf(
            "paymentResult" to mapOf(
                "registrationName" to "onPaymentResult"
            )
        )
    }
}