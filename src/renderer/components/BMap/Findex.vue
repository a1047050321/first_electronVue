<template>
<div class="content">
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <div style="padding-bottom:24px;">     
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                首页
            </el-breadcrumb-item>
            <el-breadcrumb-item >{{status}}</el-breadcrumb-item>
        </el-breadcrumb>
        </div>
    </div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" @click="itemClick">
               报警地图
        </el-menu-item>
        <el-menu-item index="2" @click="itemClick1" style="margin-right:24px;">
            趋势统计
        </el-menu-item>
    </el-menu>
    <keep-alive>
        <router-view :alarmType="alarmType" :areaId="areaId" @areaId="getAeraId" :configData="configData"></router-view>
    </keep-alive>
</div>
</template>
<script>
    export default{
        props:["alarmType","configData"],
        data(){
            return {
                pending:0,
                processed:0,
                activeIndex:"1",
                tableData: [],
                length:1,
                status:"报警地图",
                areaId:0,
            }
        },
        methods:{
            //获取待处理，已处理的length
            itemClick(){
                this.status = "报警地图";
                this.$router.push({path:"/index/bMap",replace:true});
            },
            itemClick1(){
                this.status = "趋势统计";
                this.$router.push({path:"/index/echarts",replace:true})
            },
            getUntreated(a){
                this.pending = a;
            },
            getTreated(a){
                this.processed = a;
            },
            getAeraId(a){
                this.areaId = a;
            }
        },
    }
</script>
<style lang="" scoped>
    .router-link-active{
        color:#20A0ff
    }
    li.el-menu-item{
        width:112px;
        margin-top:23px;
        padding:0 24px;
    }

    ul.el-menu{
        position:fixed;
        top:0;
        right:0;
    }
    ul.el-menu li{
        height:40px;
        line-height:40px;
    }
    .badge{
        height:24px;
        line-height:24px;
    }
div.name-wrapper i{
    color:#20A0ff;
}
.el-button{
    width:88px;
    height:28px;
    line-height:8px;
    }
    .is-active,.router-link-active{
        color:#20A0ff;
    }
</style>