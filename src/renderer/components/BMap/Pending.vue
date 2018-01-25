<template>
<div>
    <div>
        <div class="button">
        <span style="margin-right:8px;">报警时间</span>
        <el-date-picker
            v-model="startTime"
            size="medium"
            id="time1"
            type="datetime"
            style="margin-right:4px;
            width:164px;"
            placeholder="选择日期时间">
            </el-date-picker>
            -
            <el-date-picker
            v-model="endTime"
            size="medium"
            style="margin-left:4px;
            width:164px;"
            id="time2"
            type="datetime"
            placeholder="选择日期时间">
        </el-date-picker>
        <div class="searchButton">
            <el-input class="search" size="medium"  prefix-icon="el-icon-search" v-model="search_value"  @keyup.enter.native="getData"  placeholder="输入机顶盒序列号、卡号、用户名搜索"></el-input>
            <div style="margin-left:16px;float:right;">
            <el-button  type="primary" size="medium" style="width:90px;"  @click.prevent="search">搜索</el-button>
            <el-button  size="medium" style="width:90px;margin-left:12px;"  @click.prevent="reset">重置</el-button>
            </div>
        </div>
        </div>
        <div class="table-wrapper">
            <el-table
                ref="singleTable"
                :data="tableData"
                v-loading="loading"
                height="42px"
                class="tableSet"
                size="mini"
                highlight-current-row
                @cell-click="edital"
                @cell-mouse-leave="mouseRemove"
                @selection-change="handleSelectionChange"
                >
                <el-table-column
                type="selection"
                label="全选"
                width="55">
                </el-table-column>
                <el-table-column
                type="index"
                label="序号"
                width="70">
                </el-table-column>
                <el-table-column
                prop="createDateTran"
                show-overflow-tooltip
                label="报警时间"
                width="200"
                >
                </el-table-column>
                <el-table-column
                prop="alarmTypeName"
                show-overflow-tooltip
                label="报警类型"
                :filters="alarmType"
                :filter-method="alarmTypeChange"
                width="100"
                >
                </el-table-column>
                <el-table-column
                prop="name"
                show-overflow-tooltip
                label="报警人"
                >
                </el-table-column>
                <el-table-column
                prop="address"
                show-overflow-tooltip
                label="报警地址"
                >
                </el-table-column>
                <el-table-column
                prop="terminalType"
                show-overflow-tooltip
                label="报警终端类型"
                header-align="center"
                align="center"
                :filters="optionMethods"
                :filter-method="alarmTypeChange1"
                width="120"
                >
                </el-table-column>
                <el-table-column
                label="监控"
                width="70"
                header-align="center"
                align="center"
                >
                <template  slot-scope="scope">
                    <div slot="reference" class="name-wrapper" v-show="scope.row.monitor">
                        <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(scope.row),type:1,status:'待处理'}}"><i class="el-icon-view" ></i></router-link>
                    </div>
                    <div v-show="!scope.row.monitor" style="text-align:center;">-</div> 
                </template>
                </el-table-column>
                <el-table-column
                label="详情"
                width="70"
                header-align="center"
                align="center"
                >
                    <template  slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <a href="javascript:void(0)"><i class="el-icon-document"></i></a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                width="70"
                header-align="center"
                align="center"
                label="处理">
                    <template  slot-scope="scope">
                        <div slot="reference" class="name-wrapper" v-show="scope.row.monitor" style="text-align:center;">
                            <i class="el-icon-edit-outline" @click="toMonitor(scope.row)"></i>
                        </div>
                        <div v-show="!scope.row.monitor" style="text-align:center;color:#4ba6ff"> <a href="javascript:void(0)" style="color:#4ba6ff"><i class="el-icon-edit-outline"></i></a></div> 
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIdx"
                :page-sizes="[20, 30, 40]"
                :page-size="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
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
    <no-monitor :mode="mode" :row="row" v-show="liClick" @liClick="opeator" @buttonShow="infoChange"></no-monitor>
    <edital-info v-show="editalInfo" @editalInfo="editalInfoReturn" :row="row" :monitor="monitor" :alarmType="alarmType"></edital-info>
