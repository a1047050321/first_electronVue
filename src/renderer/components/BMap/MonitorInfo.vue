<template>
     <!--报警信息弹出框-->
<div>
    <div class="monitorInfo" v-if="!row.monitor && row.name">
        <div class="infoHeader">报警信息</div>
        <div class="prev" @click="prevInfo">
            <i class="el-icon-arrow-left"></i>
        </div>
        <div class="next" @click="nextInfo">
            <i class="el-icon-arrow-right"></i>
        </div>
        <div class="pending">待处理:{{i+1 +"/"+length}}</div>
        <ul class="currInfo1">
            <li><div style="margin-top:13px;" :title="row.address">地区:{{row.address}}</div></li>
            <li><div style="margin-top:8px;" :title="row.name">报警人:{{row.name}}</div></li>
            <li><div style="margin-top:8px;" :title="row.alarmTypeName">报警类型:{{row.alarmTypeName}}</div></li>
        </ul>
        <ul class="opeator1" style="margin:0;">
            <li class="detail">
                <div><el-button type="primary" @click="ulbtnClick" style="position:absolute;right:24px;bottom:12px;">处理</el-button></div>
            </li>
        </ul>
        <div class="noMonitorShow" v-if="noMonitorShow">
            <div class="mask"></div>
            <div class="content1">
                <div class="title1">报警信息<a href="javascript:void(0)"><span style="float:right;padding:0 16px;font-size:20px;color:#fff;" @click="close">&times;</span></a></div>
                <div class="p" :title="row.address" style="margin-top:24px"><span>地区:{{row.address}}</span></div>
                <div class="p" :title="row.name"><span>报警人:{{row.name}}</span></div>
                <div class="p" :title="row.alarmTypeName"><span>报警类型:{{row.alarmTypeName}}</span></div>
                <ul class="opeator1">
                    <li class="call">
                        <div><el-button type="primary" @click="ulbtnClick" style="margin-left:0;">致电</el-button></div>
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
                </ul>
            </div>
        </div>
        <div class="monitorInfo1" v-show="!row.monitor &&!buttonShow">
                <span class="icon-success" style="position:absolute;left:60px;top:48px;"></span>
                <div class="destription">
                {{row.name}} 报警已解除</div>
                <div style="text-align:right;margin-right:24px;">
                        <el-button type="primary" @click="removeConfirm" style="height:36px;">确定</el-button>
                </div>
            </div>
         <no-monitor :mode="mode" :row="row" v-if="liClick" @liClick="opeator" @buttonShow="infoChange"></no-monitor>
        <edital-info v-show="editalInfo" @editalInfo="editalInfoReturn" :row="row" :alarmType="alarmType"></edital-info>
    </div>
     <div class="monitorInfo" v-if=" row.monitor && tableData.length != 0">
        <div class="infoHeader">报警信息</div>
        <div class="pending">待处理:{{i+1 +"/"+length}}</div>
        <div class="prev" @click="prevInfo">
            <i class="el-icon-arrow-left"></i>
        </div>
        <div class="next" @click="nextInfo">
            <i class="el-icon-arrow-right"></i>
            
        </div>
        <!-- 放监控截图-->
        <div id="currInfo">
            <img :src="imgSrc" alt="无法获取监控照片" style="width:100%;height:100%;font-size:12px;">
        </div>
        <ul class="opeator">
            <li class="detail">
                <div :title="row.address"><span>地区:{{row.address}}</span></div>
                <div :title="row.name"><span>报警人:{{row.name}}</span></div>
                <div :title="row.alarmTypeName" style="margin-bottom:6px;"><span>报警类型:{{row.alarmTypeName}}</span></div>
                <el-button type="primary" @click="toMonitor" style="position:absolute;right:24px;bottom:12px;">处理</el-button>
                <!-- <el-button type="primary" @click="nextInfo" style="float:left">下一条</el-button> -->
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
    import $ from "jquery"
    export default {
        props: ["multipleSelection", "alarmType", "id","configData"],
        data() {
            return {
                mode: 1,
                liClick: false,
                editalInfo: false,
                buttonShow: true,
                mode: 1,
                i: 0,
                _temp: null,
                row: {},
                length: null,
                tableData: [],
                temp: false,
                pageIdx: 1,
                pageNum: 100,
                //非监控报警要确认点击了致电
                feiFlag: false,
                imgSrc: "",
                noMonitorShow: false,
                noOpeator:false,
                setTime:0,
            }
        },
        watch: {
            multipleSelection(multipleSelection) {
                if (multipleSelection) {
                    this.row = multipleSelection;
                } else {
                    this.row = this.tableData[this.i];
                }
            },
            tableData: {
                handler(newValue, oldValue) {
                    if (newValue) {
                        this.$emit("tableData", newValue, self.length);
                    }
                },
                　　deep: true
            },
            row: {
                handler(newValue, oldValue) {
                    if (newValue.monitor) {
                        var self = this;
                        self.axios({
                            url: self.$iHomed("api", "get_picture") + newValue.monitor + "/" + parseInt(newValue.createDate / 1000),
                            method: "get",
                        }).then((res) => {
                            if (res.data.code == 0) {
                                self.imgSrc = res.data.data;
                            } else {
                                self.imgSrc = "";
                            }
                        })
                    }
                },
                deep: true
            },
            configData:{
                handler(newValue, oldValue) {
                    var self = this;
                    console.log(newValue);
                    if(newValue.homedTerminalLoginUrl){
                        this.setTime = newValue.handleTimeout;
                    }
                },
                deep:true,
                immediate:true
            }
        },
        methods: {
            //获取待处理数据
            getData() {
                var self = this;
                var chnllist = [],
                    playlist = [];
                self.axios({
                        url: self.$iHomed("api", "get_untreated"),
                        method: "get",
                        params: {
                            currentPage: 0,
                        }
                    })
                    .then((res) => {
                        //数据处理
                        if (res.data.data.data) {
                            for (let i = 0; i < res.data.data.data.length; i++) {
                                var datalist = res.data.data.data;
                                if (!datalist[i].terminalType) {
                                    datalist[i].terminalType = "无";
                                }
                                datalist[i].createDateTran = new Date(datalist[i].createDate).toLocaleDateString() + " " + new Date(datalist[i].createDate).toLocaleTimeString();
                                datalist[i].pendDate = new Date(datalist[i].pendDate).toLocaleDateString() + " " + new Date(datalist[i].pendDate).toLocaleTimeString();
                                datalist[i].reportDate = new Date(datalist[i].reportDate).toLocaleDateString() + " " + new Date(datalist[i].reportDate).toLocaleTimeString();
                            }
                            self.tableData = datalist;
                        }
                        self.length = res.data.data.total;
                        self.row = self.tableData[0];
                        self.$emit("total", self.length);
                        self.$emit("tableData", self.tableData, self.length);
                    })
                    .catch((error) => {
                        //地址错误
                        console.log(error);
                    })
            },
            editalInfoReturn(a) {
                this.editalInfo = a;
            },
            //接收报警处理按钮返回关闭弹窗
            opeator(a, b) {
                this.liClick = a;
                var self = this;
                //致电后才能解除
                if (b == "false") {
                    this.feiFlag = b;
                    this.noMonitorShow = true;
                }
                //退出弹框，解除标记
                if(!this.liClick && !this.noMonitorShow && !this.noOpeator){
                    self.axios({
                        method:"post",
                        url:self.$iHomed("api","editing")+self.row.id+"/cancel",
                    }).then((res)=>{
                        if(res.data.code == 0){
                            console.log("标记解除");
                             this.noOpeator = true;
                        }
                    })
                }
            },
            //跳转监控页 先判断当前是否有人在处理此条数据
            toMonitor(){
                var self = this;
                self.axios({
                    method:"post",
                    url:self.$iHomed("api","editing")+self.row.id,
                }).then((res)=>{
                    console.log(res.data);
                    if(res.data.code == 0){
                        console.log("标记成功");
                        self.$router.push({path:'/handlePending',query:{row:JSON.stringify(self.row),status:'待处理'}});
                    //有人处理
                    }else{
                        if(res.data.code ==101 && res.data.msg == "treated"){
                            self.$alert("当前报警已处理，请选择其他报警处理");
                        }else{
                            self.$alert(res.data.msg);
                        }
                        return false;
                    }
                })    
            },
            //关闭非监控报警弹窗
            close() {
                this.noMonitorShow = false;
                var self = this;
                self.axios({
                    method:"post",
                    url:self.$iHomed("api","editing")+self.row.id+"/cancel",
                }).then((res)=>{
                    console.log(res.data);
                    if(res.data.code == 0){
                        console.log("标记解除");
                         this.noOpeator = true;
                    }
                })
            },
            //解除成功显示接触弹框提示
            infoChange(a) {
                this.buttonShow = a;
            },
            // 接除提示确认
            removeConfirm() {
                this.liClick = false;
                this.buttonShow = true;
                this.getData();
            },
            //6个按钮点击事件
            ulbtnClick() {
                var self = this;
                $("ul.opeator1").unbind("click");
                $("ul.opeator1").click(function(e) {
                    var e = e || window.event,
                        target = e.target || e.srcElement;
                        e.preventDefault();
                    switch (target.textContent) {
                        case "致电":
                            self.mode = 1;
                            self.liClick = true;
                            self.feiFlag = true;
                            self.noMonitorShow = false;
                            break;
                        case "上报":
                            self.mode = 2;
                            self.liClick = true;
                            self.noMonitorShow = false;
                            break;
                        case "提交":
                            self.mode = 3;
                            self.liClick = true;
                            self.noMonitorShow = false;
                            break;
                        case "解除":
                            self.mode = 4;
                            if (!self.feiFlag) {
                                self.$alert("请先致电！");
                                return false;
                            } else {
                                self.axios({
                                    method:"put",
                                    url:self.$iHomed("api","put_remark")+self.row.id+"/relieve?time=0",
                                }).then((response)=>{
                                    console.log(response);
                                    if(response.data.data){
                                        self.buttonShow = false;
                                        self.noMonitorShow = false;
                                        self.liClick = false;
                                        
                                    }else{
                                        self.$alert(response.data.msg);
                                        self.buttonShow = true;
                                        self.noMonitorShow = true;
                                        self.liClick = false;
                                    }
                                })
                            }
                            break;
                        case "处理":
                        // console.log(self.row);
                            self.axios({
                                method:"post",
                                url:self.$iHomed("api","editing")+self.row.id,
                            }).then((res)=>{
                                console.log(res.data);
                                if(res.data.code == 0){
                                    console.log("标记成功");
                                    self.noMonitorShow = true;
                                    self.noOpeator = false;
                                //定时器
                                setTimeout(function() {
                                    if((self.noMonitorShow || self.liClick) && !self.noOpeator){
                                        //把状态改为非处理
                                        self.noMonitorShow = false;
                                        self.liClick = false;
                                        self.$message({
                                            message: '当前操作已超时，请重新处理',
                                            type: 'warning'
                                        });
                                        self.axios({
                                            method:"post",
                                            url:self.$iHomed("api","editing")+self.row.id+"/cancel",
                                        }).then((res)=>{
                                            console.log(res.data);
                                            if(res.data.code == 0){
                                                console.log("标记解除");
                                                 this.noOpeator = true;
                                                self.noMonitorShow = false;
                                                self.liClick = false;
                                            }
                                        })
                                    }
                                }, self.setTime *1000);
                                //有人处理
                                }else {
                                    self.noMonitorShow = false;
                                    if(res.data.code ==101 && res.data.msg == "treated"){
                                        self.$alert("当前报警已处理，请选择其他报警处理");
                                    }else{
                                    self.$alert(res.data.msg);
                                    }
                                    return false;
                                }
                            })
                            break;
                    }
                })
            },
            //上一条
            prevInfo() {
                if (this.i == 0) {
                    this.i = this.length - 1;
                } else {
                    this.i = this.i - 1;
                }
                this.feiFlag = false;
                this.row = this.tableData[this.i];
            },
            //下一条
            nextInfo() {
                if (this.i ==this.length-1) {
                    this.i = 0;
                }else{
                    this.i = this.i + 1;
                }
                this.feiFlag = false;
                this.row = this.tableData[this.i];
            }
        },
        mounted() {
            //要把tableData 传进来
            this.getData();
            this.ulbtnClick();
            //有新的报警实时消息 同步刷新 $off避免多次刷新调用过多接口，造成服务器负担
            bus.$off("temp").$on("temp", (a) => {
                this.getData();
            });
            //  bus.$on("tableChange",(a)=>{
            //     this.getData();
            // });
            // this.row = this.tableData[this.i];
            // this.length= this.tableData.length;
        },
        components: {
            "no-monitor": NoMonitor,
            "edital-info": EditalInfo
        }
    }
