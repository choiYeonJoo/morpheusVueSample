<template>
  <div class="l-header">
    <div class="header">
      <div class="user" v-if="$route.name === 'dashboard'">
        <img src="" alt="로고" class="logo dashboard" @click="reloadChart" />
      </div>
      <div class="navi" v-else>
        <div class="navi-action">
          <button class="btn btn-prev" @click="back">뒤로</button>
        </div>
        <div class="subject">
          <h2 class="title-page">
            <span>{{ $route.name }}</span>
          </h2>
        </div>
      </div>
      <div class="menu">
        <button class="btn" @click="sideMenuOn = true"><i class="icon-menu">menu</i></button>
      </div>
    </div>

    <side-menu v-if="sideMenuOn" @click="sideMenuOn = false"></side-menu>
  </div>
</template>

<script>
import SideMenu from "@/components/layout/SideMenu";
import EventBus from "@/common/EventBus";

export default {
  name: "Header",
  components: {
    SideMenu,
    },
  props: {
  },
  data() {
    return {
      sideMenuOn: false,
    };
  },
  methods: {
    reloadChart(){
      EventBus.$emit('loadChartRelease');
      
      if(isMorpheus()){
        M.pop.instance('갱신되었습니다.');
      }else{
        this.$alert('갱신되었습니다.');
      }
    },
    async back() {
      this.$router.go(-1);
    },
  },
  watch: {
    
  },
  mounted() {
    
  }
};
</script>
