<template>
    <div>
    <div class="mask"></div>
<div class="content">
    <div class="title">{{edital}}管理员</div>
    <div class="editalInfo"  v-if="buttonClick ==1">
        <div class="content-box1">
            <div><span class="icon-must"></span>登录名<span style="font-size:12px;color:red;">(输入英文字母或数字)</span></div>
            <el-input v-model="newGuest.username" ref="username" autofocus @change="userName"></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>登录密码</div>
            <el-input type="password" ref="password" v-model="newGuest.password"></el-input>
        </div>
        <div class="content-box1">
            <div style="margin-top:3px;">管理区域</div>
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
            <el-select v-model="city" placeholder="请选择" @change="cityChange" filterable class="halfWidth" style="margin-left:10px;" v-if=" width && province && (province != root)">
                <el-option
                    v-for="item in cityOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="county"  @change="countyChange" placeholder="请选择" filterable class="halfWidth" style="margin-left:10px;" v-if="province && (province != root)&&city">
                <el-option
                    v-for="item in countyOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="countySide" placeholder="请选择" filterable class="halfWidth" style="margin-left:10px;" v-if="province && (province != root)&&county ">
                <el-option
                    v-for="item in countySideOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>管理员类型<span style="font-size:12px;color:red;" v-show="quan">(请修改管理区域)</span></div>
            <el-select v-model="newGuest.level" ref="level" placeholder="选择管理员类型" :disabled="quan" style="width:92%;">
                <el-option
                    v-for="item  in guests"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>  
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>管理报警类型</div>
            <el-select v-model="newGuest.alarmType"  :class="{'demo-select': isMore}" ref="alarmType" multiple  placeholder="选择报警类型" style="width:92%;">
                <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>        
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>姓名</div>
            <el-input v-model="newGuest.name" ref="name"></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>电话</div>
            <el-input v-model="newGuest.tel" ref="tel" type="text"></el-input>
        </div>
        <div class="content-box1">
            <div><span class="icon-must"></span>邮箱</div>
            <el-input v-model="newGuest.mail" ref="mail"></el-input>
        </div>
    </div>
    <div class="editalInfo"  v-if="buttonClick ==2 && multipleSelection">
        <div class="content-box1">
            <div>登录名</div>
            <el-input v-model="multipleSelection.userName" disabled></el-input>
        </div>
        <div class="content-box1">
            <div>登录密码</div>
            <el-input v-model="disabled" disabled></el-input>
        </div>
        <div class="content-box1">
            <div style="margin-top:16px;">管理区域</div>
            <el-select v-model="province" :disabled="edit" placeholder="选择区域"  @change="provinceChange" :class="{allWidth:!width,halfWidth:width}">
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
            <el-select v-model="city" :disabled="edit" placeholder="请选择" @change="cityChange" class="halfWidth city" style="margin-left:10px;" v-if=" province && province != root && width">
                <el-option
                    v-for="item in cityOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="county" :disabled="edit" @change="countyChange"  placeholder="请选择" class="halfWidth county" style="margin-left:10px;" v-if=" province && province != root && city">
                <el-option
                    v-for="item in countyOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="countySide" :disabled="edit" placeholder="请选择"  class="halfWidth countySide" style="margin-left:10px;" v-if="province && province != root && county">
                <el-option
                    v-for="item in countySideOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="content-box1">
            <div>管理员类型</div>
            <el-select v-model="multipleSelection.type" placeholder="选择管理员类型" style="width:100%;" :disabled="quan">
                <el-option
                    v-for="item in guests"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>  
        </div>
        <div class="content-box1">
            <div>管理报警类型</div>
            <el-select v-model="multipleSelection.alarmId" :disabled="edit" multiple  placeholder="选择报警类型" style="width:100%;">
                <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>        

        </div>
        <div class="content-box1">
            <div>姓名</div>
            <el-input  v-model="multipleSelection.name" :disabled="tongJi"></el-input>
        </div>
        <div class="content-box1">
            <div>电话</div>
            <el-input v-model="multipleSelection.tel" type="text" :disabled="tongJi"></el-input>
        </div>
        <div class="content-box1">
            <div>邮箱</div>
            <el-input v-model="multipleSelection.mail" :disabled="tongJi"></el-input>
        </div>
    </div>
             <div class="confirm" style="text-align:center;margin-top:10px;">
             <el-button type="primary" @click="ok" :disabled="edit && tongJi">确定</el-button>
             <el-button type="primary" @click="cancel">取消</el-button>
         </div>
