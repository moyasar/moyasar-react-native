package com.moyasarsdk.samsungpay

import android.os.Bundle
import android.content.Context
import com.samsung.android.sdk.samsungpay.v2.SamsungPay
import com.samsung.android.sdk.samsungpay.v2.StatusListener
import com.samsung.android.sdk.samsungpay.v2.SpaySdk
import com.samsung.android.sdk.samsungpay.v2.PartnerInfo
import com.samsung.android.sdk.samsungpay.v2.payment.*
import com.samsung.android.sdk.samsungpay.v2.payment.sheet.CustomSheet
import com.samsung.android.sdk.samsungpay.v2.payment.sheet.AmountBoxControl
import com.samsung.android.sdk.samsungpay.v2.payment.sheet.AmountConstants
import java.util.UUID
import com.moyasarsdk.Logger

/**
 * Holds merchant-related information
 */
data class MerchantInfo(
    val serviceId: String,
    val merchantName: String,
    val merchantId: String,
    val merchantCountryCode: String,
    val amount: Double,
    val currency: String,
    val supportedNetworks: List<String>,
    val orderNumber: String?
)

/**
 * Logic to handle Samsung Pay payment flow
 */
class SamsungPayButtonViewModel(
    private val merchantInfo: MerchantInfo,
    private val paymentCallback: (String?, String?) -> Unit
) {

    // Samsung Pay SDK objects
    private var samsungPay: SamsungPay? = null
    private var paymentManager: PaymentManager? = null
    private var partnerInfo: PartnerInfo? = null

    private fun checkSamsungPayStatus(shouldShowButtonCallback: (Boolean) -> Unit) {
        samsungPay?.getSamsungPayStatus(object : StatusListener {
            override fun onSuccess(status: Int, bundle: Bundle) {
                when (status) {
                    SpaySdk.SPAY_READY -> {
                        Logger.d("MoyasarSDK", "Samsung Pay ready")

                        shouldShowButtonCallback(true)
                    }
                    SpaySdk.SPAY_NOT_READY -> {
                        Logger.w("MoyasarSDK", "Samsung Pay not ready")

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
                        Logger.w("MoyasarSDK", "Samsung Pay not allowed temporarily")

                        // TODO: Support below comment

                        // If EXTRA_ERROR_REASON is ERROR_SPAY_CONNECTED_WITH_EXTERNAL_DISPLAY,
                        // guide user to disconnect it.
                        shouldShowButtonCallback(false)
                    }
                    SpaySdk.SPAY_NOT_SUPPORTED -> {
                        Logger.w("MoyasarSDK", "Samsung Pay is not supported on this device or emulator/simulator")

                        shouldShowButtonCallback(false)
                    }

                    else -> {
                        Logger.e("MoyasarSDK", "Samsung Pay unknown status: $status")

                        shouldShowButtonCallback(false)
                    }
                }
            }

            override fun onFail(errorCode: Int, bundle: Bundle) {
                Logger.e("MoyasarSDK", "Samsung Pay status check failed with error code: $errorCode")

                shouldShowButtonCallback(false)
            }
        })
    }

    private fun makeAmountControl(): AmountBoxControl {
        val amountBoxControl = AmountBoxControl(AMOUNT_CONTROL_ID, merchantInfo.currency)
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
                Logger.d("MoyasarSDK", "Samsung Pay updating card info in `startInAppPayWithCustomSheet`")

                paymentManager?.updateSheet(customSheet)
            }

            override fun onSuccess(
                response: CustomSheetPaymentInfo,
                paymentCredential: String,
                extraPaymentData: Bundle
            ) {
                Logger.d("MoyasarSDK", "Samsung Pay succeeded in `startInAppPayWithCustomSheet`")

                paymentCallback(paymentCredential, response.orderNumber)
            }

            override fun onFailure(errorCode: Int, errorData: Bundle?) {
                Logger.e("MoyasarSDK", "Samsung Pay failed in `startInAppPayWithCustomSheet`: $errorCode")

                paymentCallback(null, null)
            }
        }

    /**
     * Initializes Samsung Pay and checks availability on the device.
     * Note: Must be called before calling `showPaymentsheet`.
     */
    fun initialize(context: Context, shouldShowButtonCallback: (Boolean) -> Unit) {
        try {
            Logger.d("MoyasarSDK", "Initializing Samsung Pay....")

            val bundle = Bundle()
            bundle.putString(SpaySdk.PARTNER_SERVICE_TYPE, SpaySdk.ServiceType.INAPP_PAYMENT.toString())

            partnerInfo = PartnerInfo(merchantInfo.serviceId, bundle)
            samsungPay = SamsungPay(context, partnerInfo)

            checkSamsungPayStatus(shouldShowButtonCallback)
        } catch (ex: Exception) {
            Logger.e("MoyasarSDK", "Initializing Samsung Pay failed", ex)

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
            Logger.d("MoyasarSDK", "Showing Samsung Pay payment sheet....")

            Logger.d("MoyasarSDK", "Supplied order number: ${merchantInfo.orderNumber} will generate one if null")

            val customSheet = CustomSheet()
            customSheet.addControl(makeAmountControl())

            val customSheetPaymentInfo = CustomSheetPaymentInfo.Builder()
                .setMerchantId(merchantInfo.merchantId) // Must for MADA
                .setMerchantName(merchantInfo.merchantName)
                .setOrderNumber(merchantInfo.orderNumber ?: UUID.randomUUID().toString()) // Must for VISA
                .setAllowedCardBrands(brandList)
                .setCustomSheet(customSheet)
                .setMerchantCountryCode(merchantInfo.merchantCountryCode) // Must for MADA
                .build()

            paymentManager = PaymentManager(context, partnerInfo)

            paymentManager?.startInAppPayWithCustomSheet(
                customSheetPaymentInfo,
                transactionInfoListener
            )

            onResponse()
        } catch (ex: Exception) {
            Logger.e("MoyasarSDK", "Showing Samsung Pay payment sheet failed", ex)

            onResponse()
        }
    }

    private val brandList: ArrayList<SpaySdk.Brand>
        get() {
            val brandList = ArrayList<SpaySdk.Brand>()

            // Map string network names to Samsung Pay SDK Brand enums
            merchantInfo.supportedNetworks.forEach { network ->
                when (network) {
                    "mada" -> brandList.add(SpaySdk.Brand.MADA)
                    "visa" -> brandList.add(SpaySdk.Brand.VISA)
                    "mastercard" -> brandList.add(SpaySdk.Brand.MASTERCARD)
                    "amex" -> brandList.add(SpaySdk.Brand.AMERICANEXPRESS)
                    else -> Logger.w("MoyasarSDK", "Unknown card network: $network, skipping")
                }
            }

            return brandList
        }

    companion object {
        private const val AMOUNT_CONTROL_ID = "amountControlId"
    }
}
