package org.opengrind

import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import io.crates.keyring.Keyring

class MainActivity : TauriActivity() {
    private var insetsTop = 0
    private var insetsBottom = 0
    private var insetsLeft = 0
    private var insetsRight = 0

    inner class InsetsInterface {
        @JavascriptInterface fun top() = insetsTop
        @JavascriptInterface fun bottom() = insetsBottom
        @JavascriptInterface fun left() = insetsLeft
        @JavascriptInterface fun right() = insetsRight
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        Keyring.initializeNdkContext(applicationContext)
        super.onCreate(savedInstanceState)

        WindowInsetsControllerCompat(window, window.decorView).apply {
            isAppearanceLightStatusBars = false
            isAppearanceLightNavigationBars = false
        }

        ViewCompat.setOnApplyWindowInsetsListener(window.decorView) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            val density = resources.displayMetrics.density
            insetsTop = (bars.top / density).toInt()
            insetsBottom = (bars.bottom / density).toInt()
            insetsLeft = (bars.left / density).toInt()
            insetsRight = (bars.right / density).toInt()
            ViewCompat.onApplyWindowInsets(view, insets)
        }
    }

    override fun onWebViewCreate(webView: WebView) {
        super.onWebViewCreate(webView)
        webView.addJavascriptInterface(InsetsInterface(), "__AndroidInsets")
    }
}
