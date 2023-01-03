import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router,{popupAutoClose}  from "./router";
import "./assets/css/morpheus_style.css";

Vue.config.productionTip = false;

import common from "./plugins/common.js";
Vue.use(common, { someOption: true });

import VueLodash from "vue-lodash";
import lodash from "lodash";

Vue.use(VueLodash, { name: "$_", lodash: lodash });


import vueMoment from 'vue-moment';
import moment from "moment";

moment.locale("ko");
Vue.use(vueMoment, {moment});

import commonMixin from './mixin/commonmixin';
Vue.mixin(commonMixin);

import Fragment from "vue-fragment";
Vue.use(Fragment.Plugin);

import global from "./plugins/global";
import "./plugins/directive.js";

import '@/common/$mcore.js';

Vue.mixin(global);

// 모든 페이지에서 안드로이드 백키에 대한 공통처리
const exit_pages = ['/', '/login', '/dashboard',  '/landing'];
let EXIT_DELAY = true;
const EXIT_DELAY_TIME = 1000;
const exitApp = () => {
  if(EXIT_DELAY) {
    EXIT_DELAY = false;
    M.pop.instance('한번 더 누르시면 앱이 종료 됩니다.');
    setTimeout(() => {
      EXIT_DELAY = true;
    }, EXIT_DELAY_TIME)
  } else {
    M.sys.exit()
  }
}
$mcore.MCommon('onback',function () {
  const currentPath = router.currentRoute.path.toLocaleLowerCase();
  if(exit_pages.includes(currentPath)) {
    // 종료 페이지
    popupAutoClose('closePop', 'closePopCb')
    .then(() => exitApp())// 팝업이 닫히지 않은 경우 페이지 이동처리
    .catch(() => {}); // 닫힌 경우 reject이 발생된다
    return;
  }
  router.back();
})

$mcore.MCommon('onpause',function () {
  M.execute("closeBarcodeScanner", {}, '');
  M.execute("stopScan", {}, "");
})


new Vue({
  render: h => h(App),
  store,
  router
}).$mount("#app");