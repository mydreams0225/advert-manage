<template>
    <div class="queryArea">
        <el-select v-model="names" :placeholder="area.name">
           <el-option v-for="item in area.options" 
           :key="item.value" 
           :label="item.label"
           :value="item.value">
           </el-option>
        </el-select>
        <el-input :placeholder="area.code" v-model="codes" ></el-input>
        <el-button size="medium" type="primary" @click="query">查询</el-button>
    </div>
</template>
<script>
export default {
  props: {
    area: {
      code: "",
      options:[]
    }
  },
  data() {
    return {
      names: "",
      codes: ""
    };
  },
  methods:{
      query:function(){
          this.$emit('querys',this.names,this.codes);
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


