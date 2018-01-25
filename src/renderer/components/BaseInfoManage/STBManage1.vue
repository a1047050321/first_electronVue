<template>
<div>
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                <router-link to="/baseInfoManage">基本信息管理</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>机顶盒用户管理</el-breadcrumb-item>

        </el-breadcrumb>
    </div>
    <div class="baseInfo" @contextmenu.prevent="">
        <div class="tree">
            <el-tree
            :data="data"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            @node-click = "leftClick"
            :expand-on-click-node="false"
            >
            </el-tree>
        </div>
        <!-- 右侧显示信息 -->
        <div class="infoContent">
        <div class="infoText">
                <div class="communityLabel">社区名称:<span v-if="!editing" @dblclick="dbClick">{{first.label}}</span>
                    <el-input v-model="first.label" :value="first.label" v-if="editing" @blur="save" ref="input"></el-input>
                </div>
                <div class="communityId">管理单位:<span v-if="!editing" @dblclick="dbClick">{{first.unit}}</span>
                    <el-input v-model="first.unit" :value="first.unit" v-if="editing" @blur="save"></el-input>
                </div>
                <div class="communityId">单位电话:<span v-if="!editing" @dblclick="dbClick">{{first.unitTel}}</span>
                    <el-input v-model="first.unitTel" :value="first.unitTel"  v-if="editing" @blur="save"></el-input>
                </div>
                <div class="communityId">社区地址:<span v-if="!editing" @dblclick="dbClick">{{first.address}}</span>
                    <el-input v-model="first.address" :value="first.address" v-if="editing" @blur="save"></el-input>
                </div>
            </div>
            <div class="infoButton" style="margin:10px 0;">
                <el-button type="primary">刷新</el-button>
                <el-button type="primary" @click="addUser" :disabled="quyuClick">新增</el-button>
                <el-button type="primary" :disabled="multi" @click="reviseUser">修改</el-button>
                <el-button type="primary" :disabled="length" @click="delStbUser">删除</el-button>
                <el-button type="primary" @click='importData'>导入</el-button>
                <el-input icon="search" class="search" placeholder="输入机顶盒序列号、卡号、用户名、社区搜索"></el-input>
            </div>
            
            <div class="infoTable">
                <el-table
                    ref="singleTable"
                    :data="tableData"
                    height="40px"
                    highlight-current-row
                     @selection-change="handleSelectionChange"
                    style="width: 910px">
                     <el-table-column
                    type="selection"
                    label="全选"
                    width="40">
                    </el-table-column>
                    <el-table-column
                    type="index"
                    label="序号"
                    width="65">
                    </el-table-column>
                    <el-table-column
                    property="areaName"
                    label="所属社区"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    property="name"
                    label="用户名"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    property="tel"
                    width="150"
                    label="用户电话">
                    </el-table-column>
                    <el-table-column
                    property="name"
                    label="机顶盒序列号"
                    width="140">
                    </el-table-column>
                     <el-table-column
                    property="terminalId"
                    label="机顶盒卡号"
                    width="120">
                    </el-table-column>
                     <el-table-column
                    property="address"
                    label="地址">
                    </el-table-column>
                </el-table>
            </div>
           <div class="block">
                 <el-pagination
                 style="margin-left:150px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[ 20, 30, 40]"
                :page-size="pagenum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            </div>
        </div>
       <right-menu @rightMenu="change" :rightMenu="rightMenu" :left="left" :top="top" :node="node" :treeData="treeData"></right-menu>
       <add-dialog @addSon="cancelAddSon" :parentLabel="parentLabel" :parentId="parentId" v-show="addSon" :mode="mode" :multipleSelection="stbUser" :treeData="treeData" :addName="addName"></add-dialog>
    </div>
    <div style="width:100%;height:100%;" v-show="importDialog">
            <div class="mask"></div>
            <div class="import">
            <div class="title">导入用户信息</div>
                <div class="button">
                    <el-button type="primary">下载模版</el-button>
                    <br/>
                    <input type="file" style="opacity:0;z-index:999;position:absolute;top:115px;left:100px;">
                    <el-button type="primary" style="position:absolute;top:110px;">点击上传</el-button>
                    <div style="width:100%;height:50px;"></div>
                </div>
                <div style="font-size:12px;margin-left:60px;">只能上传由模版填写的excel文件</div>
                <div class="button" style="margin-left:50px;margin-top:30px;">
                    <el-button type="primary">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </div>
    </div>
