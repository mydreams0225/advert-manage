<template>
    <section>
        <div class="parent">
            <div class="margin-tops">
               <el-row>
                    <el-col class="cols" :span="6" v-for="(o, index) in list" :key="index"  >
                        <el-card :body-style="{ padding: '0px' }" class="card">
                        <!-- <img src="~examples/assets/images/hamburger.png" class="image"> -->
                             <el-row >
                                 <el-col :span="6">
                                     <div class="logos"><span class="el-icon-sold-out"></span></div>
                                     
                                 </el-col>
                                 <el-col :span="18">
                                     <div class="datas">
                                         <div class="mount">{{o.mount}}</div>
                                          <div class="name">{{o.name}}</div>
                                          
                                     </div>
                                 </el-col>
                             </el-row>
                             <el-row>
                               <div class="detail">
                                  <el-col :span="12">
                                    <label for="">View Detail</label>
                                     
                                 </el-col >
                                 <el-col :span="12" class="to">
                                   <span  class="el-icon-back"></span>
                                 </el-col>
                               </div>
                             </el-row>
                        </el-card>
                    </el-col>
               </el-row>
            </div>
            <div class="margin-tops">
                <div class="showTitle">
                    <el-row>
                        <el-col :span="6"> 
                            <h5>收益产出详情</h5>
                        </el-col>
                        <el-col class="showDate" :span="18">
                            <span >时间：</span>
                            <el-button type="primary" size="mini" @click="day7">7日</el-button>
                            <el-button type="primary" size="mini" @click="day10">10日</el-button>
                            <el-button type="primary" size="mini" @click="day15">15日</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div>
                   <div id="myChart" style="width:100%;height:400px;"></div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { reqfinaState, reqfsTable } from "@/api/moneyManage/financial";
