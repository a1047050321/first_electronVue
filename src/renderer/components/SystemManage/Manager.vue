<template>
<div>
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>系统管理 </el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="baseInfo" @contextmenu.prevent="">
        <div class="tree">
            <my-tree
            :data="data"
            :props="defaultProps"
            node-key="id"
            @node-click = "leftClick"
            default-expand-all
            :expand-on-click-node="false"
            :default-expanded-keys="array"
            >
            </my-tree>
        </div>
        <!-- 右侧显示信息 -->
        <div class="infoContent">
        <div class="infoText">
                <div class="communityLabel" :title="first.label" style="margin-left:16px;">{{region}}名称:<span >{{first.label}}</span>
                </div>
                <div class="communityId" :title="first.unit">管理单位:<span>{{first.unit}}</span>
                </div>
                <div class="communityId" :title="first.unitTel">单位电话:<span>{{first.unitTel}}</span>
                </div>
                <div class="communityId" :title="first.unitAddress">单位地址:<span>{{first.unitAddress}}</span>
                </div>
            </div>
            <div class="infoButton">
                <el-button type="primary" @click="addManager" :disabled="addDis">新增</el-button>
                <el-button type="primary" :disabled="disableDel" @click="deleteGuest">删除</el-button>
                <el-button type="primary" @click="editManager" :disabled="multi">{{edital}}</el-button>
                <div class="searchButton">
                    <el-input prefix-icon="el-icon-search" class="search" size="medium" @keyup.enter.native="search" placeholder="输入用户名搜索" v-model="search_value"></el-input>
                    <div style="float:right;">
                    <el-button type="primary" @click="search" style="margin-left:16px;">查找</el-button>
                    <el-button @click="reset">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="infoTable">
                <el-table
                    ref="singleTable"
                    :data="tableData"
                    height="42px"
                    size="mini"
                    highlight-current-row
                    @selection-change="handleSelectionChange"
                    >
                    <el-table-column
                    type="selection"
                    label="全选"
                    show-overflow-tooltip
                    width="40">
                    </el-table-column>
                    <el-table-column
                    type="index"
                    label="序号"
                    show-overflow-tooltip
                    width="65">
                    </el-table-column>
                    <el-table-column
                    property="userName"
                    label="登录名"
                    show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                    property="role"
                    label="管理员类型"
                    show-overflow-tooltip
                    width="110">
                    </el-table-column>
                    <el-table-column
                    property="areaName"
                    width="120"
                    show-overflow-tooltip
                    label="管理区域">
                    </el-table-column>
                    <el-table-column
                    property="alarmName"
                    show-overflow-tooltip
                    label="管理报警类型"
                    width="150">
                    </el-table-column>
                     <el-table-column
                    property="name"
                    show-overflow-tooltip
                    label="姓名"
                    >
                    </el-table-column>
                     <el-table-column
                    property="tel"
                    label="手机号"
                    show-overflow-tooltip
                    width="120">
                    </el-table-column>
                     <el-table-column
                    property="mail"
                    show-overflow-tooltip
                    label="邮箱">
                    </el-table-column>
                </el-table>
            </div>
            <div class="block">
                 <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[20, 30, 40]"
                :page-size="pagenum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            </div>
        </div>
       <add-guest v-if="addManage" :alarmType="alarmType" @addManage="addGuestReturn" :buttonClick="buttonClick" :multipleSelection="multipleSelection[0]" :first="firstData"></add-guest>
       <monitor-info :alarmType="alarmType" :configData="configData" :current="1"></monitor-info>
    </div>
