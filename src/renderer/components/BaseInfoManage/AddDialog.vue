<template>
<div>
    <div class="mask"></div>
    <div class="content">
        <div class="name">{{addName}}</div>
        <div class="add">
        <!-- 新增区域或社区弹窗公共部分 -->
        <div class="content-box1"  v-if="mode == 1 || mode == 2">
            <div style="margin-top:24px;">上一级区域</div>
            <el-input v-model="parentLabel" disabled></el-input>
        </div>
        <!-- 修改界面上级区域可修改 -->
        <div class="content-box1" v-if="mode ==5">
            <div>上一级区域</div>
            <el-select v-model="province" style="margin-top:10px;margin-bottom:10px;"  placeholder="选择区域"  @change="provinceChange" :class="{allWidth:!width,halfWidth:width}">
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
            <el-select v-model="city" placeholder="请选择" @change="cityChange" filterable class="halfWidth" style="margin-left:10px;" v-if=" width && cityOptions.length !=0">
                <el-option
                    v-for="item in cityOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
             <el-select v-model="county"  @change="countyChange" placeholder="请选择" filterable class="halfWidth" style="margin-left:10px;" v-if="width && countyOptions.length !=0">
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
        <!-- 新增区域-->                <!--新增社区 -->
        <div v-if="mode == 1 || mode == 2" class="flag">
         <div class="content-box1">
            <div><span class="icon-must"></span>名称</div>
            <el-input v-model="addTreeData.name" ref="name" autofocus></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>经度</div>
            <el-input v-model="addTreeData.lng" ref="lng" type="text"></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>纬度</div>
            <el-input v-model="addTreeData.lat" ref="lat" type="text"></el-input>
        </div>
         <div class="content-box1">
            <div><span class="icon-must"></span>管理单位</div>
            <el-input v-model="addTreeData.unit" ref="unit"></el-input>
        </div>
         <div class="content-box1">
            <div><span class="icon-must"></span>单位电话</div>
            <el-input v-model="addTreeData.unitTel" ref="unitTel" type="text"></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>单位地址</div>
            <el-input v-model="addTreeData.unitAddress" ref="unitAddress" type="text"></el-input>
        </div>
        </div>
        <!-- 新增STB 用户-->
        <div v-if="mode == 3" class="flag">
        <div class="content-box1">
            <div>所属社区</div>
            <el-input v-model="treeData.label" disabled></el-input>
        </div>
        <div class="content-box1"> 
            <div><span class="icon-must"></span>姓名</div>
            <el-input v-model="stbUser.name" ref="name" autofocus></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>用户名</div>
            <el-input v-model="stbUser.username" ref="username" ></el-input>
        </div>
         <div class="content-box1">
            <div><span class="icon-must"></span>用户电话</div>
            <el-input  v-model="stbUser.tel"  ref="tel" type="text" ></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>机顶盒智能卡号</div>
            <el-input  v-model="stbUser.terminalId"  ref="terminalId"></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>机顶盒序列号</div>
            <el-input v-model="stbUser.stbId"  ref="stbId"></el-input>
        </div>
         <div class="content-box1">
            <div><span class="icon-must" ></span>地址</div>
            <el-input  v-model="stbUser.address" ref="address"></el-input>
        </div>
        </div>
        <!-- 修改用户信息-->
        <div v-if="mode == 4 && multipleSelection" class="flag">
            <div class="content-box1">
                <div>所属社区</div>
                <el-input v-model="multipleSelection.areaName" disabled></el-input>
            </div>
            <div class="content-box1">
                <div>姓名</div>
                <el-input v-model="multipleSelection.name" disabled></el-input>
            </div>
            <div class="content-box1">
                <div>用户名</div>
                <el-input v-model="multipleSelection.username" disabled></el-input>
            </div>
            <div class="content-box1">
                <div>用户电话</div>
                <el-input  v-model="multipleSelection.tel" type="text" autofocus></el-input>
            </div>
            <div class="content-box1">
                <div>机顶盒智能卡号</div>
                <el-input  v-model="multipleSelection.terminalId"></el-input>
            </div>
             <div class="content-box1">
                <div>机顶盒序列号</div>
                <el-input  v-model="multipleSelection.stbId"></el-input>
            </div>
            <div class="content-box1">
                <div>地址</div>
                <el-input  v-model="multipleSelection.address"></el-input>
            </div>
        </div>
        <!--修改名称-->
         <div v-if="mode ==5">
         <!-- 区域--> <!--社区 --> 
            <div  class="flag">
            <div class="content-box1">
                <div>名称</div>
                <el-input v-model="treeData.label" autofocus></el-input>
            </div>
            <div class="content-box1">
            <div>经度</div>
            <el-input v-model="treeData.lng" type="text"></el-input>
            </div>
            <div class="content-box1">
                <div>纬度</div>
                <el-input v-model="treeData.lat" type="text"></el-input>
            </div>
            <div class="content-box1">
                <div>管理单位</div>
                <el-input v-model="treeData.unit"></el-input>
            </div>
            <div class="content-box1">
                <div>单位电话</div>
                <el-input v-model="treeData.unitTel" type="text" ></el-input>
            </div>
            <div class="content-box1">
                <div>单位地址</div>
                <el-input v-model="treeData.unitAddress" type="text"></el-input>
            </div>
            <!-- 资讯按需加载，无数据不显示 -->
            <div v-if="treeData.fid == 2" class="content-box1">
            <div style="font-size:17px;font-weight:600;">资讯<span style="font-size:12px;color:red">(以下请填写数字)</span>:</div>
                <el-radio class="radio" v-model="radio" label="tv" style="margin-left:30%;">TV端</el-radio>
                <el-radio class="radio" v-model="radio" label="mob" style="margin-left:10%;">手机端</el-radio>
                <div v-if="radio !=''"  class="news">
                    <div v-for = "item in zxlmxx">
                        <div>{{item.name}}</div>
                        <el-input v-model="item.id" @focus="idFocus(item)" @blur="loseFocus(item)"></el-input>
                    </div>
               </div>
            </div>
            </div>
            </div>
        </div>
            <div class="button">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="submit" :disabled="submitDis">确定</el-button>
            </div>
    </div>
