<template>
    <section>
         <div class="parent">
             <div class="margin-tops flowdates">
                 曝光日期：
                 <el-date-picker
                    v-model="expDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    default-value="2018-3-3"
                    value-format="yyyyMMdd">
                 </el-date-picker>
                  <query :area= "area" @querys="querys" ></query>
             </div>
             <div class="margin-tops">
                 <el-table
                   v-loading="tableLoading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="adExpData"
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
                    prop="expFlowId"
                    label="曝光流水编号"
                    width="200px"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adrId"
                    label="广告主编号"
                    width="200px"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adrName"
                    label="广告主"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="coop"
                    label="合作商"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adId"
                    label="广告位编号"
                    width="120px"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adName"
                    label="广告位名称"
                    width="120px"
                    align="center">
                    </el-table-column>
                     <el-table-column
                    prop="putPlanId"
                    label="投放计划编号"
                    width="150px"
                    align="center"
                    v-if="tb.advert_show_applyplan_number_table">
                    </el-table-column>
                     <el-table-column
                    prop="adPlanName"
                    label="广告计划名称"
                    width="150px"
                    align="center"
                    v-if="tb.advert_show_applyplan_name_table">
                    </el-table-column>
                     <el-table-column
                    prop="adEleName"
                    label="广告元素名称"
                    width="150px"
                    align="center"
                    v-if="tb.advert_show_element_name_table">
                    </el-table-column>
                    <el-table-column
                    prop="adEleId"
                    label="广告元素编号"
                    width="150px"
                    align="center"
                    v-if="tb.advert_show_element_number_table">
                    </el-table-column>
                    <el-table-column
                    prop="feeMethod"
                    label="计费方式"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="terminalIP"
                    label="终端IP"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="expUnitPrice"
                    label="曝光单价"
                    align="center"
                    v-if="tb.advert_show_advert_price_table">
                    </el-table-column>
                    <el-table-column
                    prop="coopBA"
                    label="合作商获益金额"
                    width="150px"
                    align="center"
                    v-if="tb.advert_show_partner_price_table">
                    </el-table-column>
                    <el-table-column
                    prop="expDate"
                    label="曝光时间"
                    width="200px"
                    align="center">
                    </el-table-column>
                 </el-table>
             </div>
             <div class="margin-tops">
                 <paging :total="totals" @handleCurrentChange="CurrentChanges"></paging>
             </div>
         </div>
    </section>
</template>
<script>
import query from "@/components/queryArea/queryExp";
import paging from "@/components/common/paging.vue";
import { reqAdExpFlow } from "@/api/advertFlow/adExpFlow.js";
export default {
  data() {
    return {
      tb:{
        advert_show_applyplan_number_table:this.common.has("advert_show_applyplan_number_table"),
        advert_show_applyplan_name_table:this.common.has("advert_show_applyplan_name_table"),
        advert_show_element_name_table:this.common.has("advert_show_element_name_table"),
        advert_show_element_number_table:this.common.has("advert_show_element_number_table"),
        advert_show_advert_price_table:this.common.has("advert_show_advert_price_table"),
        advert_show_partner_price_table:this.common.has("advert_show_partner_price_table")
      },
      config:{
        feeMethod:configs.feeMethod
      },
      expDate: "",
      //   expDate: new Date().getTime() + 3600 * 1000 * 24 * 3,
      area: {
        adId: "广告主编号",
        coopId: "合作商编号",
        clickFlowId: "曝光流水号",
        ggwId: "广告位编号",
        planId: "投放计划编号",
        adEleId:"广告元素编号",
        ifadId:this.common.has("advert_show_advertiser_search"),
        ifcoopId:this.common.has("advert_partner_advertiser_search"),
        ifclickFlowId:this.common.has("advert_show_number_search"),
        ifggwId:this.common.has("advert_show_advertposition_search"),
        ifplanId:this.common.has("advert_show_applyplan_search"),
        ifadEleId:this.common.has("advert_show_element_search"),
      },
      tableLoading: false,
      adExpData: [{}],
      filters: {},
      totals: {
        totalNum: 0,
        pageSize: 10,
        currentPage: 1
      }
    };
  },
  mounted() {
    this.querys();
  },
  methods: {
    querys(list) {
      var _this = this;
      var list = list || {}
      this.adExpData=[];
      this.tableLoading = true;
      let para = {
        advertisernum: list.adIds || "", // 广告主编号
        partnernum: list.coopIds || "", //合作商 编号
        advertshownum: list.clickFlowIds || "", // 曝光流水号
        advertpositionnum: list.ggwIds || "", // 广告位编号
        spreadplannum: list.planIds || "", // 投放计划编号
        advertelenum:  list.adEleId || "",
        showdate: this.expDate, // 曝光日期
        currentPage:this.totals.currentPage,
        pageSize:this.totals.pageSize,
        token: window.localStorage.getItem("token"),
        userId:window.localStorage.getItem("username"),
        identity:window.localStorage.getItem("identitys")
      };
      reqAdExpFlow(para)
        .then(res => {
          if (res.status === 200) {
            var list = res.data.list;
            list && list.length!=0 ? _this.loopItem(list) : "";
            _this.totals.totalNum = res.data.totalNum;
          } else if (res.status === 202) {
            _this.common.tokenCheck(_this);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.$message.error("请求超时，请重新发送请求");
          this.tableLoading = false;
          return false;
        });
    },
    loopItem(list) {
      var _this =this;
      list.forEach(item => {
        //  let feeMethod = this.filterItem(
        //   item.ratemode,
        //   _this.configs.feeMethod
        // );
        let temp = {
          expFlowId: item.advertshownum, // 曝光流水编号
          adrId: item.advertisernum, //广告主编号
          adrName: item.advertisername, // 广告主
          coop: item.partnername, // 合作商
          adId: item.advertpositionnum, // 广告位编号
          adName: item.advertpositionname, // 广告位名称
          putPlanId: item.putPlanId, // 投放计划编号
          adPlanName: item.planname, // 广告计划名称
          adEleId: item.advertelenum,
          adEleName: item.advertelename, // 广告元素名称
          feeMethod: item.ratemode, //计费方式
          terminalIP: item.showip, //终端IP
          expUnitPrice: item.showprice, // 曝光单价
          coopBA: item.partnergetprice, // 合作商获益金额
          expDate: item.showtime // 曝光时间
        };
        this.adExpData.push(temp);
      });
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
    CurrentChanges(currentPage, pageSize) {
      this.totals.currentPage = currentPage;
      this.totals.pageSize = pageSize;
      this.querys();
      //   this.queryAdvertList(_this.filters.identity,_this.filters.name);
    }
  },
  components: {
    query,
    paging
  }
};
</script>
<style>
/* .flowdates{
    display: inline-block
} */
</style>


