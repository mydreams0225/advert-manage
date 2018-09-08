<template>
    <section>
         <div class="parent">
             <div class="margin-tops">
                  <query :area="areas" @querys="query"></query>
             </div>
             <div class="margin-tops">
                 <el-table
                   v-loading="tableLoading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="List"
                    border
                    style="width: 100%"
                    >
                    <el-table-column
                      type="index"
                      width="100"
                      label="序号"
                      align="center">
                    </el-table-column>
                    <el-table-column
                    prop="patternId"
                    label="合作商编号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="patternType"
                    label="类型"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="createDate"
                    label="时间"
                    align="center">
                    </el-table-column>
                    
                    <el-table-column
                            fixed="right"
                            label="操作"
                            align="center"
                             width="250px">
                            <template slot-scope="scope">
                                <el-button size="medium" type="primary" @click="downLoad(scope.row.resourcepath)" >下载</el-button>
                            </template>
                     </el-table-column>
                </el-table> 
             </div>
             <div class="margin-tops">
                  <paging :total="totals" @handleCurrentChange="currentChange"></paging>
             </div>
         </div>
    </section>
</template>

<script>
import query from '@/components/queryArea/queryRecon'
import paging from '@/components/common/paging'
import {reqAdFlow} from  '@/api/reconManage/adFlowRecon'
export default {
    data(){
        return{
            config:{
                filetype:configs.filetype
            },
           areas:{
           
           },
           tableLoading:false,
           List:[{}],
           totals:{
               currentPage:1,
               pageSize:10,
               totalNum:0
           }
        }
    },
    mounted(){
        this.query();
    },
    methods:{
      query(dates){
           this.tableLoading = true;
          var _this = this;
          let para = {
              businessdate:dates,
              currentPage:this.totals.currentPage,
              pageSize:this.totals.pageSize,
              token:window.localStorage.getItem("token"),
              userId:window.localStorage.getItem("username"),
          };
          reqAdFlow(para).then(res=>{
              _this.List=[]
              debugger
             if(res.status===200){
                 let list = res.data.list;
                 list && list.length!=0? _this.loopItem(list) :"";
                 _this.totals.totalNum = res.data.totalNum;
             }else if(res.status===202){
                _this.common.tokenCheck(_this);
             }
              _this.tableLoading = false;
          }).catch(err=>{

            _this.$message.error("请求超时，请重新发送请求");
            _this.tableLoading = false;
            return false;
          })
         
      },
      loopItem(list){
          list.forEach(item=>{
              let patternType = this.filterItem(
                item.filetype,
                this.config.filetype
                );
              var temp = {
                createDate:  item.businessdate,
                patternId: item.partnernum,
                patternType:patternType,
                resourcepath:item.resourcepath
              }
              this.List.push(temp)
          })
      },
      filterItem(str, list) {
      var temp = "";
      for (var i = 0; i < list.length; i++) {
        if (str === list[i].value) {
          return (temp = list[i].label);
        }
      }
      return temp;
    },
      currentChange(currentPage,pageSize){
         this.totals.currentPage = currentPage;
         this.totals.pageSize=pageSize;
         this.query();
      },
      downLoad(path){
        window.open(path);
    },
    },
    
    components:{
        query,
        paging
    }
    
}
</script>
<style>
   
</style>


