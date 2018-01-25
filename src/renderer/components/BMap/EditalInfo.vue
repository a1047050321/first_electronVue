<template>
<div v-if="row" class="container">
<div class="mask"></div>
    <div class="editalInfo">
        <div class="title">报警详情</div>
        <div class="table_cell">
            <div v-if="!editSetting"><span style="display:inline-block;float:left;">报警人：</span><el-input v-model="row.name" size="small" style="width:50%;height:32px;margin-left:22px;" @change="keyDown"></el-input></div>
            <div  v-if="editSetting"><span>报警人：</span><span style="margin-left:8px;">{{row.name}}</span></div>
            <div><span>联系方式：</span><span style="margin-left:8px;">{{row.contact}}</span></div>
            <div><span>报警位置：</span><span style="margin-left:8px;" :title="row.address">{{row.address}}</span></div>
            <div v-if="!editSetting"><span style="float:left;">报警类型：</span>
                 <el-select v-model="row.alarmTypeId" size="small" @change="keyDown" placeholder="选择报警类型" style="width:50%;margin:0;margin-left:8px;">
                    <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>  
            </div>
            <div v-if="editSetting"><span>报警类型：</span><span style="margin-left:8px;" :title="row.alarmTypeName">{{row.alarmTypeName}}</span></div>
            <div><span>报警时间：</span><span style="margin-left:8px;" :title="row.createDateTran">{{row.createDateTran}}</span></div>
            <div><span>报警终端类型：</span><span style="margin-left:10px;" :title="row.terminalType">{{row.terminalType}}</span></div>
            <div v-show="!row.monitor"><span>机顶盒智能卡号：</span><span style="margin-left:10px;" :title="row.ca">{{row.ca}}</span></div>
            <div v-show="row.monitor"><span style="display:inline-block;float:left;margin-right:16px;" :title="row.monitor">监控频道id：{{row.monitor}}</span>
                <span class="name-wrapper">
                    <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(row)}}"><i class="el-icon-view" ></i></router-link>
                </span>
            </div>
        </div>
        <div class="table_cell" style="margin-left:32px;">
            <div v-show="row.monitor"><span>机顶盒智能卡号：</span><span style="margin-left:20px;" :title="row.ca">{{row.ca}}</span></div>
            <div><span>处理时间：</span><span style="margin-left:20px;" :title="row.pendDate">{{row.pendDate}}</span></div>
            <div><span>处理单位：</span><span style="margin-left:20px;">{{row.unit}}</span></div>
            <div><span>处理人：</span><span style="margin-left:34px;">{{row.pendUser}}</span></div>
            <div><span>上报：</span><span style="margin-left:50px;">{{row.state}}</span></div>
            <div><span>上报时间：<span style="margin-left:20px;":title="row.reportDate" >{{row.reportDate}}</span></span></div>
            <div><span>解除报警：</span><span style="margin-left:20px;" v-if="row.relieve && row.imageUrl " @click="imgShow"><i class="el-icon-picture"></i></span>
            <span style="margin-left:20px;" v-if="row.relieve && !row.imageUrl" @click="imgShow">是</span>
                <span style="margin-left:20px;" v-if="!row.relieve">否</i></span>
            </div>
        </div>
        <div style="clear:both;"></div>
        <div class="container"  v-if="showImg" >
            <div class="showImg">
                <div class="title" style="margin-bottom:0;">图片展示<a href="javascript:void(0)"><span style="float:right;margin-right:16px;font-size:20px;color:#fff;" @click="close">&times;</span></a></div>
                <img :src="row.imageUrl" alt="没有图片" width="100%" height="100%">
            </div>
        </div>
        <div style="text-align:right;">
        <el-button @click="cancel" >取消</el-button>
        <el-button type="primary" @click="ok" style="margin-right:24px;">确定</el-button>
    </div>
    </div>
