import { mapGetters } from 'vuex';

export default {

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
};
