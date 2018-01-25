<template>
<div>
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
           <el-breadcrumb-item :to="{path:'/baseInfoManage'}">基本信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>机顶盒用户管理</el-breadcrumb-item>

        </el-breadcrumb>
    </div>
    <div class="baseInfo" @contextmenu.prevent="">
        <div class="tree">
            <my-tree
            :data="data"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            @node-click = "leftClick"
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
                <div class="communityId" :title="first.unitTel">单位电话:<span >{{first.unitTel}}</span>
                </div>
                <div class="communityId" :title="first.unitAddress">单位地址:<span >{{first.unitAddress}}</span>
                </div>
            </div>
            <div class="infoButton">
                <el-button type="primary" @click="addUser" :disabled="quyuClick" style="margin-left:0;">新增</el-button>
                <el-button type="primary" :disabled="multi" @click="reviseUser">修改</el-button>
                <el-button type="primary" :disabled="length" @click="delStbUser">删除</el-button>
                <el-button type="primary" @click='importData' :loading="quyuClick1" :disabled="quyuClick">导入</el-button>
                 <div class="searchButton">
                    <el-input prefix-icon="el-icon-search" class="search" size="medium" @keyup.enter.native="search" placeholder="输入用户名、姓名、电话、智能卡号、机顶盒序列号搜索" v-model="search_value"></el-input>
                    <div style="float:right;">
                    <el-button type="primary" @click="search" style="margin-left:16px;">查找</el-button>
                    <el-button @click="reset">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="infoTable" >
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
                    property="areaName"
                    label="所属社区"
                    show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                    property="name"
                    label="姓名"
                    show-overflow-tooltip
                    >
                    </el-table-column>
                     <el-table-column
                    property="username"
                    label="用户名"
                    show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                    property="tel"
                    show-overflow-tooltip
                    label="用户电话">
                    </el-table-column>
                    <el-table-column
                    property="stbId"
                    label="机顶盒序列号"
                    show-overflow-tooltip
                    width="140">
                    </el-table-column>
                     <el-table-column
                    property="terminalId"
                    label="智能卡号"
                    show-overflow-tooltip
                    >
                    </el-table-column>
                     <el-table-column
                    property="address"
                    show-overflow-tooltip
                    label="地址">
                    </el-table-column>
                </el-table>
            </div>
            <div class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-sizes="[ 20, 30, 40]"
                    :page-size="pagenum"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <right-menu @rightMenu="change" :rightMenu="rightMenu" :left="left" :top="top" :node="node" :treeData="treeData"></right-menu>
        <add-dialog @addSon="cancelAddSon" :parentLabel="parentLabel" :parentId="parentId" v-if="addSon" :mode="mode" :multipleSelection="stbUser" :treeData="treeData" :addName="addName"></add-dialog>
        <monitor-info :alarmType="alarmType" :configData="configData" :current="1"></monitor-info>
    </div>
    <div style="position:fixed;top:50%;left:50%;" v-if="importDialog">
        <form>
            <div class="mask"></div>
            <div class="import">
            <div class="title">导入用户信息</div>
                <div class="button">
                    <el-button type="primary" @click="download" style="margin-left:100px;width:98px;">下载模版</el-button>
                    <br/>
                    <input type="file" name="fileField" @change="getFile($event)" style="opacity:0;z-index:999;position:absolute;top:115px;left:100px;">
                    <el-button type="primary" style="position:absolute;top:110px;left:100px;width:98px;">点击上传</el-button>
                    <div style="width:100%;height:48px;"></div>
                </div>
                <div style="font-size:12px;">只能上传由模版填写的excel文件</div>
                <div style="text-align:right;margin-right:24px;float:right;">
                    <el-button @click="cancel" style="width:74px;">取消</el-button>
                    <el-button type="primary"  @click="submit($event)" style="width:74px;margin-left:12px;">确定</el-button>
                </div>
            </div>
        </form>
    </div>
