<template>
<div>
<div class="mask"></div>
    <div class="content">
        <div class="addCallType" v-if="mode==1">
                <div class="title"  v-if="mode==1">新增报警类型</div>
            <div class="content-box1">
                <div><span class="icon-must"></span>报警类型编号</div>
                <el-input v-model="newArea.code" autofocus ref="code"></el-input>
            </div>
            <div class="content-box1">
                <div><span class="icon-must"></span>报警类型</div>
                <el-input v-model="newArea.name" ref="name"></el-input>
            </div>
            <div class="content-box1">
                <div><span class="icon-must"></span>自动上报时间<span style="font-size:12px;color:red;">(单位：秒/S)</span></div>
                <el-input v-model="newArea.reportTime" ref="reportTime"></el-input>
            </div>
        </div>
        <div class="addCallType" v-if="mode==4">
            <div class="title"  v-if="mode==4">修 改报警类型</div>
            <div class="content-box1">
                <div>报警类型编号</div>
                <el-input v-model="multipleSelection.code" disabled></el-input>
            </div>
            <div class="content-box1">
                <div>报警类型</div>
                <el-input v-model="multipleSelection.name" ref="name" autofocus></el-input>
            </div>
            <div class="content-box1">
                <div>自动上报时间<span style="font-size:12px;color:red;">(单位：秒/S)</span></div>
                <el-input v-model="multipleSelection.reportTime" ref="reportTime"></el-input>
            </div>
        </div>
        <div class="addCallType" v-if="mode==2 &&!multipleSelection">
            <div class="title">新增消息</div>
            <div class="content-box1">
                <div><span class="icon-must"></span>信息</div>
                <el-input type="textarea" style="width:100%;" autofocus ref="content" v-model="newInfo.content" placeholder="消息内容"></el-input>
            </div>
            <!-- <div class="content-box1">
                <div><span class="icon-must"></span>操作人</div>
                <el-input type="input" style="width:100%;" v-model="newInfo.username" disabled></el-input>
            </div> -->
            <div class="content-box1">
                <div><span class="icon-must"></span>接受区域</div>
                <el-select v-model="province" placeholder="选择区域"  filterable @change="provinceChange" :class="{allWidth:!width,halfWidth:width}">
                    <el-option-group
                        v-for="group in provinceOptions"
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
                <el-select v-model="city" placeholder="请选择" @change="cityChange" filterable class="halfWidth" style="margin-left:10px;" v-if=" width && cityOptions.length != 0">
                    <el-option
                        v-for="item in cityOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="county" placeholder="请选择"  @change="countyChange" filterable class="halfWidth" style="margin-left:10px;" v-if="width && countyOptions.length != 0">
                    <el-option
                        v-for="item in countyOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="countySide" placeholder="请选择" filterable class="halfWidth" style="margin-left:10px;" v-if="width && countySideOptions.length != 0">
                    <el-option
                        v-for="item in countySideOptions"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="content-box1">
                <div><span class="icon-must"></span>接收方式</div>
                <el-select v-model="newInfo.receives" multiple ref="receives" placeholder="选择接受方式" style="width:100%;">
                    <el-option
                        v-for="item in optionMethods"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>        
            </div>
            <div class="content-box1">
                <div><span class="icon-must"></span>发布时间</div>
                    <el-date-picker
                    v-model="newInfo.publishTime"
                    ref="publishTime"
                    type="datetime"
                    width="100%"
                    :default-value="new Date()"
                    placeholder="选择日期时间">
                    </el-date-picker>
            </div>
        </div>
            <div class="button" style="text-align:right;margin:24px;">
                <el-button  @click="cancel">取消</el-button>
                <el-button type="primary" @click="ok" :disabled="notChange">确定</el-button>
            </div>
