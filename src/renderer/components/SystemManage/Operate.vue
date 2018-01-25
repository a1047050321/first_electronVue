<template>
    <div>
    <div class="nav-wrapper">
			<!-- 面包屑导航路径 -->
			<el-breadcrumb separator=">">
                <el-breadcrumb-item>系统管理 </el-breadcrumb-item>
			    <el-breadcrumb-item>操作记录</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
        <div class="search-bar">
            <div class="search-box">
                <span style="margin-right:8px;">操作人：</span><el-input v-model="searcher"  size="medium" style="width:164px;" @keyup.enter.native="search"></el-input>
                <div class="searchButton">
                    <el-date-picker
                    v-model="value1"
                    id="time1"
                    size="medium"
                    type="datetime"
                    style="margin-right:4px;
                    width:164px;"
                    placeholder="选择日期时间">
                    </el-date-picker>
                    -
                    <el-date-picker
                    v-model="value2"
                    size="medium"
                    id="time2"
                    style="margin-left:4px;
                    width:164px;"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
                <div style="float:right;margin-left:4px;">
                    <el-button type="primary" @click="search" >查找</el-button>
                    <el-button @click="reset">重置</el-button>
                </div> 
            </div>
        </div>
    </div>
    <el-table ref="multipleTable"  
        height="42px" 
        highlight-current-row
        size="mini" 
        :data="tableData">
        <el-table-column label="序号" width="80" show-overflow-tooltip type="index">
        </el-table-column>
        <el-table-column prop="createBy" show-overflow-tooltip label="操作人">
        </el-table-column>
        <el-table-column prop="operationName" show-overflow-tooltip label="操作名称" >
        </el-table-column>
        <el-table-column prop="operationType" show-overflow-tooltip label="操作属性" >
        </el-table-column>
        <el-table-column prop="createDate" show-overflow-tooltip label="操作时间">
        </el-table-column>   
        <el-table-column prop="result" show-overflow-tooltip label="操作结果">
        </el-table-column>
    </el-table>
    <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page ="pageidx"
        :page-sizes="[20,50,100, 200, 300]"
        :page-size="pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>    
    <monitor-info :alarmType="alarmType" :configData="configData" :current="1"></monitor-info>
</div>
</template>
<script>
    import axios from 'axios'
    import MonitorInfo from "./../BMap/MonitorInfo.vue"
    export default{
        props:["alarmType","configData"],
        data(){
            return {
                alert: true,
                input: '',
                total:1,
                pageidx:1,
                pagenum:20,
                tableData: [],
                multipleSelection: [],
                value1:"",
                value2:"",
                searcher:"",
                endTime:"",
                startTime:"",
                clickSearch:false,

            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            //获取数据
            getData(){
                var self = this;
                // self.pageIdx =1;
                var url = this.$iHomed("api", "opeator_log");
                var table= {};
                self.tableData = [];
                if(self.value1){
                  self.startTime= self.dateTranslate(self.value1);
                }
                if(self.value2){
                  self.endTime = self.dateTranslate(self.value2);
                }
                self.axios.get(url,{
                    params:{
                         currentPage:self.pageidx,
                         pageSize:self.pagenum,
                         search:this.clickSearch?self.searcher:"",
                         endTime:this.clickSearch?self.endTime:"",
                         beginTime:this.clickSearch?self.startTime:"",
                    }
                }).then(function(res){
                    var datalist = res.data.data;
                    self.total = Number(datalist.total);
                    self.tableData = datalist.data;
                })
            },
             //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                console.log(`每页 ${val} 条`);
                this.pagenum = val;
                this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                this.pageidx = val;
                this.getData();
            },
            //多选框
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search(){
                this.clickSearch = true;
                this.pageidx = 1;
                this.getData();
            },
            reset(){
                this.pageidx = 1;
                this.searcher = "";
                this.value1 = "";
                this.startTime = "";
                this.value2 = "";
                this.endTime = "";
                this.getData();
                this.clickSearch = false;
            }
        },
        components:{
            "monitor-info": MonitorInfo
        }
    }
</script>
<style lang="" scoped>
    .search-box{
        margin-top:24px;
    }
    .el-input{
        width:200px;
    }
    .el-table{
        position:absolute;
        top:148px;
        bottom:140px;
        width:100%;
        border:1px solid #dfe6ec;
        border-bottom:none;
    }
    .el-button{
        width:90px;
        height:36px;
        margin-left:12px;
    }
    .searchButton{
        position:fixed;
        top:88px;
        right:24px;
    }
    .el-table th.gutter{
        width:0;
        height:0;
    }
</style>