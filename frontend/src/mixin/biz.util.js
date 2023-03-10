import { mapGetters } from "vuex";
import Vue from "vue";

export default {
  components: {},
  data() {
    return {};
  },
  /* 공통설정부분 */
  layout(context) {
    /* 팝업 유무 설정 */
    let layoutContent = 'default';
    if (context.route.name === 'index') layoutContent = 'login';
    else if (context.query.popOpen && context.query.popOpen === 'true') layoutContent = 'popup';
    return layoutContent;
  },
  computed: {
    ...mapGetters({
      getLoginSession: 'userAuth/getCachedUser',
    }),
  },
  methods: {
    $t(msg){
      console.log(msg);
      return msg;
    },
  },
  beforeRouteLeave(to, from, next) {
    // 화면에서도 로그인으로 이동처리가 되는 경우 기타 팝업은 무시하고 이동되도록 처리
    if (to.name === "로그인") {
      return next(true);
    }
    if(to.path === "/login"){
      return next(true);
    }
    // beforeRouteLeave를 선언하지 않은 컴포넌트에서 오류가 발생되지않도록 처리
    setTimeout(() => {
      next(true);
    }, 0);

  },
};
