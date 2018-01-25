<template>
<div>
 <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                <router-link to="/baseInfoManage">基本信息管理</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>区域管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="baseInfo" @contextmenu.prevent="">
        <div style="overflow:hidden;">
            <div class="tree">
                <el-tree
                :data="data"
                :props="defaultProps"
                node-key="id"
                default-expand-all
                @node-click = "leftClick"
                :expand-on-click-node="false"
                :render-content="renderContent"
                >
                </el-tree>
            </div>
        </div>
        <!-- 右侧显示信息 -->
        <div class="infoContent">
        <div class="infoText">
                <div class="communityLabel">{{region}}名称:<span @dblclick="dbClick">{{first.label}}</span>
                </div>
                <div class="communityId">{{region}}单位:<span @dblclick="dbClick">{{first.unit}}</span>
                </div>
                <div class="communityId">{{region}}电话:<span @dblclick="dbClick">{{first.unitTel}}</span>
                </div>
                <div class="communityId">{{region}}地址:<span  @dblclick="dbClick">{{first.address}}</span>
                </div>
            </div>
            <div class="infoButton" style="margin:10px 0;">
                <el-button type="primary">刷新</el-button>
                <el-button type="primary" @click="infoImport" :disabled="role">信息导入</el-button>
                <el-button type="primary" @click="syncInfo">监控同步</el-button>
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
                    width="55">
                    </el-table-column>
                    <el-table-column
                    property="code"
                    label="摄像头id"
                    width="130">
                    </el-table-column>
                    <el-table-column
                    property="name"
                    label="摄像头名称"
                    width="145">
                    </el-table-column>
                    <el-table-column
                    property="areaName"
                    label="所属社区"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    property="url"
                    width="150"
                    label="摄像头位置">
                    </el-table-column>
                    <el-table-column
                    property="mskUid"
                    label="关联马赛克"
                    width="140">
                    </el-table-column>
                     <el-table-column
                    property="channelCode"
                    label="关联频道号">
                    </el-table-column>
                </el-table>
            </div>
            <div class="block">
                 <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
    </el-pagination>
            </div>
        </div>
        <right-menu @rightMenu="change" :rightMenu="rightMenu" :left="left" :top="top" :node="node" :treeData="treeData"></right-menu>
        <add-dialog @addSon="cancelAddSon" :parentLabel="parentLabel" :parentId="parentId" v-show="addSon" :mode="mode" :addName="addName" :treeData="treeData"></add-dialog>
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
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rightMenu:false,
        left:240,
        top:459,
        node:{},
        addSon:false,
        treeData:{},
        total:1,
        pageIdx:1,
        currentPage: 1,
        pageNum:20,
        tableData: [],
        multipleSelection: [],
        editing: false,
        newNode:{},
        parentLabel:"",
        parentId:2,
        mode:1,
        addName:"",
        editeFlag:true,
        first:{},
        role:false,
        areaId:null,
        all:{},
        region:"区域",
        flag:false,
        firstData:{}
        }
    },
    mounted(){
        this.getTreeData();
       
        var role = localStorage.getItem('role');
         if(role == 0 || role == 1 || role == 2){
                this.role = true;
            }
            else{
                this.role = false;           
            }
    },
    watch:{
        areaId(areaId){
             this.getTableData();
        }
    },
    methods: {
        //获取区域树data
        getTreeData(){
            //type = 0 区域 type = 1 社区
            var self = this;
            self.data = [];
            self.axios({
                method:"get",
                url:self.$iHomed("api","get_treeList")+"-1",
            }).then((res)=>{
                res = res.data.data;
                self.data.push(res);
                self.first = Object.assign({},res);
                self.all = Object.assign({},res);
                //    self.nodeType([res]); //显示区域下第一个社区
                self.areaId = res.id;
                //    console.log(self.first);
            })
        },
        //获取用户列表
        getTableData(){
            var self = this;
            self.tableData = [];
            self.axios({
                method:"get",
                url:self.$iHomed("api","edit_monitor"),                
                params:{
                    areaId:self.flag?self.first.id:-1,
                    currentPage:self.pageIdx,
                    pageSize:self.pageNum
                }
            }).then((res)=>{
                self.flag = true;
                var data = res.data.data.data;
                // console.log(res);
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
                        if(this.node.parent){
                            this.parentLabel = this.node.data.label;
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
                        this.parentLabel = this.node.data.label;
                        this.parentId = this.node.data.id;
                        this.mode = c;
                    });
                    //显示添加区域框
                    this.addSon = true;
                    break;
                    case 3:
                    var self = this;
                     if( self.treeData.type == 0){
                            self.addName="修改区域";
                            this.parentLabel = "当前为根元素";
                    }
                    else if(self.treeData.type == 1){
                        self.addName="修改社区";
                    }
                    self.$nextTick(()=>{
                        self.parentId = this.node.data.id;
                        self.mode = 5;
                    });
                    self.addSon = true;
                    break;
                    case 4:
                    var self = this;
                     this.$confirm('此操作将永久删除'+b.label, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                                self.axios({
                                method:"delete",
                                url:self.$iHomed("api","change_tree")+b.id,
                            })
                                .then((res)=>{
                                    var ret = res.data;
                                    console.log(ret);
                                    if(ret.code == "0"){
                                        self.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                    }
                                    else{
                                        self.$alert(ret.msg);
                                    }
                                        ;
                                })
                            //刷新列表   
                            setTimeout(function(){
                                self.getTreeData();
                            },500);               
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
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
                //新增区域
                case 1:
                     self.axios({
                        method:"post",
                        data:b,
                         headers: {
                            "Content-Type": "application/json"
                        },
                        url:self.$iHomed("api","add_area")
                     })
                        .then((res)=>{
                            let ret = res.data.data;
                            // console.log(res);
                            if(ret){
                                self.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                self.getTreeData();
                                self.axios({
                                    method:"get",
                                    url:self.$iHomed("api","change_tree")+self.first.id,
                                    params:self.first
                                })
                                .then((res)=>{
                                    // console.log(res.data.data);
                                    self.first = $.extend({},res.data.data);
                                    self.first.label = self.first.name;
                                })
                            }
                            else{
                                self.$alert(res.data.msg);
                                return;
                            };
                        })
                break;
                //新增设区
                case 2:
                    self.axios({
                        method:"post",
                        data:b,
                         headers: {
                            "Content-Type": "application/json"
                        },
                        url:self.$iHomed("api","add_area")
                     })
                        .then((res)=>{
                            let ret = res.data.data;
                            if(ret){
                                self.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                self.getTreeData();
                                self.axios({
                                method:"get",
                                url:self.$iHomed("api","change_tree")+self.first.id,
                                data:self.first
                                })
                                .then((res)=>{
                                    // console.log(res.data.data);
                                    self.first = $.extend({},res.data.data);
                                    self.first.label = self.first.name;
                                })
                            } else{
                                self.$alert(res.data.msg);
                                return;
                            };
                        }) 
                break;
                case 5:
                console.log(b);
                var putData = {
                            "address": b.address,
                            "code": b.code,
                            "name": b.label,
                            "pid": b.pid,
                            "remark": b.remark,
                            "unit": b.unit,
                            "unitTel": b.unitTel
                            };
                    if(!putData["address"] || !putData["code"] ||!putData["name"]||!putData["remark"]||!putData["unit"] ||!putData["unitTel"] ){
                        self.$alert("请补全信息!");
                        self.addSon = true;
                        return false;
                }
                self.axios({
                        method:"put",
                        url:self.$iHomed("api","change_tree")+b.id,
                        data:putData
                        })
                        .then((res)=>{
                            var ret = res.data.data;
                            console.log(ret);
                            if(ret){
                                self.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                self.getTreeData();
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
                        // console.log(e.target);
                        $("font").css("color","#000");
                        e.target.style.color="#20A0FF";
                    this.node = Object.assign({},data);
                 console.log(data);
                //  function common(data,node,store){
                     
                //  }
                if(self.firstData.id){
                    if(self.firstData == data){
                        for(let i = 0;i < node.parent.data.children.length;i++){
                            node.parent.data.children[i].children = [];
                        }
                        self.firstData = {};
                        return false;
                    }
                    else{
                    self.firstData = data;
                    // if(data.type == 0){ //只显示区域  
                    if(data.type == 0){
                        this.region = "区域";
                        if(data.id == localStorage.getItem("areaId")){
                                self.first = self.all;
                                self.getTreeData();
                                return false;
                            }else{
                                self.first =  Object.assign({},data);
                                self.areaId= self.first.id;
                            }
                        for(let i = 0;i < node.parent.data.children.length;i++){
                            node.parent.data.children[i].children = [];
                        }
                            self.axios({
                                method:"get",
                                url:self.$iHomed("api","get_treeList")+data.id,
                            }).then((res)=>{
                                res = res.data.data;
                                data.children = res.children;
                            })
                    }
                    else{
                        this.region = "社区";
                        self.first =  Object.assign({},data);
                                self.areaId= self.first.id;
                    }
                }
            }
            else{
                self.firstData = data;
                    // if(data.type == 0){ //只显示区域  
                    if(data.type == 0){
                        this.region = "区域";
                        if(data.id == localStorage.getItem("areaId")){
                                self.first = self.all;
                                self.getTreeData();
                                return false;
                            }else{
                                self.first =  Object.assign({},data);
                                self.areaId= self.first.id;
                            }
                        //清除所有children
                        for(let i = 0;i < node.parent.data.children.length;i++){
                            node.parent.data.children[i].children = [];
                        }
                        //点击哪个节点显示相应的社区
                            self.axios({
                                method:"get",
                                url:self.$iHomed("api","get_treeList")+data.id,
                            }).then((res)=>{
                                res = res.data.data;
                                data.children = res.children;
                            })
                    }
                    else{
                        this.region = "社区";
                        self.first =  Object.assign({},data);
                        self.areaId= self.first.id;
                    }
            }
            },
        
            //  node.store.append({ id: self.baseId++, label:  self.aaa, children: [] }, data);
            remove:function(store, data) {
                store.remove(data);
            },
            //右键显示菜单
             renderContent:function(create, {node,data,store }) {
                var self = this;
                return create('font',{
                on: {
                    contextmenu: function (e) {
                        e.preventDefault();
                        $(".el-tree-node__content font").css("color","#000");
                        e.target.style.color="#20A0FF";
                        // console.log(node);
                        // console.log(data);
                        if(data.type == 0){
                            self.region = "区域";
                             self.first =  Object.assign({},data);
                        }
                        else{
                            self.region = "社区";
                        }
                        console.log(node);
                        self.rightMenu = true;  
                        self.$nextTick(()=>{
                            self.top = e.clientY; 
                            self.left = e.clientX;   
                            self.node = node;
                            self.parentLabel = node.parent.data.label;
                            self.treeData = Object.assign({},data);
                        }) 
                    }
                },
                style:{
                    "display":"inline-block",
                    "width":"100%"
                }
            }, data.label);
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                // console.log(`每页 ${val} 条`);
                this.pageNum = val;
                // this.getTableData();
            },
            //点击第几页
            handleCurrentChange(val) {
                // console.log(val);
                this.pageIdx = val;
                // this.getTableData();
            },
            //多选框
             handleSelectionChange(val) {
                this.multipleSelection = val;
             },
             //双击可编辑
             dbClick(){
                 console.log(this.first);
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
                // save: function (row) {
                //     this.editing = false;
                //     this.editeFlag= true;
                //     var self = this;
                //     self.first.name = self.first.label;
                //     var pattern = /^1[34578]\d{9}$/;
                //     if(!pattern.test(self.first.unitTel)){
                //         self.$alert("电话要为11位数字并且符合规范哦！");
                //         // self.getTreeData();
                //         self.first.unitTel = null;
                //         return false;
                //     }
                //     self.axios({
                //         method:"put",
                //         url:self.$iHomed("api","change_tree")+self.first.id,
                //         data:self.first
                //         })
                //         .then((res)=>{
                //             var ret = res.data.data;
                //             if(ret){
                //                 self.$message({
                //                     message: '修改成功',
                //                     type: 'success'
                //                 });
                //                 self.getTreeData();
                //                 self.axios({
                //                 method:"get",
                //                 url:self.$iHomed("api","change_tree")+self.first.id,
                //                 data:self.first
                //                 })
                //                 .then((res)=>{
                //                     // console.log(res.data.data);
                //                     self.first = $.extend({},res.data.data);
                //                     self.first.label = self.first.name;
                //                 })
                //             }
                //             else{
                //                 self.$alert(res.data.msg);
                //             }
                //         }) 
                // },
                //信息导入
                infoImport(){
                    this.$confirm('开始从监控系统导入信息', ' ', {
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
                            message: '已取消操作'
                        });          
                        });
                },
                //同步信息
                syncInfo(){
                    this.$confirm('开始从监控系统同步监控', ' ', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
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
                    this.editeFlag = false;
                },
        },
        components:{
            "right-menu":RightMenu,
            "add-dialog":AddDialog
        }
      }
</script>
<style lang="" scoped>
*{
    font-size:14px;
}
    .el-tree{
        width:230px;
        position:absolute;
        top:40px;
        bottom:0;
        overflow-y:scroll;
        overflow-x:hidden;
    }
   
    .infoContent{
        position:absolute;
        top:30px;
        bottom:0;
        right:0;
        left:500px;
    }
    .infoText{
        width:95%;
        height:90px;
        margin-top:20px;
        border:1px solid #ccc;
    }
    .infoText div{
        display:inline-block;
        margin-right:80px;
        height:35px;
        line-height:35px;
        margin-top:7px;
    }
    .infoButton{
        position:fixed;
        top:140px;
        left:500px;
    }
    .el-input{
        display:inline-block;
        height:30px;
        width:100px;
    }
    .infoText span{
        display:inline-block;
        height:30px;
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
        left:500px;
        bottom:40px;
    }
    .content div.nav-wrapper{
        margin:0;
    }
    .search{
        width:350px;
        margin-left:50px;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>