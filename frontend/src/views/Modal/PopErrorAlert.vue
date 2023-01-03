<template>
  <div class="l-dialog small 22222">
      <div slot="title" class="el-dialog__title">
        {{ popTitle }}
      </div>
      <div class="l-dialog-body">
        <div class="msg" v-html="popMsg"></div>
      </div>
      <div slot="footer">
        <div class="btn-group">
          <button class="btn btn-full-size ft-color-main-blue" @click.stop="popClick(true)">{{ popBtn }}</button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "PopErrorAlert",
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
      default: "",
    },
  },
  data() {
    return {
      PopErrorAlert: true,
    };
  },
  methods: {
    popClick: function(submit) {
      this.$emit("click", submit);
    },
  },
};
</script>
