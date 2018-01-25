<template>
<div>
 <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/baseInfoManage'}">基本信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>区域管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="baseInfo" @contextmenu.prevent="">
        <div style="overflow:hidden;">
            <div class="tree">
                <my-tree
                :data="data"
                :props="defaultProps"
                node-key="id"
                default-expand-all
                @node-click = "leftClick"
                :expand-on-click-node="false"
                :render-content="renderContent"
                :default-expanded-keys="array"
                >
                </my-tree>
            </div>
        </div>
    </div>
        <!-- 右侧显示信息 -->
        <div class="infoContent">
            <div class="infoText">
                <div class="communityLabel" :title="first.label" style="margin-left:16px;">{{region}}名称:<span @dblclick="dbClick">{{first.label}}</span>
                </div>
                <div class="communityId" :title="first.unit">管理单位:<span @dblclick="dbClick">{{first.unit}}</span>
                </div>
                <div class="communityId" :title="first.unitTel">单位电话:<span @dblclick="dbClick">{{first.unitTel}}</span>
                </div>
                <div class="communityId" :title="first.unitAddress">单位地址:<span  @dblclick="dbClick">{{first.unitAddress}}</span>
                </div>
            </div>
            <div class="infoButton">
                <div v-show="!unbindingClick">
                    <el-button type="primary" @click="monitorImport"  v-show="!blackOutShow" >监控导入</el-button>
                    <el-button type="primary" @click="infoImport" :disabled="role" v-show="!blackOutShow">获取未绑定监控</el-button>
                    <el-button type="primary" @click="cancelSelect" :disabled="cancelBinding" v-show="!blackOutShow">取消绑定</el-button>
                    <el-button type="primary" @click="returnLast" v-show="blackOutShow"  style="width:90px;margin-left:0;">返回</el-button>
                    <el-button type="primary" @click="blackData">黑名单</el-button>
                    <el-button type="primary" @click="cancelBlack" :disabled="blackOut" v-show="blackOutShow">取消拉黑</el-button>
                </div>
                <div v-show="unbindingClick">
                <el-button type="primary" @click="bindingData" :disabled="multi"  v-show="!blackOutShow">绑定区域</el-button>
                    <el-button type="primary" @click="returnLast" v-show="blackOutShow"  style="width:90px;margin-left:0;">返回</el-button>
                    <el-button type="primary" @click="blackData">黑名单</el-button>
                    <el-button type="primary" @click="toBlack" :disabled="multi"  v-show="!blackOutShow"  style="width:90px;">拉黑</el-button>
                    <el-button type="primary" @click="cancelBlack" :disabled="blackOut" v-show="blackOutShow">取消拉黑</el-button>
                </div>
                <div class="searchButton">
                    <el-input prefix-icon="el-icon-search" class="search" size="medium" @keyup.enter.native="search" placeholder="输入监控id、名称、描述搜索" v-model="search_value"></el-input>
                    <div style="float:right;">
                    <el-button type="primary" @click="search" style="width:90px;margin-left:16px;">查找</el-button>
                    <el-button @click="reset" style="width:90px;">重置</el-button>
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
                    width="55">
                    </el-table-column>
                    <el-table-column
                    property="chnlid"
                    show-overflow-tooltip
                    width="120"
                    label="监控频道id"
                    >
                    </el-table-column>
                    <el-table-column
                    property="chnlname"
                    show-overflow-tooltip
                    label="监控名称">
                    </el-table-column>
                    <el-table-column
                    property="lag"
                    show-overflow-tooltip
                    label="监控位置">
                        <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper" >
                            <div v-if="!scope.row.lng && !scope.row.lat">-</div>
                            <div v-else>({{scope.row.lng}},{{scope.row.lat}})</div>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column
                    property="areaName"
                    label="区域名称"
                    show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                    property="desc"
                    show-overflow-tooltip
                    label="监控描述">
                    </el-table-column>
                </el-table>
            </div>
            <div class="block">
                 <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIdx"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageNum"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            <div class="bindingdialog"  v-show="binding">
                <div class="mask"></div> 
            <div class="binding">
                <div class="name">选择区域</div>
                <el-select v-model="province"  placeholder="选择区域"  @change="provinceChange" :class="{allWidth:!width,halfWidth:width}">
                <el-option-group
                    v-for="(group,key) in provinceOptions"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                        v-for="item in group.options"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                </el-option>
                </el-option-group>
                </el-select>
                <el-select v-model="city" placeholder="请选择" @change="cityChange" filterable class="halfWidth" style="margin-left:10px;" v-if=" province && width && cityOptions.length != 0">
                    <el-option
                        v-for="item in cityOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="county"  @change="countyChange" placeholder="请选择" filterable class="halfWidth" style="margin-left:10px;" v-if="city && countyOptions.length != 0">
                    <el-option
                        v-for="item in countyOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="countySide" placeholder="请选择" filterable class="halfWidth" style="margin-left:10px;" v-if="county && countySideOptions.length != 0">
                    <el-option
                        v-for="item in countySideOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
                <div class="button">
                    <el-button @click="quyuCancel">取消</el-button>
                    <el-button type="primary" @click="quyuConfirm">确定</el-button>
                </div>
            </div>
        </div>
           
        <right-menu @rightMenu="change" :rightMenu="rightMenu" :left="left" :top="top" :node="node" :treeData="treeData"></right-menu>
        <add-dialog @addSon="cancelAddSon" :parentLabel="parentLabel" :parentId="parentId" v-if="addSon" :mode="mode" :addName="addName" :treeData="treeData"></add-dialog>
        <monitor-info :alarmType="alarmType"  :configData="configData"  :current="1"></monitor-info>
    </div>
