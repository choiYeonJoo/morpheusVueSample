<template>
  <div>
    <button type="button" class="btn line small" @click="alerMsg1">기본 text</button>
    <button type="button" class="btn line small" @click="alerFullOptionMsg1">전체 옵션</button>
  </div>
</template>
<script>
export default {
  name: 'AlertTest',
  data() {
    return {
      msg1 : `alert 띄움`,
    };
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    
  },
  methods : {
    alerMsg1(){
      this.$alert(this.msg1);
    },
    alerFullOptionMsg1(){
      this.$alert({
        text : this.msg1,
        title : "제목",
        buttonText : "닫기",
      });
    },
  }
};
</script>

<style scoped>
button{width:50%;margin-bottom:.5rem;}
p{display: block;;}
</style>