</div>
</template>
<script>
import EditalInfo from "./EditalInfo"
import MonitorInfo from "./MonitorInfo"
import NoMonitor from './NoMonitor'
import bus from "../../assets/js/bus"
import md5 from "js-md5"

    export default{
        props:["alarmType","showType","configData"],
        data(){
            return {
                total:0,
                pageIdx:1,
                pageNum:20,
                key:1,
                //monitor:0 有监控 1 是没监控
                tableData: [],
                cols:[],
                multipleSelection: [],
                startTime:"",
                endTime:"",
                search_value:"",
                editalInfo:false,
                row:[],
                moniInfoShow:false,
                i:0,
                monitor:0,
                clickRow:[],
                newAlarm:{},
                playtoken:null,
                editeFlag:true,
                changeRow:{},
                flag:false,
                temp:false,
                searchFlag:false,
                firstIn:false,
                pageFlag:1,
                //标记解除
                noOpeator:false,
                optionMethods: [{
                    value: '机顶盒',
                    label: '机顶盒',
                    text: '机顶盒'
                    }, {
                    value: '短信',
                    label: '短信',
                    text: '短信',
                },{
                
                    value: 'APP',
                    label: 'APP',
                    text: 'APP'
                }],
                noMonitorShow:false,
                feiFlag:false,
                mode:1,
                liClick:false,
                editalInfo:false,
                buttonShow:false,       
                monitor:"",
                loading:true,
            }
        },
        watch:{
            //选择框修改，值为空获取待处理
            search_value(value){
                if(!value){
                    this.pageIdx = 1;
                    this.getData();
                }
            },
            configData:{
                handler(newValue, oldValue) {
                    var self = this;
                    console.log(newValue);
                    if(newValue.homedTerminalLoginUrl){
                        if (!localStorage.getItem("token")) {
                            var timeDate = self.timeStamp(new Date());
                            self.axios({
                                method: "post",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                withCredentials: false,
                                url:newValue.homedTerminalLoginUrl,
                                data: {
                                    "deviceno": timeDate + "" + md5("" + timeDate)[7],
                                    "devicetype": "zdt",
                                    "accounttype": 3,
                                    "account": localStorage.getItem("tel") + "",
                                    "timestamp": timeDate + "",
                                    "signature": md5((timeDate + "" + md5("" + timeDate)[7]) + "|zdt|3|" + localStorage.getItem("tel") + "|" + timeDate + ""),
                                    "identification": localStorage.getItem("CA").toLowerCase() + ""
                                }
                            }).then((res) => {
                                if (res.data.ret == 0) {
                                    localStorage.setItem("token", res.data.access_token);
                                    console.log(localStorage.getItem("token"));
                                } else {
                                    this.$alert("未获取到有效token,请稍后重试！");
                                    localStorage.setItem("token", "");
                                }
                            })
                        }
                        this.setTime = newValue.handleTimeout;
                    }
                },
                deep:true,
                immediate:true
            }
        },
        methods:{
            //获取待处理数据
            getData(){
                var self = this;
                self.loading = true;
                self.tableData = [];
                self.axios({
                    url:self.$iHomed("api","get_untreated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum,
                        beginTime:self.startTime && self.searchFlag?self.dateTranslate(self.startTime):"",
                        endTime:self.endTime && self.searchFlag?self.dateTranslate(self.endTime):"",
                        search:self.searchFlag?self.search_value:""
                    }
                })
                .then((res)=>{
                    if(res.data.data.data){
                        self.tableData = [];
                        self.loading = false;
                        for(let i = 0;i < res.data.data.data.length;i++){
                            var datalist = res.data.data.data;
                            if(! datalist[i].terminalType){
                                datalist[i].terminalType = "无";
                            }
                            datalist[i].createDateTran  = new Date(datalist[i].createDate).toLocaleDateString()+" "+new Date(datalist[i].createDate).toLocaleTimeString();
                            datalist[i].pendDate  = new Date(datalist[i].pendDate).toLocaleDateString()+" "+new Date(datalist[i].pendDate).toLocaleTimeString();
                            datalist[i].reportDate  = new Date(datalist[i].reportDate).toLocaleDateString()+" "+new Date(datalist[i].reportDate).toLocaleTimeString();
                        }
                        self.total = res.data.data.total;
                        self.tableData =datalist;
                        self.$emit("total",self.total);
                    }
                    else{
                        //没有数据
                        self.total = res.data.data.total;
                        self.$emit("total",self.total);
                    }
                })
            },
            //跳转监控页 先判断当前是否有人在处理此条数据
            toMonitor(row){
                var self = this;
                self.axios({
                    method:"post",
                    url:self.$iHomed("api","editing")+row.id,
                }).then((res)=>{
                    console.log(res.data);
                    if(res.data.code == 0){
                        console.log("标记成功");
                        self.$router.push({path:'/handlePending',query:{row:JSON.stringify(row),status:'待处理'}});
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
            //表格里报警类型赛选
            alarmTypeChange(value, row){
                return row.alarmTypeId === value;
            },
            //表格里报警终端类型筛选
            alarmTypeChange1(value, row){
                return row.terminalType === value;
            },
            //鼠标已出单元格 取消编辑模式
            mouseRemove(row, column, cell, event){
                this.editeFlag = true;
            },
            //非监控报警按钮点击事件
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
                        self.noMonitorShow = false;
                        break;
                        case "上报":
                        self.mode =2;
                        self.liClick = true;
                        self.noMonitorShow = false;
                        break;
                        case "提交":
                        self.mode =3;
                        self.liClick = true;
                        self.noMonitorShow = false;
                        break;
                        case "解除":
                        self.mode =4;
                        if(!self.feiFlag){
                            self.$alert("请先致电！");
                            return false;
                        }else{
                            self.axios({
                                method:"put",
                                url:self.$iHomed("api","put_remark")+self.row.id+"/relieve?time=0",
                            }).then((response)=>{
                                console.log(response);
                                if(response.data.data){
                                    self.buttonShow = false;
                                    self.noMonitorShow = false;
                                    self.liClick = false;
                                    self.$message({
                                        type: 'success',
                                        message: '解除成功！'
                                    });
                                    self.getData();
                                }else{
                                    self.$alert(response.data.msg);
                                    self.noMonitorShow = true;
                                    self.liClick = false;
                                    self.getData();
                                }
                            })
                        }
                        break;
                    }
                })
            },
            //关闭非监控报警弹窗
            close(){
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
            //非监控解除
            infoChange(a){
                this.buttonShow = a;
            },
            //关闭noMonitor按钮弹窗
            opeator(a,b){
                this.liClick = a;
                var self = this;
                if(b == "false"){
                    this.feiFlag = b;
                    this.noMonitorShow = true;
                }
                //退出处理模式
                if(!this.liClick && !this.noMonitorShow && !this.noOpeator){
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
                }
            },
            //双击修改表单 失去焦点
            save: function (row) {
                this.editing = false;
                this.editeFlag= true;
                var self = this;
                if(self.flag){
                    self.flag = false;
                    self.axios({
                        method:"put",
                        url:self.$iHomed("api","change_untreated")+this.changRow.id+"/detail",
                        data:{
                            "alarmTypeId": self.changRow.alarmTypeId,
                            "name": self.changRow.name
                        }
                    }).then((res)=>{
                        var ret = res.data.data;
                        if(ret){
                            self.$message({
                                message: '修改成功',
                                type: 'success'
                            });  
                        self.getData();
                        }
                        else{
                            self.$alert(res.data.msg);
                        }
                    }) 
                 } 
            },
            //显示详情框消息变化
            editalInfoReturn(a,b){
                this.editalInfo = a;
                // 修改成功
                if(b){
                this.getData();
                }
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                this.pageNum = val;
                //根据当前状态判断翻页的函数
                this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                this.pageIdx = val;
                    this.getData();
                // if(this.pageFlag == 1){
                // }else{
                //     this.search();
                // }
            },
            //多选框
             handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection);
                var length = this.multipleSelection.length;
                this.clickRow = this.multipleSelection[length-1];
                   
             },
            //点击模板图标
            edital(row, column, cell, event){
                var self = this;
                if(column.label == "详情"){
                    self.monitor=row.monitor;
                    self.editalInfo = true;
                    self.row = row;
                }else if(column.label == "处理" && !row.monitor){
                    self.row = row;
                    //判断是否为正在处理状态  非监控报警
                    self.axios({
                        method:"post",
                        url:self.$iHomed("api","editing")+self.row.id,
                    }).then((res)=>{
                        if(res.data.code == 0){
                            self.noMonitorShow = true;
                            console.log("标记成功");
                            self.noOpeator = false;
                            //定时器
                            setTimeout(function(){
                                if((self.noMonitorShow || self.liClick) && !self.noOpeator){
                                    self.noMonitorShow = false;
                                    //把状态改为非处理
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
                                }else{
                                    return false;
                                }
                            },this.setTime*1000);
                        //当前有人处理此报警
                        }else{
                            self.noMonitorShow = false;
                            if(res.data.code ==101 && res.data.msg == "treated"){
                                self.$alert("当前报警已处理，请选择其他报警处理");
                            }else{
                                self.$alert(res.data.msg);
                            }
                            return false;
                        }
                    })
                }
            },
            //搜索按钮
            search(){
                this.pageIdx = 1;
                this.searchFlag = true;
                this.getData();
            },
            //重置按钮
            reset(){
                 this.searchFlag = false;
                this.search_value = "";
                this.beginTime = "";
                this.endTime = "";
                this.pageIdx = 1;
                this.getData();
            }
        },
         mounted(){
            this.getData();
            this.row =this.tableData[this.i];
            bus.$off("temp").$on("temp",(a)=>{
                    this.getData();
            });
        },
        components:{
            "monitor-info":MonitorInfo,
            "edital-info":EditalInfo,
            "no-monitor":NoMonitor,
        }
    }
