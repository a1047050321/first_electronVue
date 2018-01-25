<template>
<div v-if="row">
<div class="mask"></div>
    <div class="editalInfo">
        <div class="title">报警详情</div>
        <div class="table_cell">
            <div><span>报警人：</span><el-input v-model="row.name" style="width:50%;"></el-input></div>
            <div>联系方式：</div>
            <div>报警位置：</div>
            <div>报警类型：
                 <el-select v-model="row.alarmName" multiple  placeholder="选择报警类型" style="width:60%;">
                 <el-option
                    label="1"
                    value="1"></el-option>
                <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>  
            </div>
            <div>报警时间：</div>
            <div>报警终端类型：</div>
            <div v-show="row.monitor">机顶盒序列号：</div>
            <div v-show="!row.monitor"><span>摄像头序列号：{{}}</span>
                <span class="name-wrapper">
                    <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(row)}}"><div class="icon_monitor" style="width:21px;height:21px;margin-top:15px;"></div></router-link>
                </span>
            </div>
        </div>
         <div class="table_cell">
            <div v-show="!row.monitor">机顶盒序列号：</div>
            <div>处理时间：</div>
            <div>资讯栏目id:</div>
            <div>处理单位：</div>
            <div>处理人：</div>
            <div>上报：</div>
            <div>上报时间：</div>
            <div>解除报警：</div>
         </div>
         <div style="clear:both;"></div>
         <div style="text-align:center;">
         <el-button type="primary" @click="ok">确定</el-button>
         <el-button @click="cancel">取消</el-button>
     </div>
    </div>
</div>
</template>
<script>
    export default{
        props:["row","alarmType"],
        data(){
            return {
                editalInfo:false
            }
        },
        mounted(){
            // this.alarmType = this.$store.state.alarmType;
            console.log(this.alarmType);
        },
        watch:{
            alarmType(alarmType){
            }
        },
        methods:{
            ok(){
                this.$emit("editalInfo",this.editalInfo);
            },
            cancel(){
                this.$emit("editalInfo",this.editalInfo);
            },
        }
    }
</script>
<style scoped>
    .title{
        width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;
    }
    .editalInfo{
        position:fixed;
        top:150px;
        left:500px;
        width:600px;
        height:400px;
        background:#fff;
        z-index:99;
        opacity:1;
    }
    .table_cell{
        float:left;
    }
    .table_cell div:not(.name-wrapper){
        width:280px;
        height:30px;
        line-height:30px;
        margin:0 0 10px 20px;
        font-size:14px;
    }
    .mask{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#000;
        opacity:0.3;
        z-index:98;
    }
    .name-wrapper{
        width:30px;
    }
    .name-wrapper a{
       display:inline-block;
       width:30px;
       height:30px;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>