</div> 
</template>
<script>
    export default {
        props: ["parentLabel", "parentId", "mode", "addName", "multipleSelection", "treeData"],
        data() {
            return {
                newName: "",
                radio: "",
                //新增区域
                addTreeData: {
                    "name": "",
                    "pid": 0,
                    "type": 0,
                    "unit": "",
                    "unitTel": null,
                    unitAddress: "",
                    lng: null,
                    lat: null
                },
                zxlmxx: [
                    // { name: "安全知识", id: null, child: []},
                    // { name: "三务公开", id: null, child: []},
                    // { name: "村务公开", id: null, child: []},
                    // { name: "党务公开", id: null, child: []},
                    // { name: "财务公开", id: null, child: []},
                    // { name: "乡村快讯", id: null, child: []},
                ],
                item: null,
                zxCopy: [],
                stbUser: {
                    address: "",
                    areaId: null,
                    name: "",
                    tel: null,
                    terminalId: "",
                },

                tel: 131242442,
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
                address: null,
                //标识是否传进来地区
                flag1: false,
                flag2: false,
                flag3: false,
                submitDis: false
            }
        },
        watch: {
            radio(radio) {
                var self = this;
                if (radio) {
                    self.axios({
                        url: self.$iHomed("api", "get_news") + this.treeData.id + "/" + self.radio,
                        method: "get",
                    }).then((res) => {
                        if (res.data.code == 0) {
                            // if(res.data.data.zxlmxx.length >0){
                            self.zxlmxx = res.data.data.zxlmxx;
                            self.zxCopy = $.extend({}, res.data.data.zxlmxx);
                            console.log(self.zxlmxx);
                            // }else{
                            //     console.log(self.zxlmxx );
                            // }
                        }
                    })
                }
            },
            province(province) {
                // if(isNaN(Number(province))){
                this.provinceChange(province);
                //如果city存在province不是整个长度
                if (this.cityOptions) {
                    this.width = true;
                } else {
                    this.width = false;
                    this.newGuest.areaId = this.first.id;
                }
                if (!province) {
                    this.width = false;
                } else {
                    if (this.multipleSelection && province == this.multipleSelection.areaName) {
                        this.width = false;
                    } else if (province == localStorage.getItem("areaId")) {
                        this.width = false;
                    } else {
                        this.width = true;
                    }
                    // }
                }
            },
            city(city) {
                if (city) {
                    this.cityChange(city);
                }
            },
            county(county) {
                if (county) {
                    this.countyChange(county);
                }
            },
            addTreeData: {　　　　
                handler(newValue, oldValue) {
                    console.log(newValue);
                    this.submitDis = false;　　　　　　
                    for (let p in newValue) {
                        if (p != "pid" && p != "type") {
                            if (newValue[p]) {
                                console.log(p);
                                console.log(this.$refs[p]);
                                this.$refs[p].$el.style.border = "none";
                            }
                        }　　　　
                    }
                },
                　　deep: true
            },
            treeData: {　　　　
                handler(newValue, oldValue) {
                    if (newValue) {
                        this.submitDis = false;
                    }
                },
                　　deep: true
            },
            stbUser: {　　　　
                handler(newValue, oldValue) {
                    console.log(newValue);　　　　　　
                    for (let p in newValue) {
                        if (p != "areaId") {
                            if (newValue[p]) {
                                console.log(this.$refs[p]);
                                this.$refs[p].$el.style.border = "none";
                            }
                        }　　　　
                    }
                },
                　　deep: true
            },
        },
        mounted() {
            if (this.mode != 5) {
                this.submitDis = false;
            } else {
                this.submitDis = true;
            }
            this.getProv();
            if (this.treeData && this.mode != 4) {
                this.arr = this.treeData.parentIds.split(".");
                for (let i = 0; i < this.arr.length; i++) {
                    this.arr[i] = Number(this.arr[i]);
                }
                if (localStorage.getItem('fid') >= 4) {
                    this.arr.splice(0, localStorage.getItem('fid') - 2);
                }
                switch (this.arr.length) {
                    case 1:
                        this.province = this.arr[0];
                        break;
                    case 2:
                        if (localStorage.getItem('fid') != 1) {
                            this.province = this.arr[1];
                        } else {
                            this.province = this.arr[0];
                        }
                        break;
                    case 3:
                        this.province = this.arr[1];
                        break;
                    case 4:
                        if (localStorage.getItem('fid') != 1) {
                            this.province = this.arr[2];
                        } else {
                            this.province = this.arr[1];
                            this.city = this.arr[2];
                        }
                        this.width = true;
                        break;
                    case 5:
                        if (localStorage.getItem('fid') != 1) {
                            this.province = this.arr[2];
                            this.city = this.arr[3];
                        } else {
                            this.province = this.arr[1];
                            this.city = this.arr[2];
                            this.county = this.arr[3];
                        }
                        this.width = true;
                        break;
                }
            }
        },
        methods: {
            cancel() {
                this.addSon = false;
                this.$message("已取消操作！");
                this.$emit("addSon", this.addSon);
            },
            submit() {
                var self = this;
                self.addSon = false;
                //新增区域
                var pattern = /\d+$/;
                if (self.mode == 1) {
                    self.addTreeData.pid = self.parentId;
                    self.addTreeData.type = 0;
                    self.addTreeData.extend = "";
                    self.addTreeData.remark = "";
                    if (!self.addTreeData.unitAddress || !self.addTreeData.name || !self.addTreeData.unit ||
                        !self.addTreeData.unitTel || !self.addTreeData.lng || !self.addTreeData.lat) {
                        this.$alert("请补全信息！");
                        for (let p in self.addTreeData) {
                            if (p != "pid" && p != "type" && !self.addTreeData[p]) {
                                self.$refs[p].$el.childNodes[1].style.border = "1px solid red";
                            }
                        }
                        return false;
                    }
                    self.$emit("addSon", self.addSon, self.addTreeData);
                }
                //新增社区
                else if (self.mode == 2) {
                    if (!self.addTreeData.unitAddress || !self.addTreeData.name || !self.addTreeData.unit ||
                        !self.addTreeData.unitTel || !self.addTreeData.lng || !self.addTreeData.lat) {
                        this.$alert("请补全信息！");
                        for (let p in self.addTreeData) {
                            if (p != "pid" && p != "type" && !self.addTreeData[p]) {
                                self.$refs[p].$el.childNodes[1].style.border = "1px solid red";
                            }
                        }
                        return false;
                    }
                    self.addTreeData.pid = self.parentId;
                    self.addTreeData.type = 1;
                    self.addTreeData.extend = "";
                    self.addTreeData.remark = "";
                    self.$emit("addSon", self.addSon, self.addTreeData);
                }
                //新增STB用户
                else if (self.mode == 3) {
                    if (!self.stbUser.address || !self.stbUser.name || !self.stbUser.username || !self.stbUser.terminalId || !self.stbUser.tel || !self.stbUser.stbId) {
                        this.$alert("请补全信息！");
                        // console.log(self.$refs);
                        // for (let p in self.stbUser) {
                        //     if (p != "areaId" && !self.stbUser[p]) {
                        //         self.$refs[p].$el.childNodes[1].style.border = "1px solid red";
                        //     }
                        // }
                        return false;
                    }
                    self.stbUser.areaId = self.treeData.id;
                    self.$emit("addSon", self.addSon, self.stbUser);
                }
                //修改STB用户
                else if (self.mode == 4) {
                    if (!pattern.test(self.multipleSelection.tel)) {
                        self.$alert("电话要为数字！");
                        return false;
                    }
                    self.$emit("addSon", self.addSon, self.multipleSelection);
                    self.stbUser = {};
                }
                //修改区域或社区
                else if (self.mode == 5) {
                    if (self.countySide && !isNaN(Number(self.countySide))) {
                        self.treeData.pid = self.countySide;
                    } else if (self.county && !isNaN(Number(self.county))) {
                        self.treeData.pid = self.county;
                    } else if (self.city && !isNaN(Number(self.city))) {
                        self.treeData.pid = self.city;
                    } else if (self.province && !isNaN(Number(self.province))) {
                        self.treeData.pid = self.province;
                    } else {
                        self.treeData.pid = self.first.id;
                    }
                    self.treeData.zxType = self.radio;
                    self.treeData.zxlmxx = self.zxlmxx;

                    if (!pattern.test(self.treeData.unitTel)) {
                        self.$alert("电话要为数字！");
                        return false;
                    }
                    self.$emit("addSon", self.addSon, self.treeData);
                    self.newName = "";
                }
            },
            //资讯获得焦点
            idFocus(item) {
                this.item = item.id;
            },
            //资讯失去焦点 并且将修改后得值同步到其他以此为父节点的元素上
            loseFocus(item) {
                var itemCopy = this.item;
                for (let i = 0; i < this.zxlmxx.length; i++) {
                    if (this.zxlmxx[i].parentId == itemCopy) {
                        this.zxlmxx[i].parentId = item.id;
                    }
                }
            },
            //省和市选择区域框
            getProv() {
                var self = this;
                self.axios({
                    method: "get",
                    url: self.$iHomed("api", "get_treeList") + localStorage.getItem("areaId"),
                }).then((res) => {
                    res = res.data.data;
                    self.root = res.id;
                    if (res.children) {
                        self.provinceOptions = [{
                            label: "下级区域",
                            options: res.children
                        }];
                    }
                    // if(res.fid != 1){
                    self.provinceOptions.unshift({
                            label: "根区域",
                            options: [{
                                id: res.id,
                                label: res.label,
                                fid: res.fid
                            }]
                        })
                        // }
                })
            },
            provinceChange(val) {
                var self = this;
                //val为id继续
                if (!isNaN(Number(val))) {
                    if (self.flag1) {
                        self.city = "";
                        self.county = "";
                        self.countySide = "";
                    }
                    self.flag1 = true;
                    self.cityOptions = [];
                    self.axios({
                        method: "get",
                        url: self.$iHomed("api", "get_treeList") + val,
                    }).then((res) => {
                        res = res.data.data;
                        // console.log(res);
                        self.cityOptions = res.children;
                    })
                }
            },
            cityChange(val) {
                //val 为id
                var self = this;
                if (!isNaN(Number(val))) {
                    if (self.flag2) {
                        self.county = "";
                    }
                    self.flag2 = true;
                    self.countyOptions = [];
                    self.axios({
                        method: "get",
                        url: self.$iHomed("api", "get_treeList") + val,
                    }).then((res) => {
                        res = res.data.data;
                        if (res.children.length > 0) {
                            self.countyOptions = res.children;
                            console.log(self.countyOptions);
                        }
                    })
                }
            },
            countyChange(val) {
                //val 为id
                var self = this;
                if (!isNaN(Number(val))) {
                    if (self.flag3) {
                        self.countySide = "";
                    }
                    self.flag3 = true;
                    self.countySideOptions = [];
                    self.axios({
                        method: "get",
                        url: self.$iHomed("api", "get_treeList") + val,
                    }).then((res) => {
                        res = res.data.data;
                        console.log("county");
                        console.log(res);
                        if (res.children.length > 0) {
                            self.countySideOptions = res.children;
                        }
                    })
                }
            },
        }
    }
</script>
<style lang="" scoped>
    .name {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding-left: 16px;
        background: #20A0FF;
        color: #fff;
    }
    
    .mask {
        position: fixed;
        top: 0;
        bottom: 84px;
        left: -264px;
        right: 0;
        background: #000;
        opacity: 0.3;
        z-index: 98;
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
    
    .content {
        position: fixed;
        top: 64px;
        left: 35%;
        width: 30%;
        height: 506px;
        overflow: hidden;
        font-size: 14px;
        background: #fff;
        z-index: 99;
    }
    
    .add {
        width: 100%;
        height: 398px;
        overflow-y: scroll;
        overflow-x: hidden;
        font-size: 14px;
        background: #fff;
        z-index: 99;
    }
    
    .el-input {
        width: 100%;
    }
    
    .button {
        text-align: right;
        margin: 24px;
    }
    
    .el-button {
        width: 88px;
        height: 28px;
        line-height: 5px;
    }
    
    .news div:first-child div {
        margin-left: 0;
    }
    
    .allWidth {
        width: 100%;
    }
    
    .halfWidth {
        width: 22%;
    }
</style>