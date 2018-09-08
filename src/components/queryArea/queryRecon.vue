<template>
    <div class="query1">
        <label for="">日期：</label>
        <el-date-picker
            v-model="names"
            type="date"
            value-format="yyyyMMdd"
           :placeholder="area.name">
        </el-date-picker>
        
        <el-button size="medium" type="primary" @click="query">查询</el-button>
    </div>
</template>
<script>
export default {
  props: {
    area: {
      name: "",
    }
  },
  data() {
    return {
      names:""
    };
  },
  methods:{
      query:function(){
          this.$emit('querys',this.names);
      }
  }
};
</script>
<style>
    .query1 {
        float: right;
        display: inline-block;
    }
    .query1 .el-input {
        width: 200px;
    }
</style>


