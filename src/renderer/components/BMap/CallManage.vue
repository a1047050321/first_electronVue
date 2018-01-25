<template>
<div class="content">
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>报警信息</el-breadcrumb-item>
            <el-breadcrumb-item >{{status}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-menu theme="white" :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" @click="itemClick">
            <el-badge :value="pending" class="item badge">
               待处理:{{pending}}
            </el-badge>
        </el-menu-item>
        <el-menu-item index="2" @click="itemClick1">
        已处理:{{processed}}
        </el-menu-item>
    </el-menu>
    <keep-alive>
    <router-view :alarmType="alarmType" :configData="configData" :processedData="processedData" :processed="processed" @total="getUntreated"></router-view>
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
                status:"待处理",
                processedData:[]
            }
        },
        mounted(){
            this.getTreated();
            this.getData();
        },
        methods:{
             getData(){
                var self = this;
                self.pageFlag = 1;
                self.axios({
                    url:self.$iHomed("api","get_untreated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum
                    }
                })
                .then((res)=>{
                    self.pending = res.data.data.total;
                })
                .catch((error)=>{
                    //地址错误
                    console.log(error);
                })
            },
            //获取待处理，已处理的length
            itemClick(){
                this.status = "待处理";
                 this.$router.push({path:"/callManage/pending",replace:true});
            },
            itemClick1(){
                this.status = "已处理";
                 this.$router.push({path:"/callManage/processed",replace:true});
            },
            getUntreated(a){
                this.pending = a;
                this.getTreated();
            },
            getTreated(){
                var self = this;
                var chnllist = [],
                    playlist = [];
                    self.axios({
                    url:self.$iHomed("api","get_treated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum
                    }
                })
                .then((res)=>{
                    var datalist = res.data.data;
                    self.processed = datalist.total;
                })
            },
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
    .content div.el-badge{
        margin-top:0;
    }
    ul.el-menu{
        position:fixed;
        top:0;
        right:24px;
        width:230px;
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
</style>