<template>
     <!--报警信息弹出框-->
<div>
    <div class="monitorInfo" v-if=" !row.monitor && row.name">
        <div class="infoHeader">报警信息</div>
        <div class="pending">待处理:{{i+1 +"/"+length}}</div>
        <div class="currInfo">
                <ul>
                    <li><span>地区:{{row.address}}</span></li>
                    <li><span>报警人:{{row.name}}</span></li>
                    <li><span>报警类型:{{row.alarmTypeName}}</span></li>
                </ul>
        </div>
        <ul class="opeator1">
            <li class="call">
                <div><el-button type="primary" @click="ulbtnClick">致电</el-button></div>
            </li>
            <li class="send">
                <div><el-button type="primary" @click="ulbtnClick">上报</el-button></div>
            </li>
            <li class="commit">
                <div><el-button type="primary" @click="ulbtnClick">提交</el-button></div>
            </li>
            <li class="end">
                <div><el-button type="primary" @click="ulbtnClick">解除</el-button></div>
            </li>
            <li class="detail">
                <div><el-button type="primary" @click="ulbtnClick">详情</el-button></div>
            </li>
            <li class="next">
                <div><el-button type="primary" @click="nextInfo">下一条</el-button></div>
            </li>
        </ul>
        <div class="monitorInfo1" v-show="!row.monitor &&!buttonShow">
                <span class="icon-success" style="position:absolute;left:120px;top:20px;"></span>
                <div class="destription">
                {{row.name}}已截屏，报警已解除</div>
                <div style="text-align:center;">
                        <el-button type="primary" @click="removeConfirm">确定</el-button>
                </div>
            </div>
         <no-monitor :mode="mode" :row="row" v-show="liClick" @liClick="opeator" @buttonShow="infoChange"></no-monitor>
        <edital-info v-show="editalInfo" @editalInfo="editalInfoReturn" :row="row" :alarmType="alarmType"></edital-info>
    </div>
     <div class="monitorInfo" v-if=" row.monitor && tableData.length != 0">
        <div class="infoHeader">报警信息</div>
        <div class="pending">待处理:{{i+1 +"/"+length}}</div>
             <div id="currInfo"></div>
        <ul class="opeator">
            <li class="detail">
            <ul>
                <li style="width:190px;font-size:14px;"><span>地区:{{row.address}}</span></li>
                <br/>
                <li style="font-size:14px;"><span>报警人:{{row.name}}</span></li>
                <br/>
                <li style="font-size:14px;"><span>报警类型:{{row.alarmTypeName}}</span></li>
                </ul>
                <br/>
            <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(row)}}">
                <div><el-button type="primary" @click="ulbtnClick" style="position:absolute;bottom:0;left:328px;">处理</el-button></div>
            </router-link>     
            </li>
            <li class="next">
                <div><el-button type="primary" @click="nextInfo" style="position:absolute;bottom:0;right:36px;">下一条</el-button></div>
            </li>
        </ul>
         <no-monitor :mode="mode" :row="row" v-show="liClick" @liClick="opeator" @buttonShow="infoChange"></no-monitor>
        <edital-info v-show="editalInfo" @editalInfo="editalInfoReturn" :row="row" :alarmType="alarmType"></edital-info>
    </div>
