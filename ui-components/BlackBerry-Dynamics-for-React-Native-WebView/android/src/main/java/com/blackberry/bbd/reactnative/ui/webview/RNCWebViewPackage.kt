package com.blackberry.bbd.reactnative.ui.webview

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext


class RNCWebViewPackage: ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext) = listOf(
    RNCWebViewModule(reactContext)
  )

  override fun createViewManagers(reactContext: ReactApplicationContext) = listOf(
    RNCWebViewManager()
  )
}
