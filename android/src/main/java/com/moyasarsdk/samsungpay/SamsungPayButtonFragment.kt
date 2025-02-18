package com.moyasarsdk.samsungpay

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.databinding.DataBindingUtil
import com.moyasarsdk.databinding.FragmentSamsungPayBinding
import com.moyasarsdk.R
import android.util.Log

/**
 * Fragment displaying a button to start Samsung Pay payment flow.
 */
class SamsungPayButtonFragment : Fragment() {

    private val viewModel: SamsungPayButtonManager = SamsungPayButtonManagerHolder.sharedSamsungPayButtonManager
    private lateinit var mBinding: FragmentSamsungPayBinding

    companion object {
        fun newInstance(
          merchantInfo: MerchantInfo,
          paymentCallback: (String?) -> Unit,
        ): SamsungPayButtonFragment {
            Log.d("Moyasar SDK", "SamsungPayButtonFragment.newInstance")

            // Need to set the sharedSamsungPayButtonManager first thing
            SamsungPayButtonManagerHolder.sharedSamsungPayButtonManager = SamsungPayButtonManager(merchantInfo, paymentCallback)

            return SamsungPayButtonFragment()
        }
      }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        Log.d("Moyasar SDK", "SamsungPayButtonFragment.onCreateView")

        mBinding = DataBindingUtil.inflate(
            inflater,
            R.layout.fragment_samsung_pay, container, false
        )

        initView()

        return mBinding.root
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

        viewModel.initialize(requireContext()) { success ->
            if (success) {
                Log.i("Moyasar SDK", "Samsung Pay ready and initialized")

                samsungPayButton.visibility = View.VISIBLE
            } 
        }
        
        samsungPayButton.setOnClickListener {
            Log.i("Moyasar SDK", "Samsung Pay button clicked")

            disablePaymentButton()

            viewModel.showPaymentsheet(
                requireContext(),
                onResponse = {
                    enablePaymentButton()
                }
            )
        }
    }
}
