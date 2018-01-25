<template>
        <div id="pieAccount" v-show="pieShow"></div>
</template>
<script>
import echarts from 'echarts';

    export default{
        props:["pieShow"],
        data(){
            return{

            }
        },
        mounted(){
            this.chart = this.pie();
        },
        methods:{
            pie(){
                var self = this,
                container = document.getElementById("pieAccount"),
                myChart = echarts.init(container);
              myChart.setOption({
                    backgroundColor: "#fff",
                    title: {
                        text: '实时各区域待处理警情数百分比图',
                        x: 'center',
                        y: 'top'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['区域1', '区域2', '区域3', '区域4', '区域5']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '50%',
                                        funnelAlign: 'left',
                                        max: 1548
                                    }
                                }
                            },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    series: [{
                        name: '报警百分比',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        itemStyle : {
                            normal : {
                                label : {
                                position : 'inner',
                                formatter : function (params){return (params.percent - 0) + '%';},
                                    textStyle: {
                                        color: '#000'
                                    }
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        },
                        data: [
                            { value: 335, name: "区域1" },
                            { value: 310, name: '区域2' },
                            { value: 234, name: '区域3' },
                            { value: 135, name: '区域4' },
                            { value: 1548, name: '区域5' }
                        ]
                    }]
                });
                return myChart;
            }

        },
    }
</script>
<style lang="">
    #pieAccount {
    position: absolute;
    bottom: 0;
    right: 180px;
    width:400px;
    height:300px;
    border-right:1px solid #ccc;
    }

</style>