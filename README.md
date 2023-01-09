# 모피어스 프로젝트
## 기본구조

* assets/res
  * www 
    * js _모피어스 스크립트 라이브러리 파일 생성 위치_
  * Manifest.xml _모피어스 환경설정 파일_
  * mcore.mobile.lic _모피어스 라이선스 파일, 수정 불가_
* frontend _Vue 프로젝트_
* gradle _gradle 환경설정_
* libs _모피어스 안드로이드 라이선스 폴더 (CPU별 폴더 별도)_
* mcoreLibs _모피어스 안드로이드 라이브러리 jar, arr 등_
* res _안드로이드 리소스 폴더_
* src _안드로이드 소스_
  * 패키지명/StartUp.java _모피어스 첫 실행, 웹디버깅 가능 소스 포함_
  * 패키지명/BaseActivity.java _모피어스 웹뷰 포함 기본 액티비티, 이미지최적화, 파일 input 관련 소스 포함_
  * 패키지명/implementation _확장 함수_
    * ExtendWNInterface.java _웹에서 사용할 네이티브 확장함수 정의_
  * 패키지명/samples _라이브러리 포함 소스 및 샘플, utils 함수_ 
* AndroidManifest.xml _안드로이드 환경 설정_
* application.xml _모피어스 환경 설정 파일_
* build.gradle _빌드 환경 설정 파일_
