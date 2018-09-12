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
                    :data="list"
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
                    prop="ggwId"
                    label="广告位编号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="planId"
                    label="投放计划编号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="planName"
                    label="投放计划名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="patternId"
                    label="合作商编号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="patternName"
                    label="合作商名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adrId"
                    label="广告主编号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adrName"
                    label="广告主名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adEleId"
                    label="广告元素编号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="statusName"
                    label="状态"
                    align="center">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            align="center"
                             width="250px">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="prentName(scope.$index, scope.row.uuid,scope.row.statusName)"
                                type="primary"
                                
                                size="mini">
                                   修改状态
                                </el-button>
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
import query from "@/components/queryArea/query2";
import paging from "@/components/common/paging";
import  {reqGgwManage,reqStatusU,reqStatusT} from '@/api/patternManage/ggwManage'
export default {
  data() {
    return {
      areas: {
        name: "投放计划编号",
        code: "广告位编号"
      },
      totals: {
        totalNum: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableLoading: false,
      list: [{}]
    };
  },
  mounted(){
    this.query();
  },
  methods: {
    query(planId, ggwId) {
        debugger
      var _this = this;
      let para = {
        spreadplannum: planId,
        advertpositionnum: ggwId,
        pageSize: this.totals.pageSize,
        currentPage: this.totals.currentPage,
        token: window.localStorage.getItem("token")
      };
      
      reqGgwManage(para)
        .then(res => {
          this.list = [];
          if (res.status === 200) {
            var list = res.data.list;
           list &&  list.length !== 0 ? _this.loopItem(list) : "";
           _this.totals.totalNum = res.data.totalNum;
          } else if (res.status === 202) {
            _this.common.tokenCheck(_this);
          }
          _this.tableLoading = false;
        })
        .catch(() => {
          _this.$message.error("请求超时，请重新发送请求");
          _this.tableLoading = false;
          return false;
        });
    },
    loopItem(list){
        list.forEach(item => {
            var statusName=""
            if(item.status==="0"){
                statusName="停用"
            }else if(item.status==="1"){
                statusName="启用"
            }
            var temp ={
               ggwId: item.advertpositionnum,
               planId:item.spreadplannum,
               planName:item.planname,
               patternId:item.partnernum,
               patternName:item.partnername,
               adrId:item.advertisernum,
               adrName:item.advertisername,
               adEleId:item.advertelenum,
               status:item.status,
               statusName:statusName,
               uuid:item.uuid
            }
            this.list.push(temp);
        });
    },
    currentChange(currentPage, pageSize) {
      this.totals.currentChange = currentPage;
      this.totals.pageSize = pageSize;
      this.query();
    },
    prentName(index, uuid,status) {
      var _this = this;
      debugger
       let para = {
        uuid: uuid,
        token:window.localStorage.getItem("token")
      };
       status === "停用" && this.reqStatusUsed(para);
       status === "启用" && this.reqStatusStop(para);
    },
    reqStatusUsed(para){
        reqStatusU(para).then(res=>{
        if(res.status===200){
           this.query();
        }else if(res.status===202){
             _this.common.tokenCheck(_this);
            this.tableLoading = false;
        }
      }).catch(()=>{
           _this.$message.error("请求超时，请重新发送请求");
          this.tableLoading = false;
          return false;
      })  
    },
    reqStatusStop(para){
      reqStatusT(para).then(res=>{
        if(res.status===200){
           this.query();
        }else if(res.status===202){
             _this.common.tokenCheck(_this);
            this.tableLoading = false;
        }
      }).catch(()=>{
           _this.$message.error("请求超时，请重新发送请求");
          this.tableLoading = false;
          return false;
      })
    }
  },
  components: {
    query
  }
};
</script>
<style>
</style>


