<template>
    <section>
        <div class="parent">
            <div class="margin-tops query">
                <el-button 
                    type="success" 
                    size="medium" 
                    @click="addClick">添加
                </el-button>
                <query :area= "area" @querys="querys" ></query>
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
                    prop="eleId"
                    label="元素编号"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adEleName"
                    label="广告元素名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="adTypeName"
                    label="广告类型"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="createDate"
                    label="创建日期"
                    align="center">
                    </el-table-column>
                   
                    <el-table-column
                            fixed="right"
                            label="操作"
                            align="center"
                             width="250px">
                            <template slot-scope="scope">
                                <el-button 
                                    @click="handleClick(scope.row)"
                                     type="primary" size="mini" 
                                     class="el-icon-edit"></el-button>
                                <el-button
                                    @click.native.prevent="deleteRow(scope.$index, scope.row.eleId)"
                                    type="danger"
                                    class="el-icon-error"
                                    size="mini">
                                </el-button>
                            </template>
                     </el-table-column>
                 </el-table>
            </div>
            <div class="margin-tops">
                <paging :total="totals" @handleCurrentChange="currentChange" ></paging>
            </div>
            <div class="dialog">
                <el-dialog
                    :title="dialog.title"
                    :visible.sync="dialog.dialogVisible"
                    :close-on-click-modal="false"
                    width="1000px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form label-position="right" 
                                label-width="160px" 
                                :model="dialog.list"  
                                :rules="rules" 
                                ref="dialog.list">
                            <el-form-item  label="页面名称：" prop="adEleName">
                                <el-input v-model="dialog.list.adEleName"></el-input>
                            </el-form-item>
                            <el-form-item  label="广告类型：" prop="adType">
                                <el-select v-model="dialog.list.adType" >
                                    <el-option
                                        v-for="item in config.adType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item  label="元素类型：">
                              <el-radio-group v-model="dialog.list.eleType">
                                <el-radio label="01">海报</el-radio>
                                <el-radio  label="02">视频</el-radio>
                                <el-radio  label="03">视频和海报</el-radio>
                              </el-radio-group>
                            </el-form-item>
                            <el-form-item  v-if="dialog.list.eleType==='01' ||dialog.list.eleType==='03' " label="海报图片：" prop="postImg">
                                <el-upload
                                        class="upload-demo"
                                        ref="upload"
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        :on-remove="handleRemove"
                                        :file-list="dialog.list.postImg"
                                        :auto-upload="true"
                                        :before-upload="buImage">
                                        <el-button slot="trigger" size="small" type="primary"  >选取文件</el-button>
                                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                        </el-upload>
                            </el-form-item>
                            <el-form-item  v-if="dialog.list.eleType==='02' ||dialog.list.eleType==='03' " label="视频封面" prop="videoPost">
                                <el-upload
                                        class="upload-demo"
                                        ref="upload"
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        :on-remove="handleRemove"
                                        :file-list="dialog.list.videoPost"
                                        :auto-upload="true"
                                        :before-upload="buFengMian">
                                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                        <div slot="tip" class="el-upload__tip">与视频文件像素相同,大小不超过200KB</div>
                                        </el-upload>
                            </el-form-item>
                            <el-form-item  v-if="dialog.list.eleType==='02' ||dialog.list.eleType==='03' " label="视频文件" prop="videoFile">
                                <el-upload
                                        class="upload-demo"
                                        ref="upload"
                                        action="https://jsonplaceholder.typicode.com/posts/"
                                        :on-remove="handleRemove"
                                        :file-list="dialog.list.videoFile"
                                        :auto-upload="true"
                                        :before-upload="buVideo">
                                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                        <div slot="tip" class="el-upload__tip">仅支持mp4，大小为5MB</div>
                                        </el-upload>
                            </el-form-item>
                            <el-form-item  label="连接到url：" prop="urls">
                                <el-input v-model="dialog.list.urls"></el-input>
                            </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="8">
                             <div  class="showPhone">
                               <video controls="controls" 
                                    v-if="dialog.list.eleType==='2' 
                                    || dialog.list.eleType==='3'" 
                                    id="advertelecoverimgpath" 
                                    loop="loop" 
                                    preload="auto" 
                                    :poster="dialog.list.poster"
                                    :src="dialog.list.url"
                                    >
                             </video>
                             <img  :src="dialog.list.image" alt="" 
                                 v-if="dialog.list.eleType==='1' 
                                 || dialog.list.eleType==='3'">
                            </div>
                        </el-col>
                    </el-row>                   
                      <div class="btn">
                          <el-button 
                           @click="submit('dialog.list')"
                           type="success" 
                           size="medium" 
                           :loading="dialog.loading">提交</el-button>
                      </div>
                </el-dialog>
            </div>
        </div>
    </section>
