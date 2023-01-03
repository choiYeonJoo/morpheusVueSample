<template>
  <div class="ml-16 mt-20">
    <h2 class="ft-size-xlarge mb-30">공통팝업</h2>
    <div class="mb-20"><el-button @click="popErrorAlertActive = !popErrorAlertActive">공통에러alert</el-button></div>
    <div class="mb-20"><el-button @click="popSaveConfirmActive = !popSaveConfirmActive">공통저장confirm</el-button></div>

    <pop-error-alert v-if="popErrorAlertActive" @click="popErrorAlertActive = !popErrorAlertActive"></pop-error-alert>
    <pop-save-confirm v-if="popSaveConfirmActive" @click="popSaveConfirmActive = !popSaveConfirmActive"></pop-save-confirm>
  </div>
</template>

<script>
import PopErrorAlert from "@/views/Modal/PopErrorAlert";
import PopSaveConfirm from "@/views/Modal/PopSaveConfirm";
export default {
  components: {
    PopErrorAlert,
    PopSaveConfirm,
  },
  name: "Popup",
  data() {
    return {
      popErrorAlertActive: false,
      popSaveConfirmActive: false,
    };
  },
  methods: {
    
  },
};
</script>