</div>
</template><div v-if="row" class="container">
<div class="mask"></div>
    <div class="editalInfo">
        <div class="title">报警详情</div>
        <div class="table_cell">
            <div v-if="!editSetting"><span style="display:inline-block;float:left;">报警人：</span><el-input v-model="row.name" size="small" style="width:50%;height:32px;margin-left:22px;" @change="keyDown"></el-input></div>
            <div  v-if="editSetting"><span>报警人：</span><span style="margin-left:8px;">{{row.name}}</span></div>
            <div><span>联系方式：</span><span style="margin-left:8px;">{{row.contact}}</span></div>
            <div><span>报警位置：</span><span style="margin-left:8px;" :title="row.address">{{row.address}}</span></div>
            <div v-if="!editSetting"><span style="float:left;">报警类型：</span>
                 <el-select v-model="row.alarmTypeId" size="small" @change="keyDown" placeholder="选择报警类型" style="width:50%;margin:0;margin-left:8px;">
                    <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>  
            </div>
            <div v-if="editSetting"><span>报警类型：</span><span style="margin-left:8px;" :title="row.alarmTypeName">{{row.alarmTypeName}}</span></div>
            <div><span>报警时间：</span><span style="margin-left:8px;" :title="row.createDateTran">{{row.createDateTran}}</span></div>
            <div><span>报警终端类型：</span><span style="margin-left:10px;" :title="row.terminalType">{{row.terminalType}}</span></div>
            <div v-show="!row.monitor"><span>机顶盒智能卡号：</span><span style="margin-left:10px;" :title="row.ca">{{row.ca}}</span></div>
            <div v-show="row.monitor"><span style="display:inline-block;float:left;margin-right:16px;" :title="row.monitor">监控频道id：{{row.monitor}}</span>
                <span class="name-wrapper">
                    <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(row)}}"><i class="el-icon-view" ></i></router-link>
                </span>
            </div>
        </div>
        <div class="table_cell" style="margin-left:32px;">
            <div v-show="row.monitor"><span>机顶盒智能卡号：</span><span style="margin-left:20px;" :title="row.ca">{{row.ca}}</span></div>
            <div><span>处理时间：</span><span style="margin-left:20px;" :title="row.pendDate">{{row.pendDate}}</span></div>
            <div><span>处理单位：</span><span style="margin-left:20px;">{{row.unit}}</span></div>
            <div><span>处理人：</span><span style="margin-left:34px;">{{row.pendUser}}</span></div>
            <div><span>上报：</span><span style="margin-left:50px;">{{row.state}}</span></div>
            <div><span>上报时间：<span style="margin-left:20px;":title="row.reportDate" >{{row.reportDate}}</span></span></div>
            <div><span>解除报警：</span><span style="margin-left:20px;" v-if="row.relieve && row.imageUrl " @click="imgShow"><i class="el-icon-picture"></i></span>
            <span style="margin-left:20px;" v-if="row.relieve && !row.imageUrl" @click="imgShow">是</span>
                <span style="margin-left:20px;" v-if="!row.relieve">否</i></span>
            </div>
        </div>
        <div style="clear:both;"></div>
        <div class="container"  v-if="showImg" >
            <div class="showImg">
                <div class="title" style="margin-bottom:0;">图片展示<a href="javascript:void(0)"><span style="float:right;margin-right:16px;font-size:20px;color:#fff;" @click="close">&times;</span></a></div>
                <img :src="row.imageUrl" alt="没有图片" width="100%" height="100%">
            </div>
        </div>
        <div style="text-align:right;">
        <el-button @click="cancel" >取消</el-button>
        <el-button type="primary" @click="ok" style="margin-right:24px;">确定</el-button>
    </div>
    </div>
</div>
</template>
<script>
import $ from "jquery"
    export default {
        props: ["row", "alarmType", "editSetting"],
        data() {
            return {
                editalInfo: false,
                alarmName: "",
                flag: false,
                _row: {},
                showImg: false
            }
        },
        mounted() {
            this._row = $.extend({}, this.row);
        },
        watch: {
            row: {
                handler(row, oldRow) {
                    if (row) {}
                },
                deep: true
            }
        },
        methods: {
            keyDown() {
                this.flag = true;
            },
            //显示图片
            imgShow() {
                this.showImg = true;
            },
            //关闭
            close() {
                this.showImg = false;
            },
            ok() {
                var self = this;
                if (self.flag) {
                    self.flag = false;
                    self.axios({
                            method: "put",
                            url: self.$iHomed("api", "change_untreated") + this.row.id + "/detail",
                            data: {
                                "alarmTypeId": self.row.alarmTypeId,
                                "name": self.row.name
                            }
                        })
                        .then((res) => {
                            var ret = res.data.data;
                            if (ret) {
                                self.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$emit("editalInfo", this.editalInfo, true);
                            } else {
                                self.$alert(res.data.msg);
                            }
                        })
                } else {
                    self.$emit("editalInfo", this.editalInfo);
                }
            },
            cancel() {
                this.$emit("editalInfo", this.editalInfo);
                this.$message("已取消操作！");
            },
        }
    }
</script>
<style scoped>
    .container {
        position: fixed;
        left: 50%;
        top: 50%;
        z-index: 999;
    }
    
    .title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-bottom: 24px;
        padding-left: 16px;
        text-align: left;
        background: #20A0FF;
        color: #fff;
    }
    
    .editalInfo {
        position: absolute;
        left: -280px;
        top: -280px;
        width: 560px;
        height: 388px;
        background: #fff;
        z-index: 99;
        opacity: 1;
    }
    
    .table_cell {
        float: left;
        width: 240px;
    }
    
    .table_cell div {
        width: 100%;
        height: 32px;
        line-height: 32px;
        margin-left: 24px;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
    }
    
    .mask {
        position: fixed;
        top: 0;
        bottom: 84px;
        left: -264px;
        right: 0;
        background: #000;
        opacity: 0.3;
        z-index: 99;
    }
    
    .name-wrapper {
        width: 30px;
    }
    
    .el-button {
        width: 74px;
        height: 28px;
        line-height: 5px;
    }
    
    i {
        color: #20A0ff;
    }
    
    .el-icon-picture {
        cursor: pointer;
    }
    
    .showImg {
        position: absolute;
        left: -280px;
        top: -280px;
        width: 560px;
        height: 388px;
        background: #fff;
        z-index: 100;
        opacity: 1;
    }
</style>