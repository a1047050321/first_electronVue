<template>
    <div class="handlePending">
        <div class="nav-wrapper">
            <!-- 面包屑导航路径 -->
            <el-breadcrumb separator=">">
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/callManage/pending'}">报警信息</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/callManage/pending'}">{{status}}</el-breadcrumb-item>
                <el-breadcrumb-item>监控查看</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="mask" title="当前不可点击！"></div>
        <div class="buttonHandle" style="margin:24px 0;" v-if="!type">
           <ul class="handleOpeator">
            <li class="call">
                <div><el-button type="primary" @click="ulbtnClick" style="margin-left:0;" :disabled="btnS">致电</el-button></div>
            </li>
            <li class="send">
                <div><el-button type="primary" @click="ulbtnClick" :disabled="btnS">上报</el-button></div>
            </li>
            <li class="commit">
                <div><el-button type="primary" @click="ulbtnClick" :disabled="btnS">提交</el-button></div>
            </li>
            <li>
                <div><el-button type="primary" @click="ulbtnClick" class="end" :disabled="btnS">解除</el-button></div>
            </li>
            <li class="detail">
                <div><el-button type="primary" @click="ulbtnClick" :disabled="btnS">详情</el-button></div>
            </li>
        </ul>
        </div>
        <div class="player">
            <div class="info">报警人信息:{{row.name +"  "+ row.createDateTran}}</div>
            <div id="myPlayer" :data-url="getUrl"></div>
            <div class="monitorInfo" v-show="!buttonShow">
                <span class="icon-success" style="position:absolute;left:50px;top:60px;"></span>
                <div class="destription" :title="row.name+'报警已截图，已解除'">
                {{row.name }}报警已截图，已解除</div>
                <div style="text-align:right;margin-right:24px;">
                    <el-button type="primary" @click="removeConfirm">确定</el-button>
                </div>
            </div>
        </div>
        <el-button type="primary" class="returnLast" @click="returnLast">返回</el-button>
        <edital-info v-if="editalInfo" @editalInfo="editalInfoReturn" :row="row" :alarmType="alarmType" ></edital-info>
        <no-monitor :mode="mode" :row="row" v-if="liClick" :time="time" :monitor="monitor" @liClick="opeator" @buttonShow="infoChange"></no-monitor>
    </div>