</script>
<style lang="" scoped>
    span.el-breadcrumb__item__inner{
        padding-bottom:0;
    }
    body,html{
        height:100%;
        overflow:hidden;
    }
    .button{
        margin:24px 0;
    }
    .button .el-input.search{
        display:inline-block;
        height:30px;
        width:328px;
        margin-left:150px;
    }
    .el-table{
        font-size:13px;
        border:1px solid #dfe6ec;
        border-bottom:none;
        position:absolute;
        top:148px;
        bottom:140px;
    }
    .tableSet .el-table__header-wrapper{
        height:42px;
    }
    .el-badge.item{
        margin-top:0;
    }
    
    div.name-wrapper i{
        color:#20A0ff;
    }
    .el-select .el-input{
        margin-top:0;
    }
    .searchButton{
        position:fixed;
        top:88px;
        right:24px;
    }
    .selectChange{
        position:fixed;
        top:300px;
        left:600px;
        border:1px solid red;
    }
    .cell{
        padding:0 16px;
    }
    .noMonitorShow{
        position:fixed;
        left:50%;
        top:50%;
        z-index:99;
    }
    .content1{
        position:absolute;
        top:-95px;
        left:-176px;
        width:352px;
        height:190px;
        background:#fff;
        z-index:1000;
    }
    .content1 div:not(.title1){
        margin-top:8px;
    }
    .content1 .p{
        height:14px;
        font-size:14px;
        text-align:center;
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
    .opeator1{
        margin:24px 16px;
    }
    .opeator1 .el-button{
        width:74px;
        height:28px;
        line-height:5px;
        float:left;
        margin-left:8px;
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