</div>
</div>
</template>
<script>
    export default {
        props: ["mode", "multipleSelection"],
        data() {
            return {
                newInfo: {
                    content: "",
                    areaName: "",
                    receives: [],
                    publishTime: "",
                    username: ""
                },
                value: "",
                newArea: {
                    code: "",
                    name: "",
                    reportTime: "",
                },
                optionMethods: [{
                    value: '1',
                    label: '机顶盒'
                }, {
                    value: '2',
                    label: '短信'
                }, {

                    value: '3',
                    label: 'APP'
                }],
                options: [{
                    value: 'true',
                    label: '是'
                }, {
                    value: 'false',
                    label: '否'
                }],
                province: "",
                city: "",
                county: "",
                countySide: "",
                provinceOptions: [],
                cityOptions: [],
                countyOptions: [],
                countySideOptions: [],
                root: "",
                width: false,
                repeatFlag: false,
                confirmBtn: true,
                notChange: true
            }
        },
        watch: {
            province(province) {
                // if(isNaN(Number(province))){
                this.provinceChange(province);
                //如果city存在province不是整个长度
                if (this.city) {
                    this.width = true;
                } else {
                    this.width = false;
                }
                if (!province) {
                    this.width = false;
                } else {
                    if (this.multipleSelection && province == this.multipleSelection.areaName) {
                        this.width = false;
                    } else if (province == localStorage.getItem("areaId")) {
                        this.width = false;
                        console.log(this.guests);
                    } else {
                        this.width = true;
                    }
                    // }
                }
            },
            newArea: {
                handler(newValue, oldValue) {
                    this.notChange = false;
                    console.log(newValue);　　　　　　
                    if (newValue.repeat == "false") {
                        this.repeatFlag = true;
                    } else {
                        this.repeatFlag = false;
                    }
                },
                　　deep: true
            },
            newInfo: {
                handler(newValue, oldValue) {
                    this.notChange = false;
                },
                　　deep: true
            },
            multipleSelection: {
                handler(newValue, oldValue) {
                    this.notChange = false;
                    this.confirmBtn = false;　　　　　　
                    if (newValue.repeat == "false") {
                        this.repeatFlag = true;
                    } else {
                        this.repeatFlag = false;
                    }
                },
                　　deep: true
            }
        },
        mounted() {
            if (this.mode != 4) {
                this.confirmBtn = false;
            } else {
                this.confirmBtn = true;
            }
            this.getProv();
            this.newInfo.username = localStorage.getItem("username");
            if (this.multipleSelection) {
                if (this.multipleSelection.repeat == "false") {
                    this.repeatFlag = true;
                } else {
                    this.repeatFlag = false;
                }
            }
        },
        methods: {
            ok() {
                var self = this;
                var month = "";
                var day = "";
                //修改报警类型
                if (self.mode == 4) {
                    self.$emit("editType", self.multipleSelection);
                }
                //新增报警类型
                else if (self.mode == 1) {
                    console.log(self.newArea);
                    if (!self.newArea.code || !self.newArea.code || !self.newArea.reportTime) {
                        self.$alert("请补充信息");
                        for (let p in self.newArea) {
                            if (!self.newArea[p]) {
                                self.$refs[p].$el.childNodes[1].style.border = "1px solid red";
                            }
                        }
                        return false;
                    }
                    self.$emit("editType", self.newArea);
                    // self.newArea = {
                    //     code:"",
                    //     name:"",
                    //     reportTime:"",
                    //     repeat:"",
                    //     tipText:"",
                    //     intervalTime:null,
                    // };
                }
                //新增通知消息
                else if (self.mode == 2) {
                    if (self.countySide) {
                        self.newInfo.areaId = self.countySide;
                    } else if (self.county) {
                        self.newInfo.areaId = self.county;
                    } else if (self.city) {
                        self.newInfo.areaId = self.city;
                    } else if (self.province) {
                        self.newInfo.areaId = self.province;
                    }
                    if (!self.newInfo.areaId || !self.newInfo.content || !self.newInfo.publishTime ||
                        !self.newInfo.receives) {
                        self.$alert("请补充信息");
                        return;
                    }
                    self.newInfo.publishTime = self.dateTranslate(self.newInfo.publishTime);
                    self.$emit("newInfo", self.newInfo);
                }
            },
            cancel() {
                var self = this;
                self.newArea = {
                    code: "",
                    name: "",
                    reportTime: "",
                };
                self.$emit("addType", self.addType);
            },
            getProv() {
                var self = this;
                self.axios({
                    method: "get",
                    url: self.$iHomed("api", "get_treeList") + localStorage.getItem("areaId"),
                }).then((res) => {
                    res = res.data.data;
                    console.log(res.children);
                    self.root = res.id;
                    self.provinceOptions = [{
                        label: "下级区域",
                        options: res.children
                    }];
                    self.provinceOptions.unshift({
                        label: "根区域",
                        options: [{
                            id: res.id,
                            label: res.label
                        }]
                    })
                })
            },
            provinceChange(val) {
                //val 为id
                var self = this;
                self.city = "";
                self.cityOptions = [];
                if (!isNaN(Number(val))) {
                    self.axios({
                        method: "get",
                        url: self.$iHomed("api", "get_treeList") + val,
                    }).then((res) => {
                        res = res.data.data;
                        self.cityOptions = res.children;
                    })
                }
            },
            cityChange(val) {
                //val 为id
                var self = this;
                self.county = "";
                self.countyOptions = [];
                self.axios({
                    method: "get",
                    url: self.$iHomed("api", "get_treeList") + val,
                }).then((res) => {
                    res = res.data.data;
                    if (res.children.length > 0) {
                        self.countyOptions = res.children;
                    }
                })
            },
            countyChange(val) {
                //val 为id
                var self = this;
                self.countySide = "";
                self.countySideOptions = [];
                self.axios({
                    method: "get",
                    url: self.$iHomed("api", "get_treeList") + val,
                }).then((res) => {
                    res = res.data.data;
                    if (res.children.length > 0) {
                        self.countySideOptions = res.children;
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding-left: 16px;
        margin: 0;
        background: #20A0FF;
        color: #fff;
    }
    
    .content {
        position: fixed;
        top: 64px;
        left: 35%;
        width: 30%;
        height: 506px;
        background: #fff;
        z-index: 99;
        opacity: 1;
        overflow: hidden;
    }
    
    .addCallType {
        width: 100%;
        height: 438px;
        background: #fff;
        z-index: 99;
        opacity: 1;
    }
    
    .content-box1 {
        margin: 0 24px;
        height: 62px;
    }
    
    .content-box1 div:not(.halfWidth) {
        font-size: 12px;
    }
    
    .content-box1 div:first-child {
        margin-top: 16px;
        margin-bottom: 8px;
    }
    
    .el-input {
        width: 100%;
        height: 40px;
        -webkit-appearance: none;
    }
    
    .mask {
        position: absolute;
        top: 0;
        bottom: 84px;
        left: -264px;
        right: 0;
        background: #000;
        opacity: 0.3;
        z-index: 98;
    }
    
    .el-date-editor.el-input.el-date-editor--datetime {
        margin-left: 0;
        width: 100%;
    }
    
    .el-button {
        width: 88px;
        height: 28px;
        line-height: 5px;
    }
    
    .allWidth {
        width: 100%;
    }
    
    .halfWidth {
        width: 21.5%;
    }
</style>