</template>
<script>
    import $ from "jquery"
    var script = document.createElement("script");
    script.setAttribute("src","../../../../static/player/sewise.player.min.js");
    script.setAttribute("type","text/javascript");
    document.body.appendChild(script);
    var script1 = document.createElement("script");
    script1.setAttribute("src","../../../../static/stomp/src/html/jquery/jquery-1.9.1.min.js");
    script1.setAttribute("type","text/javascript");
    document.body.appendChild(script1);
    import NoMonitor from './NoMonitor'
    import EditalInfo from "./EditalInfo"
    export default {
        props: ["moniInfoShow", "alarmType","configData"],
        data() {
            return {
                row: {},
                liClick: false,
                monitor: 1,
                editalInfo: false,
                buttonShow: true,
                mode: 1,
                initFlag: false,
                time: 0,
                btnS: false,
                status: "待处理",
                //第一次加载视频播放器
                first:false,
                _isMounted:false,
                url:"",
                playUrl:"",
                startTime:null,
                endTime:null,
                type:1,
                rowNext:{},
                index:1,
                flag:false,
                getPlayToken:"",
            }
        },
        components: {
            "no-monitor": NoMonitor,
            "edital-info": EditalInfo
        },
        watch:{
            row: {　　　　
                handler(newValue, oldValue) {
                    if(newValue.monitorUrl != null){
                        this.url = newValue.monitorUrl;
                        console.log(this.url);
                        var self = this;
                        if(!self.first){
                            self.first = true;
                            SewisePlayer.setup({
                                server: "vod",
                                type: "m3u8",
                                videourl: this.url,
                                skin: "vodWhite",
                                title: "视频监控",
                                lang: 'zh_CN',
                                claritybutton: 'disable',
                                draggable: "true",
                                topbardisplay: 'disable'
                            }, "myPlayer");
                        }else{
                            SewisePlayer.toPlay(this.url,"视频",0, true);
                        }
                        //定时器
                        if(!this.type){
                            setTimeout(function() {
                                if(!self.flag){
                                    //把状态改为非处理
                                    self.$message({
                                        message: '当前操作已超时，请重新处理',
                                        type: 'warning'
                                    });
                                    self.axios({
                                        method:"post",
                                        url:self.$iHomed("api","editing")+newValue.id+"/cancel",
                                    }).then((res2)=>{
                                        if(res2.data.code == 0){
                                            console.log("标记解除");
                                            self.flag = true;
                                            self.$router.push({
                                                path: "/callManage/pending",
                                                replace: true
                                            });
                                        }
                                    })
                                }
                            }, this.setTime*1000);
                        }
                        SewisePlayer.onPlayTime(function(time, id) {
                            $(".end").mouseup(function() {
                                self.time = time;
                                // console.log(self.time);
                                self.mode = 4;
                                self.liClick = true;
                                self.monitor = self.row.monitor;
                            })
                        });
                    }
                },
                deep: true
            },
            configData:{
                handler(newValue, oldValue) {
                    if(newValue.homedMonitorTerminalPlayUrl){
                        console.log(newValue);
                        var row = this.$route.query.row;
                        this.type  = this.$route.query.type;
                        var btnS = this.$route.query.btnS;
                        this.status = this.$route.query.status;
                        this.btnS = btnS;
                        if (this.type) {
                            var myPlayer = document.getElementById("myPlayer");
                            $(".player").css("top", "64px");
                            $(".mask").css("width", "0");
                        }
                        //row是点击的信息
                        if (row) {
                            this.row = JSON.parse(row);
                        }
                        this.playUrl = newValue.homedMonitorTerminalPlayUrl;
                        this.startTime = newValue.lookBackTimeSpaceStartTime;
                        this.endTime = newValue.lookBackTimeSpaceEndTime;
                        this.setTime = newValue.handleTimeout;
                        this.getPlayToken = newValue.homedMonitorTerminalGetAuthorityInfoUrl;
                        if(!this.row.monitorUrl ){
                            this.getToken(this.playUrl,this.getPlayToken,this.startTime,this.endTime);
                        }
                    }
                },
                deep:true,
                immediate:true
            }
        },
        methods: {
            changeUrl(){
                console.log(this.row.minitorUrl);
               SewisePlayer.toPlay(this.row.minitorUrl, "监控", 0, true);
            },
            //显示详情框
            editalInfoReturn(a) {
                this.editalInfo = a;
            },
            //选中相应按钮
            opeator(a,b) {

                this.liClick = a;
                if(b == "success"){
                    this.get_next();
                }
            },
            //显示解除框
            infoChange(a) {
                this.buttonShow = a;
                this.btnS = true;
            },
            //解除确定按钮
            removeConfirm() {
                this.buttonShow = true;
                this.liClick = false;
                this.btnS = false;
                this.get_next();
            },
            //获取play_token
            getToken(url,getPlayToken,startTime,endTime) {
                var self = this;
                console.log(self.row);
                if (!self.row.monitorUrl) {
                    self.axios({
                        method: "get",
                        url: getPlayToken,
                        params: {
                            accesstoken: localStorage.getItem("token"),
                            programid: self.row.monitor,
                            playtype:"live"
                        },
                        withCredentials: false
                    }).then((response) => {
                        // console.log(response.data);
                        if (response.data.ret == 0) {
                            self.row.monitorUrl = url + "?accesstoken=" + localStorage.getItem("token") + "&protocol=hls&playtype=lookback&auth=no&rate=org&programid=" + self.row.monitor + "&playtoken=" + response.data.play_token + "&starttime=" +
                                self.utcChange(Number(self.row.createDate) - startTime*1000) + "&endtime=" + self.utcChange(Number(self.row.createDate) + endTime*1000);
                            // this.row.demandurl = url;
                            self.url = self.row.monitorUrl; 
                        }
                    })
                }
            },
            //6个按钮点击事件
            ulbtnClick() {
                var self = this;
                $("ul.handleOpeator").click(function(e) {
                    var e = e || window.event,
                        target = e.target || e.srcElement;
                    switch (target.textContent) {
                        case "致电":
                            self.mode = 1;
                            self.liClick = true;
                            break;
                        case "上报":
                            self.mode = 2;
                            self.liClick = true;
                            break;
                        case "提交":
                            self.mode = 3;
                            self.liClick = true;
                            break;
                            // case "解除":
                            // self.mode =4;
                            // console.log(self.getToken);
                            // self.liClick = true;
                            // self.monitor = self.row.monitor;
                            // break;
                        case "详情":
                            self.editalInfo = true;
                            self.monitor = self.row.monitor;
                            break;
                        case "下一条":
                            self.mode = 6;
                            self.liClick = true;
                            break;
                    }
                })
            },
            //返回按钮
            returnLast() {
                if (this.status == "待处理") {
                    this.$router.push({
                        path: "/callManage/pending",
                        replace: true
                    });
                } else {
                    this.$router.push({
                        path: "/callManage/processed",
                        replace: true
                    });
                }
                var self = this;
                self.axios({
                    method:"post",
                    url:self.$iHomed("api","editing")+self.row.id+"/cancel",
                }).then((res)=>{
                    console.log(res.data);
                    if(res.data.code == 0){
                        console.log("标记解除");
                        self.flag = true;
                    }
                })
            },
            //获取下一个待处理报警
            get_next(){
                 var self = this;
                this.type = self.$route.query.type;
                //处理按钮
                if (!this.type ) {
                    self.axios({
                            url: self.$iHomed("api", "get_untreated"),
                            method: "get",
                            params: {
                                currentPage:this.index,
                                pageSize: 1,
                            }
                        }).then((res) => {
                            console.log(res.data.data.data);
                            if (res.data.data.data) {
                                self.axios({
                                method:"post",
                                url:self.$iHomed("api","editing")+res.data.data.data[this.index-1].id,
                                }).then((res1)=>{
                                    //当前未处理状态
                                    if(res1.data.code == 0){
                                        console.log("标记成功");
                                        //定时器
                                        setTimeout(function() {
                                            if(!self.flag){
                                                //把状态改为非处理
                                                self.$message({
                                                    message: '当前操作已超时，请重新处理',
                                                    type: 'warning'
                                                });
                                                self.axios({
                                                    method:"post",
                                                    url:self.$iHomed("api","editing")+res.data.data.data[this.index-1].id+"/cancel",
                                                }).then((res2)=>{
                                                    if(res2.data.code == 0){
                                                        console.log("标记解除");
                                                        self.flag = true;
                                                        self.$router.push({
                                                            path: "/callManage/pending",
                                                            replace: true
                                                        });
                                                    }
                                                })
                                            }
                                        }, this.setTime*1000);
                                        if(res.data.data.data[this.index-1].monitor){
                                            var datalist = res.data.data.data[this.index-1];
                                            if (!datalist.terminalType) {
                                                datalist.terminalType = "无";
                                            }
                                            datalist.createDateTran = new Date(datalist.createDate).toLocaleDateString() + " " + new Date(datalist.createDate).toLocaleTimeString();
                                            datalist.pendDate = new Date(datalist.pendDate).toLocaleDateString() + " " + new Date(datalist.pendDate).toLocaleTimeString();
                                            datalist.reportDate = new Date(datalist.reportDate).toLocaleDateString() + " " + new Date(datalist.reportDate).toLocaleTimeString();
                                            self.row = datalist;
                                            self.getToken(this.playUrl,this.getPlayToken,this.startTime,this.endTime);
                                        }else{
                                            self.axios({
                                                method:"post",
                                                url:self.$iHomed("api","editing")+res.data.data.data[this.index-1].id+"/cancel",
                                            }).then((res2)=>{
                                                if(res2.data.code == 0){
                                                    console.log("标记解除");
                                                    self.flag = true;
                                                    self.$router.push({
                                                        path: "/callManage/pending",
                                                        replace: true
                                                    });
                                                }
                                            })
                                        }
                                    }
                                    //有人处理
                                    else {
                                        this.index++;
                                        this.get_next();
                                    }
                                })
                                
                            }
                        })
                 //视频播放页
                } else {
                    this.$router.push({
                        path: "/callManage/pending",
                        replace: true
                    });
                }
            }

        },
        computed: {
            // player() {
            //     return this.$refs.videoPlayer.player
            // },
            getUrl: function() {
                if (this.row.minitorUrl) { // 触发播放路径更新
                    SewisePlayer.toPlay(this.url, "监控", 0, true);
                }
                return this.url;
            }
        },
        mounted() {
            var row = this.$route.query.row;
            this.type  = this.$route.query.type;
            var btnS = this.$route.query.btnS;
            this.status = this.$route.query.status;
            this.btnS = btnS;
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function() {
                history.pushState(null, null, document.URL);
            });
            if (this.type) {
                var myPlayer = document.getElementById("myPlayer");
                $(".player").css("top", "64px");
                $(".mask").css("width", "0");
            }
            //row是点击的信息
            if (row) {
                this.row = JSON.parse(row);
                // console.log(this.row);
            }
            //获取下一个数据
            this.ulbtnClick();
        }
    }
