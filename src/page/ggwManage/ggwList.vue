<template>
    <section>
       <div class="parent">
           <div class="margin-tops">
               <el-button type="success" size="medium" @click="addClick">添加广告位</el-button>
               <query :area =  "area" @querys="query"></query>
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
                    align="center"
                     width="200">
                    </el-table-column>
                    <el-table-column
                    prop="ggwName"
                    label="广告位名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="ggwTypeName"
                    label="广告位类型"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adCategoryName"
                    label="广告类别"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="feeMethod"
                    label="计费方式"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="status"
                    label="状态"
                    align="center">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            align="center"
                             width="250px">
                            <template slot-scope="scope">
                                <el-button @click="editClick(scope.row)" type="success" size="mini" class="el-icon-edit"></el-button>
                                 <el-button @click="detailClick(scope.row)" type="success" size="mini" >详情</el-button>
                                  <el-button v-if="scope.row.auditStatus==='4' 
                                  &&scope.row.planPositionStatus==='1' " 
                                  @click="lookAdClick(scope.row.ggwId)" 
                                  type="success" size="mini" >查看广告</el-button>
                            </template>
                     </el-table-column>
                 </el-table>
           </div>
           <div class="margin-tops">
              <paging :total="totals" @handleCurrentChange="currentChange"></paging>
           </div>
           <div class="dialogArea">
               <el-dialog
                    :title="dialog.title"
                    :visible.sync="dialog.dialogVisible"
                    :close-on-click-modal="false"
                    width="700px">
                    <el-form label-position="right" label-width="160px" :model="dialog.list" :rules="rules" ref="dialog.list">
                         <el-form-item label="广告位名称：" prop="ggwName">
                          <el-input v-model="dialog.list.ggwName"></el-input>
                         </el-form-item>
                         <el-form-item label="广告位类型：" prop="ggwType">
                             <el-select v-model="dialog.list.ggwType" >
                            <el-option
                                v-for="item in config.ggwType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                            </el-select>
                         </el-form-item>
                         <el-form-item label="广告位类别：" prop="ggwCategory">
                          <el-select v-model="dialog.list.ggwCategory">
                              <el-option v-for ="item in config.ggwCategory"
                                     :value="item.value" 
                                     :key="item.value" 
                                     :label="item.label">
                              </el-option>
                          </el-select>
                         </el-form-item>
                         <el-form-item  v-if=" dialog.list.ggwCategory==='01'" label="停车场编号：" prop="parkId">
                          <el-input v-model="dialog.list.parkId"></el-input>
                         </el-form-item>
                         <el-form-item  v-if="dialog.list.ggwCategory==='01'" label="停车场名称：" prop="parkName">
                          <el-input v-model="dialog.list.parkName"></el-input>
                         </el-form-item>
                         <el-form-item v-if=" dialog.list.ggwCategory==='01'" label="类型：" prop="parkType">
                          <el-select v-model="dialog.list.parkType">
                              <el-option v-for ="item in config.parkType"
                                     :value="item.value" 
                                     :key="item.value" 
                                     :label="item.label">
                              </el-option>
                          </el-select>
                         </el-form-item>
                         
                        <el-form-item label="日期：" >
                            <el-date-picker
                            v-model="dialog.list.ggwDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyyMMdd">
                            </el-date-picker>
                         </el-form-item>
                         <el-form-item label="位置：" prop="position">
                          <el-cascader class="areaCascader" 
                                      :options="config.position"
                                      expand-trigger="hover"
                                      v-model="dialog.list.position"
                                      @change="handleChange">
                        </el-cascader>
                         </el-form-item>
                         <el-form-item label="详细地址：" >
                          <el-input v-model="dialog.list.detailAddress"></el-input>
                         </el-form-item>
                         <el-form-item label="计费方式：" prop="feeMethod">
                          <el-select v-model="dialog.list.feeMethod">
                              <el-option v-for ="item in config.feeMethod"
                                     :value="item.value" 
                                     :key="item.value" 
                                     :label="item.label">
                              </el-option>
                          </el-select>
                         </el-form-item>
                    </el-form>
                    <div class="btn margin-tops" v-if="looKAt!=='1'">
                      <el-button  @click="submit('dialog.list')" type="success" size="medium" :loading="dialog.loading">提交</el-button>
                    </div>  
               </el-dialog>
           </div>
            <div>
                 <el-dialog
                    title="查看广告内容"
                    :visible.sync="QRcode.dialogVisible"
                    :close-on-click-modal="false"
                    width="350px"
                    height="520px">
                    <div class="qrcode">
                        
                        <div id="qrcode"></div>
                    </div>

               </el-dialog>
            </div>
       </div>
    </section>
