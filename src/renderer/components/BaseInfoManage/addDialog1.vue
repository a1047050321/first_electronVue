<template>
<div>
    <div class="mask"></div>
    <div class="content">
        <div class="name">{{addName}}</div>
        <div class="add">
        <div v-if="mode !=4">
            <div style="margin-left:20px;" >上一级区域</div>
            <el-input v-model="parentLabel" disabled></el-input>
        </div>
        <!-- 新增区域-->
        <div v-if="mode == 1" class="flag">
        <div>
            <div><span class="icon-must"></span>区域编码</div>
            <el-input v-model="addTreeData.code"></el-input>
        </div>
        <div>
            <div><span class="icon-must"></span>区域地址</div>
            <el-input v-model="addTreeData.address"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>区域名称</div>
            <el-input v-model="addTreeData.name"></el-input>
        </div>
        
         <div>
            <div><span class="icon-must"></span>区域描述</div>
            <el-input v-model="addTreeData.remark"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>管理单位</div>
            <el-input v-model="addTreeData.unit"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>单位电话</div>
            <el-input v-model="addTreeData.unitTel" type="text"></el-input>
        </div>
         <div>
            <div>资讯栏目id</div>
            <el-input v-model="addTreeData.extend"></el-input>
        </div>
        </div>
                <!--新增社区 -->
        <div v-if="mode == 2" class="flag">
         <div>
            <div><span class="icon-must"></span>社区地址</div>
            <el-input v-model="addTreeData.address"></el-input>
        </div>
        <div>
            <div><span class="icon-must"></span>社区编码</div>
            <el-input v-model="addTreeData.code"></el-input>
        </div>
            <div>
            <div><span class="icon-must"></span>社区名称</div>
            <el-input v-model="addTreeData.name"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>社区描述</div>
            <el-input  v-model="addTreeData.remark"></el-input>
        </div>
        <div>
            <div><span class="icon-must"></span>管理单位</div>
            <el-input v-model="addTreeData.unit"></el-input>
        </div>
        <div>
            <div><span class="icon-must"></span>单位电话</div>
            <el-input  v-model="addTreeData.unitTel" type="text"></el-input>
        </div>
        <div>
            <div>资讯栏目id</div>
            <el-input v-model="addTreeData.extend"></el-input>
        </div>
        </div>
        <!-- 新增STB 用户-->
        <div v-if="mode == 3" class="flag">
        <div>
         <div>所属社区</div>
            <el-input v-model="treeData.label" disabled></el-input>
            </div>
            <div>
            <div><span class="icon-must"></span>用户名</div>
            <el-input v-model="stbUser.name"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>用户电话</div>
            <el-input  v-model="stbUser.tel" type="text" ></el-input>
        </div>
        <div>
            <div><span class="icon-must"></span>机顶盒序列号</div>
            <el-input v-model="stbUser.terminalId"></el-input>
        </div>
        <div>
            <div><span class="icon-must"></span>机顶盒智能卡号</div>
            <el-input  v-model="stbUser.terminalId"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>地址</div>
            <el-input  v-model="stbUser.address"></el-input>
        </div>
        <div style="display:none;">
            <div>资讯栏目id</div>
            <el-input v-model="stbUser.extend"></el-input>
        </div>
        </div>
        <!-- 修改用户信息-->
        <div v-if="mode == 4 && multipleSelection" class="flag">
            <div>
                <div>所属区域</div>
                <el-input v-model="multipleSelection.areaName" disabled  style="margin-left:20px;"></el-input>
            </div>
            <div>
                <div>用户名</div>
                <el-input v-model="multipleSelection.name" disabled></el-input>
            </div>
            <div>
                <div>用户电话</div>
                <el-input  v-model="multipleSelection.tel" type="text"></el-input>
            </div>
            <div>
                <div>机顶盒序列号</div>
                <el-input  v-model="multipleSelection.terminalId"></el-input>
            </div>
            <div>
                <div>机顶盒智能卡号</div>
                <el-input  v-model="multipleSelection.terminalId"></el-input>
            </div>
            <div>
                <div>地址</div>
                <el-input  v-model="multipleSelection.address"></el-input>
            </div>
            <div style="display:none;">
            <div>资讯栏目id</div>
            <el-input v-model="multipleSelection.extend"></el-input>
        </div>
        </div>
        <!--修改名称-->
         <div v-if="mode ==5">
         <!-- 区域-->
        <div v-if= "treeData.type == 0"  class="flag">
        <div>
            <div>区域编码</div>
            <el-input v-model="treeData.code" disabled></el-input>
        </div>
        <div>
                <div>区域地址</div>
                <el-input v-model="treeData.address"></el-input>
            </div>
         <div>
            <div>区域名称</div>
            <el-input v-model="treeData.label" ></el-input>
        </div>
        
         <div>
            <div>区域描述</div>
            <el-input v-model="treeData.remark"></el-input>
        </div>
         <div>
            <div>管理单位</div>
            <el-input v-model="treeData.unit"></el-input>
        </div>
         <div>
            <div>单位电话</div>
            <el-input v-model="treeData.unitTel" type="text" ></el-input>
        </div>
        <div>
            <div>资讯栏目id</div>
            <el-input v-model="treeData.extend"></el-input>
        </div>
        </div>
                <!--社区 -->
        <div v-if="treeData.type == 1"  class="flag">
            <div>
                <div>社区编码</div>
                <el-input v-model="treeData.code" disabled></el-input>
            </div>
            <div>
                <div>社区地址</div>
                <el-input v-model="treeData.address"></el-input>
            </div>
            <div>
            <div>社区名称</div>
            <el-input v-model="treeData.label"></el-input>
            </div>
            <div>
                <div>社区描述</div>
                <el-input  v-model="treeData.remark"></el-input>
            </div>
            <div>
                <div>管理单位</div>
                <el-input v-model="treeData.unit"></el-input>
            </div>
            <div>
                <div>单位电话</div>
                <el-input  v-model="treeData.unitTel" type="text"></el-input>
            </div>
            <div>
            <div>资讯栏目id</div>
            <el-input v-model="treeData.extend"></el-input>
        </div>
        </div>
        </div> 
    </div>
            <div class="button" style="margin-left:15px;">
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </div>
    </div>
