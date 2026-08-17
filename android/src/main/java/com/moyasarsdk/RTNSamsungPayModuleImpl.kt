package com.moyasarsdk

import android.os.Bundle
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.samsung.android.sdk.samsungpay.v2.PartnerInfo
import com.samsung.android.sdk.samsungpay.v2.SamsungPay
import com.samsung.android.sdk.samsungpay.v2.SpaySdk
import com.samsung.android.sdk.samsungpay.v2.StatusListener
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Shared implementation for the Samsung Pay native module.
 *
 * Exposes an availability check so apps building their own UI can decide
 * whether to show a Samsung Pay option before rendering the Samsung Pay button.
 */
class RTNSamsungPayModuleImpl {

    companion object {
        const val NAME = "RTNSamsungPay"
    }

    /**
     * Resolves `true` only when Samsung Pay is ready to process a payment
     * (`SPAY_READY`). Every other status (not supported, not set up, temporarily
     * not allowed, or any failure) resolves `false`. The promise never rejects,
     * so callers get a simple boolean.
     * 
     * Important: this is a wallet readiness check, not a definitive merchant
     * service ID validation check. A `true` result means Samsung Pay reports the
     * device wallet as ready. It does not guarantee that the provided `serviceId`
     * is onboarded/approved for all operations. 
     * 
     * Note: service ID authorization issues may be reported through 
     * Samsung error codes and `EXTRA_ERROR_REASON` values in failure callbacks of Samsung Pay operations (e.g. when clicking the Samsung Pay button or attempting a payment).
     */
    fun isSamsungPayAvailable(
        reactContext: ReactApplicationContext,
        serviceId: String?,
        promise: Promise
    ) {
        Logger.d("MoyasarSDK", "Checking Samsung Pay availability...")

        // Guarantees the promise is settled exactly once even if the Samsung Pay
        // SDK were to invoke the listener more than once, which would otherwise
        // throw when resolving an already-settled promise.
        val settled = AtomicBoolean(false)
        val resolveOnce = { isAvailable: Boolean ->
            if (settled.compareAndSet(false, true)) {
                promise.resolve(isAvailable)
            }
        }

        if (serviceId.isNullOrBlank()) {
            Logger.e("MoyasarSDK", "serviceId is null or blank, cannot check Samsung Pay availability")
            resolveOnce(false)
            return
        }

        try {
            val bundle = Bundle()
            bundle.putString(SpaySdk.PARTNER_SERVICE_TYPE, SpaySdk.ServiceType.INAPP_PAYMENT.toString())

            val partnerInfo = PartnerInfo(serviceId, bundle)

            // A status query only needs the application context; using it (rather
            // than an Activity) avoids leaks and works even when no Activity is
            // resumed. Fall back defensively if it is somehow unavailable.
            val context = reactContext.applicationContext ?: reactContext
            val samsungPay = SamsungPay(context, partnerInfo)

            samsungPay.getSamsungPayStatus(object : StatusListener {
                // Capturing `samsungPay` keeps it (and the service binding it
                // owns) alive until this asynchronous callback fires. Using a
                // per-call local rather than a shared field also keeps
                // concurrent availability checks independent.
                @Suppress("unused")
                private val retained = samsungPay

                override fun onSuccess(status: Int, extras: Bundle) {
                    val isReady = status == SpaySdk.SPAY_READY
                    Logger.d("MoyasarSDK", "Samsung Pay status: $status, ready: $isReady")
                    resolveOnce(isReady)
                }

                override fun onFail(errorCode: Int, extras: Bundle) {
                    Logger.w("MoyasarSDK", "Samsung Pay status check failed with error code: $errorCode")
                    resolveOnce(false)
                }
            })
        } catch (ex: Exception) {
            Logger.e("MoyasarSDK", "Checking Samsung Pay availability failed", ex)
            resolveOnce(false)
        }
    }
}