</script>
<style lang="" scoped>
    #myPlayer {
        width: 100%;
        height: 100%;
        margin-top: 0!important;
        z-index: 99;
    }
    
    .player {
        position: fixed!important;
        right: 24px!important;
        left: 264px!important;
        top: 148px;
        bottom: 132px!important;
        z-index: 99;
    }
    
    .info {
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: #f0f0f0;
    }
    
    .buttonHandle {
        width: 100%;
        height: 36px;
    }
    
    .handle {
        position: fixed;
        top: 95px;
        left: 250px;
    }
    
    .call .el-button {
        margin-left: 0;
    }
    
    .el-button {
        width: 90px;
        height: 36px;
        margin-left: 16px;
    }
    
    .el-popover {
        box-shadow: none;
        border: 0;
        padding: 0;
        margin-left: 24px;
        margin-top: 6px;
    }
    
    .handleOpeator li {
        float: left;
    }
    
    .video-player.video-player-box>div {
        width: 1100px;
        height: 550px;
    }
    
    .monitorInfo {
        width: 360px;
        height: 168px;
        position: fixed;
        bottom: 84px;
        right: 24px;
        background: #fff;
        z-index: 99;
        box-shadow: 2px 2px 5px #333333;
    }
    
    .destription {
        width: 240px;
        height: 86px;
        line-height: 86px;
        text-align: center;
        margin-top: 30px;
        margin-left: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .returnLast {
        position: fixed;
        top: 20px;
        right: 24px;
        height: 28px;
        line-height: 5px;
    }
    
    .mask {
        width: 240px;
        position: fixed;
        top: 64px;
        bottom: 0;
        left: 0;
        background: #000;
        opacity: 0;
        z-index: 98;
        cursor: not-allowed;
    }
</style>