</div> 
</template>
<script>
    export default{
        props:["parentLabel","parentId","mode","addName","multipleSelection","treeData"],
        data(){
            return {
                serName:"www",
                name:"qqq",
                newName:"",
                addTreeData:{
                    "address":"",
                    "code": "",
                    "extend":"",
                    "name": "",
                    "pid": 0,
                    "remark": "",
                    "type": 0,
                    "unit": "",
                    "unitTel": null,
                },
                stbUser:{
                    address: "",
                    areaId:null,
                    name: "",
                    tel: null,
                    terminalId: "",
                },
                
                tel:131242442
            }
        },
        methods:{
            cancel(){
                this.addSon = false;
                this.$message("已取消操作！");
                this.$emit("addSon",this.addSon);
            },
            // //监听输入
            // inputTel(){
            //     alert(Number(this.addTreeData.unitTel) == "NaN");
            //     if(Number(this.addTreeData.unitTel) == "NaN"){
            //         this.$alert("请输入数字");
            //     }
            // },
            submit(){
                var self = this;
                self.addSon = false;
                //新增区域
                var pattern = /^\d+$/;
                if(self.mode ==1){
                    self.addTreeData.pid = self.parentId;
                    self.addTreeData.type = 0;
                    console.log(self.addTreeData);
                   
                        if(!self.addTreeData.address || !self.addTreeData.code || !self.addTreeData.name || !self.addTreeData.remark || !self.addTreeData.unit || !self.addTreeData.unitTel){
                            this.$alert("请补全信息！");
                            return false;
                        } else if(!pattern.test(self.addTreeData.unitTel)){
                                self.$alert("电话要为数字并且符合规范哦！");
                                return false;
                            }
                    self.$emit("addSon",self.addSon,self.addTreeData);
                }
                //新增社区
                else if(self.mode == 2){
                    if(!self.addTreeData.address || !self.addTreeData.code || !self.addTreeData.name || !self.addTreeData.remark || !self.addTreeData.unit || !self.addTreeData.unitTel ){
                            this.$alert("请补全信息！");
                            return false;
                        } else if(!pattern.test(self.addTreeData.unitTel)){
                                self.$alert("电话要为数字并且符合规范哦！");
                                return false;
                            }
                    self.addTreeData.pid = self.parentId;
                    self.addTreeData.type = 1;
                    self.$emit("addSon",self.addSon,self.addTreeData);
                }
                //新增STB用户
                 else if(self.mode == 3){
                     if(!self.stbUser.address || !self.stbUser.name || !self.stbUser.terminalId || !self.stbUser.tel ){
                            this.$alert("请补全信息！");
                            return false;
                        }else if(!pattern.test(self.stbUser.tel)){
                                self.$alert("电话要为数字并且符合规范哦！");
                                return false;
                            }
                     self.stbUser.areaId = self.treeData.id;
                    self.$emit("addSon",self.addSon,self.stbUser);
                    self.stbUser = {};
                }
                //修改STB用户
                 else if(self.mode == 4){
                     if(!pattern.test(self.multipleSelection.tel)){
                                self.$alert("电话要为数字并且符合规范哦！");
                                return false;
                    }
                    self.$emit("addSon",self.addSon,self.multipleSelection);
                    self.stbUser = {};
                }
                else if(self.mode == 5){
                     if(!pattern.test(self.treeData.unitTel)){
                        self.$alert("电话要为数字并且符合规范哦！");
                        return false;
                    }
                    self.$emit("addSon",self.addSon,self.treeData);
                    self.newName = "";
                }
            }
        }
    }
</script>
<style lang="" scoped>
    .name{
        width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;

    }
    .mask{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#000;
        opacity:0.3;
        z-index:98;
    }
    .content{
        position:fixed;
        top:100px;
        left:35%;
        width:400px;
        height:600px;
        overflow-y:hidden;
        font-size:14px;
        background:#f0f0f0;
        z-index:99;
    }
    .add{
        width:400px;
        height:500px;
        overflow-y:scroll;
        font-size:14px;
        background:#f0f0f0;
        z-index:99;
    }
    .flag div div:first-child{
        margin-left:20px;
    }
    .el-input{
        width:90%;
        margin:10px 5%;
    }
    .button{
        position:absolute;
        bottom:10px;
        left:90px;
        text-align:center;
        margin-top:20px;
    }
    .changeName {
        position:fixed;
        top:120px;
        left:500px;
        width:400px;
        height:160px;
        background:#f0f0f0;
        z-index:99;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>