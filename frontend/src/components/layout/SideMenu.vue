<template>
  <div class="l-side-menu" @click.stop="switchSideMenu">
    <div class="l-side-menu-wrap" @click.stop  v-loading="loading" element-loading-spinner="el-icon-loading">
      <loading-bar :loading="loading"></loading-bar>
      <div class="l-menu-header">
        <div class="menu-header">
          <img src="" alt="로고" class="logo" @click="routeDashboard"/>
          <button class="btn btn-close" @click="switchSideMenu"><i class="icon-x"></i></button>
        </div>
        <div class="menu-user">
          <div class="user-thumb">
          </div>
          <div class="d-flex-be-center">
            <button class="btn btn-xsmall-size outline" style="flex:1" @click="onLogOut">로그아웃</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingBar from "@/components/common/LoadingBar";

export default {
  name: "SideMenu",
  components: { LoadingBar },
  data() {
    return {
      loading : false,
    };
  },
  computed: {

  },
  watch: {
  },
  mounted() {
  },
  methods: {
    async onLogOut() {
      let isLogout = await this.$confirm("로그아웃하고 어플리케이션을 종료하시겠습니까?");
      if(isLogout){
        // TODO 로그아웃 처리
        // 로그인 이동
        this.$router.replace("/login");
      };
    },
    switchSideMenu() {
      this.$emit("click");
    },
    routeDashboard(){
      this.$emit('click');
      if (this.$route.path !== '/dashboard') {
        this.$router.push("/dashboard");
      }
    },
  }
};
</script>