</template>
<script>
import query from "@/components/queryArea/queryAd";
import paging from "@/components/common/paging";
import {
  reqAdEleList,
  reqEditadEle,
  reqAddadEle,
  reqRemoveELe
} from "@/api/advertManage/adEle";
export default {
  data() {
    return {
      rules: {
        adEleName: [
          { required: true, message: "请输入页面名称", trigger: "blur" }
        ],
        adType: [
          { required: true, message: "请选择广告类型", trigger: "change" }
        ]
      },
      config: {
        adType: configs.ggwType
      },
      area: {
        name: "搜索广告元素类型",
        options: configs.adEleType
      },
      tableLoading: false,
      list: [
        {
          eleId: "1",
          adEleName: "fff",
          adTypeName: "1",
          createDate: "20182323",
          adType: "2"
        }
      ],
      totals: {
        totalNum: 0,
        currentPage: 1,
        pageSize: 10
      },
      dialog: {
        loading:false,
        title: "",
        dialogVisible: false,
        list: {
          eleType:"01",
          image: "../../../static/img/car.jpg",
          pageName: "",
          poster: "../../../static/img/car.jpg",
          url:
            "http://hc.yinyuetai.com/uploads/videos/common/E9B40165A8FC7544DB34697FA6F050EB.mp4?sc=ab78f1699fdd31a6&br=780&vid=3285437&aid=44719&area=KR&vst=0"
        }
      }
    };
  },
  mounted() {
    this.querys();
  },
  methods: {
    querys(name) {
      var _this = this;
      let para = {
        adverteletype: name,
        currentPage: this.totals.currentPage,
        pageSize: this.totals.pageSize,
        token: window.localStorage.getItem("token"),
        userId: window.localStorage.getItem("username")
      };
      reqAdEleList(para)
        .then(res => {
          debugger
          this.list = [];
          if (res.status === 200) {
            var list = res.data.list;
            list && list.length != 0 ? _this.loopItem(list) : "";
            _this.totals.totalNum = res.data.totalNum;
          } else if (res.status === 202) {
            _this.common.tokenCheck(_this);
          }
          this.tableLoading = false;
        })
        .catch(err => {
          _this.$message.error("请求超时，请重新发送请求");
          this.tableLoading = false;
          return false;
        });
    },
    loopItem(list) {
      list.forEach(item => {
        let adTypeName = this.filterItem(item.adverttype, this.config.adType);
        var temp = {
          eleId: item.advertelenum,
          adEleName: item.advertelenam,
          adType: item.adverttype,
          adTypeName:adTypeName,
          //  adTypeName:adTypeName,
          eleType: item.adverteletype ,
          poster: item.advertelecoverimgpath, //视频封面
          url: item.advertelevideopath,
          image: item.adverteleimgpath,
          createDate: item.createdate,
          urls: item.elejumpurl
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
    //编辑
    handleClick(row) {
      debugger
      this.dialog.dialogVisible = true;
      this.dialog.title = "修改广告元素";
      // this.dialog.list = row;
      this.dialog.list.adEleName = row.adEleName;
      this.dialog.list.eleId=row.eleId;
      this.dialog.list.adType=row.adType;
      this.dialog.list.eleType=row.eleType;
      this.dialog.list.postImg = row.postImg;
      this.dialog.list.videoPost=row.videoPost;
      this.dialog.list.videoFile=row.videoFile;
      this.dialog.list.urls=row.urls;
    },
    deleteRow(index, id) {
      let _this = this;
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            advertelenum: id,
            token: window.localStorage.getItem("token")
          };
          reqRemoveELe(para).then(res => {
            if (res.status === 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              _this.querys();
            } else if (res.status === 202) {
              _this.common.tokenCheck(_this);
            }
           
          });
        })
        .catch(err => {
          _this.$message.error("请求超时，请重新发送请求");
          _this.dialog.loading = false;
          return false;
        });
    },
    submit(formName) {
      this.dialog.loading=true;
      var _this = this;
      this.dialog.loading = true;
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = {
              token:window.localStorage.getItem("token"),
              userId:window.localStorage.getItem("username"),
              params:{
                advertelenum:_this.dialog.list.eleId,
                advertelenam:_this.dialog.list.adEleName,
                adverteletype:_this.dialog.list.adType,
                adverteleimgpath:_this.dialog.list.postImg,
                advertelevideopath:_this.dialog.list.videoFile,
                advertelecoverimgpath:_this.dialog.list.videoPost,
                elejumpurl:_this.dialog.list.urls,
                adverteletype:_this.dialog.list.adType
              }
          };
          debugger
          this.reqData(this.dialog.title, para);
        } else {
          _this.$message.error("请完善必填项信息");
          _this.dialog.loading = false;
          return false;
        }
      });
    },
    reqData(title, para) {
      var _this = this;
      if (title === "添加广告元素") {
        debugger
        // 添加请求
        reqAddadEle(para)
          .then(res => {
            if (res.status === 200) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              _this.querys();
            } else if (res.status === 202) {
              _this.common.tokenCheck(_this);
            }
            _this.dialog.dialogVisible=false;
            
            _this.dialog.loading = false;
          })
          .catch(err => {
            _this.dialog.loading = false;
            _this.$message.error("请求超时，请重新发送请求");
            return false;
          });
      } else {
        // 修改请求
        reqEditadEle(para)
          .then(res => {
            debugger
            if (res.status === 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              _this.querys();
            } else if (res.status === 202) {
              _this.common.tokenCheck(_this);
            }
             _this.dialog.dialogVisible=false;
            _this.dialog.loading = false;
          })
          .catch(err => {
            _this.$message.error("请求超时，请重新发送请求");
            _this.dialog.loading = false;
            return false;
          });
      }
    },
    currentChange(currentPage, pageSize) {
      this.totals.currentPage = currentPage;
      this.totals.pageSize = pageSize;
      this.querys();
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //   handlePreview(file) {
    //     console.log(file);
    //   },
    // 点击添加按钮
    addClick() {
      this.dialog.dialogVisible = true;
      this.dialog.title = "添加广告元素";
      this.dialog.list = {};
      this.dialog.list.eleType='01';
    },
    buImage(file) {
      var  _this = this;
      debugger
      const isLt10M = file.size / 1024 / 1024 < 0.5;
      if (
        [
         "image/jpg",
         "image/jpeg",
         "image/png",
         "image/pjpeg",
         "image/gif",
         "image/bmp",
         "image/x-png"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确图片格式");
        return false;
      }
       if (!isLt10M) {
        this.$message.error("上传图片大小不能超过500KB哦!");
        return false;
      }
          let formData = new FormData();
          formData.append("file", file);
        axios
          .post("http://192.168.0.116:8083/pic/upload", formData)
          .then(function(response) {
            _this.dialog.list.image = response.data;
            // alert(response.data);
            console.log(response);
          })
          .catch(function(error) {
            alert("上传失败");
            console.log(error);
          });
      
    },
    buVideo(file){
          var  _this = this;
      debugger
      const isLt10M = file.size / 1024 / 1024 < 5;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      else if (!isLt10M) {
        this.$message.error("上传视频大小不能超过5MB哦!");
        return false;
      }else{
          let formData = new FormData();
          formData.append("file", file);
        axios
          .post("http://192.168.0.116:8083/pic/upload", formData)
          .then(function(response) {
            _this.dialog.list.image = response.data;
            // alert(response.data);
            console.log(response);
          })
          .catch(function(error) {
            alert("上传失败");
            console.log(error);
          });
      }

    },
    buFengMian(file){
      var  _this = this;
      debugger
      const isLt10M = file.size / 1024 / 1024 < 0.2;
      if (
        [
         "image/jpg",
         "image/jpeg",
         "image/png",
         "image/pjpeg",
         "image/gif",
         "image/bmp",
         "image/x-png"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确图片格式");
        return false;
      }
       if (!isLt10M) {
        this.$message.error("上传图片大小不能超过200KB哦!");
        return false;
      }
          let formData = new FormData();
          formData.append("file", file);
        axios
          .post("http://192.168.0.116:8083/pic/upload", formData)
          .then(function(response) {
            _this.dialog.list.image = response.data;
            // alert(response.data);
            console.log(response);
          })
          .catch(function(error) {
            alert("上传失败");
            console.log(error);
          });
      
    }
  },
  components: {
    query,
    paging
  }
};
</script>
<style>
.dialog .el-input,
.el-select,
.el-cascader {
  width: 300px;
}
.query .el-select {
  width: 200px;
}
.dialog .btn {
  padding-left: 160px;
}
.showPhone {
  border: 1px solid #ccc;
  height: 568px;
  width: 320px;
  box-shadow: 2px 2px 5px #888888;
}
.dialog video {
  height: 180px;
  width: 320px;
  background: rgb(0, 0, 0);
}
</style>


