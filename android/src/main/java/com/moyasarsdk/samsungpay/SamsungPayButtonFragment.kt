package com.moyasarsdk.samsungpay

import android.content.res.Configuration
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.fragment.app.Fragment
import androidx.databinding.DataBindingUtil
import android.graphics.drawable.GradientDrawable
import com.moyasarsdk.databinding.FragmentSamsungPayBinding
import com.moyasarsdk.R
import com.moyasarsdk.Logger

/**
 * Fragment displaying a button to start Samsung Pay payment flow.
 */
class SamsungPayButtonFragment : Fragment() {

    private val viewModel: SamsungPayButtonViewModel = SamsungPayButtonViewModelHolder.sharedSamsungPayButtonViewModel
    private lateinit var mBinding: FragmentSamsungPayBinding
    private var selectedButtonDrawable: Int = R.drawable.pay_with_samsung_pay_logo
    private val buttonLayoutChangeListener = View.OnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
        applyPaddingForButtonDrawable(selectedButtonDrawable)
    }

    companion object {
        fun newInstance(
            merchantInfo: MerchantInfo,
            paymentCallback: (String?, String?) -> Unit,
        ): SamsungPayButtonFragment {
            Logger.d("MoyasarSDK", "SamsungPayButtonFragment.newInstance")

            // Need to set the sharedSamsungPayButtonViewModel first thing
            SamsungPayButtonViewModelHolder.sharedSamsungPayButtonViewModel = SamsungPayButtonViewModel(merchantInfo, paymentCallback)

            return SamsungPayButtonFragment()
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        Logger.d("MoyasarSDK", "SamsungPayButtonFragment.onCreateView")

        mBinding = DataBindingUtil.inflate(
            inflater,
            R.layout.fragment_samsung_pay, container, false
        )

        initView()

        return mBinding.root
    }

    override fun onDestroyView() {
        if (this::mBinding.isInitialized) {
            mBinding.samsungPayButton.removeOnLayoutChangeListener(buttonLayoutChangeListener)
        }
        super.onDestroyView()
    }

    private fun enablePaymentButton() {
        mBinding.samsungPayButton.isClickable = true
        mBinding.samsungPayButton.alpha = 1f
    }

    private fun disablePaymentButton() {
        mBinding.samsungPayButton.isClickable = false
        mBinding.samsungPayButton.alpha = 0.4f
    }

    private fun initView() {
        val samsungPayButton = mBinding.samsungPayButton

        selectedButtonDrawable = when (viewModel.merchantInfo.buttonType?.trim()) {
            "samsung_pay_logo" -> R.drawable.samsung_pay_logo
            else -> R.drawable.pay_with_samsung_pay_logo
        }

        samsungPayButton.setImageResource(selectedButtonDrawable)
        samsungPayButton.scaleType = ImageView.ScaleType.FIT_CENTER

        applyPaddingForButtonDrawable(selectedButtonDrawable)
        samsungPayButton.addOnLayoutChangeListener(buttonLayoutChangeListener)

        val backgroundDrawable = mBinding.samsungPayButton.background

        if (backgroundDrawable is GradientDrawable) {
            val radiusDp = (viewModel.merchantInfo.buttonBorderRadius)?.toFloat() ?: 12f
            val radiusPx = radiusDp * requireContext().resources.displayMetrics.density
            
            backgroundDrawable.cornerRadius = radiusPx
        }

        viewModel.initialize(requireContext()) { success ->
            if (success) {
                Logger.i("MoyasarSDK", "Samsung Pay ready and initialized")

                samsungPayButton.visibility = View.VISIBLE
            }
        }

        samsungPayButton.setOnClickListener {
            Logger.d("MoyasarSDK", "Samsung Pay button clicked")

            disablePaymentButton()

            viewModel.showPaymentsheet(
                requireContext(),
                onResponse = {
                    enablePaymentButton()
                }
            )
        }
    }

    private fun applyPaddingForButtonDrawable(buttonDrawable: Int) {
        val isLandscape = resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE

        val (leftPaddingDp, topPaddingDp, rightPaddingDp, bottomPaddingDp) = when (buttonDrawable) {
            R.drawable.samsung_pay_logo -> listOf(12, 10, 12, 10)
            else -> {
                if (isLandscape) {
                    listOf(24, 19, 24, 13)
                } else {
                    listOf(24, 10, 24, 6)
                }
            }
        }

        val density = requireContext().resources.displayMetrics.density
        val leftPaddingPx = (leftPaddingDp * density).toInt()
        val topPaddingPx = (topPaddingDp * density).toInt()
        val rightPaddingPx = (rightPaddingDp * density).toInt()
        val bottomPaddingPx = (bottomPaddingDp * density).toInt()

        mBinding.samsungPayButton.setPadding(
            leftPaddingPx,
            topPaddingPx,
            rightPaddingPx,
            bottomPaddingPx
        )
    }
}
