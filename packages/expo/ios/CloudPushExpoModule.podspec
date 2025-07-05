# ios/CloudPushExpoModule.podspec
Pod::Spec.new do |s|
  s.name         = "CloudPushExpoModule"
  s.version      = "1.0.0"
  s.summary      = "Manual OTA downloader with progress"
  s.license      = { :type => "MIT" }
  s.homepage     = "https://github.com/your-org/cloud-push-expo"
  s.platform     = :ios, "13.0"
  s.source       = { :path => "." }
  s.swift_version = "5.0"

  # 네이티브 소스
  s.source_files  = "ios/**/*.{h,m,mm,swift}"
  # 프레임워크·시스템 라이브러리
  s.frameworks    = "Foundation"
  # Expo 모듈 코어·Updates 의존성
  s.dependency    "ExpoModulesCore"
  s.dependency    "ExpoUpdates"

  # 추가 라이브러리 예: SQLite.swift, CryptoSwift …
  # s.dependency  "SQLite.swift", "~> 0.13"
end