</div>
</template>
<script>
  import $ from "jquery"
  import RightMenu from "./RightMenu.vue"
  import AddDialog from "./AddDialog.vue"
  import monitorInfo from "./../BMap/MonitorInfo.vue"
  import Tree from "./../tree/src/tree.vue"
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
        treeData:{},
        total:0,
        pageIdx:1,
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
        firstData:{},
        search_value:"",
        array:[],
        multi:true,
        options2:[],
        binding:false,
        props: {
          value: 'label',
          children: 'cities'
        },
        province:"",
        city:"",
        county:"",
        countySide:"",
        provinceOptions: [],
        cityOptions:[],
        countyOptions:[],
        countySideOptions:[],
        root:"",
        width:false,
        address:null,
        //标识是否传进来地区
        flag1:false,
        flag2:false,
        flag3:false,
        selectId:null,
        selectItem:[],
        cancelBinding:true,
        black:true,
        blackOut:true,
        blackOutShow:false,
        unbindingClick:false,
        lastData:0,
        addData:{},
        firstIn:false,
        condition:"",
        moniInfoShow:true
        }
    },
    mounted(){
        this.getTreeData();
        this.getProv();
    },
    watch:{
        areaId(areaId){
             this.getTableData();
        },
        search_value(search_value){
            if(!search_value){
                if(this.lastData == 1){
                    this.infoImport();
                }else if(this.lastData == 2){
                    this.getTableData();
                }
            }
        },
        first(first){
            this.array = [first.id];
        }
    },
    methods: {
        //获取区域树data
         getTreeData(){
            //type = 0 区域 type = 1 社区
            var self = this;
            self.data = [];
            var id = self.first.id?self.first.id:localStorage.getItem("areaId");
            self.axios({
                method:"get",
                url:self.$iHomed("api","get_treeList")+localStorage.getItem("areaId"),
            }).then((res)=>{
                res = res.data.data;
                self.data.push(res);
                if(!self.firstIn){
                    self.first = Object.assign({},res);
                    self.all = Object.assign({},res);
                    self.areaId = self.first.id;
                    self.firstIn = true;
                }
                if(res.type == 1){
                    self.region = "社区";
                }
                //    self.nodeType([res]); //显示区域下第一个社区
                //    console.log(self.first);
            })
        },
        //获取用户列表
        getTableData(){
            var self = this;
            self.blackOutShow = false;
            self.unbindingClick = false;
            self.condition = "binding";
            self.tableData = [];
            self.lastData = 2;
            self.axios({
                method:"get",
                url:self.$iHomed("api","edit_monitor"),                
                params:{
                    areaId:self.first.id,
                    currentPage:self.pageIdx,
                    pageSize:self.pageNum
                }
            }).then((res)=>{
                self.flag = true;
                var data = res.data.data.data;
                if(data){
                    for(let i = 0; i < data.length ;i++){
                        if(!data[i].desc){
                            data[i].desc = "-";
                        }
                    }
                    self.tableData = data;
                    self.total = res.data.data.total;
                } 
            })
        },
        //父子通信传值 c=1添加子节点 c=2 添加同级节点 c=4删除节点
        change(a,b,c){
            this.rightMenu = a;
            if(b){
                switch(c){
                    case 1 :
                    this.addName = b;
                    console.log(this.addData);
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
                    //显示修改区域框
                    this.addSon = true;
                    break;
                    case 3:
                    var self = this;
                     if( self.treeData.type == 0){
                        self.addName="修改区域";
                    }
                    else if(self.treeData.type == 1){
                        self.addName="修改社区";
                    }
                    self.$nextTick(()=>{
                        self.mode = 5;
                        self.addSon = true;
                    });
                    break;
                    case 4:
                    var self = this;
                    console.log(self.node);
                     this.$confirm('此操作将永久删除'+b.label, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                                self.axios({
                                method:"delete",
                                url:self.$iHomed("api","change_tree")+b.id,
                            }).then((res)=>{
                                var ret = res.data;
                                console.log(ret);
                                if(ret.code == "0"){
                                    self.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    // self.getTreeData();
                                    self.axios({
                                        method:"get",
                                        url:self.$iHomed("api","get_treeList")+self.node.parent.data.id,
                                    }).then((res)=>{
                                        console.log(res.data);
                                        var ret = res.data.data;
                                        if(ret.children){
                                            self.node.parent.data.children = ret.children;
                                        }
                                        else{
                                            self.node.parent.data.children = [];
                                        }
                                        self.first = ret;
                                    })     
                                }else{
                                    self.$alert(ret.msg);
                                };
                            })            
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
            if(b){
            switch(this.mode){
                //新增区域
                case 1:
                console.log(b);
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
                                self.editTree();
                                self.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.addSon = a;
                            }else{
                                self.$alert(res.data.msg);
                                return ;
                            }
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
                                self.editTree();
                                self.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.addSon = a;
                            } else{
                                self.$alert(res.data.msg);
                                return;
                            };
                        }) 
                break;
                case 5:
                    var putData = {
                        "unitAddress": b.unitAddress,
                        // "code": b.code,
                        "name": b.label,
                        "pid": b.pid,
                        "remark":"",
                        "unit": b.unit,
                        "lat": b.lat,
                        "lng": b.lng,
                        "unitTel": b.unitTel,
                        "zxType": b.zxType,
                        "zxlmxx": b.zxlmxx,
                    };
                    self.axios({
                        method:"put",
                        url:self.$iHomed("api","change_tree")+b.id,
                        data:putData
                        })
                        .then((res)=>{
                            var ret = res.data.data;
                            console.log(res.data);
                            if(ret){
                                self.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.addSon = a;
                                self.getTreeData();
                                // self.editTree();
                                self.first = b;
                            }
                            else{
                                self.$alert(res.data.msg);
                                return false;
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
            self.search_value = "";
            self.blackOutShow = false;
            self.unbindingClick = false;
            e.preventDefault();
            // console.log(e.target);
            $("font").css("color","#000");
            var obj  = e.target ||e.srcElement;
            obj.style.color="#20A0FF";
            this.node = Object.assign({},data);
            if(data.type == 0){
                if(data.id == localStorage.getItem("areaId")){
                    self.first = self.all;
                    self.areaId= self.first.id;
                    self.getTableData();
                    return false;
                }else{
                    self.first =  Object.assign({},data);
                    self.areaId= self.first.id;
                    console.log(self.first);
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
            }else if(data.type == 1){
                this.region = "社区";
                self.first =  Object.assign({},data);
                self.areaId= self.first.id;
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
                    //阻止右键默认事件
                    e.preventDefault();
                    e.stopPropagation();
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
                    self.rightMenu = true;  
                    self.$nextTick(()=>{
                        self.top = e.clientY; 
                        self.left = e.clientX;   
                        self.node = node;
                        self.addData = data;
                        self.parentLabel = node.parent.data.label;
                        self.treeData = Object.assign({},data);
                    }) 
                },
            },
            style:{
                "display":"inline-block",
                "width":"100%",
            }
        }, data.label);
        },
        //选择显示数量
            handleSizeChange(val) {
                //看接口最大能获取多少
            this.pageNum = val;
            if(this.lastData == 1){
                    this.infoImport();
                }else if(this.lastData == 2){
                    this.getTableData();
                }
        },
        //点击第几页
        handleCurrentChange(val) {
            this.pageIdx = val;
            //判断状态看当前是未绑定数据还是已绑定数据
            if(this.lastData == 1){
                    this.infoImport();
                }else if(this.lastData == 2){
                    this.getTableData();
                }
        },
        //多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.selectItem = [];
            for(let i = 0; i < val.length ; i++){
                this.selectItem.push(val[i].id);
            }
            console.log(val);
            //过滤非绑定的数据 绑定不可选
            function filterData(a){
                return a.areaId != null;
            }
            if(val.length >=1 && val.filter(filterData).length == 0){
                this.multi = false;
            }else{
                this.multi = true;
            } 
            if(val.length == 0){
                this.cancelBinding = true;
                this.blackOut = true;

            }else{
                this.cancelBinding = false;
                this.blackOut = false;
            }
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
            //编辑区域
            editTree(){
                var self = this;
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","get_treeList")+self.addData.id,
                }).then((res)=>{
                    res = res.data.data;
                    if(res.children){
                        self.addData.children = res.children;
                    }
                    else{
                        self.$alert("当前无权限访问！");
                    }
                })
            },
            //信息导入
            infoImport(){
                var self = this;
                self.condition = "unbinding";
                self.tableData = [];
                self.lastData = 1;
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","unbinding_monitor"),
                    params:{
                        currentPage:self.pageIdx,
                        pageSize:self.pageNum
                    }
                }).then((res)=>{
                    console.log(res.data);
                    if(res.data.code == 0){
                        self.unbindingClick =true ;
                        if(res.data.data.data != null){
                            for(let i = 0; i < res.data.data.data.length ;i++){
                                if(!res.data.data.data[i].desc){
                                    res.data.data.data[i].desc = "-";
                                }
                                if(!res.data.data.data[i].areaName){
                                    res.data.data.data[i].areaName = "-";
                                }
                            }
                            self.tableData = res.data.data.data;
                            self.total = res.data.data.total;
                        }else{
                            self.$alert("当前不存在未绑定监控！");
                            self.getTableData();
                        }
                    }else{
                            this.$message({
                            type: 'info',
                            message: '同步失败'
                        });
                    }                           
                })
            },
            //黑名单点击之后返回
            returnLast(){
                this.blackOutShow = !this.blackOutShow;
                    //获取未绑定
                if(this.lastData == 1){
                    this.infoImport();
                }else if(this.lastData == 2){
                    this.getTableData();
                }
            },
            //拉黑
            toBlack(){
                var self = this;
                self.$confirm('是否将选中的未绑定监控拉进黑名单', ' ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(() => {
                    //同步信息代码
                    self.tableData = [];
                    self.axios({
                    url:self.$iHomed("api","to_black"),
                    method:"post",
                    data:{
                        "defriend": true,
                        ids:this.selectItem
                    }
                    }).then((res)=>{
                        console.log(res);
                        if(res.data.code == 0){
                            self.$alert("拉黑成功！");
                        }
                        self.infoImport();
                    })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步操作'
                    });          
                });
                    
            },
            //同步信息
            monitorImport(){
                var self = this;
                this.$confirm('是否开始从监控系统导入监控', ' ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    }).then(() => {
                    //同步信息代码
                    self.tableData = [];
                    self.axios({
                        method:"get",
                        url:self.$iHomed("api","import_monitor"),
                        params:{
                            accesstoken:0
                        }
                    }).then((res)=>{
                        console.log(res.data);  
                        if(res.data.code != 0){
                                this.$message({
                                type: 'info',
                                message: '导入失败'
                            });  
                            self.infoImport();
                        }else{
                            this.$message({
                                type: 'success',
                                message: '同步成功！'
                            });
                            self.infoImport();
                        }  
                    })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步操作'
                    });          
                });
            },
            //绑定区域
            bindingData(){
                this.binding = true;
                this.width = false;
                this.province = "";
                this.city = "";
                this.county = "";
                this.countySide = "";
            },
            //取消绑定
            cancelSelect(){
                var self = this;
                self.$confirm('此操作取消绑定，确认继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        self.axios({
                            url:self.$iHomed("api","unbinding_monitor"),
                            method:"post",
                            data:{
                                ids:this.selectItem
                            }
                        }).then((res)=>{
                            console.log(res);
                            if(res.data.code == 0){
                                self.$alert("取消绑定成功！");
                            }
                            self.getTableData();
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            //点击黑名单
            blackData(){
                var self = this;
                self.blackClick = 3;
                self.blackOutShow = true;
                self.tableData = [];
                self.condition = "blacklist";
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","to_black"),
                    params:{
                        currentPage:self.pageIdx,
                        pageSize:self.pageNum
                    }
                }).then((res)=>{
                    if(res.data.code == 0){
                        console.log(res.data.data);
                        for(let i = 0; i < res.data.data.data.length ;i++){
                                if(!res.data.data.data[i].desc){
                                    res.data.data.data[i].desc = "-";
                                }
                                if(!res.data.data.data[i].areaName){
                                    res.data.data.data[i].areaName = "-";
                                }
                            }
                        res = res.data.data;
                        self.tableData = res.data;
                        self.total = res.total;
                    }
                })
            },
            //取消拉黑
            cancelBlack(){
                var self = this;
                self.$confirm('此操作讲选中数据解除黑名单，确认继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        self.axios({
                            url:self.$iHomed("api","to_black"),
                            method:"post",
                            data:{
                                "defriend": false,
                                ids:this.selectItem
                            }
                        }).then((res)=>{
                            console.log(res);
                            if(res.data.code == 0){
                                self.$alert("解除黑名单成功！");
                            }
                            self.blackData();
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                    });
            },
            //绑定区域确认
            quyuConfirm(){
                var self = this;
                this.binding = false;
                if(self.countySide && !isNaN(Number(self.countySide))){
                    self.selectId = self.countySide;
                }else if(self.county && !isNaN(Number(self.county))){
                    self.selectId = self.county;
                }else if(self.city && !isNaN(Number(self.city))){
                    self.selectId = self.city;
                }
                else if( self.province &&!isNaN(Number(self.province))){
                    self.selectId = self.province;
                }
                self.axios({
                    url:self.$iHomed("api","binding_monitor"),
                    method:"post",
                    data:{
                        areaId:self.selectId,
                        ids:this.selectItem
                    }
                }).then((res)=>{
                    console.log(res);
                    if(res.data.code == 0){
                        self.$alert("绑定成功！");
                    }
                    self.first.id = localStorage.getItem("areaId");
                    self.getTableData();
                })
            },
            quyuCancel(){
                this.province = "";
                this.city = "";
                this.county = "";
                this.countySide = "";
                this.binding = false;
            },
            getProv(){
                var self = this;
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","get_treeList")+localStorage.getItem("areaId"),
                }).then((res)=>{
                    res = res.data.data;
                    self.root = res.id;
                    if(res.children){
                        self.provinceOptions = [{
                            label:"下级区域",
                            options:res.children
                        }];
                    }
                    self.provinceOptions.unshift({
                        label:"跟区域",
                        options:[{
                            id:res.id,
                            label:res.label,
                            fid:res.fid
                        }]
                    })
                })
            },
            provinceChange(val){
            //val 为id
                var self = this;
                self.width= true;
                //遍历下级区域
                if(self.provinceOptions[1]){
                    for(let i = 0;i< self.provinceOptions[1].options.length;i++){
                        if(self.provinceOptions[1].options[i].id == val){
                            //不是省的情况
                            if(self.provinceOptions[1].options[i].fid != 1){
                                this.quan = false;
                                this.guests = [{
                                    value:10,
                                    label:"普通管理员"
                                },    
                                {
                                    value:50,
                                    label:"高级管理员"
                                }];
                            }
                        }
                    }   
                    if(val == this.provinceOptions[0].options[0].id){
                        if(this.provinceOptions[0].options[0].fid == 1){
                            this.width  = false;
                        }
                    }
                }
                 //val为id继续
                if(!isNaN(Number(val))){
                    if(self.flag1){
                        self.city = "";
                    }
                    self.flag1= true;
                    self.cityOptions = [];
                    self.axios({
                        method:"get",
                        url:self.$iHomed("api","get_treeList")+val,
                    }).then((res)=>{
                        res = res.data.data;
                        console.log(res);
                        self.cityOptions = res.children;
                    })    
                }      
            },
            cityChange(val){
                //val 为id
                var self = this;
                if(!isNaN(Number(val))){
                    if(self.flag2){
                        self.county = "";
                    }
                    self.flag2= true;
                    self.countyOptions = [];
                    self.axios({
                        method:"get",
                        url:self.$iHomed("api","get_treeList")+val,
                    }).then((res)=>{
                        res = res.data.data;
                        if(res.children.length > 0){
                            self.countyOptions = res.children;
                            console.log(self.countyOptions );
                        }
                    })   
                } 
            },
            countyChange(val){
            //val 为id
                var self = this;
                if(!isNaN(Number(val))){
                    if(self.flag3){
                        self.countySide = "";
                    }
                    self.flag3= true;
                    self.countySideOptions = [];
                    self.axios({
                        method:"get",
                        url:self.$iHomed("api","get_treeList")+val,
                    }).then((res)=>{
                        res = res.data.data;
                        console.log("county");
                        console.log(res);
                        if(res.children.length > 0){
                            self.countySideOptions = res.children;
                        }
                    })  
                }  
            },
            //表双击可编辑
            handleEdit:function(row){
                //遍历数组改变editeFlag
                console.log(row);
                this.editeFlag = false;
            },
            //搜索监控
            search(){
                var self = this;
                self.pageIdx = 1;
                if(self.search_value){
                    self.tableData = [];
                    self.axios({
                        method:"get",
                        url:self.$iHomed("api","monitor_search"),
                        params:{
                            currentPage:self.pageIdx,
                            pageSize:self.pageNum,
                            search:self.search_value,
                            condition:self.condition
                        }
                    }).then((res)=>{
                        console.log(res.data);
                        if(res.data.code == 0){
                            if(res.data.data.total >0){
                                self.tableData = res.data.data.data;
                                self.total = res.data.data.total;
                            }else{
                                self.tableData = [];
                                self.total = 0;
                            }
                            this.$message({
                                type: 'success',
                                message: '查询成功！'
                            });
                        }                           
                    })
                }
            },
            //重置按钮
            reset(){
                this.search_value = "";
                this.pageIdx = 1;
                this.first.id = localStorage.getItem("areaId");
                this.getTableData();
            }
        },
        components:{
            "right-menu":RightMenu,
            "add-dialog":AddDialog,
            //重新封装el-tree
            "my-tree":Tree,
            "monitor-info":monitorInfo
        }
      }
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
        margin:24px 0;
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
        font-size:13px;
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
        height:36px;
        margin-left:12px;
    }
    .el-button:first-child{
        margin-left:0;
    }
    .bindingdialog{
        position:fixed;
        top:50%;
        left:50%;
        z-index:999;
    }
    .binding{
        position:absolute;
        top:-90px;
        left:-200px;
        width:400px;
        height:180px;
        background:#fff;
        z-index:99;
    }
    .name{
        width:100%;
        height:40px;
        margin-bottom:24px;
        line-height:40px;
        text-align:left;
        padding-left:16px;
        background:#20A0FF;
        color:#fff;

    }
    .allWidth{
       width:96%;
       margin-left:5px;

    }
    .halfWidth{
        width:22%;
        margin-left:2px;
    }
    .button{
        text-align:right;
        margin:24px;
    }
    .button .el-button{
        margin-left:12px;
    }
</style>