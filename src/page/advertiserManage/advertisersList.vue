<template>
    <section>
        <div class="parent">
            <div class="margin-tops">
                 <el-button 
                     type="success" 
                     size="medium" 
                     class="el-icon-plus" 
                     @click="addAdvertList">添加
                  </el-button>
                 <query :area = "areas" @querys = "queryAdvertList"></query>  
            </div>
            <div class="margin-tops">
                 <el-table
                   v-loading="tableLoading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="advertListData"
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
                    prop="userRealName"
                    label="姓名"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="userName"
                    label="用户名"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="email"
                    label="邮箱"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="statusName"
                    label="状态"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="identityName"
                    label="身份"
                    align="center">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            align="center"
                             width="250px">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="primary" size="mini" class="el-icon-edit"></el-button>
                                <el-button
                                @click.native.prevent="deleteRow(scope.$index, scope.row.userName)"
                                type="danger"
                                class="el-icon-error"
                                size="mini">
                                </el-button>
                            </template>
                     </el-table-column>
                 </el-table>
            </div>
            <div class="margin-tops">
                <paging :total="totals" @handleCurrentChange="CurrentChanges"></paging>
            </div>
            <div class="advertList">
                <el-dialog
                     :title="dialog.title"
                    :visible.sync="dialog.dialogVisible"
                    :close-on-click-modal="false"
                    width="800px"
                    >
                    <el-form label-position="right" label-width="160px" :model="dialog.list" :rules="rules" ref="dialog.list">
                       <el-form-item label="姓名：" prop="userRealName">
                          <el-input v-model="dialog.list.userRealName"></el-input>
                       </el-form-item>
                       <el-form-item label="用户名：" prop="userName">
                          <el-input v-model="dialog.list.userName"></el-input>
                       </el-form-item>
                       <el-form-item label="密码：" prop="pwd">
                          <el-input v-model="dialog.list.pwd"></el-input>
                       </el-form-item>
                       <el-form-item label="身份：" prop="identity">
                          <!-- <el-input v-model="dialog.rechargeData.identity"></el-input> -->
                          <el-select v-model="dialog.list.identity">
                              <el-option v-for="item in config.identity" 
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                       </el-form-item>
                       <el-form-item label="邮箱：">
                          <el-input v-model="dialog.list.email"></el-input>
                       </el-form-item>
                       <el-form-item label="状态：" >
                          <!-- <el-input v-model="dialog.list.status"></el-input> -->
                            <el-radio v-model="dialog.list.status" label="1">正常</el-radio>
                            <el-radio v-model="dialog.list.status" label="2">禁用</el-radio>

                       </el-form-item>
                       <el-form-item label="权限：">
                            <el-checkbox v-model="dialog.list.role1">代理商权限</el-checkbox>
                            <el-checkbox v-model="dialog.list.role2">广告主所有权限</el-checkbox>
                            <el-checkbox v-model="dialog.list.role3">广告主部分权限</el-checkbox>                         
                       </el-form-item>
                       </el-form>
                       <div class="btn margin-tops">
                        <el-button @click="submit('dialog.list')" type="success" size="medium" :loading="dialog.loading">提交</el-button>
                       </div>     
                   </el-dialog>
            </div>
        </div>
    </section>