</div>
</template>
<script>
  let id = 1000;
  import $ from "jquery"
  import AddGuest from "./AddGuest.vue"
  import Tree from "./../tree/src/tree.vue"
  import monitorInfo from './../BMap/MonitorInfo.vue'
  export default {
    props:['alarmType',"configData"],
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rightMenu:false,
        gridData:[],
        left:240,
        top:459,
        node:{},
        addSon:false,
        importDialog:false,
        treeData:{},
        managerPhone:12111,
        total:0,
        page:1,
        pagenum:20,
        tableData: [],
        multipleSelection: [],
        newNode:{},
        parentLabel:"",
        parentId:1,
        mode:1,
        addManage:false,
        buttonClick:1,
        multi:true,
        disableDel:true,
        addName:"",
        areaId:"",
        first:{},
        //传递first 的copy
        firstData:{},
        guest:{
            "10":"普通管理员",
            "50":"高级管理员",
            "100":"超级管理员"
        },
        addDis:false,
        all:{},
        flag:false,
        region:"区域",
        search_value:"",
        clickNode:{},
        array:[],
        edital:"编辑",
        role:null,
        fid:null,
        currentFlag:1,
        }
    },
    mounted(){
        this.getTreeData();
    },
     watch:{
        areaId:function(newArea){
            // console.log(newArea);
            this.getTableData();
        },
        search_value(search_value){
            if(!search_value){
                this.getTableData();
            }
        },
        first(first){
            this.array = [first.id];
        }
    },
    methods: {
       getTreeData(){
            //type = 0 区域 type = 1 社区
            var self = this;
            self.data = [];
            self.axios({
                method:"get",
                url:self.$iHomed("api","get_treeList")+localStorage.getItem("areaId"),
            }).then((res)=>{
                res = res.data.data;
                console.log(res);
                self.fid = res.fid;
                if(res.type == 1){
                    self.region = "社区";
                }
                var idArr = [];
                for(let i = 0;i <res.children.length;i++){
                    idArr.push(res.children[i].id);
                    localStorage.setItem("rootId",idArr.toString());
                }
                if(!self.first.id){
                      self.first = Object.assign({},res);
                }
                 self.role =localStorage.getItem('role');
                if(self.role == 10){
                    if(self.first.type == 1 || (self.first.type == 0 && self.first.children.length  == 0)){
                        self.addDis = true;
                        self.disableDel = true;
                    }else{
                        self.addDis = false;       
                    }  
                }
                self.all = Object.assign({},res);
                self.areaId = res.id;
                self.data =[res];
            })
        },
        //获取管理员列表
        getTableData(){
            var self = this;
            self.currentFlag = 1;
            self.tableData = [];
            self.axios({
                method:"get",
                url:self.$iHomed("api","search_guest"),                
                params:{
                    areaId:self.first.id,
                    currentPage:self.page,
                    pageSize:self.pagenum
                }
            }).then((res)=>{
                self.flag = true;
                var data = res.data.data.data;
                var arr = [];
                for(let i = 0;i < data.length;i++){
                    var arr =[]; 
                    var arrId =[]; 
                    for(let j = 0;j<data[i].alarmType.length;j++){
                        arr.push(data[i].alarmType[j].name);
                        arrId.push(data[i].alarmType[j].id);
                    }
                    data[i].alarmName = arr.join();
                    data[i].alarmId = arrId;
                    data[i].role = self.guest[data[i].type];
                }
                self.tableData = data;
                self.total = res.data.data.total;
            })
        },
        //显示详情框消息变化
            addGuestReturn(a,b){
                var self = this;
                //新增管理员
                if(b){
                    if(self.buttonClick ==1){
                        self.axios({
                            method:"post",
                            data:b,
                            url:self.$iHomed("api","edit_guest")
                        })
                        .then((res)=>{
                            let ret = res.data.data;
                            console.log(res);
                            if(ret){
                                self.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                self.addManage  = a;
                                    //刷新列表   
                                    self.getTableData();
                            }
                            else{
                                self.$alert(res.data.msg);
                                return;
                            };
                        })
                        //修改管理员
                        }else if(self.buttonClick ==2){
                            console.log(self.clickNode);
                            if(self.clickNode.alarmId == b.alarmId && self.clickNode.areaId == b.areaId &&
                                self.clickNode.type == b.type && self.clickNode.mail == b.mail&&
                                self.clickNode.name == b.name &&self.clickNode.tel == b.tel){
                                self.addManage  = a;
                                return false;
                            }else{
                                console.log(b);
                                self.axios({
                                method:"put",
                                data:{
                                    "alarmType": b.alarmId,
                                    "areaId":b.areaId,
                                    "level": b.type,
                                    "mail": b.mail,
                                    "name": b.name,
                                    "tel": b.tel
                                    },
                                url:self.$iHomed("api","change_guest")+b.id,
                            }).then((res)=>{
                                console.log(res);
                                let ret = res.data.data;
                                if(ret){
                                    self.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });

                                    self.addManage  = a;
                                    //刷新列表   
                                    self.getTableData();
                                }
                                else{
                                    self.$alert(res.data.msg);
                                    return;
                                };
                            })  
                        }
                    }
                }
                else{
                    self.addManage  = a;
                }
            },
            //新增管理员
            addManager(){
                this.buttonClick= 1;
                this.$nextTick(()=>{
                    this.firstData = $.extend({},this.first);
                })
                this.addManage =true;
            },
            //删除管理员
            deleteGuest(){
                var self = this;
                self.$confirm('此操作将彻底删除选中管理员，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var arr= [];
                    for(let i = 0;i<self.multipleSelection.length;i++){
                        arr.push(self.multipleSelection[i].id);
                    }
                    self.axios({
                        method:"delete",
                        url:self.$iHomed("api","edit_guest"),
                        data:{
                            "longIds": arr,
                        }
                    })
                    .then((res)=>{
                        console.log(res);
                        var ret = res.data.data;
                        if(ret){
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                        else{
                            self.$alert(res.data.msg);
                        }
                        //刷新列表   
                        self.getTableData();
                    })        
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });             
                });
            },
            //编辑管理员
            editManager(){
                this.buttonClick= 2;
                this.addManage =true;                
            },
         //鼠标单击显示
             leftClick(data,node,store,e){
                var self = this;
                    e.preventDefault();
                $(".el-tree-node__content .el-tree-node__label").css("color","#000");
                e.target.style.color="#20A0FF";
                if(e.target.children[1]){
                    e.target.children[1].style.color="#20A0FF";
                }
                if(data.type == 0){
                    self.region = "区域";
                    self.quyuClick = true;
                    if(data.id == localStorage.getItem("areaId")){
                        self.first = self.all;
                        self.getTreeData();
                        return false;
                    }else{
                        self.first =  Object.assign({},data);
                        self.areaId= self.first.id;
                    }
                    if(data.children.length != 0){
                        data.children = [];
                    }else{
                        for(let i = 0;i < node.parent.data.children.length;i++){
                            node.parent.data.children[i].children = [];
                        }
                        //点击哪个节点显示相应的社区
                        self.axios({
                            method:"get",
                            url:self.$iHomed("api","get_treeList")+data.id,
                        }).then((res)=>{
                            res = res.data.data;
                            if(res.children){
                                data.children = res.children;
                            }
                            else{
                                self.$alert("当前无权限访问！");
                            }
                        })
                    }          
                }
                else if(data.type == 1){
                    self.region = "社区";
                    self.quyuClick = false;
                    self.first = Object.assign({},data);
                    self.areaId= data.id;
                }
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                this.pagenum = val;
                if(this.currentFlag ==1){
                    this.getTableData();
                }else{
                    this.search();
                }
            },
            //点击第几页
            handleCurrentChange(val) {
                // console.log(val);
                this.page = val;
                if(this.currentFlag ==1){
                    this.getTableData();
                }else{
                    this.search();
                }
            },
            //多选框
             handleSelectionChange(val) {
                 //过滤函数 获取当前不可修改信息的行
                 var fid = this.fid;
                 function filterType(a){
                     var role = localStorage.getItem("role");
                     return a.type >= role && a.fid ==fid ;
                 }
                 console.log(val);
                 this.multipleSelection =val;
                 this.clickNode = $.extend({},this.multipleSelection[0]);  
                    if(this.multipleSelection.length ==1){
                        this.multi = false;
                    }else{
                        this.multi = true;
                    }
                    if(this.multipleSelection.length >= 1){
                        if(this.multipleSelection.length == 1 && this.multipleSelection.filter(filterType).length > 0){
                            if(this.multipleSelection[0].userName == localStorage.getItem("username")){
                                this.edital = "编辑";
                            }else{
                                this.edital = "查看";
                            }
                        }else{
                            this.edital = "编辑";
                        }
                        if(this.multipleSelection.filter(filterType).length > 0){
                            this.disableDel = true;
                        }else{
                            this.disableDel = false;
                        }
                    }else{
                        this.disableDel = true;
                    } 
                    if(localStorage.getItem("username") == "admin"){
                        this.disableDel = false;
                        this.edital = "编辑";
                    }               
             },
             //修改按钮点击
             handleInfo(){
                for(let i = 0; i< this.multipleSelection.length;i++){
                    this.multipleSelection[i].editeFlag = false;
                }
             },
            //同步信息
            syncInfo(){
                this.$confirm('开始同步homed监控系统区域及监控信息，操作将更新覆盖已有信息', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    //同步信息代码
                    this.$message({
                        type: 'success',
                        message: '同步成功！'
                    });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消同步操作'
                        });          
                    });
            },
            //表双击可编辑
                handleEdit:function(row){
                //遍历数组改变editeFlag
                // console.log(row);
                row.editeFlag = false;
            },      
            //搜索接口
            search(){
                var self = this;
                self.currentFlag = 2;
                self.page = 1;
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","search_guest"),
                    params:{
                        areaId:self.first.id,
                        currentPage:self.page,
                        pageSize:self.pagenum,
                        search:self.search_value
                    }
                }).then((res)=>{
                     var data = res.data.data.data;
                    var arr = [];
                    for(let i = 0;i < data.length;i++){
                    var arr =[]; 
                    var arrId =[]; 
                    for(let j = 0;j<data[i].alarmType.length;j++){
                        arr.push(data[i].alarmType[j].name);
                        arrId.push(data[i].alarmType[j].id);
                    }
                    data[i].alarmName = arr.join();
                    data[i].alarmId = arrId;
                    data[i].role = self.guest[data[i].type];
                }
                    self.tableData = data;
                    self.total = res.data.data.total;
                })
            },
            reset(){
                this.page = 1;
                this.search_value= "";
                this.getTableData();
            }      
        },
        components:{
            "add-guest":AddGuest,
            "my-tree":Tree,
            "monitor-info":monitorInfo
        }
      }
