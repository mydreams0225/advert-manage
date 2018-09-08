<template>
    <div class="queryArea">
        <el-input :placeholder="area.adId" v-model="list.adIds" v-if="area.ifadId"></el-input>
        <el-input :placeholder="area.coopId" v-model="list.coopIds" v-if="area.ifcoopId"></el-input>
        <el-input :placeholder="area.clickFlowId" v-model="list.clickFlowIds" v-if="area.ifclickFlowId"></el-input>
        <el-input :placeholder="area.ggwId" v-model="list.ggwIds" v-if="area.ifggwId"></el-input>
        <el-input :placeholder="area.planId" v-model="list.planIds" v-if="area.ifplanId"></el-input>
        <el-input :placeholder="area.adEleId" v-model="list.adEleId" v-if="area.ifadEleId"></el-input>
        <el-button size="medium" type="primary" @click="query">查询</el-button>
    </div>
</template>
<script>
export default {
  props: {
    area: {
      adId: "",
      coopId: "",
      clickFlowId: "",
      ggwId: "",
      planId: "",
      adEleId:""
    }
  },
  data() {
    return {
      list: {
        adIds: "",
        coopIds: "",
        clickFlowIds: "",
        ggwIds: "",
        planIds: "",
        adEleId:""
      }
    };
  },
  methods: {
    query: function() {
      this.$emit("querys", this.list);
    }
  }
};
</script>
<style>
.queryArea {
  float: right;
  display: inline-block;
}
.queryArea .el-input {
  width: 200px;
}
</style>