</template>
<script>
import query from "@/components/queryArea/queryList"; // 查询
import paging from "@/components/common/paging.vue";
import {
  reqAdvertList,
  reqAddAdvertList,
  reqEditAdvertList,
  reqRemoveAdvertisters
} from "@/api/advertManage/advertList";
export default {
  data() {
    return {
      areas: {
        name: "搜索内容",
        code: "姓名", //  姓名
        options: [{ value: "1", label: "4444" }] //下拉框的值
      },
      tableLoading: false,
      filters: {},
      advertListData: [
        { advertName: "姓名", userName: "用户名", pwd: "密码", email: "邮箱",identity:"2",status:"2" }
      ], // 展示区数据
      totals: {
        totalNum: 0,
        pageSize: 10,
        currentPage: 1
      },
      dialog: {
        loading: false,
        dialogVisible: false,
        list: {
          
        }
      },
      config:{
        identity:configs.identity
      },
     
      rules: {
        userRealName: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        identity: [{ required: true, message: "请选择身份", trigger: "change" }]
      }
    };
  },
    mounted(){
      this.queryAdvertList();
  },
  methods: {
    // 查询
    queryAdvertList(identity, name) {
      var identitys = window.localStorage.getItem("identitys");
      identitys = identitys == 0 ? "2" : identitys;
      var _this = this;
      this.tableLoading = true;
      this.filters.identity = identity;
      this.filters.name = name;
      let para = {
        identity:identitys, // 广告主身份
        name: this.filters.name, // 
        currentPage: this.totals.currentPage,
        pageSize: this.totals.pageSize,
        token: window.localStorage.getItem("token")
      };
      // 发送请求
      reqAdvertList(para).then(res => {
        if (res.status === 200) {
          debugger
          _this.advertListData = [];
          let list = res.data.list.data;
          list && list.length>0 ? _this.loopItem(list) : "";
          _this.totals.totalNum = parseInt(res.data.totalNum) ; //总条数
          this.tableLoading = false;
        } else if (res.status === 202) {
          _this.common.tokenCheck(_this);
          this.tableLoading = false;
        }
      }).catch(err=>{
        _this.$message.error("请求超时，请重新发送请求");
        this.tableLoading=false;
        return false;
      });
    },
    loopItem(list){
       list.forEach(item => {
         var identityNames = "";
            if(item.deptId){
              
               this.config.identity.forEach(items=>{
                 if(items.value === item.deptId){
                     identityNames = items.label;
                 }
               })
            }//
           var statusNames= item.status && iitem.status !== "1" ? "禁用" : "启用"
            let temp = {
              userRealName: item.userRealName,
              userName: item.account,
              email:item.email,
              identityName:identityNames,
              status:item.status,
              identity:item.identity,
              statusName:item.statusName,
              status:item.status,
              role:item.roleIds
            };
            this.advertListData.push(temp);
          });
    },
    // open编辑
    handleClick(row) {
      this.dialog.loading = false;
      this.dialog.dialogVisible = true;
      this.dialog.title = "编辑用户";
      this.dialog.list = row;
    },
    //open 添加
    addAdvertList() {
      this.dialog.loading = false;
      this.dialog.dialogVisible = true;
      this.dialog.title = "添加用户";
      this.dialog.list = {};
    },
    // 提交
    submit(formName) {
         this.dialog.loading = true;
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let list = this.dialog.list;
          let para = {
            advertName: list.advertName,
            userName: list.userName,
            pwd: list.pwd,
            email: list.email,
            identity: list.identity,
            status: list.status,
            role1: list.role1,
            role2: list.role2,
            role3: list.role3,
            token: window.localStorage.getItem("token")
          };
          if (list.title === "添加用户") {
            // 添加请求
            reqAddAdvertList(para).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
              } else if (res.status === 202) {
                _this.common.tokenCheck(_this);
              }
               _this.dialog.loading = false;
            }).catch(err => {
              _this.dialog.loading = false;
              _this.$message.error("请求超时，请重新发送请求");
              return false;
            });;
          } else {
            // 修改请求
            reqEditAdvertList(para).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
              } else if (res.status === 202) {
                _this.common.tokenCheck(_this);
                
              }
              _this.dialog.loading = false;
            }).catch(err => {
              _this.$message.error("请求超时，请重新发送请求");
              _this.dialog.loading = false;
              return false;
            });;
          }
        } else {
          _this.$message.error("请完善必填项信息");
           _this.dialog.loading = false;
          return false;
        }
      });
    },
    // 单行删除
    deleteRow(index,id) {
        let  _this = this;
        this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            shopno: id, //门店编号
            token: window.localStorage.getItem("token")
          };
          reqRemoveAdvertisters(para).then(res => {
            if (res.status === 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else if (res.status === 202) {
              _this.common.tokenCheck(_this);
            }
            this.queryStore(this.filters.names, this.filters.codes);
          });
        })
        .catch(() => {
             _this.$message.error("请求超时，请重新发送请求");
              _this.dialog.loading = false;
              return false;
        });
    },
    // 分页方法
    CurrentChanges(currentPage, pageSize) {
      this.totals.currentPage = currentPage;
      this.totals.pageSize = pageSize;
      // this.queryRecharge(this.filters.advertisterName);
    }
  },
  components: {
    query,
    paging
  }
};
</script>
<style>
.advertList .el-input {
  width: 200px;
}
.btn {
  padding-left: 160px;
}
.advertList .el-form-item {
  margin-bottom: 15px;
}
</style>


