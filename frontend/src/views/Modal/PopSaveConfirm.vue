<template>
  <div class="l-dialog small">
      <div slot="title" class="el-dialog__title">
        {{ popTitle }}
      </div>
      <div class="l-dialog-body">
        <div class="msg" :class="{'ft-align-center':!isLeft, 'ft-align-left' : isLeft}" v-html="popMsg"></div>
      </div>
      <div slot="footer">
        <div class="btn-group">
          <button class="btn btn-full-size ft-color-placeholder" @click="popClick(false)">{{cancelButtonText}}</button>
          <button class="btn btn-full-size ft-color-main-blue" @click="popClick(true)">{{ popBtn }}</button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "PopSaveConfirm",
  props: {
    popTitle: {
      type: String,
      default: "",
    },
    popMsg: {
      type: String,
      default: "",
    },
    popBtn: {
      type: String,
      default: "확인",
    },
    cancelButtonText: {
      type: String,
      default: "취소",
    },
    isLeft : {
      type: Boolean,
      default : false
    }
  },
  data() {
    return {
      PopSaveConfirm: true,
    };
  },
  methods: {
    popClick: function(isTrueOrFalse) {
      this.$emit("click", isTrueOrFalse) ;
    },
  },
};
</script>
