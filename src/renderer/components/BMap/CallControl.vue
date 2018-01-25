<template>
<div>
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/callManage'}">报警管理 </el-breadcrumb-item>
            <el-breadcrumb-item>报警控制</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="buttonAll">
        <el-button type="primary" @click="getData" :disabled="role" style="margin-left:0;">刷新</el-button>
        <el-button type="primary" @click="newType" :disabled="role">新增</el-button>
        <el-button type="primary" :disabled="multi" @click="editType">修改</el-button>
        <el-button type="primary" :disabled="del" @click="deleteType">删除</el-button>
    </div>
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
            type="index"
            label="序号"
            width="83">
            </el-table-column>
            <el-table-column
            property="code"
            show-overflow-tooltip
            label="报警类型编号"
            >
            </el-table-column>
            <el-table-column
            property="name"
            show-overflow-tooltip
            label="报警类型"
            >
            </el-table-column>
            <el-table-column
            property="reportTime"
            show-overflow-tooltip
            
            label="自动上报时间(s)">
            </el-table-column>
        </el-table>
    <add-callType v-if="addType" :mode="mode" @editType="editInfo"  @addType="typeChange" :multipleSelection="multiple"></add-callType>
    <monitor-info :alarmType="alarmType" :configData="configData" :current="1"></monitor-info>
</div>
</template>
<script>
import AddCallType from './AddCallType'
import MonitorInfo from "./MonitorInfo"
    export default{
        props:['configData'],
        data(){
            return {
                tableData:[],
                addType:false,
                multi:true,
                del:true,
                multipleSelection: [],
                mode:1,
                page:1,
                pagenum:10,
                multiple:"",
                alarmType:[],
                showType:{},
                role:false,
                moniInfoShow:true
            }
        },
        methods:{
            //获取数据并处理
            getData(){
                var self = this;
                self.tableData = [];
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","alarmType_list"),
                    data:{
                        currentPage:self.page,
                        pageSize:self.pagenum
                    }
                })
                .then((res)=>{
                    res = res.data.data;
                    // console.log(res.data);
                    for(let i = 0;i<res.data.length;i++){
                        if(res.data[i].repeat){
                            res.data[i].repeat = "true";
                            res.data[i].repeatTrans = "是";
                            res.data[i].internalTime = Number(res.data[i].intervalTime);
                        }
                        else{
                            res.data[i].repeat = "false";
                            res.data[i].repeatTrans = "否";
                            res.data[i].internalTime = "-";
                        }
                        self.tableData.push(res.data[i]);
                        self.alarmType[i] ={
                            value:res.data[i].id,
                            label:res.data[i].name,
                            text:res.data[i].name
                        }
                        self.showType[res.data[i].id] = res.data[i].name;
                    }
                    self.$emit("callType",self.showType , self.alarmType);
                    
                })
            },
             //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                this.maxResult = val;
                this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                this.page = val;
                // this.getData();
            },
            //多选框
             handleSelectionChange(val) {
                this.multipleSelection = val;
                 var username = localStorage.getItem("username");
                if(username == "admin"){
                    if(this.multipleSelection.length == 1){
                        if(this.multipleSelection[0].code == "000"){
                            this.del = true;
                        }else{
                            this.del = false;
                        }
                        this.multi = false;
                    }else{
                        this.multi = true;
                    };
                    if(this.multipleSelection.length >= 1){
                        function filter(a){
                            return a.code == "000";
                        }
                        if(this.multipleSelection.filter(filter).length == 1){
                            this.del = true;
                        }else{
                            this.del = false;
                        }
                    }
                    else{
                        this.del = true;
                    }
                }
             },
             newType(){
                 this.addType = true;
                 this.mode = 1;
             },
             typeChange(a){
                 this.addType = a;
             },
             //修改确认
             editInfo(a){
                 var self = this;
                 //修改报警类型
                 if(self.mode == 4){
                    //  console.log(a);
                     self.axios({
                        method:"put",
                        data:{
                            "code": a.code,
                            "name": a.name,
                            "repeat": a.repeat,
                            "reportTime":a.reportTime,
                            "tipText": a.tipText,
                            "intervalTime": a.intervalTime,
                        },
                        url:self.$iHomed("api","edit_type")+a.id
                     })
                        .then((res)=>{
                            // console.log(res);
                            var ret = res.data.data;
                            if(ret){
                                self.addType = false;
                                self.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                               self.getData();
                            }
                            else{
                                self.alert(res.data.msg);
                            };
                        })   
                //新增    
                }else if(self.mode == 1){
                    self.axios({
                        method:"post",
                        data:a,
                        url:self.$iHomed("api","add_type")
                        }).then((res)=>{
                        // console.log(res);
                            var ret = res.data.data;
                        if(ret){
                            self.addType = false;
                            self.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                                self.getData();
                        }
                        else{
                            self.$alert(res.data.msg);
                        };
                    })         
                }
            },
             //删除报警类型
            deleteType(){
                var self = this;
                self.$confirm('确定删除选中报警类型信息吗', ' ', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    //同步信息代码
                    var arr = [];
                    for(let i = 0;i < self.multipleSelection.length;i++){
                        arr.push(self.multipleSelection[i].id)
                    }
                    //ajax delete
                    self.axios({
                        method:"delete",
                        url:self.$iHomed("api","add_type"),
                        data:{                                  
                        "intIds": arr,
                        }
                    }).then((res)=>{
                        if(res.data.code == 0){
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }else{
                            self.$alert(res.data.msg);
                        }
                        self.getData();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步操作'
                    });          
                });  
            },
            //修改报警类型
            editType(){
                var self = this;
                self.mode = 4;
                self.addType = true;
                self.multiple = Object.assign({}, self.multipleSelection[0]);
            }
        },
        mounted(){
            var username = localStorage.getItem("username");
                if(username != "admin"){
                    this.role = true;
                    this.multi = true;
                    this.del = true;
                }else{
                    this.role = false;
                }
            this.getData();
        },
        components:{
            "add-callType":AddCallType,
            "monitor-info":MonitorInfo
        }
    }
</script>
<style scoped>
    .el-table{
        position:absolute;
        top:148px;
        bottom:84px;
        font-size:12px;
        width:100%;
        border:1px solid #dfe6ec;
        border-bottom:none;
        overflow-x:hidden;
    }
    table th,table td{
        height:42px;
    }
    .el-button{
        width:90px;
        height:36px;
        margin-top:24px;
        margin-left:12px;
    }
</style>