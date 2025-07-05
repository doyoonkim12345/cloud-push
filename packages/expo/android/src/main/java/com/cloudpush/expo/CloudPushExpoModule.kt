package com.cloudpush.expo

import android.util.Log
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.events.EventListener
import expo.modules.kotlin.events.EventName
import expo.modules.updates.UpdatesController
import expo.modules.updates.UpdatesListener
import expo.modules.updates.UpdatesConfiguration

class CloudPushExpoModule : Module() {

  override fun definition() = ModuleDefinition {

    Name("CloudPushExpoModule")

    Events("downloadProgress")

    AsyncFunction("fetchUpdateWithProgressAsync") { promise: Promise ->
      val controller = UpdatesController.getInstance(context)
      val config: UpdatesConfiguration = controller.configuration

      // 1. Listener 등록
      val listener = object : UpdatesListener {
        override fun onDownloadProgress(
          success: Boolean,
          bytesDownloaded: Long,
          bytesTotal: Long
        ) {
          // bytesTotal == 0 이면 서버가 크기 모를 때도 있음
          sendEvent(
            "downloadProgress",
            mapOf(
              "receivedBytes" to bytesDownloaded,
              "totalBytes" to bytesTotal
            )
          )
        }

        override fun onUpdateFinished(success: Boolean) {
          // 호출 후 listener 해제
          controller.unregisterListener(this)
          if (success) {
            promise.resolve(true)
          } else {
            promise.reject("ERR_FETCH_UPDATE", "Fetch update failed")
          }
        }

        override fun onUpdateError(error: Exception) {
          controller.unregisterListener(this)
          promise.reject("ERR_FETCH_UPDATE", error.message, error)
        }
      }

      controller.registerListener(listener)

      // 2. fetchUpdateAsync
      controller.fetchUpdateAsync()
    }
  }
}
