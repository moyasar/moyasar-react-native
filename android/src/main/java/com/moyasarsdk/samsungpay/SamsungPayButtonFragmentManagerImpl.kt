package com.moyasarsdk.samsungpay

import android.view.Choreographer
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
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.moyasarsdk.BuildConfig
import com.moyasarsdk.Logger

// TODO: Re-check this entire file once official docs for creating a native fragment in the new architecture of React Native are available (03/2025). Implementing it was very tricky and tedious.
// This file is resposible for the integration between React Native layer and the Android native layer
object SamsungPayButtonFragmentManagerImpl {

    private lateinit var propMerchantInfo: MerchantInfo

    const val REACT_CLASS = "RTNSamsungPayButton"
    private const val COMMAND_CREATE = "CreateSamsungPayButtonFragment"

    fun createViewInstance(reactContext: ThemedReactContext) = FrameLayout(reactContext)
    
    fun receiveCommand(
        root: FrameLayout,
        commandId: String,
        args: ReadableArray?,
        reactContext: ReactApplicationContext
    ) {
        val reactNativeViewId = requireNotNull(args).getInt(0)

        when (commandId) {
            COMMAND_CREATE -> createFragment(root, reactNativeViewId, reactContext)
        }
    }

    /**
     * Layout View properly
     */
    // TODO: Why is this called repeatedly?
    private fun manuallyLayoutChildren(view: ViewGroup) {
        for (i in 0 until view.childCount) {
            val child = view.getChildAt(i)

            child.measure(
                View.MeasureSpec.makeMeasureSpec(view.getMeasuredWidth(), View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(view.getMeasuredHeight(), View.MeasureSpec.EXACTLY)
            )

            child.layout(0, 0, child.getMeasuredWidth(), child.getMeasuredHeight())
        }
    }

    fun setMerchantInfo(view: FrameLayout, merchantInfoMap: ReadableMap?) {
        Logger.d("MoyasarSDK", "setMerchantInfo")
        if (merchantInfoMap == null) return

        Logger.d("MoyasarSDK", "Setting merchant info...")

        // Parse data from TS layer
        val serviceId = merchantInfoMap.getString("serviceId") ?: ""
        val merchantName = merchantInfoMap.getString("merchantName") ?: ""
        val merchantId = merchantInfoMap.getString("merchantId") ?: ""
        val merchantCountryCode = merchantInfoMap.getString("merchantCountryCode") ?: ""
        val amount = merchantInfoMap.getDouble("amount") ?: 0.0
        val currency = merchantInfoMap.getString("currency") ?: ""
        val supportedNetworksArray = merchantInfoMap.getArray("supportedNetworks") ?: Arguments.createArray()
        val supportedNetworks = mutableListOf<String>()

        var orderNumber: String? = null
        var buttonBorderRadius: Double? = null

        if (merchantInfoMap.hasKey("orderNumber") && !merchantInfoMap.isNull("orderNumber")) {
            Logger.d("MoyasarSDK", "Order number will be set")
            orderNumber = merchantInfoMap.getString("orderNumber")
        }

        if (merchantInfoMap.hasKey("buttonBorderRadius") && !merchantInfoMap.isNull("buttonBorderRadius")) {
            Logger.d("MoyasarSDK", "Button border radius will be set")
            buttonBorderRadius = merchantInfoMap.getDouble("buttonBorderRadius")
        }

        // TODO: Optimize if needed like this or we can use the array directly
        for (i in 0 until (supportedNetworksArray.size())) {
            val network = supportedNetworksArray.getString(i)

            if (!network.isNullOrBlank()) {
                supportedNetworks.add(network)
            }
        }

        this.propMerchantInfo = MerchantInfo(
            serviceId = serviceId,
            merchantName = merchantName,
            merchantId = merchantId,
            merchantCountryCode = merchantCountryCode,
            amount = amount,
            currency = currency,
            supportedNetworks = supportedNetworks,
            orderNumber = orderNumber,
            buttonBorderRadius = buttonBorderRadius
        )

        Logger.d("MoyasarSDK", "Merchant info has been set: $propMerchantInfo")
    }

    // TODO: Make sure createFragment is always called after setMerchantInfo
    /**
     * Replace your React Native view with a custom fragment
     */
    fun createFragment(root: FrameLayout, reactNativeViewId: Int, reactContext: ReactApplicationContext) {
        Logger.d("MoyasarSDK", "createFragment")

        // TODO: Test behaviour when the view is not found / null and decide if we should handle nullability here
        val parentView = root.findViewById<ViewGroup>(reactNativeViewId)

        setupLayout(parentView as ViewGroup)

        // If the view is already measured and laid out, we can proceed with replacement immediately
        if (parentView.isLaidOut && parentView.isAttachedToWindow) {
            Logger.d("MoyasarSDK", "Already laid out")

            replaceFragment(parentView.id, reactContext)
        } else {
            Logger.d("MoyasarSDK", "View not laid out yet")

            // Otherwise, wait for it to finish laying out
            parentView.viewTreeObserver.addOnGlobalLayoutListener(object : ViewTreeObserver.OnGlobalLayoutListener {
                override fun onGlobalLayout() {
                    Logger.d("MoyasarSDK", "onGlobalLayout listener called to replace fragment")

                    // Check if the view laid out and attached or continue waiting
                    if (parentView.isLaidOut && parentView.isAttachedToWindow) {
                        Logger.d("MoyasarSDK", "Now the view is laid out")

                        parentView.viewTreeObserver.removeOnGlobalLayoutListener(this)
                        replaceFragment(parentView.id, reactContext)
                    }
                }
            })
        }
    }

    private fun replaceFragment(containerId: Int, reactContext: ReactApplicationContext) {
        Logger.d("MoyasarSDK", "replaceFragment")

        val paymentCallback: (String?, String?) -> Unit = { paymentResult: String?, orderNumber: String? ->
            Logger.d("MoyasarSDK", "Received Payment result. Order number: $orderNumber")

            emitOnPaymentResult(containerId, paymentResult, orderNumber, reactContext)
        }

        val activity = reactContext.currentActivity as? FragmentActivity ?: return
        val samsungPayButtonFragment = SamsungPayButtonFragment.newInstance(propMerchantInfo, paymentCallback)

        Logger.d("MoyasarSDK", "Will begin fragment transaction")

        activity.supportFragmentManager
            .beginTransaction()
            .replace(containerId, samsungPayButtonFragment, containerId.toString())
            .commit()
    }

    fun setupLayout(view: ViewGroup) {
        Logger.d("MoyasarSDK", "setupLayout")

        Choreographer.getInstance().postFrameCallback(object : Choreographer.FrameCallback {
            override fun doFrame(frameTimeNanos: Long) {

                manuallyLayoutChildren(view)
                view.viewTreeObserver.dispatchOnGlobalLayout()
                Choreographer.getInstance().postFrameCallback(this)
            }
        })
    }

    private fun emitOnPaymentResult(viewId: Int, paymentResult: String?, orderNumber: String?, reactContext: ReactApplicationContext) {
        val safeResult = paymentResult ?: ""
        val safeOrderNumber = orderNumber ?: ""
        val payload =
            Arguments.createMap().apply {
                putString("result", safeResult)
                putString("orderNumber", safeOrderNumber)
            }

        try {
            if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
                // New architecture
                Logger.d("MoyasarSDK", "Emitting event using new architecture")
                val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
                val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, viewId)
                
                if (eventDispatcher == null) {
                    Logger.e("MoyasarSDK", "Failed to get event dispatcher for view $viewId")
                    return
                }
                
                val event = OnPaymentResultEvent(surfaceId, viewId, payload)
                eventDispatcher.dispatchEvent(event)
            } else {
                // Old architecture
                Logger.d("MoyasarSDK", "Emitting event using old architecture")
                reactContext
                    .getJSModule(RCTEventEmitter::class.java)
                    .receiveEvent(viewId, "paymentResult", payload)
            }
        } catch (e: Exception) {
            Logger.e("MoyasarSDK", "Error emitting payment result event", e)
        }
    }

    // For new architecture
    class OnPaymentResultEvent(
        surfaceId: Int,
        viewId: Int,
        private val payload: WritableMap
    ) : Event<OnPaymentResultEvent>(surfaceId, viewId) {
        override fun getEventName() = "onPaymentResult"

        override fun getEventData() = payload
    }
}