</script>
<style lang="" scoped>
    li {
        margin: 0;
        padding: 0;
    }
    
    .monitorInfo {
        width: 360px;
        height: 168px;
        position: fixed;
        bottom: 84px;
        right: 24px;
        background: #fff;
        z-index: 99;
        box-shadow: 2px 2px 5px #333333;
    }
    
    .prev {
        position: absolute;
        left: 0;
        top: 40px;
        width: 20px;
        height: 120px;
        line-height: 120px;
        text-align: left;
        cursor: pointer;
    }
    
    .next {
        position: absolute;
        right: 0;
        top: 40px;
        width: 20px;
        height: 120px;
        line-height: 120px;
        text-align: left;
        cursor: pointer;
    }
    
    .prev i,
    .next i {
        display: inline-block;
        width: 24px;
        height: 24px;
        color: #2fa0ff;
        font-weight: 600px;
    }
    
    .monitorInfo1 {
        width: 360px;
        height: 168px;
        position: fixed;
        bottom: 84px;
        right: 24px;
        background: #fff;
        z-index: 99;
        box-shadow: 2px 2px 5px #333333;
    }
    
    .infoHeader {
        width: 100%;
        height: 30px;
        line-height: 30px;
        background: #2fa0ff;
        color: #fff;
        padding-left: 16px;
    }
    
    .pending {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        margin-left: 16px;
    }
    
    #currInfo,
    .currInfo {
        width: 164px;
        height: 92px;
        font-size: 14px;
        border: 1px solid #dfe6ec;
        float: left;
        margin-left: 16px;
    }
    
    .currInfo1 {
        width: 320px;
        height: 92px;
        font-size: 12px;
        float: left;
        margin-left: 16px;
    }
    
    a {
        color: #000;
    }
    
    .currInfo1 li div {
        font-size: 12px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom:8px;
    }
    
    .opeator {
        width: 156px;
        height: 92px;
        font-size: 12px;
        float: left;
        margin: 0;
        margin-left: 8px;
    }
    
    .opeator1 li {
        float: left;
    }
    
    .opeator1 li div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .opeator .detail div {
        margin-bottom: 8px;
        font-size: 12px;
        width: 156px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .el-input {
        width: 150px;
        height: 40px;
        margin: 20px 0 5px 20px;
    }
    
    .el-button {
        width: 74px;
        height: 28px;
        line-height: 5px;
        margin-bottom: 4px;
        margin-left: 8px;
    }
    
    .destription {
        width: 300px;
        height: 86px;
        line-height: 86px;
        text-align: center;
        margin-top: 30px;
        margin-left: 60px;
    }
    
    .noMonitorShow {
        position: fixed;
        left: 50%;
        top: 50%;
        z-index: 99;
    }
    
    .content1 {
        position: absolute;
        top: -95px;
        left: -176px;
        width: 352px;
        height: 190px;
        background: #fff;
        z-index: 1000;
    }
    
    .content1 div:not(.title1) {
        margin-top: 8px;
    }
    
    .content1 .p {
        height: 14px;
        font-size: 14px;
        text-align: center;
    }
    
    .title1 {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: left;
        padding-left: 16px;
        margin: 0;
        background: #20A0FF;
        color: #fff;
    }
    
    .opeator1 {
        margin: 24px 16px;
    }
    
    .opeator1 .el-button {
        width: 74px;
        height: 28px;
        line-height: 5px;
        float: left;
        margin-left: 8px;
    }
    
    .mask {
        position: fixed;
        top: 0;
        bottom: 84px;
        left: -264px;
        right: 0;
        background: #000;
        opacity: 0.3;
        z-index: 98;
    }
</style>