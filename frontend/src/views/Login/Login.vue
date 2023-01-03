<template>
  <div class="l-login">
    <div class="l-inner">
      <div class="login-header">
        <h1>앱 이름</h1>
        <h2 class="ft-color-gray ft-size-xsmall">앱 설명</h2>
      </div>
      <form class="l-form login-form">
          <div class="l-inp">
            <div class="inp">
              <div class="inp-inner">
                <label for="idInput">아이디 : </label>
                <input type="text" id="idInput" v-model="loginId" class="inp-text-line" placeholder="아이디를 입력하세요.">
              </div>
            </div>
          </div>
          <div class="l-inp">
            <div class="inp">
              <div class="inp-inner">
                <label for="pwInput">패스워드 : </label>
                <input v-model="password" id="pwInput"  type="password" class="inp-text-line" placeholder="비밀번호를 입력하세요.">
              </div>
            </div>
          </div>
          <div class="l-checkbox">
            <input type="checkbox" v-model="isIdSave" label="아이디 저장">
          </div>
      </form>
      <button class="btn btn-full-size btn-login" :disabled="!canLogin || isLoginLoading" @click="loginChk">로그인</button>
      <div class="login-option">
        <span class="app-version">{{CommonUtil.getBuildVersion()}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import CommonUtil from "@/lib/CommonUtil";

export default {
  name: "Login",
  components: { },
  data() {
    return {
      loginId: "",
      password: "",
      isIdSave: false,
      isLoginLoading: false
    };
  },
  computed: {
    canLogin() {
      return !CommonUtil.isEmpty(this.loginId) && !CommonUtil.isEmpty(this.password);
    }
  },
  watch:{
    loginId(val){
      // login id 입력 시 숫자입력 및 10자리수 제한 체크
      const chkNum = /^[0-9a-z]{0,12}$/i;
      if(chkNum.exec(val)==null) this.loginId = this.loginId.slice(0,-1);
    }
  },
  methods: {
    /**
     * 로그인
     */
    loginChk() {

      if (CommonUtil.isEmpty(this.loginId)) {
        this.$alert("아이디를 입력해주세요.");
        return false;
      }

      if (CommonUtil.isEmpty(this.password)) {
        this.$alert("비밀번호를 입력해주세요.");
        return false;
      }

      // ID vuex 저장
      if (this.isIdSave) {
        const saveLoginId = this.loginId
        this.$store.commit('userAuth/setCachedUser', saveLoginId);
      } else {
        this.$store.commit('userAuth/removeCachedUser');
      }
      this.onLogin();
    },

    async onLogin(){
      try {
        this.isLoginLoading = true;

        // 로그인
        let loginVer = isMorpheus() ?  M.info.app('app.version') : "1.0.1"; 
        const res = await this.$fetchData({
          method: 'POST',
          url: process.env.VUE_APP_URL+'login',
          data: {
            password: this.password,
            userid: this.loginId,
            appVer : loginVer
          }
        }).finally(() => {
          this.isLoginLoading = false;
        });

        console.log("res : ",res)

       if(isMorpheus()){
          M.data.global('USER_ID',this.loginId);
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
  async mounted() {
    // vuex저장된 로그인 아이디 정보
    const cachedId = this.$store.getters['userAuth/getCachedUser'];

    if (!CommonUtil.isEmpty(cachedId)) {
      //아이디 저장 체크박스 활성화 및 로그인 아이디 세팅
      this.loginId = cachedId;
      this.isIdSave = true;
    } else {
      //아이디 저장 체크박스 비활성화 및 로그인 아이디 빈값 세팅
      this.loginId = "";
      this.isIdSave = false;
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log("to ===>",to);
    console.log("from ===>",from);

    const isOpen = this.$autoClosePop([
    ])

    next(!isOpen);
  },
};
</script>