</script>
</script>
<style lang="" scoped>
    .el-tree{
        width:200px;
        position:absolute;
        top:88px;
        bottom:140px;
        overflow-y:scroll;
        overflow-x:hidden;
        border:1px solid #dfe6ec;
    }
   
    .infoContent{
        position:fixed;
        top:64px;
        bottom:84px;
        right:24px;
        left:488px;
    }
    .infoText{
        position:absolute;
        left:0;
        right:0;
        height:70px;
        margin-top:24px;
        border-top:1px solid #dfe6ec;
        border-bottom:1px solid #dfe6ec;
        background:#f9fafc;
    }
    .infoText div{
        display:inline-block;
        height:35px;
        line-height:35px;
        margin-top:16px;
        width:20%;
        font-size:14px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .infoButton{
        position:fixed;
        top:182px;
        left:488px;
    }
    .el-input{
        display:inline-block;
        height:30px;
        width:100px;
    }
    .el-table{
        position:absolute;
        top:178px;
        bottom:56px;
        font-size:12px;
        border:1px solid #dfe6ec;
        border-bottom:none;
        overflow-x:hidden;
    }
    .content div.nav-wrapper{
        margin:0;
    }
    .search{
        width:200px;
    }
    .searchButton{
        position:fixed;
        top:182px;
        right:24px;
    }
    .el-button{
        height:36px;
        width:90px;
        margin-left:12px;
    }
    .el-button:first-child{
        margin-left:0;
    }
    .import{
        position:fixed;
        top:120px;
        left:600px;
        width:200px;
        height:250px;
        background:#fff;
        z-index:100;
    }
    .import div:not(.title,.button){
        margin-top:10px;
        margin-left:35px;
    }
    .title{
        width:100%;
        height:40px;
        color:#fff;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
    }
    .button{
        margin-left:30px;
    }
    .search{
        width:200px;
    }
    .el-table tr{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
</style>