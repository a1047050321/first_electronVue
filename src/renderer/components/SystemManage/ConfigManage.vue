<template>
    <div>
        <div class="nav-wrapper">
            <!-- 面包屑导航路径 -->
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>系统管理 </el-breadcrumb-item>
                <el-breadcrumb-item>配置管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-light">
                            <span>后台配置信息</span>
                            <el-button @click="changeData1" v-if="data1Show">修改</el-button>
                            <el-button @click="saveData1" v-else>保存</el-button>
                        </div>
                    </el-col>
                    <div v-for="item in data1" class="content_box">
                        <el-col :span="8">
                            <div class="grid-content">
                                <div>{{item.name}}</div>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content">
                                <div v-if="data1Show && item.fieldName!='alarmTimeInterval'">{{item.value}}</div>
                                <div v-if="data1Show &&item.fieldName=='alarmTimeInterval'" :title="'大于0表示任意类型报警成功后'+item.value+'秒内不可再进行任何类型的报警，0表示无限制'">{{item.value}}</div>
                                <div v-if="!data1Show"><el-input v-model="item.value" size="small" @change="dataChange(1)"></el-input></div>
                            </div>
                        </el-col>
                    </div>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-light">
                            <span>PC页面配置</span>
                            <el-button @click="changeData2" v-if="data2Show">修改</el-button>
                            <el-button @click="saveData2" v-else>保存</el-button>
                        </div>
                    </el-col>
                    <div v-for="item in data2" class="content_box">
                        <el-col :span="8">
                            <div class="grid-content">
                                <div>{{item.name}}</div>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content">
                                <div v-if="data2Show">{{item.value}}</div>
                                <div v-else><el-input v-model="item.value" size="small" @change="dataChange(2)"></el-input></div>
                            </div>
                        </el-col>
                    </div>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple-light">
                            <span>公共配置</span>
                            <el-button @click="changeData3" v-if="data3Show">修改</el-button>
                            <el-button @click="saveData3" v-else>保存</el-button>
                        </div>
                    </el-col>
                    <div v-for="item in data3" class="content_box">
                        <el-col :span="8">
                            <div class="grid-content">
                                <div>{{item.name}}</div>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content">
                                <div v-if="data3Show && item.fieldName!='handleTimeout'">{{item.value}}</div>
                                <div v-if="data3Show && item.fieldName=='handleTimeout'" :title="'报警进入处理状态'+item.value+'秒后仍然没有实质性操作自动解除处理状态'">{{item.value}}</div>
                                <div v-if="!data3Show"><el-input v-model="item.value" size="small" @change="dataChange(3)"></el-input></div>
                            </div>
                        </el-col>
                    </div>
                </el-row>

            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                data1: [],
                data2: [],
                data3: [],
                data1Show: true,
                data2Show: true,
                data3Show: true,
                changeData: {},
                flag:null,
            }
        },
        mounted() {
            this.getData1();
            this.getData2();
            this.getData3();
        },
        watch: {
            data3: {　　　　
                handler(newValue, oldValue) {
                    this.changeData = {};
                    if(oldValue.length != 0){
                        for (let p in newValue) {
                            if(!newValue[p].value && newValue[p].value != "0"){
                            return false;
                        }else if(newValue[p].value <0){
                            // this.$alert(newValue[p].name+"不能为负数");
                            return false;
                        }
                            this.changeData[newValue[p].fieldName] = newValue[p].value;
                        }
                    }
                },
                deep: true
            },
            // changeData:{
            //    handler(newValue, oldValue) {
            //        if(newValue.areaLongitudeAndLatitudeDvalue && newValue.alarmTimeInterval){
            //             if(isNaN(Number(newValue.areaLongitudeAndLatitudeDvalue))){
            //                 this.$alert("添加村/社区时经纬度与上级区域经纬度的差值范围必须是数字");
            //                 return false;
            //             }else if(isNaN(Number(newValue.alarmTimeInterval))){
            //                 console.log(isNaN(Number(newValue.alarmTimeInterval)));
            //                 console.log(newValue);
            //                 this.$alert("报警时间间隔必须是数字");
            //                 return false;
            //             }
            //        }
            //    },
            //    deep:true
            // }
        },
        methods: {
            //获取配置数据
            getData1() {
                this.axios({
                    method: "get",
                    url: this.$iHomed("api", "get_system")
                }).then((res) => {
                    this.data1 = res.data.data;
                })
            },
            getData2() {
                this.axios({
                    method: "get",
                    url: this.$iHomed("api", "get_webApp")
                }).then((res) => {
                    this.data2 = res.data.data;
                })
            },
            getData3() {
                this.axios({
                    method: "get",
                    url: this.$iHomed("api", "get_common")
                }).then((res) => {
                    this.data3 = res.data.data;
                })
            },
            dataChange(a){
                this.flag = a;
            },
            changeData1() {
                this.data1Show = false;
            },
            changeData2() {
                this.data2Show = !this.data2Show;
            },
            changeData3() {
                this.data3Show = !this.data3Show;
            },
            saveData1() {
                this.changeData = {};
                console.log(this.data1);
                var arr = [];
                for(let p in this.data1){
                    if(!this.data1[p].value && this.data1[p].value != "0"){
                        arr.push(this.data1[p].name);
                    }
                }
                if(arr.length != 0){
                    this.$alert(arr.join("，")+"不能为空");
                    return false;
                }else{
                    arr = [];
                    for(let p in this.data1){
                        if((this.data1[p].fieldName == "areaLongitudeAndLatitudeDvalue" &&
                        isNaN(Number(this.data1[p].value))) ||(this.data1[p].fieldName == "alarmTimeInterval" &&
                        isNaN(Number(this.data1[p].value)))){
                            arr.push(this.data1[p].name);
                        }
                        this.changeData[this.data1[p].fieldName] = this.data1[p].value;
                    }
                    if(arr.length != 0){
                        this.$alert(arr.join("，")+"必须为数字");
                        return false;
                    }
                }
                console.log(this.changeData);
                this.data1Show = true;
                if(this.flag == 1){
                    this.axios({
                        method: "put",
                        url: this.$iHomed("api", "get_system"),
                        data: this.changeData
                    }).then((res) => {
                        console.log(res.data);
                        if (res.data.code == 0) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.getData1();
                        } else {
                            this.$alert(res.data.msg);
                            this.getData1();
                        }
                    })
                    this.flag = null;
                }
            },
            saveData2() {
                this.changeData = {};
                var arr = [];
                for(let p in this.data2){
                    if(!this.data2[p].value && this.data2[p].value != "0"){
                        arr.push(this.data2[p].name);
                    }
                }
                if(arr.length != 0){
                    this.$alert(arr.join("，")+"不能为空");
                    return false;
                }else{
                    arr = [];
                    for(let p in this.data2){
                        this.changeData[this.data2[p].fieldName] = this.data2[p].value;
                    }
                }
                this.data2Show = !this.data2Show;
                if(this.flag ==2){
                    this.axios({
                        method: "put",
                        url: this.$iHomed("api", "get_webApp"),
                        data: this.changeData
                    }).then((res) => {
                        if (res.data.code == 0) {
                            this.$alert("修改成功，请重新登录");
                            this.$iHomed("logout");
                            return false;
                        } else {
                            this.$message.error(res.data.msg);
                            this.getData2();
                        }
                    })
                    this.flag = null;
                }
            },
            saveData3() {
                this.changeData = {};
                var arr = [];
                for(let p in this.data3){
                    if(!this.data3[p].value && this.data3[p].value != "0"){
                        arr.push(this.data3[p].name);
                    }
                }
                if(arr.length != 0){
                    this.$alert(arr.join("，")+"不能为空");
                    return false;
                }else{
                    arr = [];
                    for(let p in this.data3){
                        if(isNaN(Number(this.data3[p].value))){
                            arr.push(this.data3[p].name);
                        }
                        this.changeData[this.data3[p].fieldName] = this.data3[p].value;
                    }
                    if(arr.length != 0){
                        this.$alert(arr.join("，")+"必须为数字");
                        return false;
                    }
                }
                this.data3Show = !this.data3Show;
                if(this.flag == 3){
                    this.axios({
                        method: "put",
                        url: this.$iHomed("api", "get_common"),
                        data: this.changeData
                    }).then((res) => {
                        console.log(res.data);
                        if (res.data.code == 0) {
                            this.$alert("修改成功，请重新登录");
                            this.$iHomed("logout");
                            return false;
                        } else {
                            this.$message.error(res.data.msg);
                            this.getData3();
                        }
                    })
                    this.flag = null;
                }
            },

        },
    }
</script>
<style scoped>
    .container {
        overflow: hidden;
    }
    
    .content {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 84px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    
    .el-row {
        margin-top: 24px;
    }
    
    .content_box {
        height: 36px;
    }
    
    .content_box:last-child >div div.grid-content {
        border-bottom: 1px solid #dfe6ec;
    }
    
    .el-col {
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        border-top: 1px solid #dfe6ec;
        border-left: 1px solid #dfe6ec;
    }
    
    .el-col:nth-child(2n) {
        border-right: 1px solid #dfe6ec;
    }
    
    .el-col >div {
        padding-left: 16px;
    }
    
    .bg-purple-light {
        background: #e5e9f2;
    }
    
    .el-button {
        width: 74px;
        height: 28px;
        line-height: 5px;
        float: right;
        margin-right: 24px;
        margin-top: 4px;
    }
</style>