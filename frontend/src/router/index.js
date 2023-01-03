import Vue from "vue";
import Router from "vue-router";
import Define from "@/utils/define";
import store from "@/store";
import EventBus from "@/common/EventBus";
import CommonUtil from "@/lib/CommonUtil";

const Landing = () => import(/* webpackChunkName: "chunk/model" */'../views/Landing');
const Dashboard = () => import(/* webpackChunkName: "chunk/model" */'../views/Dashboard/Dashboard');
const Login = () => import(/* webpackChunkName: "chunk/model" */'../views/Login/Login');
Vue.use(Router);

const router = new Router({
  mode: "hash",
  // base: '/', // only history mode
  routes: [
    { path: "/", name: "landing", component: Landing },
    { path: "/landing", name: "landing", component: Landing },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        layout: Define.LAYOUT_TYPE.DEFAULT,
        className: "dashboard"
      }
    },
    { path: "/login", name: "로그인", component: Login },
  ]

});

// 전역 네비게이션
const anonymous_pages = ['/', '/login', '/home', '/dashboard', '/landing'];
export const popupAutoClose = (closeEvt, closeCbEvt ) => {
  return new Promise((resolve, reject) => {
    if(!EventBus._events[closeEvt]) resolve();
    EventBus.$off(closeCbEvt);
    EventBus.$on(closeCbEvt, (canMove) => {
      // 닫힌 팝업이 없이 이동해도 괜찮다면 canMove = true
      // 닫힌 팝업이 존재하여 이동을 멈춰야한다면 canMove = false
      EventBus.$off(closeCbEvt)
      canMove ? resolve() : reject();
      })
    EventBus.$emit(closeEvt);
  })

}

router.beforeEach((to, from, next) => {
  // 최초 진입시에는 팝업을 체크하지않는다.
  const toPath = to.path.toLowerCase();
  const fromPath = from.path.toLowerCase();
  // 로그인인 경우 바로 이동한다
  if(toPath === '/login') return next();
  // 로그인 여부를 체크하여 화면이동을 처리한다. 세션 유지 상태를 확인한다
  if(!anonymous_pages.includes(toPath)) {
    const session = store.getters['userAuth/getLoginSession'];
    if(CommonUtil.isEmpty(session.refreshToken)) return next('/login');
  }
  // 첫페이지인 경우 화면이 뜰 수 있도록..
  if(from.name == null) return next();

  popupAutoClose('closePop', 'closePopCb')
  .then(() => {console.log("true!!"); next(true)})// 팝업이 닫히지 않은 경우 페이지 이동처리
  .catch(() => {console.log("false!!");next(false)}); // 닫힌 경우 reject이 발생된다



});

export default router;