</div>
</template>
<script>
import EditalInfo from "./EditalInfo"
import NoMonitor from './NoMonitor'
import bus from "../../assets/js/bus"

    export default{
        props:["moniInfoShow","multipleSelection","alarmType","id"],
        data(){
            return {
                mode:1,
                liClick:false,
                editalInfo:false,
                buttonShow:true,
                mode:1,
                i:0,
                _temp:null,
                row:{},
                length:null,
                tableData: [],
                temp:false,
                pageIdx:1,
                pageNum:20,
                //非监控报警要确认点击了致电
                feiFlag:false
            }
        },
        watch:{
            multipleSelection(multipleSelection){
                if(multipleSelection){
                this.row = multipleSelection;
                }
                else{
                this.row = this.tableData[this.i];
                }
            },
            tableData:{
                handler(newValue, oldValue) {
                    if(newValue){
                        this.$emit("tableData",newValue,self.length);
                    }
                },   
            　　deep: true
            }   
        },
        methods:{
             getData(){
                var self = this;
                var chnllist = [],
                    playlist = [];
                        self.axios({
                        url:self.$iHomed("api","get_untreated"),
                        method:"get",
                        params:{
                            currentPage: self.pageIdx,
                            pageSize:self.pageNum
                        }
                    })
                    .then((res)=>{
                        if(res.data.data.data){
                        for(let i = 0;i < res.data.data.data.length;i++){
                            var datalist = res.data.data.data;
                            if(! datalist[i].terminalType){
                                datalist[i].terminalType = "无";
                            }
                            datalist[i].createDate  = new Date(datalist[i].createDate).toLocaleDateString()+" "+new Date(datalist[i].createDate).toLocaleTimeString();
                            datalist[i].pendDate  = new Date(datalist[i].pendDate).toLocaleDateString()+" "+new Date(datalist[i].pendDate).toLocaleTimeString();
                            datalist[i].reportDate  = new Date(datalist[i].reportDate).toLocaleDateString()+" "+new Date(datalist[i].reportDate).toLocaleTimeString(); 
                        }
                        self.tableData =datalist;
                        }
                        self.length = res.data.data.total;
                        self.row = self.tableData[0];
                        self.$emit("total",self.length);
                        self.$emit("tableData",self.tableData,self.length);
                    })
                    .catch((error)=>{
                        //地址错误
                        console.log(error);
                    })  
            },
             editalInfoReturn(a){
                this.editalInfo = a;
            },
            opeator(a,b){
                this.liClick=a;
                if(b){
                    this.feiFlag = b;
                }
            },
            infoChange(a){
                this.buttonShow = a;
            },
            removeConfirm(){
                this.liClick=false;
                this.buttonShow=true;
                this.getData();
            },
            //6个按钮点击事件
            ulbtnClick(){
                var self = this;
                $("ul.opeator1").click(function(e){
                    var e = e||window.event,
                        target = e.target ||e.srcElement;
                        switch(target.textContent){
                            case "致电":
                            self.mode =1;
                            self.liClick = true;
                            self.feiFlag = true;
                            break;
                            case "上报":
                            self.mode =2;
                            self.liClick = true;
                            break;
                            case "提交":
                            self.mode =3;
                            self.liClick = true;
                            break;
                            case "解除":
                            self.mode =4;
                            if(!self.feiFlag){
                                self.$alert("请先致电！");
                                return false;
                            }else{
                            self.liClick = true;
                            self.monitor = self.row.monitor;
                            }
                            break;
                            case "详情":
                            self.editalInfo = true;
                            self.monitor = self.row.monitor;
                            break;
                        }
                })
            },
            nextInfo(){
                this.i = this.i+1;
                if(this.i % this.length == 0){
                    this.i = 0;
                }
                this.row = this.tableData[this.i];
            }
        },
        mounted(){
            //要把tableData 传进来
            this.getData();
            this.ulbtnClick();
             bus.$off("temp").$on("temp",(a)=>{
                this.getData();
            });
             bus.$on("tableChange",(a)=>{
                this.getData();
            });
            // this.row = this.tableData[this.i];
            // this.length= this.tableData.length;
        },
        components:{
            "no-monitor":NoMonitor,
            "edital-info":EditalInfo
        }
    }
</script>
<style lang="" scoped>
.monitorInfo {
    width: 550px;
    height: 252px;
    position: fixed;
    bottom: 42px;
    right: 2%;
    background: #fff;
    z-index:99;
    box-shadow:2px 2px 5px #333333;
}
.monitorInfo1 {
    width: 550px;
    height: 252px;
    position: absolute;
    bottom: 0;
    right: 0;
    background: #fff;
    z-index:99;
    box-shadow:2px 2px 5px #333333;
}

.infoHeader {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #2fa0ff;
    color: #fff;
    padding-left: 10px;
}
.pending{
    height:38px;
    line-height:38px;
    margin-left: 10px;

}
 #currInfo, .currInfo {
    width: 298px;
    height: 168px;
    font-size:14px;
    border: 2px solid #ccc;
    float: left;
    margin-left: 16px;
}
a{
    color:#000;
}
.currInfo ul li span {
    display: inline-block;
    margin: 10px 0 20px 10px;
}

.opeator{
    width:220px;
    height:140px;
    float:left;
    margin: 0;
    padding-left: 28px;
}
.opeator1{
    width:220px;
    height:140px;
    float:left;
    margin-top: 30px;
    padding-left: 28px;
}
.opeator1 li {
    float: left;
    margin-right: 5px;
}
.opeator li .el-button{

}
.el-input{
    width:150px;
    height:40px;
    margin:20px 0 5px 20px;
}
.el-button{
    width:88px;
    height:28px;
    line-height:8px;
    margin-bottom:16px;
}
.destription{
    width:300px;
    height:100px;
    line-height:100px;
    text-align:center;
    margin-top:40px;
    margin-left:100px;
}
</style>