</div>
</template>
<script>
    let id = 1000;
    import $ from "jquery"
    import RightMenu from "./RightMenu.vue"
    import AddDialog from "./AddDialog.vue"
     import Tree from "./../tree/src/tree.vue"
    import monitorInfo from "./../BMap/MonitorInfo.vue"
    export default {
        props:['alarmType',"configData"],
        data() {
        return {
            data:[],
            defaultProps: {
            children: 'children',
            label: 'label'
            },
            rightMenu:false,
            left:240,
            top:459,
            node:{},
            addSon:false,
            importDialog:false,
            treeData:{},
            community:"",
            total:0,
            page:1,
            radio:"1",
            pagenum:20,
            areaId:null,
            tableData: [],
            multipleSelection: [],
            stbUser:{},
            editing: false,
            newNode:{},
            parentLabel:"",
            parentId:1,
            mode:1,
            addName:"",
            length:true,
            multi:true,
            first:{},
            firstIn:false,
            quyuClick:true,
            quyuClick1:false,
            all:{},
            file:"",
            region:"区域",
            flag:false,
            firstData:{},
            search_value:"",
            array:[],
            dataFlag:1,
            }
        },
        watch:{
            areaId:function(newArea){
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
        mounted(){
            this.getTreeData();
        },
        methods: {
            //获取区域树data
            getTreeData(){
                //type = 0 区域 type = 1 社区
                var self = this;
                self.data = [];
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","get_treeList")+localStorage.getItem("areaId"),
                }).then((res)=>{
                    res = res.data.data;
                    // self.nodeType([res]);//显示区域下第一个社区
                    //  if(!self.first.id){
                    //        self.areaId = res.id;
                    //    }
                    //    else{
                    //    self.areaId = self.first.id;  
                    //    }
                    if(res.type == 1){
                        self.region = "社区";
                    }
                    if(!self.first.id){
                        self.first = Object.assign({},res);
                        if(self.first.type==1){
                            self.quyuClick = false;
                        }
                    }
                    self.all = Object.assign({},res);
                    self.areaId = res.id;
                    self.data.push(res);
                })
            },
            //获取用户列表
            getTableData(){
                var self = this;
                self.dataFlag = 1;
                self.tableData = [];
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","edit_stbUser"),                
                    params:{
                        areaId:self.areaId,
                        currentPage:self.page,
                        pageSize:self.pagenum
                    }
                }).then((res)=>{
                    self.flag = true;
                    var data = res.data.data.data;
                    self.tableData = data;
                    self.total = res.data.data.total;
                })
            },
            //父子通信传值 c=1添加子节点 c=2 添加同级节点 c=4删除节点
            change(a,b,c){
                this.rightMenu = a;
                if(b){
                    switch(c){
                        case 1 :
                        this.addName = b;
                        this.$nextTick(()=>{
                            if(this.node){
                                this.parentLabel = this.node.parent.data.label;
                                this.parentId = this.node.data.id;
                            }
                            this.mode = c;
                        });
                        //显示添加区域框
                        this.addSon = true;
                        break;
                        case 2 :
                        this.addName = b;
                        this.$nextTick(()=>{
                            this.parentLabel = this.node.parent.data.label;
                            this.parentId = this.node.data.id;
                            this.mode = c;
                        });
                        //显示添加区域框
                        this.addSon = true;
                        break;
                        case 4:
                        this.newNode = b;
                        this.node.store.remove(this.newNode);
                        break;
                    }
                }
            },
            //添加区域隐藏
            cancelAddSon(a,b){
                var self = this;
                if(b){
                    switch(this.mode){
                        //新建STB用户
                        case 3:
                        var putData = b;
                        for(let p in putData){
                            if(putData[p] == ""){
                                self.$alert("请补全信息!");
                                return false;
                            }
                        }
                        self.axios({
                            method:"post",
                            url:self.$iHomed("api","edit_stbUser"),
                            data:putData
                        })
                        .then((res)=>{
                            console.log(res);
                            var ret = res.data.data;
                            if(ret){
                                this.addSon = a;
                                self.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                self.getTableData();
                            }
                            else{
                                self.$alert(res.data.msg);
                            }
                        })           
                        break;
                        //修改用户信息
                        case 4:
                        var putData = b;
                        for(let p in putData){
                            if(!putData[p]){
                                self.$alert("请补全信息!");
                                return false;
                            }
                        }
                        self.axios({
                            method:"put",
                            url:self.$iHomed("api","change_stbUser")+b.id,
                            data:b
                        }).then((res)=>{
                            var ret = res.data.data;
                            if(ret){
                                this.addSon = a;
                                self.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            self.getTableData();
                            }
                            else{
                                self.$alert(res.data.msg);
                            }
                        })               
                        break;
                    }    
                }else{
                    this.addSon = a;
                }      
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
                        self.areaId= self.first.id;
                        self.getTableData();
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
                            }else{
                                self.$alert("当前无权限访问！");
                            }
                        })
                    } 
                }else if(data.type == 1){
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
                if(this.dataFlag == 1){
                    this.getTableData();
                }else{
                    this.search();
                }
            },
            //点击第几页
            handleCurrentChange(val) {
                this.page = val;
                if(this.dataFlag == 1){
                    this.getTableData();
                }else{
                    this.search();
                }
            },
            //多选框
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val);
                this.stbUser = $.extend({},this.multipleSelection[0]);
                if(this.multipleSelection.length == 1){
                    this.multi = false;
                }
                else{
                this.multi = true;
                }
                if(this.multipleSelection.length >= 1){
                    this.length = false;
                }
                else{
                    this.length = true;
                }
            },
            //双击可编辑
            dbClick(){
                var self = this;
                self.mode = 5;
                self.addSon = true;
                self.parentLabel=self.first.parentLabel;
                if(self.first.type== 0){
                    self.addName="修改区域";
                }else{
                    self.addName="修改社区";
                }
                self.treeData=$.extend({},self.first);
            },
            //新增用户
            addUser(){
                this.$nextTick(()=>{
                    this.mode = 3;
                    this.addSon = true;
                    this.addName = "新增用户";
                    this.parentLabel = this.first.parentLabel;
                    this.nodeType([this.first]);
                    this.treeData = $.extend({},this.first);
                })
            },
            //修改用户
            reviseUser(){
                this.mode = 4;
                this.addSon = true;
                this.parentLabel = this.first.parentLabel;
                this.addName = "修改用户信息";
            },
            //删除stb USer
            delStbUser(){
                var self = this;
                self.$confirm('确定删除选中用户信息吗', ' ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    //同步信息代码
                    var arr = [];
                    for(let i = 0;i<self.multipleSelection.length;i++){
                        arr.push(self.multipleSelection[i].id);
                    }
                    self.axios({
                        method:"delete",
                        url:self.$iHomed("api","edit_stbUser"),
                        data:{
                            "longIds": arr,
                        }
                    }).then((res)=>{
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
                        self.getTableData();
                    })    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步操作'
                    });          
                });
            },
            //按钮事件
            //导入
            importData(){
                this.importDialog = true;
            },
            //下载模板重定向
            download(){
                window.location = this.$iHomed("api","upload");
            },
            //上传文件
            getFile(event) {
                this.file = event.target.files[0];
                console.log(this.file);
            },
            submit(e){
                var self = this;
                e.preventDefault();
                if(!this.file){
                    self.$alert("请上传文件！");
                    return false;
                }else{
                    self.quyuClick1 = true;
                    self.importDialog = false;
                    let formData = new FormData();
                    formData.append('file', this.file);
                    //提交表格的url
                    self.axios({
                        url:self.$iHomed("api","user_import")+self.first.id,
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                        method:"post",
                        data:formData,
                    }).then((res)=>{
                        if(res.data.code == 0){
                            var sReturn = window.open(res.data.data);
                            if (sReturn == null){
                                self.$alert("本站弹出窗口被屏蔽,如需查看请修改浏览器相关配置!");
                            }else{
                                self.quyuClick1 = false;
                                self.$notify({
                                    title: '',
                                    message: '用户信息导入成功！',
                                    type: 'success',
                                    onClick:function(){ 
                                        self.$router.push({path: '/STBManage', replace: true});   
                                    }
                                });
                                self.areaId = self.first.id;
                                self.getTableData();
                            }
                        }
                        else{
                            self.$alert(res.data.msg);
                        }
                    })        
                }   
            },
            //导入取消
            cancel(){
                this.importDialog = false;
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });       
            },
            //搜索用户
            search(){
                var self = this;
                self.dataFlag = 2;
                if(!this.firstIn){
                    self.page = 1;
                    this.firstIn = true;
                }
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","search_user"),
                    params:{
                        currentPage:self.page,
                        pageSize:self.pagenum,
                        search:self.search_value
                    }
                }).then((res)=>{
                    var data = res.data.data.data;
                    console.log(data);
                    self.tableData = data;
                    self.total = res.data.data.total;
                })
            },
            reset(){
                this.page = 1;
                this.search_value = "";
                this.getTableData();
            }
        },
        components:{
            "right-menu":RightMenu,
            "add-dialog":AddDialog,
            "my-tree":Tree,
            "monitor-info":monitorInfo
        }
    }
</script>
</script>
<style lang="" scoped>
    *{
        font-size:14px;
    }
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
        border-bottom: none;
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
        width:90px;
        height:36px;
        margin-left:12px;
    }
    .el-button:first-child{
        margin-left:0;
    }
    .title{
        width:100%;
        height:40px;
        line-height:40px;
        text-align:left;
        padding-left:16px;
        background:#20A0FF;
        color:#fff;
    }
    .import{
        position:absolute;
        top:-118px;
        left:-140px;
        width:280px;
        height:236px;
        background:#fff;
        z-index:100;
        text-align:center;
    }
    .import div:not(.title){
        margin-top:16px;
    }
    .import .el-button{
        margin-left:0;
    }
    .import .button .el-button{
        float:left;
    }
    
    .mask{
        position: fixed;
        top: 0;
        bottom: 84px;
        left: -264px;
        right: 0;
        background: #000;
        opacity: 0.3;
        z-index: 98;
        }
    a{
        color:#000;
    }
</style>