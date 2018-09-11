<template>
    <section>
        <div class="parent">
            <div class="margin-tops">
                <query :area="areas" @querys="query"> </query>
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
                    prop="planName"
                    label="计划名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adType"
                    label="广告类型"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="dayBudget"
                    label="当日预算"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="createDate"
                    label="创建日期"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="approvalStatus"
                    label="审批状态"
                    align="center">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            align="center"
                             width="250px">
                            <template slot-scope="scope">
                                 <el-button type="success" size="mini" 
                                  v-if="scope.row.approvalStatus==='0'" @click="openApprovalStatus(scope.row)" >审核</el-button>
                                 <el-button type="success" size="mini" 
                                  v-if="scope.row.approvalStatus==='4'" >录入</el-button>
                            </template>
                     </el-table-column>
                </el-table>
            </div>
                <div class="margin-tops">
                    <paging :total="totals" @handleCurrentChange="CurrentChanges"></paging>
                </div>
                <div>
                    <el-dialog
                    :title="dialog.title"
                    :visible.sync="dialog.dialogVisible"
                    :close-on-click-modal="false"
                    width="800px">
                       <el-form 
                           label-position="right" 
                           label-width="160px" 
                           :model="dialog.list" 
                           :rules="rules" 
                           ref="dialog.list">
                           <el-form-item label="ID:" prop="planId">
                                <el-input v-model="dialog.list.planId"></el-input>
                            </el-form-item>
                            <el-form-item label="广告位名称:" prop="ggwName">
                                <el-input v-model="dialog.list.ggwName"></el-input>
                            </el-form-item>
                            <el-form-item label="广告位类型:" prop="ggwType">
                                <el-select v-model="dialog.list.ggwType" >
                                  <el-option v-for="item in config.ggwType" 
                                  :key="item.value" 
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="广告位类别:" prop="ggwCategory">
                                <el-select v-model="dialog.list.ggwCategory" >
                                  <el-option v-for="item in config.ggwCategory" 
                                  :key="item.value" 
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="停车场编号:" prop="parkNo">
                                <el-input v-model="dialog.list.parkNo"></el-input>
                            </el-form-item>
                            <el-form-item label="停车场名称:" prop="parkName">
                                <el-input v-model="dialog.list.parkName"></el-input>
                            </el-form-item>
                            <el-form-item label="类型:" prop="type">
                                <el-select v-model="dialog.list.type" >
                                  <el-option v-for="item in config.type" 
                                  :key="item.value" 
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="位置:" prop="area">
                                <el-input v-model="dialog.list.area"></el-input>
                            </el-form-item>
                            <el-form-item label="详细地址:" prop="detailAddress">
                                <el-input v-model="dialog.list.detailAddress"></el-input>
                            </el-form-item>
                       </el-form>
                    </el-dialog>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import query from "@/components/queryArea/queryTask";
import paging from "@/components/common/paging";
import {reqQuery } from '@/api/padingTask/adPlanAudit'
export default {
  data() {
    return {
        config:{

        },
      areas: {
        ad1: "创建日期",
        ad2: "计划名称",
        ad3: "广告主编号"
      },
      totals: {
        totalNum: 0,
        currentPage: 1,
        pageSize: 10
      },
      tableLoading: false,
      List: [],
      dialog:{
          title:"审核",
          dialogVisible:false,
          list:{}
      },
      rules:{

      }
    };
  },
  methods: {
    query(list) {
        let _this = this;
      let para = {
        createDate: list.ads1,
        planName: list.ads2,
        adrId: list.ads3
      };
      reqQuery(para)
        .then(res => {
            if(res.status === 200){
               let arr = res.data.list;
               arr && arr.length>0 ? _this.loopItem(arr) : "";
               _this.totals.totalNum = res.data.totalNum;
            }
        })
        .catch(err => {});
    },
    loopItem(arr){
       arr.forEach(item => {
            let temp = {
                planName:item.planname,
                planId:item.spreadplannum,
                adType:item.spreadenddate,
                dayBudget:item.todaybudget,
                createDate:"",
                approvalStatus:item.checkstatus
            }
       });
    },
    CurrentChanges(currentPage, pageSize) {
      this.totals.currentPage = currentPage;
      this.totals.pageSize = pageSize;
    },
    // 打开审核页面 
    openApprovalStatus(row) {
        this.dialog.list.planId= row.planId;
        this.dialog.list.ggwName = row.ggwName;
    }
  },
  components: {
    query,
    paging
  }
};
</script>
<style>
</style>