</div>
</template>
<script>
  let id = 1000;
  import RightMenu from "./RightMenu.vue"
  import AddDialog from "./AddDialog.vue"
      export default {
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
        total:1,
        page:1,
        radio:"1",
        currentPage: 1,
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
        quyuClick:true
        }
    },
    watch:{
        areaId:function(newArea){
            console.log(newArea);
            this.getTableData();
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
                url:self.$iHomed("api","get_treeList"),
            }).then((res)=>{
                res = res.data.data;
                console.log(res);
                // self.nodeType([res]);//显示区域下第一个社区
                //  if(!self.first.id){
                //        self.areaId = res.id;
                //    }
                //    else{
                //    self.areaId = self.first.id;  
                //    }
                if(!self.first.id){
                    self.first = Object.assign({},res);
                    if(self.first.type==1){
                        self.quyuClick = false;
                    }
                }
                   self.areaId = res.id;
                self.data =[res];
            })
        },
        //获取用户列表
        getTableData(){
            var self = this;
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
                var data = res.data.data.data;
                console.log(res);
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
               this.addSon = a;
               if(b){
                    switch(this.mode){
                        //新建STB用户
                        case 3:
                        console.log(b);
                        var putData = b;
                        for(let p in putData){
                            if(putData[p] == ""){
                                self.$alert("请补全信息!");
                                return false;
                            }
                        }
                        console.log(putData);
                        self.axios({
                                method:"post",
                                url:self.$iHomed("api","edit_stbUser"),
                                data:putData
                                })
                                .then((res)=>{
                                    console.log(res);
                                    var ret = res.data.data;
                                    if(ret){
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
                        console.log(b);
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
                                })
                                .then((res)=>{
                                    console.log(res);
                                    var ret = res.data.data;
                                    if(ret){
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
               }      
        },
            //鼠标单击显示
            leftClick(data,node,store){
                var self = this;
                var e = window.event;
                    e.preventDefault();
                    $(".el-tree-node__content .el-tree-node__label").css("color","#000");
                    e.target.style.color="#20A0FF";
                    if(e.target.children[1]){
                        e.target.children[1].style.color="#20A0FF";
                    }
                    console.log(data);
                if(data.type == 1){
                    self.quyuClick = false;
                    self.first = Object.assign({},data);
                    self.areaId= data.id;
                    console.log(self.first);
                }
                else{
                    self.quyuClick = true;
                    self.nodeType([data]); 
                    self.areaId= data.id;
                    // self.first = Object.assign({},data);
                    // //显示区域下所有社区的用户
                    // self.areaId= data.id;
                }
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                this.pagenum = val;
                this.getTableData();
            },
            //点击第几页
            handleCurrentChange(val) {
                console.log(val);
                this.page = val;
                this.getTableData();
            },
            //多选框
             handleSelectionChange(val) {
                this.multipleSelection = val;
                this.stbUser = $.extend({},this.multipleSelection[0]);
                console.log(this.stbUser);
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
                this.editing = true;
                },
                save: function (row) {
                    this.editing = false;
                    this.editeFlag= true;
                    var self = this;
                    var first = self.first;
                    self.first.name = self.first.label;
                    var pattern = /^\d+$/;
                    if(!pattern.test(self.first.unitTel)){
                        self.$alert("电话要为数字并且符合规范哦！");
                        self.areaId = self.first.id;
                        self.getTreeData();
                        return false;
                    }
                    self.axios({
                        method:"put",
                        url:self.$iHomed("api","change_tree")+self.first.id,
                        data:self.first
                        })
                        .then((res)=>{
                            var ret = res.data.data;
                            if(ret){
                                self.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                self.getTreeData();
                                self.axios({
                                method:"get",
                                url:self.$iHomed("api","change_tree")+self.first.id,
                                data:self.first
                                })
                                .then((res)=>{
                                    console.log(res.data.data);
                                    self.first = $.extend({},res.data.data);
                                    console.log(self.first);
                                    self.first.label = self.first.name;
                                })
                            }
                            else{
                                self.$alert(res.data.msg);
                            }
                        })  
                },
                //新增用户
                addUser(){
                    this.$nextTick(()=>{
                        this.mode = 3;
                        this.addSon = true;
                        this.addName = "新增用户";
                        // console.log(this.first);
                        this.nodeType([this.first]);
                        this.treeData = $.extend({},this.first);
                    })
                },
                //修改用户
                reviseUser(){
                    this.mode = 4;
                    this.addSon = true;
                    this.addName = "修改用户信息";
                    //把选中的值传到addDialog里
                },
                 //删除stb USer
                delStbUser(){
                    var self = this;
                    for(let i = 0;i<self.multipleSelection.length;i++){
                        self.axios({
                        method:"delete",
                        url:self.$iHomed("api","change_stbUser")+self.multipleSelection[i].id,
                        })
                        .then((res)=>{
                            console.log(res);
                            var ret = res.data.data;
                            if(ret){
                                self.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                            self.getTableData();
                            }
                            else{
                                self.$alert(res.data.msg);
                            }
                        })             
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
                    console.log(row);
                    row.editeFlag = false;
                },
                //按钮事件
                //导入
                importData(){
                    this.importDialog = true;
                    // $(".app-content.el-row").css("opacity","0.5");
                    // $(".import").css("opacity","1");
                },
                //导入取消
                cancel(){
                    this.importDialog = false;
                     this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });       
                }
        },
        components:{
            "right-menu":RightMenu,
            "add-dialog":AddDialog
        }
      }
</script>
</script>
<style lang="" scoped>
     .baseInfo{
        width:100%;
    }
    .el-tree{
        width:200px;
        position:absolute;
        top:40px;
        bottom:0;
    }
   
    .infoContent{
        position:absolute;
        top:30px;
        bottom:0;
        right:0;
        left:480px;
    }
    .infoText{
        width:95%;
        height:90px;
        margin-top:20px;
        border:1px solid #ccc;
    }
    .infoText div{
        display:inline-block;
        margin-right:100px;
        margin-bottom:2px;
        margin-top:5px;
    }
    .infoButton{
        position:fixed;
        top:140px;
        left:480px;
    }
    .el-input,.infoText span{
        display:inline-block;
        height:30px;
        width:100px;
        margin-right:100px;
    }
    .el-table{
        position:fixed;
        top:190px;
        bottom:80px;
        font-size:12px;
        overflow-y:scroll;
        overflow-x:hidden;
    }
    .block{
        position:fixed;
        left:350px;
        bottom:40px;
    }
    .content div.nav-wrapper{
        margin:0;
    }
    .import{
        position:fixed;
        top:200px;
        left:600px;
        width:300px;
        height:240px;
        background:#fff;
        z-index:100;
    }
    .import div:not(.title){
        margin-top:10px;
        margin-left:100px;
    }
    .title{
         width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;
    }
    .mask{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#000;
        opacity:0.1;
        z-index:98;
    }
    .search{
        width:330px;
        margin-left:10px;
    }
    a{
        color:#000;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>