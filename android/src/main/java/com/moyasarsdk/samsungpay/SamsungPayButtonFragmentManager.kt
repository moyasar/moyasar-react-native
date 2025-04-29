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
import com.facebook.react.viewmanagers.RTNSamsungPayButtonManagerInterface
import com.facebook.react.viewmanagers.RTNSamsungPayButtonManagerDelegate
import com.moyasarsdk.Logger

// TODO: Re-check this entire file once official docs for creating a native fragment in the new architecture of React Native are available (03/2025). Implementing it was very tricky and tedious.
@ReactModule(name = SamsungPayButtonFragmentManager.REACT_CLASS)
public class SamsungPayButtonFragmentManager(private val reactContext: ReactApplicationContext) : ViewGroupManager<FrameLayout>(), RTNSamsungPayButtonManagerInterface<FrameLayout> {

    private lateinit var propMerchantInfo: MerchantInfo

    private val delegate = RTNSamsungPayButtonManagerDelegate(this)

    override fun getDelegate(): ViewManagerDelegate<FrameLayout> = delegate

    override fun getName() = REACT_CLASS

    /**
     * Return a FrameLayout which will later hold the Fragment
     */
    override fun createViewInstance(reactContext: ThemedReactContext) = FrameLayout(reactContext)

    /**
     * Handle "create" command (called from JS) and call createFragment method
     */
    override fun receiveCommand(
        root: FrameLayout,
        commandId: String,
        args: ReadableArray?
    ) {
        Logger.d("MoyasarSDK", "receiveCommand")
        super.receiveCommand(root, commandId, args)

        val reactNativeViewId = requireNotNull(args).getInt(0)

        when (commandId) {
            COMMAND_CREATE -> createFragment(root, reactNativeViewId)
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

    @ReactProp(name = "merchantInfo")
    override fun setMerchantInfo(view: FrameLayout, merchantInfoMap: ReadableMap?) {
        Logger.d("MoyasarSDK", "setMerchantInfo")
        if (merchantInfoMap == null) return

        Logger.d("MoyasarSDK", "Setting merchant info...")

        // Parse data from TS layer
        val serviceId = merchantInfoMap.getString("serviceId") ?: ""
        val merchantName = merchantInfoMap.getString("merchantName") ?: ""
        val amount = merchantInfoMap.getDouble("amount") ?: 0.0
        val currency = merchantInfoMap.getString("currency") ?: ""
        val supportedNetworksArray = merchantInfoMap.getArray("supportedNetworks") ?: Arguments.createArray()
        val supportedNetworks = mutableListOf<String>()
        val orderNumber = merchantInfoMap.getString("orderNumber")

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
            amount = amount,
            currency = currency,
            supportedNetworks = supportedNetworks,
            orderNumber = orderNumber
        )

        Logger.d("MoyasarSDK", "Merchant info has been set: $propMerchantInfo")
    }

    // TODO: Make sure createFragment is always called after setMerchantInfo
    /**
     * Replace your React Native view with a custom fragment
     */
    fun createFragment(root: FrameLayout, reactNativeViewId: Int) {
        Logger.d("MoyasarSDK", "createFragment")

        // TODO: Test behaviour when the view is not found / null and decide if we should handle nullability here
        val parentView = root.findViewById<ViewGroup>(reactNativeViewId)

        setupLayout(parentView as ViewGroup)

        // If the view is already measured and laid out, we can proceed with replacement immediately
        if (parentView.isLaidOut && parentView.isAttachedToWindow) {
            Logger.d("MoyasarSDK", "Already laid out")

            replaceFragment(parentView.id)
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
                        replaceFragment(parentView.id)
                    }
                }
            })
        }
    }

    private fun replaceFragment(containerId: Int) {
        Logger.d("MoyasarSDK", "replaceFragment")

        val paymentCallback: (String?, String?) -> Unit = { paymentResult: String?, orderNumber: String? ->
            Logger.d("MoyasarSDK", "Received Payment result. Order number: $orderNumber")

            emitOnPaymentResult(containerId, paymentResult, orderNumber)
        }

        val activity = reactContext.currentActivity as? FragmentActivity ?: return
        val samsungPayButtonFragment = SamsungPayButtonFragment.newInstance(propMerchantInfo, paymentCallback)

        Logger.d("MoyasarSDK", "Will begin fragment transaction")

        activity.supportFragmentManager
            .beginTransaction()
            .replace(containerId, samsungPayButtonFragment, containerId.toString())
            .commit()
    }

    private fun emitOnPaymentResult(viewId: Int, paymentResult: String?, orderNumber: String?) {
        val safeResult = paymentResult ?: ""
        val safeOrderNumber = orderNumber ?: ""

        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, viewId)
        val payload =
            Arguments.createMap().apply {
                putString("result", safeResult)
                putString("orderNumber", safeOrderNumber)
            }
        val event = OnPaymentResultEvent(surfaceId, viewId, payload)

        eventDispatcher?.dispatchEvent(event)
    }

    inner class OnPaymentResultEvent(
        surfaceId: Int,
        viewId: Int,
        private val payload: WritableMap
    ) : Event<OnPaymentResultEvent>(surfaceId, viewId) {
        override fun getEventName() = "onPaymentResult"

        override fun getEventData() = payload
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

    companion object {
        const val REACT_CLASS = "RTNSamsungPayButton"
        private const val COMMAND_CREATE = "CreateSamsungPayButtonFragment"
    }
}