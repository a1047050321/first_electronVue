<template>
<div>
    <div class="button">
    <span>报警时间</span>
      <el-date-picker
        v-model="startTime"
        type="datetime"
        placeholder="选择日期时间">
        </el-date-picker>
        -
        <el-date-picker
        v-model="endTime"
        type="datetime"
        placeholder="选择日期时间">
      </el-date-picker>
        <el-input class="search" icon="search" v-model="search_value" @change="valueChange" @keyup.enter.native="search"  placeholder="输入机顶盒序列号、卡号、用户名、社区搜索"></el-input>
        <el-button  type="primary" @click.prevent="search">搜索</el-button>
    </div>
    <div class="table-wrapper">
        <el-table
            ref="singleTable"
            :data="tableData"
            height="40px"
            highlight-current-row
            @cell-click="edital"
            @row-dblclick="dblClick"
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
            prop="createDate"
            label="报警时间"
            width="180">
            {{tableData[i]}}
            </el-table-column>
            <el-table-column
            prop="alarmTypeName"
            label="报警类型"
            width="150">
            <template scope="scope">
                <span @dblclick="dblClick" v-if="editeFlag">{{scope.row.alarmTypeName}}</span>
                  <el-select v-model="scope.row.alarmTypeId" @change="keyDown" v-if="!editeFlag" :value="scope.row.alarmTypeId"  @blur="save" placeholder="选择报警类型" style="width:80%;margin-left:0;">
                    <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>  
            </template>
            </el-table-column>
            <el-table-column
            prop="name"
            show-overflow-tooltip
            label="报警人"
            width="120">
            <template scope="scope">
                <span @dblclick="dblClick" v-if="editeFlag">{{scope.row.name}}</span>
                <el-input v-model="scope.row.name" :value="scope.row.name" @change="keyDown" v-if="!editeFlag" @blur="save" ref="input"></el-input>
             </template>
            </el-table-column>
            <el-table-column
            prop="address"
            show-overflow-tooltip
            label="报警地址"
            width="180">
            </el-table-column>
             <el-table-column
             prop="terminalType"
             show-overflow-tooltip
            label="报警终端类型"
            width="150">
            </el-table-column>
             <el-table-column
            label="监控"
            width="70">
             <template scope="scope">
                <div slot="reference" class="name-wrapper" v-show="scope.row.monitor">
                    <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(scope.row),type:1}}"><div class="icon_monitor" style="width:21px;height:21px;"></div></router-link>
                </div>
                 <div v-show="!scope.row.monitor" style="margin-left:5px;">无</div> 
            </template>
            </el-table-column>
            <el-table-column
            label="详情"
            width="70">
                <template scope="scope">
                 <div slot="reference" class="name-wrapper">
                    <i class="el-icon-information"></i>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            label="处理">
                <template scope="scope">
                        <div slot="reference" class="name-wrapper" v-show="scope.row.monitor">
                            <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(scope.row)}}"><i class="el-icon-edit" ></i></router-link>
                        </div>
                        <div v-show="!scope.row.monitor" style="margin-left:5px;">无</div> 
                    </template>
            </el-table-column>
        </el-table>
    </div>
            <div class="block">
                <el-pagination
                style="margin-left:200px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[20, 30, 40]"
                :page-size="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
    </el-pagination>
            </div>
    <monitor-info :multipleSelection="clickRow" :alarmType="alarmType"  @tableData.off="tableDataChange"></monitor-info>
    <edital-info v-show="editalInfo" @editalInfo="editalInfoReturn" :row="row" :monitor="monitor" :alarmType="alarmType"></edital-info>
