package com.moyasarsdk

import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import android.view.ViewTreeObserver
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.facebook.react.viewmanagers.RTNSamsungPayButtonManagerInterface
import com.facebook.react.viewmanagers.RTNSamsungPayButtonManagerDelegate
import com.moyasarsdk.Logger

// TODO: Re-check this entire file once official docs for creating a native fragment in the new architecture of React Native are available (03/2025). Implementing it was very tricky and tedious.
@ReactModule(name = RTNSamsungPayButtonFragmentManagerImpl.REACT_CLASS)
public class RTNSamsungPayButtonFragmentManager(private val reactContext: ReactApplicationContext) : ViewGroupManager<FrameLayout>(), RTNSamsungPayButtonManagerInterface<FrameLayout> {

    private val delegate = RTNSamsungPayButtonManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<FrameLayout> = delegate

    override fun getName() = RTNSamsungPayButtonFragmentManagerImpl.REACT_CLASS

    /**
     * Return a FrameLayout which will later hold the Fragment
     */
    override fun createViewInstance(reactContext: ThemedReactContext) = RTNSamsungPayButtonFragmentManagerImpl.createViewInstance(reactContext)

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
    override fun setMerchantInfo(view: FrameLayout, merchantInfoMap: ReadableMap?) {
        Logger.d("MoyasarSDK", "setMerchantInfo new arch")

        RTNSamsungPayButtonFragmentManagerImpl.setMerchantInfo(view, merchantInfoMap)
    }
}