import ExpoModulesCore
import EXUpdates

public class CloudPushExpoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("CloudPushExpoModule")
    Events("downloadProgress")

    AsyncFunction("fetchUpdateWithProgressAsync") { (promise: Promise) in
      // 1) 싱글턴 접근 – 함수 호출 대신 프로퍼티
      let controller = EXUpdatesAppController.sharedInstance

      // 2) 다운로드 진행률 노티 구독
      let center = NotificationCenter.default
      let observer = center.addObserver(
        forName: .EXUpdatesDownloadStatusUpdate,
        object: nil,
        queue: .main
      ) { [weak self] note in
        guard
          let body     = note.userInfo?["manifestDownloadProgress"] as? [String: Any],
          let received = body["receivedBytes"]   as? Int,
          let total    = body["totalBytes"]      as? Int
        else { return }

        self?.sendEvent("downloadProgress", [
          "receivedBytes": received,
          "totalBytes":   total
        ])
      }

      // 3) 업데이트 가져오기 – withConfiguration 파라미터 제거
      controller.fetchUpdate { success, error in
        center.removeObserver(observer)
        if let err = error {
          promise.reject("ERR_FETCH_UPDATE", err.localizedDescription, err)
        } else {
          promise.resolve(success)
        }
      }
    }
  }
}
