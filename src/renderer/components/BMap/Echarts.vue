<template>
<div>
    <div class="echartConent">
        <!-- 磁盘图表 -->
        <div id="diskChart"></div>
        <el-button type="primary" class="exportData" @click="exportData">导出数据</el-button>
    </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import axios from 'axios'
import bus from "../../assets/js/bus"

var xData=[];
for(let i = 0 ; i < 24;i++){
    xData.push(i+"点");
}
export default {
    props:["areaId"],
    data() {
        return {
            date:new Date(),
            chart: null,
            option:{},
            id:null,
        }
    },
    methods: {
        /**
         * 初始化图表
         * @return {Object} 图表对象
         */
        initChart: function () {
            var self = this,
                container = document.getElementById("diskChart"),
                myChart = echarts.init(container);

                self.option = {
                     title: {
                    left:'center',
                    text: "各区域每小时报警数",
                    textStyle: {
                        color: "#000",
                        fontSize: 18,
                        fontWeight: "normal",
                    },
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var str = "";
                        str = params[0].name +"<br/>";
                        for(let i = 0; i< params.length;i++){
                            if(i == 0){
                                str +='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[0].color+'"></span>' + params[0].seriesName + "：" + params[0].data+"<br/>";
                            }else{
                                str +='<span style="display:inline-block;width:150px;height:14px;"><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[i].color+'"></span>' + params[i].seriesName + "：" + params[i].data+"</span>"+"<span style='display:inline-block;width:50px;height:10px;'></span>";
                                if(i%2 == 0){
                                    str+="<br/>";
                                }
                            }
                        }
                        return str;
                    },
                    axisPointer: {
                        lineStyle: {
                            width: 2,
                            color: "#CCEFF6"
                        }
                    }
                },
                legend: {
                    top:5,
                    right:24,
                    itemHeight: 30,
                    itemWidth: 30,
                    orient: 'vertical',
                    itemGap: 10,
                    data: [],
                    textStyle: {
                        color: '#5f6a7e',
                        borderWidth :"1"
                    },
                    // formatter: '{name}速度'
                },
                // color: ["#2fbb58","#457dda"],
                // textStyle: {
                //     color: '#5f6a7e'
                // },
                // toolbox: {
                //     feature: {
                //         dataZoom: {},
                //         brush: {
                //             type: ['rect', 'polygon', 'clear']
                //         }
                //     }
                // },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                 xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xData,
                },
                yAxis:{
                        type : 'value',
                        splitLine: {
                            show: false
                        },
                         min:0,
                        max:10,
                    },
                dataZoom: [
                    {
                        type: 'inside',
                    }
                ],
                series: []
                };
            myChart.setOption(self.option);
            return myChart;
        },
       /**
         * 获取图表数据
         * @param  {String} url    请求地址
         * @param  {Object} config 请求配置
         * @return 无
         */
        getChartData() {
            var self = this;
            self.id = self.id?self.id:localStorage.getItem("areaId")
            self.option.series =[];
            self.option.legend.data = [];
            self.axios({
                method:"get",
                url:self.$iHomed("api","get_echarts")+self.id,
            }).then((res)=>{
                for(let i = 0;i <res.data.data.perHourAlarm.length;i++){
                    if(!res.data.data.perHourAlarm[i]){
                        res.data.data.perHourAlarm[i] = 0;
                    }
                }
                    var root = {
                        name:res.data.data.areaName,
                        data: res.data.data.perHourAlarm,
                        type:'line',
                        showSymbol: true,
                    },
                    rootName = {
                        name:res.data.data.areaName,
                        icon: 'line'
                    };
                    self.option.yAxis.max = res.data.data.max >= 10 ?(res.data.data.max+10):(res.data.data.max + 1);
                    self.option.series.push(root);
                        //  self.option.legend.data.push(rootName);
                    if(res.data.data.children){
                        if(res.data.data.children.length > 0){
                            for(let i = 0 ;i <res.data.data.children.length;i++){
                                var y_child = {
                                    name:res.data.data.children[i].areaName,
                                    data: res.data.data.children[i].perHourAlarm,
                                    type:'line',
                                    showSymbol: false,
                                    itemStyle: {normal:{
                                        color: "transparent",
                                        // opacity: 0
                                    },
                                    emphasis:{
                                        color: "transparent",
                                        // opacity: 0
                                    }},
                                }
                                var y_float = {
                                    name:res.data.data.children[i].areaName,
                                    icon: 'line'
                                }
                                self.option.series.push(y_child);
                                //  self.option.legend.data.push(y_float);
                            }
                        }
                    }
                    
                    self.chart.setOption(self.option,true);
                
            })
        },
         //导出折线图数据
        exportData(){
            var self = this;
            window.location =  self.$iHomed("api","echarts_data")+self.id;
        },
    },
    watch:{
        areaId(areaId){
            if(areaId && areaId != localStorage.getItem("areaId")){
                this.id = areaId;
                this.getChartData();
            }
        }
    },
    mounted() {
        this.chart = this.initChart();
        this.getChartData();   
    }
}
</script>
<style scoped>
.echartConent{
    width:100%;
    height:550px;
    background:#fff;
    margin-top:100px;
}
canvas{
    width:90%;
}
.disk-chart-wrapper {
    display: inline-block;
    width: 90%;
    vertical-align: top;
    margin-top:20px;
}

#diskChart {
    width: 95%;
    height: 500px;
}

.disk-chart-wrapper .el-input {
    width: 120px;
    vertical-align: bottom;
}

.disk-chart-wrapper .el-input input {
    border-color: #1b4573!important;
    border-radius: 4px!important;
}

.disk-chart-wrapper .el-button {
    background-color: transparent!important;
    border-color: #1B4573!important;
    color: #9fabc6!important;
}

.disk-chart-wrapper .el-button.active {
    background-color: #20A0FF!important;
    color: #fff!important;
}

.exportData{
    position:absolute;
    top:88px;
    left:0;
    width:110px;
    z-index:99;
}
</style>