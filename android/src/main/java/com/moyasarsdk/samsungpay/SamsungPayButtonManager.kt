package com.moyasarsdk.samsungpay

import android.app.Application
import android.os.Bundle
import android.content.Context
import android.util.Log
import com.samsung.android.sdk.samsungpay.v2.SamsungPay
import com.samsung.android.sdk.samsungpay.v2.StatusListener
import com.samsung.android.sdk.samsungpay.v2.SpaySdk
import com.samsung.android.sdk.samsungpay.v2.PartnerInfo
import com.samsung.android.sdk.samsungpay.v2.payment.*
import com.samsung.android.sdk.samsungpay.v2.payment.sheet.CustomSheet
import com.samsung.android.sdk.samsungpay.v2.payment.sheet.AmountBoxControl
import com.samsung.android.sdk.samsungpay.v2.payment.sheet.AmountConstants

/**
 * Holds merchant-related information
 */
data class MerchantInfo(
    val serviceId: String,
    val merchantName: String,
    val amount: Double,
    val currency: String,
    val supportedNetworks: List<String>
)

/**
 * Logic to handle Samsung Pay payment flow
 */
class SamsungPayButtonManager(
    private val merchantInfo: MerchantInfo,
    private val paymentCallback: (String?) -> Unit
) {

    // TODO: Support `supportedNetworks`

    // Samsung Pay SDK objects
    private var samsungPay: SamsungPay? = null
    private var paymentManager: PaymentManager? = null
    private var partnerInfo: PartnerInfo? = null

    private fun checkSamsungPayStatus(shouldShowButtonCallback: (Boolean) -> Unit) {
        samsungPay?.getSamsungPayStatus(object : StatusListener {
            override fun onSuccess(status: Int, bundle: Bundle) {
                when (status) {
                    SpaySdk.SPAY_READY -> {
                        Log.d("Moyasar SDK", "Samsung Pay ready")

                        shouldShowButtonCallback(true)
                    }
                    SpaySdk.SPAY_NOT_READY -> {
                        Log.w("Moyasar SDK", "Samsung Pay not ready")

                        // Samsung Pay is supported but not fully ready.

                        // TODO: Support updating button visibility after updating or activating
                        shouldShowButtonCallback(false)
                        
                        val extraError = bundle.getInt(SamsungPay.EXTRA_ERROR_REASON)

                        if (extraError == SamsungPay.ERROR_SPAY_SETUP_NOT_COMPLETED) {
                            // doActivateSamsungPay(SpaySdk.ServiceType.INAPP_PAYMENT.toString())
                            // Call activateSamsungPay().
                        } else if (extraError == SamsungPay.ERROR_SPAY_APP_NEED_TO_UPDATE) {
                            // Call goToUpdatePage()
                        }
                    }
                    SpaySdk.SPAY_NOT_ALLOWED_TEMPORALLY -> {
                        Log.w("Moyasar SDK", "Samsung Pay not allowed temporarily")

                        // TODO: Support below comment

                        // If EXTRA_ERROR_REASON is ERROR_SPAY_CONNECTED_WITH_EXTERNAL_DISPLAY,
                        // guide user to disconnect it.
                        shouldShowButtonCallback(false)
                    }
                    SpaySdk.SPAY_NOT_SUPPORTED -> {
                        Log.w("Moyasar SDK", "Samsung Pay not supported on this device")

                        shouldShowButtonCallback(false)
                    }

                    else -> {
                        Log.e("Moyasar SDK", "Samsung Pay unknown status: $status")

                        shouldShowButtonCallback(false) 
                    }
                }
            }

            override fun onFail(errorCode: Int, bundle: Bundle) {
                Log.e("Moyasar SDK", "Samsung Pay status check failed with error code: $errorCode")

                shouldShowButtonCallback(false)
            }
        })
    }

    private fun makeAmountControl(): AmountBoxControl {
        val amountBoxControl = AmountBoxControl(AMOUNT_CONTROL_ID, merchantInfo.currency)
        // TODO: Check if below is needed
        // amountBoxControl.addItem(PRODUCT_ITEM_ID, "Item", 1199.00, "")
		// amountBoxControl.addItem(PRODUCT_TAX_ID, "Tax", 5.0, "")
		amountBoxControl.setAmountTotal(merchantInfo.amount, AmountConstants.FORMAT_TOTAL_PRICE_ONLY)
        return amountBoxControl
    }

    private val transactionInfoListener: PaymentManager.CustomSheetTransactionInfoListener =
        object : PaymentManager.CustomSheetTransactionInfoListener {
            override fun onCardInfoUpdated(selectedCardInfo: CardInfo, customSheet: CustomSheet) {
                /*
                 * Called when the user changes a card in Samsung Pay.
                 * Newly selected cardInfo is passed and partner app can update transaction amount based on new card (if needed).
                 * Calling updateSheet() is mandatory.
                 */
                Log.d("Moyasar SDK", "Samsung Pay updating card info in `startInAppPayWithCustomSheet`")

                paymentManager?.updateSheet(customSheet)
            }

            override fun onSuccess(
                response: CustomSheetPaymentInfo,
                paymentCredential: String,
                extraPaymentData: Bundle
            ) {
                Log.d("Moyasar SDK", "Samsung Pay succeeded in `startInAppPayWithCustomSheet`")
                
                paymentCallback(paymentCredential)
            }

            override fun onFailure(errorCode: Int, errorData: Bundle?) {
                Log.e("Moyasar SDK", "Samsung Pay failed in `startInAppPayWithCustomSheet`: $errorCode")

                paymentCallback(null)
            }
        }

    /**
     * Initializes Samsung Pay and checks availability on the device.
     * Note: Must be called before calling `showPaymentsheet`.
     */
    fun initialize(context: Context, shouldShowButtonCallback: (Boolean) -> Unit) {
        try {
            Log.d("Moyasar SDK", "Initializing Samsung Pay....")

            val bundle = Bundle()
            bundle.putString(SpaySdk.PARTNER_SERVICE_TYPE, SpaySdk.ServiceType.INAPP_PAYMENT.toString())

            partnerInfo = PartnerInfo(merchantInfo.serviceId, bundle)
            samsungPay = SamsungPay(context, partnerInfo)

            checkSamsungPayStatus(shouldShowButtonCallback)
        } catch (ex: Exception) {
            Log.e("Moyasar SDK", "Initializing Samsung Pay failed", ex)

            shouldShowButtonCallback(false)
        }
    }

    // TODO: Test context changes, because the context is passed in `initialize` then `showPaymentsheet`. Can that make any issues?
    /**
     * Shows the payment sheet (Uses a CustomSheet).
     * Note: `initialize` must be called before this method.
     */
    fun showPaymentsheet(
        context: Context,
        onResponse: () -> Unit
    ) {
        try {
            Log.d("Moyasar SDK", "Showing Samsung Pay payment sheet....")

            val customSheet = CustomSheet()
            customSheet.addControl(makeAmountControl())

            val customSheetPaymentInfo = CustomSheetPaymentInfo.Builder()
                .setMerchantName(merchantInfo.merchantName)
                .setCustomSheet(customSheet)
                .build()

            paymentManager = PaymentManager(context, partnerInfo)

            paymentManager?.startInAppPayWithCustomSheet(
                customSheetPaymentInfo,
                transactionInfoListener
            )

            onResponse()
        } catch (ex: Exception) {
            Log.e("Moyasar SDK", "Showing Samsung Pay payment sheet failed", ex)

            onResponse()
        }
    }
    
    companion object {
        private const val AMOUNT_CONTROL_ID = "amountControlId"
        // TODO: Check if below is needed
        // private const val PRODUCT_ITEM_ID = "productItemId"
        // private const val PRODUCT_TAX_ID = "productTaxId"
    }
}
