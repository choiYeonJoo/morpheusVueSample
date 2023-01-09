<template>
  <div class="l-dialog small">
        <div slot="title" class="el-dialog__title">
          <h2>리스트 선택</h2>
        </div>
        <div class="l-dialog-body">
          <div class="l-radio is-bordered">
            <el-radio-group v-model="value">
              <el-radio v-for="(item, idx) in rowList" :key="'list'+idx" :label="item.vl" :value="item.vl">{{item.lb}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div slot="footer">
          <div class="btn-group">
            <button class="btn btn-full-size ft-color-main-blue" @click="handleStep">확인</button>
          </div>
        </div>
  </div>
</template>

<script>
import CommonUtil from "@/utils/CommonUtil";

export default {
  name: "PopPrintGetCData",
  props: {
  },
  data() {
    return {
      PopPrintGetCData: true,
      rowList : [{vl:"value1", lb:"선택1"},{vl:"value2", lb:"선택2"},{vl:"value3", lb:"선택3"}],
      value : "",
    };
  },
  computed : {
  },
  methods: {
    handleStep() {
      if(CommonUtil.isEmpty(this.value)) {
        this.$alert("리스트를 선택해주세요.");
        return;
      }
      this.popClick('Y');
    },
    popClick(isSelected) {
      let payload = {
        list : this.value
      };

      if(CommonUtil.isEmpty(isSelected)){
        payload.list = '';
      }
      
      this.$emit("click", payload);
    },
  },
};
</script>
