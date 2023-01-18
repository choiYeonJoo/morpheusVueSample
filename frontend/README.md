# sample_app_publish
모피어스 프로젝트 내에서 Vue 를 사용하고자 할 경우 사용할 수 있는 기본 템플릿 프로젝트 입니다.
현재 안드로이드 버전만 작성되어 있습니다. (iOS의 경우 파일 다운로드 등에 대해 공통 프로젝트 개선 후 업데이트 예정)

frontend 폴더 구조
* public
  * morpheus _모피어스 라이브러리 폴더_
    * mcore.extends.js _모피어스 라이브러리 기본 파일(변경 X)_
    * mcore.min.js _모피어스 라이브러리 기본 파일(프로젝트 생성 시 프로젝트/assets/res/www/js에 생성되는 파일을 복사해 해당 폴더에 붙여넣어 최신화 필요)_
    * wnInterface.js _모피어스 라이브러리 기본 파일(프로젝트 생성 시 프로젝트/assets/res/www/js에 생성되는 파일을 복사해 해당 폴더에 붙여넣어 최신화 필요)_
  * favicon.ico _웹 내 아이콘 파일, 앱에서는 표시되지 않음_
  * index.html _기본 html 파일_
* src
  * assets _css, image 등 디자인 폴더_
  * common _프로젝트에서 사용하는 공통 js 폴더_
    * $mcore.js _모피어스 생명주기 관련 컨트롤러_
    * define.js _앱 내에서 사용하는 상수 정의_
    * EventBus _이벤트 버스 정의 (해당 앱에서는 공통 팝업 관련 내용 정의됨)_
    * morpheus.native.js _모피어스 앱 판단 관련 내용, 모든 화면에서 isMorpheus() 로 호출가능_
    * service.api.js _axios 통신 관련 정의_
  * components _화면 내 컴포넌트_
    * layout _레이아웃 관련 컴포넌트 폴더_
      * CommonPopup.vue _공통 팝업 정의_
      * Footer.vue _푸터 컴포넌트_
      * Header.vue _헤더 컴포넌트_
      * index.js _푸터, 헤더 export_
      * LoadingBar.vue _스크립트 로딩 바_
      * SideMene.vue _사이드메뉴_
  * layouts _화면 전체 레이아웃 종류 정의_
    * DefaultLayout.vue _헤더푸터가 있는 레이아웃_
    * EmptyLayout.vue _헤더푸터가 없는 레이아웃_
    * TheLayout.vue _레이아웃 종류를 나눠 호출_
  * mixin
    * biz.util.js _화면 내 biz 로직에 대한 util 함수를 mixin 으로 정의_
  * plugins
    * common.js _공통 prototype 정의_
    * directive.js _공통 directive 정의_
  * router
    * index.js _기본 라우터 설정_
  * store
    * index.js _기본 스토어 설정, 정의 (웹 LocalStorage에 저장하는 부분을 모피어스 storage 저장으로 변경)_
    * module
      * sample.js _biz 별 스토어 파일 생성시 참고 샘플 파일_
  * utils
    * CommonUtil.ts _유틸성 함수 정의_
    * NativeUtil.ts _모피어스 확장 함수 정의_
  * views _각 화면별 파일_
    * Landing.vue _제일 첫 페이지로 사용 (리소스 업데이트, 스토어에 데이터 유지 등 로직 포함)_
    * AlertTest.vue _스크립트 alert 팝업을 사용할 시 샘플 소스 적용_
    * ConfirmTest.vue _스크립트 confirm 팝업을 사용할 시 샘플 소스 적용_
* App.vue _기본 Vue 레이아웃_
* main.js _css, 공통 라이브러리 import_
* env.development _개발 환경 설정 파일 (서버 주소 등)_
* env.production _운영 환경 설정 파일 (서버 주소 등, 앱 배포시에는 sourcemap false로 변경)_
* vue.config.js _뷰 환경설정 파일, jquery 등 사용시 주석 해제_