</div>
</div>
</template>
<script>
    import Select from "./../select/src/select"
    export default {
        props: ["buttonClick", "multipleSelection", "first", "alarmType"],
        data() {
            return {
                addManage: false,
                newGuest: {
                    alarmType: [],
                    areaId: null,
                    "level": null,
                    "mail": "",
                    "name": "",
                    "password": "",
                    "tel": null,
                    "username": ""
                },
                rootId: [],
                quan: false,
                disabled: "*********",
                guests: [{
                    value: 10,
                    label: "普通管理员"
                }, {
                    value: 50,
                    label: "高级管理员"
                }, {
                    value: 100,
                    label: "超级管理员"
                }],
                role: null,
                edit: false,
                tongJi: false,
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
                isMore: false,
                edital: ""
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
                    this.newGuest.areaId = this.first.id;
                }
                // }else{
                //  this.quan = false;
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
                        this.guests = [{
                            value: 10,
                            label: "普通管理员"
                        }, {
                            value: 50,
                            label: "高级管理员"
                        }];
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
            newGuest: {　　　　
                handler(newValue, oldValue) {
                    console.log(newValue);　　　　　　
                    for (let p in newValue) {
                        if (p != "areaId" && p != "alarmType") {
                            if (newValue[p]) {
                                console.log(p);
                                console.log(this.$refs[p]);
                                this.$refs[p].$el.style.border = "none";
                            }
                        } else if (p == "alarmType" && newValue[p].length != 0) {
                            this.$refs[p].$el.style.border = "none";
                        }　　　　
                    }
                },
                　　deep: true
            },
            buttonClick(buttonClick) {
                if (buttonClick == 1) {
                    this.city = "";
                    this.county = "";
                    this.countySide = "";
                    this.edit = false;
                    this.quan = false;
                    this.tongJi = false;
                    this.newGuest = {
                        alarmType: [],
                        areaId: null,
                        "level": null,
                        "mail": "",
                        "name": "",
                        "password": "",
                        "tel": null,
                        "username": ""
                    };
                }
            },
        },
        mounted() {
            if (this.buttonClick == 1) {
                this.edital = "新增";
            } else {
                this.edital = "编辑";
            }
            this.role = localStorage.getItem('role');
            if (localStorage.getItem("username") != "admin") {
                if (this.role == 100) {
                    this.guests = [{
                        value: 10,
                        label: "普通管理员"
                    }, {
                        value: 50,
                        label: "高级管理员"
                    }, {
                        value: 100,
                        label: "超级管理员"
                    }];
                }
            } else {
                if (this.first.fid == 1) {
                    this.guests = [{
                        value: 100,
                        label: "超级管理员"
                    }];
                } else {
                    this.guests = [{
                        value: 10,
                        label: "普通管理员"
                    }, {
                        value: 50,
                        label: "高级管理员"
                    }];
                }

            };
            this.getProv();
            if (this.buttonClick == 1) {
                // this.province = this.first.label;
                this.arr = this.first.parentIds.split(".");
                for (let i = 0; i < this.arr.length; i++) {
                    this.arr[i] = Number(this.arr[i]);
                }
                console.log(this.arr);
                this.guests = [{
                    value: 10,
                    label: "普通管理员"
                }, {
                    value: 50,
                    label: "高级管理员"
                }];
                switch (this.arr.length) {
                    case 1:
                        this.province = this.arr[0];
                        break;
                    case 2:
                        this.province = this.arr[1];
                        break;
                    case 3:
                        this.province = this.arr[1];
                        this.city = this.arr[2];
                        break;
                    case 4:
                        this.province = this.arr[1];
                        this.city = this.arr[2];
                        this.county = this.arr[3];
                        break;
                    case 5:
                        this.province = this.arr[1];
                        this.city = this.arr[2];
                        this.county = this.arr[3];
                        this.countySide = this.arr[4];
                        break;
                }
                if (this.first.fid == 1) {
                    if (localStorage.getItem("username") != "admin") {
                        this.quan = true;
                    } else {
                        //admin 四川省可以新建超级管理员
                        this.quan = false;
                        this.guests = [{
                            value: 100,
                            label: "超级管理员"
                        }];
                    }
                } else {
                    this.quan = false;
                    if (this.role == 10) {
                        if (this.first.id == localStorage.getItem('areaId')) {
                            this.quan = true;
                        } else {
                            this.quan = false;
                        }
                    }
                    //高级管理员 同区域不可创建高级
                    else if (this.role == 50) {
                        if (this.first.id == localStorage.getItem('areaId')) {
                            this.guests = [{
                                value: 10,
                                label: "普通管理员"
                            }];
                        }
                    }
                }
            }
            //编辑
            else {
                if (this.multipleSelection) {
                    this.arr = this.multipleSelection.parentIds.split(".");
                    for (let i = 0; i < this.arr.length; i++) {
                        this.arr[i] = Number(this.arr[i]);
                    }
                    this.guests = [{
                        value: 10,
                        label: "普通管理员"
                    }, {
                        value: 50,
                        label: "高级管理员"
                    }];
                    switch (this.arr.length) {
                        case 1:
                            this.province = this.arr[0];
                            break;
                        case 2:
                            this.province = this.arr[1];
                            break;
                        case 3:
                            this.province = this.arr[1];
                            this.city = this.arr[2];
                            break;
                        case 4:
                            this.province = this.arr[1];
                            this.city = this.arr[2];
                            this.county = this.arr[3];
                            break;
                        case 5:
                            this.province = this.arr[1];
                            this.city = this.arr[2];
                            this.county = this.arr[3];
                            this.countySide = this.arr[4];
                            break;
                    }
                }
                if (this.multipleSelection.userName == localStorage.getItem("username")) {
                    this.edit = true;
                    this.quan = true;
                    this.tongJi = false;

                } else if (this.multipleSelection.areaId == localStorage.getItem("areaId") && this.multipleSelection.type >= this.role) {
                    if (localStorage.getItem("username") == "admin") {
                        this.edit = false;
                        this.quan = false;
                        this.tongJi = false;
                    } else {
                        this.edit = true;
                        this.quan = true;
                        this.tongJi = true;
                    }
                }

            }
        },
        components: {
            "my-select": Select
        },
        methods: {
            //限制新增管理员登录为英文字母
            userName(a) {
                var partern = /^[0-9a-zA_Z]+$/g;
                if (!partern.test(a)) {
                    if (a) {
                        this.newGuest.username = "";
                        this.$alert("只能输入英文字母或数字哦！");
                    }
                } else {

                }
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
                    if (res.children) {
                        self.provinceOptions = [{
                            label: "下级区域",
                            options: res.children
                        }];
                    }
                    // if(res.fid != 1){
                    self.provinceOptions.unshift({
                            label: "跟区域",
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
                //val 为id
                var self = this;
                //遍历下级区域
                if (self.provinceOptions[1]) {
                    for (let i = 0; i < self.provinceOptions[1].options.length; i++) {
                        if (self.provinceOptions[1].options[i].id == val) {
                            //不是省的情况
                            if (self.provinceOptions[1].options[i].fid != 1) {
                                this.quan = false;
                                this.guests = [{
                                    value: 10,
                                    label: "普通管理员"
                                }, {
                                    value: 50,
                                    label: "高级管理员"
                                }];
                            } else {
                                if (localStorage.getItem("username") == "admin") {
                                    this.quan = false;
                                    this.guests = [{
                                        value: 100,
                                        label: "超级管理员"
                                    }];
                                } else {
                                    this.quan = true;
                                }
                            }
                        }
                    }
                    if (val == this.provinceOptions[0].options[0].id) {
                        if (this.provinceOptions[0].options[0].fid == 1) {
                            if (localStorage.getItem("username") != "admin") {
                                this.quan = true;
                            } else {
                                this.quan = false;
                                this.guests = [{
                                    value: 100,
                                    label: "超级管理员"
                                }];
                            }
                        } else {
                            if (this.role == 10) {
                                this.quan = true;
                            } else {
                                //高级管理员 同区域不可创建高级
                                if (this.role == 50) {
                                    this.quan = false;
                                    this.guests = [{
                                        value: 10,
                                        label: "普通管理员"
                                    }];
                                    //普通管理员不可建本区域的管理员  
                                }
                            }

                        }
                    }
                }
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
                        console.log(res);
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
                        self.countySide = "";
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
            changeSelect() {
                this.$nextTick(function() {
                    let [$span, tags, Len] = [this.$refs.alarmType.$refs.tags.children[0].childNodes, [], 0];
                    console.log($span);
                    for (let i = 0, len = $span.length; i < len; i++) {
                        if ($span[i].className.indexOf('leave') > -1) {
                            tags.slice(i, 1);
                        } else {
                            tags.push($span[i]);
                        }
                    }
                    for (let i = 0, len = tags.length; i < len; i++) {
                        Len += tags[i].offsetWidth;
                    }

                    this.isMore = Len > 90 ? true : false;
                });
            },
            ok() {
                var self = this;
                var pattern = /^\d+$/;
                //新增
                if (this.buttonClick == 1) {
                    //新增用户确定操作
                    if (self.countySide && !isNaN(Number(self.countySide))) {
                        self.newGuest.areaId = self.countySide;
                    } else if (self.county && !isNaN(Number(self.county))) {
                        self.newGuest.areaId = self.county;
                    } else if (self.city && !isNaN(Number(self.city))) {
                        self.newGuest.areaId = self.city;
                    } else if (self.province && !isNaN(Number(self.province))) {
                        self.newGuest.areaId = self.province;
                    } else {
                        self.newGuest.areaId = self.first.id;
                    }
                    if (!this.newGuest.alarmType || !this.newGuest.areaId || !this.newGuest.level ||
                        !this.newGuest.mail || !this.newGuest.name || !this.newGuest.password || !this.newGuest.tel ||
                        !this.newGuest.username) {
                        this.$alert("请补全信息！");
                        for (let p in self.newGuest) {
                            if (!self.newGuest[p] || (p == "alarmType" && self.newGuest[p].length == 0)) {
                                self.$refs[p].$el.style.border = "1px solid red";
                                // console.log(this.$refs['username'].$el.childNodes[2]);
                            }
                        }
                        return false;
                    }
                    this.$emit("addManage", this.addManage, this.newGuest);
                    self.county = "";
                    self.city = "";
                    self.countySide = "";

                } else {
                    //修改用户确定操作
                    if (!pattern.test(self.multipleSelection.tel)) {
                        self.$alert("电话要为数字并且符合规范哦！");
                        return false;
                    }
                    self.multipleSelection.level = self.multipleSelection.type;
                    if (self.countySide && !isNaN(Number(self.countySide))) {
                        self.multipleSelection.areaId = self.countySide;
                    } else if (self.county && !isNaN(Number(self.county))) {
                        self.multipleSelection.areaId = self.county;
                    } else if (self.city && !isNaN(Number(self.city))) {
                        self.multipleSelection.areaId = self.city;
                    } else if (self.province && !isNaN(Number(self.province))) {
                        self.multipleSelection.areaId = self.province;
                    } else {
                        self.multipleSelection.areaId = self.first.id;
                    }
                    self.multipleSelection.username = self.multipleSelection.userName;
                    self.$emit("addManage", self.addManage, self.multipleSelection);
                    self.county = "";
                    self.city = "";
                    self.countySide = "";
                }
            },
            cancel() {
                this.$message("已取消操作！");
                this.$emit("addManage", this.addManage);
                this.newGuest = {
                    alarmType: [],
                    areaId: null,
                    level: null,
                    mail: "",
                    name: "",
                    password: "",
                    tel: null,
                    username: ""
                };
                this.city = "";
                this.county = "";
                this.countySide = "";
            },
        }
    }
</script>
<style scoped>
    .title {
        width: 100%;
        height: 40px;
        margin-bottom: 10px;
        line-height: 40px;
        text-align: center;
        background: #20A0FF;
        color: #fff;
    }
    
    .content {
        position: fixed;
        top: 100px;
        left: 35%;
        width: 30%;
        height: 550px;
        background: #fff;
        z-index: 99;
        opacity: 1;
        overflow: hidden;
    }
    
    .editalInfo {
        width: 100%;
        height: 450px;
        overflow-y: scroll;
        background: #fff;
        z-index: 99;
        opacity: 1;
    }
    
    .editalInfo div div {
        margin-bottom: 3px;
        margin-top: 3px;
    }
    
    .table_cell {
        float: left;
    }
    
    .table_cell div {
        width: 280px;
        height: 30px;
        line-height: 30px;
        margin: 0 0 10px 20px;
        font-size: 14px;
    }
    
    .mask {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000;
        opacity: 0.3;
        z-index: 98;
    }
    
    .content-box {
        width: 240px;
        height: 65px;
        float: left;
        margin-top: 3px;
    }
    
    .content-box .el-input {
        width: 180px;
    }
    
    .content-box div:not(.title) {
        margin-left: 28px;
    }
    
    .content-box1 div:not(.halfWidth) {
        margin-left: 20px;
    }
    
    .el-input {
        margin-top: 3px;
        width: 92%;
        -webkit-appearance: none;
    }
    
    .el-button {
        width: 88px;
        height: 28px;
        line-height: 6px;
    }
    
    .allWidth {
        width: 92%;
    }
    
    .halfWidth {
        width: 19.6%;
        margin-left: 28px;
    }
    
    .demo-select:after {
        content: '...';
        position: absolute;
        right: 39px;
        bottom: 5px;
    }
</style>