export default {
  data() {
    return {
      colors: ["#FFA54F", "#63B8FF", "#CD69C9"],
      list: [
        { mount: "1", name: "广告位" },
        { mount: "0元", name: "今日收益" }
      ],
      data: "-6",
      mychart: {
        legendData: ["曝光", "点击", "包日"],
        axxisData: [
          "6-11周一",
          "6-12周二",
          "6-13周三",
          "6-14周四",
          "6-15周五",
          "6-16周六",
          "6-17周日"
        ],
        expData: [2, 2, 2],
        clickData: [1, 1, 1],
        dayData: [4, 4, 4]
      }
    };
  },
  created() {
    var data = this.areacolumn;
    this.myChartData(data);
  },
  mounted() {
    
    this.query();
    this.queryTop();
    // this.initChart();
  },
  methods: {
    queryTop() {
      debugger
      var _this = this;
      let para = {
        //用户id
        token: window.localStorage.getItem("token"),
        userId: window.localStorage.getItem("username"),
        identity: window.localStorage.getItem("identitys")
      };
      // 顶部数据
      reqfsTable(para)
        .then(res => {
          if (res.status === 200) {
            let lists = res.data;
            if (lists) {
              _this.list.push(
                {
                  mount: lists.expenditure,
                  name: "当天花费或收益"
                },
                { mount: lists.showCount, name: "曝光数" },
 
                { mount: lists.clickCount, name: "点击数" },
                {
                  mount: lists.advertPlanPositionCount,
                  name: "广告位数/计划数"
                },
                { mount: lists.balance, name: "余额" }
              );

            }
          } else if (res.status === 202) {
            _this.common.tokenCheck(_this);
          }
        })
        .catch(() => {
          this.$message.error("请求超时，请重新发送请求");
          this.tableLoading = false;
          return false;
        });
    },
    loopfsTable(list) {
      list.forEach(item => {
        var temp = {};
        this.list.push(temp);
      });
    },
    query() {
      this.mychart={}
      var _this = this;
      let para = {
        day: this.data,
        token: window.localStorage.getItem("token"),
        userId: window.localStorage.getItem("username"),
        identity: window.localStorage.getItem("identitys")
      };
      debugger
      // 报表请求
      reqfinaState(para)
        .then(res => {
          this.areacolumn = [];
          if (res.status === 200) {
            var list = res.data;
            _this.mychart.axxisData = list.xAxis[0].data;
            _this.mychart.legendData = list.legendData;
            var series = res.data.series;
            series.length != 0 && series ? _this.loopseries(series) : "";

            // list.length !== 0 ? this.loopItem(list) : "";
            // this.loopItem(list);
          } else if (res.status === 202) {
            _this.common.tokenCheck(_this);
          }
           this.initChart();
          console.log(_this.mychart.legendData)
        })
        .catch(err => {
          this.$message.error("请求超时，请重新发送请求");
          this.tableLoading = false;
          return false;
        });
    },
    loopseries(lists) {
      lists.forEach(items => {
        if (items.name === "点击") {
          this.mychart.clickData = items.data;
        }
        if ((items.name === "曝光")) {
          this.mychart.expData = items.data;
        }
        if (items.name === "包日") {
          this.mychart.dayData = items.data;
        }
      });
    },
    loopItem(list) {
      list.forEach(item => {
        var temp = {
          axxisData: item.xAxis
        };
        this.areacolumn.push(temp);
      });
    },
    day7() {
      this.data = "-6";
      this.query();
    },
    day10() {
      this.data = "-9";
      this.query();
    },
    day15() {
      this.data = "-14";
      this.query();
    },
    myChartData(data) {
      var data = data || [];
      if (data.length !== 0) {
        data.forEach(item => {
          this.mychart.axxisData.push(item.citySimpleName);
          this.mychart.entrysData.push(item.entrSum);
          this.mychart.outsData.push(item.outSum);
          //   this.mychart.pieaxxisData.push({value:(item.entrSum+item.outSum)+","+name+":"+item.citySimpleName})
          var obj = {};
          obj.value = item.entrSum - 0 + item.outSum;
          obj.name = item.citySimpleName;
          console.log(obj);

          this.mychart.pieaxxisData.push(obj);
        });
      }
    },
    initChart() {
      let myChart = echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        title: { text: "" },
        color: this.colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
          // axisPointer: {
          //     type: 'cross'
          // }
        },
        legend: {
          data: this.mychart.legendData
        },
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.colors[0]
              }
            },
            // axisPointer: {
            //     label: {
            //         formatter: function (params) {
            //         	console.log(params);
            //             return '总车流量数  ' + params.value
            //                 + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
            //         }
            //     }
            // },
            data: this.mychart.axxisData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: this.mychart.legendData[0], //"入场统计",
            type: "bar",
            smooth: true,
            barWidth: 30, //柱图宽度
            data: this.mychart.expData //[666, 44, 0, 67, 90, 200, 400]
          },
          {
            name: this.mychart.legendData[1], //"出场统计",
            type: "bar",
            smooth: true,
            barWidth: 30, //柱图宽度
            data: this.mychart.clickData //[777, 188, 200, 777, 60, 3, 600]
          },
          {
            name: this.mychart.legendData[2], //"出场统计",
            type: "bar",
            smooth: true,
            barWidth: 30, //柱图宽度
            data: this.mychart.dayData //[777, 188, 200, 777, 60, 3, 600]
          }
        ]
      });
    }
  }
};
</script>
<style>
.card {
  border: 1px solid #ccc;
}
.logos {
  display: inline-block;
  padding: 4px;
  margin: 10px;
  font-size: 4em;
  /* height: 60px; */
  color: rgba(0, 0, 0, 0.8);
}
.datas {
  box-sizing: border-box;
  margin: 10px;
  padding: 4px;
  font-size: 26px;
  text-align: right;
  vertical-align: middle;
  /* height: 60px; */
  color: rgba(0, 0, 0, 0.8);
}
.datas .mount {
  margin-top: 10px;
}
.datas .name {
  font-size: 16px;
}
.card .detail > div {
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
}
.card .detail label {
  font-size: 14px !important;
}
.card .detail .to {
  text-align: right;
}
.showTitle {
  padding: 10px;
  background: #eee;
  box-shadow: 2px 2px 3px #888888;
}
.showDate {
  text-align: right;
}
.showDate span {
  font-size: 14px;
}
.cols{
  margin: 5px;
  min-width: 50px;
}
</style>


