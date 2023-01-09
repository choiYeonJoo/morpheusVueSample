<template>
  <div>
    <pop-alert v-if="popAlertActive" :popTitle="title" :popMsg="text" :popBtn="buttonText" @click="onAleartClicked"></pop-alert>
    <pop-confirm v-if="popConfirmActive" :popTitle="title" :popMsg="text" :popBtn="buttonText" :cancelButtonText="cancelButtonText" :isLeft="isLeft" @click="onConfirmClicked"></pop-confirm>
    <pop-list v-if="popList" @click="onListClicked"></pop-list>
  </div>
</template>

<script>
import PopAlert from "@/views/Modal/PopErrorAlert";
import PopConfirm from "@/views/Modal/PopSaveConfirm";
import PopList from "@/views/Modal/PopList";
import {mapState} from "vuex";
import EventBus from "@/common/EventBus";

export default {
  name: "Common",
  components: {PopAlert,PopConfirm, PopList},
  props : {

  },
  created() {},
  mounted() {

    EventBus.$off('showAlert');
    EventBus.$on("showAlert", (param)=>{
      this.title = param.title || '알림';
      this.text = param.text;
      this.buttonText = param.buttonText || '확인';
      this.popAlertActive = true;
    });
    EventBus.$off('showConfirm');
    EventBus.$on("showConfirm", (param)=>{
      this.title = param.title || '알림';
      this.text = param.text;
      this.buttonText = param.buttonText || '확인';
      this.cancelButtonText = param.cancelButtonText || '취소';
      this.isLeft = param.isLeft;
      this.confirmParam = param;
      this.popConfirmActive = true;
    });
    EventBus.$off('showList');
    EventBus.$on("showList", () => {
      this.popList = true;
    })
    EventBus.$off('closePop');
    EventBus.$on('closePop', () => {
      let chk = this.popAlertActive || this.popConfirmActive || this.popList;
      if (chk) this.popAlertActive = this.popConfirmActive = this.popList = false;
      console.log(chk);
      EventBus.$emit('closePopCb', !chk);
    })

  },
  computed: {
    ...mapState({
    }),
  },
  watch: {},
  data() {
    return {
      popAlertActive: false,
      popConfirmActive: false,
      popList : false,
      confirmParam : null,
      title : "",
      text : "",
      buttonText : "",
      isLeft : false,
      popMileageActive:false,
      popConfirmErrorActive : false,
    };
  },
  methods: {
    onConfirmClicked(isTrueOrFasle){
      EventBus.$emit('CBConfirm', isTrueOrFasle);
      this.popConfirmActive = false;
    },
    onAleartClicked() {
      EventBus.$emit('CBAlert');
      this.popAlertActive = false;
    },
    onListClicked(cbData) {
    /* 리스트 선택 시 반환 값 
    {
        code : this.value,
      }  */

      EventBus.$emit('CBList', cbData);
      this.popList = false;
    },
  },
}
</script>

<style scoped>

</style>
