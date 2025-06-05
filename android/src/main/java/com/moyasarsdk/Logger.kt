package com.moyasarsdk

import android.util.Log
import com.moyasarsdk.BuildConfig

val isDebugLogsEnabled = false

class Logger {
    companion object {
        @JvmStatic
        fun d(tag: String, message: String) {
            if (BuildConfig.DEBUG && isDebugLogsEnabled) {
                Log.d(tag, message)
            }
        }

        @JvmStatic
        fun i(tag: String, message: String) {
            if (BuildConfig.DEBUG) {
                Log.i(tag, message)
            }
        }

        @JvmStatic
        fun w(tag: String, message: String, throwable: Throwable? = null) {
            if (BuildConfig.DEBUG) {
                Log.w(tag, message, throwable)
            } else {
                Log.w(tag, message)
            }
        }

        @JvmStatic
        fun e(tag: String, message: String, throwable: Throwable? = null) {
            if (BuildConfig.DEBUG) {
                Log.e(tag, message, throwable)
            } else {
                Log.e(tag, message)
            }
        }
    }
}