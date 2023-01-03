<template>
  <div id="app">
    <TheLayout>
      <Common></Common>
      <router-view />
    </TheLayout>
  </div>
</template>

<script>
import TheLayout from "@/layouts/TheLayout";
import Common from "@/components/layout/Common";

export default {
  // name: "App",
  components: { TheLayout, Common },
  
  mounted() {
      //back button
      //이벤트
    //안드로이드 back 버튼

    /*if(isMorpheus()){
      M.onBack( (v) => {
        console.log('onback log' , v);
        M.execute("stopScan", {}, "");
        this.$router.back();
      })
    }*/
  },
  methods : {

  }
}
</script>
