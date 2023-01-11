<template>
  <div>
    <button type="button" class="btn small" @click="confirmMsg">기본 text</button>
    <button type="button" class="btn small" @click="confirmFullOptionMsg1">전체 옵션 적용</button>
  </div>
</template>
<script>
export default {
  name: 'ConfirmTest',
  data() {
    return {
      msg1 : `confirm 띄움`,
    };
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    
  },
  methods : {
    async confirmMsg(){
      var isOK = await this.$confirm(this.msg1);
      console.log(isOK);
    },
    async confirmFullOptionMsg1(){
      var isOK = await this.$confirm({
        text : this.msg1,
        title : "제목",
        buttonText : "재시도",
        cancelButtonText : "종료"
      });
      console.log(isOK);
    },
  }
};
</script>

<style scoped>
button{width:50%;margin-bottom:.5rem;}
p{display: block;}
</style>