</template>
<script>
import query from "@/components/queryArea/query1.vue";
import paging from "@/components/common/paging";
import QRCodes from "qrcode";
import {
  reqAddggw,
  reqGGWList,
  reqEditggw,
  reqQRcode
} from "@/api/ggwManage/ggwList";
export default {
  data() {
    return {
      looKAt: "",
      config: {
        ggwCategory: configs.ggwCategory,
        ggwType: configs.ggwType,
        position: configs.options,
        feeMethod: configs.feeMethod,
        auditStatus: configs.auditStatus,
        parkType: configs.parkType
      },

      area: {
        name: "广告位名称"
      },
      totals: {
        totalNum: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableLoading: false,
      list: [
        { ggwId: "3333", ggwName: "ffff", adType: "开屏广告", feeMethod: 1 },
        { ggwId: "3333", ggwName: "ffff", adType: "开屏广告" }
      ],
      dialog: {
        sign: "2",
        title: "",
        dialogVisible: false,
        loading: false,
        list: {
          ggwType: "1",
          ggwDate: [
            this.common.dateFormatter(new Date(), false),
            this.common.dateFormatter(new Date(), false)
          ],
          position: ["110000", "110100", "110101"]
        }
      },
      QRcode: {
        title: "",
        dialogVisible: false
      },
      rules: {
        ggwName: [
          { required: true, message: "请输入广告位名称", trigger: "blur" }
        ],
        ggwType: [
          { required: true, message: "请选择广告位类型", trigger: "change" }
        ],
        ggwCategory: [
          { required: true, message: "请选择广告位类别", trigger: "change" }
        ]
      },
      username: "",
      token: ""
    };
  },
  mounted() {
    this.username = window.localStorage.getItem("username");
    this.token = window.localStorage.getItem("token");
    this.query();
  },
  methods: {
    // 查询列表
    query(name) {
      var _this = this;
      // this.filters.ggwName = name;
      let para = {
        advertpositionname: name,
        currentPage: this.totals.currentPage,
        pageSize: this.totals.pageSize,
        token: this.token,
        userId: this.username
      };

      reqGGWList(para)
        .then(res => {
          debugger;
          this.list = [];
          if (res.status === 200) {
            let list = res.data.list;
            list && list.length !== 0 ? this.loopItem(list, _this) : "";
            this.totals.totalNum = res.data.totalNum;
            //  this.loopItem(list);
          } else if (res.status === 202) {
            _this.common.tokenCheck(_this);
          }
        })
        .catch(err => {
          _this.$message.error("请求超时，请重新发送请求");
          _this.dialog.loading = false;
          return false;
        });
    },
    loopItem(list, _this) {
      list.forEach(item => {
        // for(var i=0;i<config.ggwType;i++){
        //   if(item.adverttype===config.ggwType[i].value){
        //     ggwTypeNames=config.ggwType[i].label
        //   }
        // }
        let ggwTypeNames = this.filterItem(
          item.adverttype,
          _this.config.ggwType
        );
        let adCategoryNames = this.filterItem(
          item.mcc,
          _this.config.ggwCategory
        );
        let statusName = this.filterItem(
          item.auditStatus,
          _this.config.auditStatus
        );
        var temp = {
          ggwId: item.advertpositionnum, //广告位编号唯一值
          //  partnernum :item.partnernum
          ggwName: item.advertpositionnam, //广告位名称
          ggwType: item.adverttype, //广告位类型
          ggwTypeName: ggwTypeNames, //广告位类型名称
          ggwCategory: item.mcc, // 广告类别
          adCategoryName: adCategoryNames, // 类别名称
          feeMethod: item.ratemode, // 计费方式
          createTime: item.createTime, // 创建时间
          status: statusName, // 审核状态
          planPositionStatus: item.planPositionStatus,
          auditStatus: item.auditStatus,
          ggwDate: [item.starttime, item.endtime], // 开始时间
          //  ggwDateT:item.endtime,// 结束时间
          position: [
            item.advertpositionpro,
            item.advertpositioncity,
            item.advertpositionarea
          ],
          detailAddress: item.address,
          parkId: item.parknum,
          parkName: item.parkname,
          parkType: item.parktype
        };
        this.list.push(temp);
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
    // 点击编辑按钮
    editClick(row) {
      this.dialog.list = row;
      this.looKAt = "0";
      this.dialog.dialogVisible = true;
      this.dialog.title = "编辑广告位";
    },
    // 点击详情按钮
    detailClick(row) {
      this.dialog.list = row;
      this.looKAt = "1";
      this.dialog.dialogVisible = true;
      this.dialog.title = "查看详情";
    },
    // 点击查看广告
    lookAdClick(ggwId) {
      // let para = {
      //   token: this.token,
      //   advertpositionnum: ggwId
      // };
      // reqQRcode(para).then(res=>{
      //   if(res.status===200){
      //     $('#qrcode').qrcode({
      //       render: "canvas",
      //       text: res.data ,
      //       width: "200",               //二维码的宽度
      //       height: "200",              //二维码的高度
      //       background: "#ffffff",       //二维码的后景色
      //       foreground: "#000000",        //二维码的前景色
      //       src: 'img/gray.jpg'             //二维码中间的图片
      //   });
      //   }
      // })
      this.qrCode();
    },
    qrCode() {
      var _this=this;
      // $("#qrcode").qrcode({
      //       render: "table",
      //       text: "http://www.baidu.com?id=",
      //       width: "200", //二维码的宽度
      //       height: "200", //二维码的高度
      //       background: "#ffffff", //二维码的后景色
      //       foreground: "#000000", //二维码的前景色
      //       src: "img/gray.jpg" //二维码中间的图片
      //     });
       var qrcodes= document.getElementById('qrcode')
      QRCodes.toCanvas(qrcodes, "http://www.baidu.com", function(error) {
        if (error) console.error(error);
        console.log("success!");
         _this.QRcode.dialogVisible = true;
      });
    },

    //点击添加按钮
    addClick() {
      this.looKAt = "0";
      this.dialog.dialogVisible = true;
      this.dialog.title = "添加广告位";
      this.dialog.list = {};
    },
    submit(formName) {
      this.dialog.loading = true;
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let list = _this.dialog.list;
          let para = {
            params: {
              advertpositionnam: list.ggwName, //广告位名称
              advertpositionnum: list.ggwId,
              adverttype: list.ggwType, // 广告位类型
              mcc: list.ggwCategory, //广告位类别
              parknum: list.parkId, //停车场编号
              parkname: list.parkName, // 停车场名称
              parktype: list.parkType, // 停车场类型
              // ggwDate: list.ggwDate,//数组
              starttime: list.ggwDate ? list.ggwDate[0] : "",
              endtime: list.ggwDate ? list.ggwDate[1] : "",
              area: list.position,
              address: list.detailAddress, //详细地址
              ratemode: list.feeMethod //计费方式
            },
            token: _this.token,
            userId: _this.username
          };
          if (_this.dialog.title === "添加广告位") {
            // 添加请求
            reqAddggw(para)
              .then(res => {
                if (res.status === 200) {
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });
                  _this.query();
                } else if (res.status === 202) {
                  _this.common.tokenCheck(_this);
                }
                _this.dialog.loading = false;
                _this.dialog.dialogVisible = false;
              })
              .catch(() => {
                _this.dialog.loading = false;
                _this.$message.error("请求超时，请重新发送请求");
                return false;
              });
          } else {
            // 修改请求
            reqEditggw(para)
              .then(res => {
                if (res.status === 200) {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                  _this.query();
                } else if (res.status === 202) {
                  _this.common.tokenCheck(_this);
                }
                _this.dialog.dialogVisible = false;
                _this.dialog.loading = false;
              })
              .catch(err => {
                _this.$message.error("请求超时，请重新发送请求");
                _this.dialog.loading = false;
                return false;
              });
          }
        } else {
          _this.$message.error("请完善必填项信息");
          _this.dialog.loading = false;
          return false;
        }
      });
    },
    //跳转页数
    currentChange(currentPage, pageSize) {
      this.totals.currentPage = currentPage;
      this.totals.pageSize = pageSize;
      this.query();
    },
    handleChange() {}
  },
  components: {
    query,
    paging,
    QRCodes
  }
};
</script>
<style>
.dialogArea .el-input,
.el-select,
.el-cascader {
  width: 280px;
}
.dialogArea .el-form-item {
  margin-bottom: 10px;
}
.dialogArea .btn {
  padding-left: 160px;
}
.qrcode {
  /* margin-left: 200%; */
  height: 320px;
}
#qrcode {
  margin-left: 18%;
  width: 200px;
  height: 200px;
}
</style>