</div>
</template>
<script>
import EditalInfo from "./EditalInfo"
import MonitorInfo from "./MonitorInfo"
import bus from "../../assets/js/bus"
import md5 from "js-md5"

    export default{
        props:["alarmType","showType"],
        data(){
            return {
                total:0,
                pageIdx:1,
                currentPage: 1,
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
                firstIn:false
            }
        },
        methods:{
            valueChange(val){
                if(!val){
                    this.getData();
                }
            },
            tableDataChange(a,b){
                this.tableData = a;
                this.total = b;
                this.$emit("total",this.total);
            },
            getData(){
                var self = this;
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
                //         // if(datalist[i].monitor){
                //         //     self.axios({
                //         //     method:"get",
                //         //     url:self.$iHomed("api","paly_token"),
                //         //     params:{
                //         //         accesstoken:localStorage.getItem("token"),
                //         //         programid:datalist[i].monitor
                //         //     },
                //         //     withCredentials:false
                //         //     }).then((response)=>{
                //         //         console.log(response.data);
                //         //         if(response.data.ret == 0){
                //         //             // src = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken="+localStorage.getItem("token")+"&protocol=hls&playtype=live&programid="+sele.row.chnlid+"&playtoken="+res.data.play_token;
                //         //             datalist[i].monitorUrl = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken="+localStorage.getItem("token")+"&protocol=hls&playtype=live&programid="+datalist[i].monitor+"&playtoken="+response.data.play_token;
                //         //             // this.row.demandurl = url;
                //         //             console.log( datalist[i].monitorUrl);
                //         //         }
                //         //     })
                //         // }
                    }
                    self.tableData =datalist;
                    }
                    self.total = res.data.data.total;
                    self.$emit("total",self.total);
                })
                .catch((error)=>{
                    //地址错误
                    console.log(error);
                })
            },
            //鼠标已出单元格 取消编辑模式
            mouseRemove(row, column, cell, event){
                this.editeFlag = true;
            },
             keyDown(){
                this.flag = true;
            },
             //表双击可编辑
            dblClick(row,event){
                 this.editeFlag = false;
                 this.changRow = row;
            },
            //失去焦点
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
                        bus.$emit("tableChange",true);
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
                if(b){
                this.getData();
                bus.$emit("tableChange",true);
                }
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                this.pageNum = val;
                this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                this.pageIdx = val;
                this.getData();
            },
            //多选框
             handleSelectionChange(val) {
                this.multipleSelection = val;
                var length = this.multipleSelection.length;
                this.clickRow = this.multipleSelection[length-1];
                   
             },
            edital(row, column, cell, event){
                if(column.label == "详情"){
                    this.monitor=row.monitor;
                    this.editalInfo = true;
                    this.row = row;
                }
            },
            //回车搜索
            search(){
                var self = this;
                self.tableData = [];
                self.axios({
                    url:self.$iHomed("api","get_untreated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum,
                        beginTime:self.dateTranslate(self.startTime),
                        endTime:self.dateTranslate(self.endTime),
                        search:self.search_value
                    }
                })
                .then((res)=>{
                    if(res.data.data.data){
                     for(let i = 0;i < res.data.data.data.length;i++){
                         var datalist = res.data.data.data;
                         console.log(datalist);
                         if(! datalist[i].terminalType){
                             datalist[i].terminalType = "无";
                         }
                        datalist[i].createDate  = new Date(datalist[i].createDate).toLocaleDateString()+" "+new Date(datalist[i].createDate).toLocaleTimeString();
                        datalist[i].pendDate  = new Date(datalist[i].pendDate).toLocaleDateString()+" "+new Date(datalist[i].pendDate).toLocaleTimeString();
                        datalist[i].reportDate  = new Date(datalist[i].reportDate).toLocaleDateString()+" "+new Date(datalist[i].reportDate).toLocaleTimeString();
                         self.axios({
                            method:"get",
                            url:self.$iHomed("api","paly_token"),
                            params:{
                                accesstoken:localStorage.getItem("token"),
                                programid:datalist[i].monitor
                            },
                            withCredentials:false
                        }).then((response)=>{
                            console.log(response.data);
                            if(response.data.ret == 0){
                                // src = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken="+localStorage.getItem("token")+"&protocol=hls&playtype=live&programid="+sele.row.chnlid+"&playtoken="+res.data.play_token;
                                datalist[i].monitorUrl = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken="+localStorage.getItem("token")+"&protocol=hls&playtype=live&programid="+datalist[i].monitor+"&playtoken="+response.data.play_token;
                                // this.row.demandurl = url;
                                console.log( datalist[i].monitorUrl);
                            }
                        })
                    }
                    self.tableData =datalist;
                    console.log(self.tableData);
                    }
                    else{
                    self.total = res.data.data.total;
                    self.$emit("total",self.total);
                    }
                })
            },
            getToken(){
                var self = this;
                console.log(localStorage.getItem("token"));
                if(!localStorage.getItem("token")){
                    var timeDate = self.timeStamp(new Date());
                    self.axios({
                        method:"post", 
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        withCredentials: false,
                        url:self.$iHomed("api","get_token"),
                        data:{
                            "deviceno":timeDate+ "" + md5(""+timeDate)[7],
                            "devicetype":"zdt",
                            "accounttype":3,
                            "account":localStorage.getItem("tel")+"",
                            "timestamp":timeDate+"",
                            "signature":md5((timeDate+""+ md5(""+timeDate)[7])+"|zdt|3|"+localStorage.getItem("tel")+"|"+timeDate+""),
                            "identification":localStorage.getItem("CA")+""
                        }
                    }).then((res)=>{
                        if(res.data.ret == 0){
                            localStorage.setItem("token",res.data.access_token);
                            console.log(localStorage.getItem("token"));
                        }else{
                            this.$alert("未获取到有效token,请稍后重试！");
                            localStorage.setItem("token","");
                        }
                    })
                }
            },   
        },
         mounted(){
            this.row =this.tableData[this.i];
            if(!localStorage.getItem("token")){
                this.getToken();
            }
        },
        components:{
            "monitor-info":MonitorInfo,
            "edital-info":EditalInfo
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
     .button .el-input.search{
        display:inline-block;
        height:30px;
        width:400px;
        margin-left:150px;
    }
    .el-table{
        margin-top:10px;
        font-size:12px;
        position:absolute;
        top:90px;
        bottom:40px;
        width:80%;
        overflow-y:scroll;
    }
    .block{
        position:fixed;
        left:350px;
        bottom:40px;
    }
    .el-badge.item{
        margin-top:0;
    }
    .el-badge__content.is-fixed {
        position: absolute;
        top: 20px;
        right: 160px;
        -ms-transform: translateY(-50%) translateX(100%);
        transform: translateY(-50%) translateX(100%);
    }
    div.name-wrapper i{
        color:#20A0ff;
    }
    .el-select .el-input{
        margin-top:0;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>