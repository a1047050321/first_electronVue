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
        <div class="buttonHandle" style="margin:24px 0;">
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
                <div><el-button type="primary" @click="ulbtnClick">详情</el-button></div>
            </li>
        </ul>
        </div>
        <div class="player">
            <div class="info">报警人信息:{{row.name +"  "+ row.createDateTran +"  "+ row.alarmTypeName}}</div>
            <!--<div class="mp4">
                <video-player  class="video-player-box"
                    ref="videoPlayer"
                    :options="playerOptions"
                    :playsinline="true"
                    customEventName="customstatechangedeventname"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"
                    @statechanged="playerStateChanged($event)"
                    @ready="playerReadied">
                </video-player>
            </div>
            -->
            <div id="myPlayer" :url="getProgramID"></div>
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
    import NoMonitor from './NoMonitor'
    import EditalInfo from "./EditalInfo"
    export default {
        props: ["moniInfoShow", "alarmType"],
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
                // playerOptions: {
                // // videojs options
                // muted: true,
                // language: 'en',
                // playbackRates: [2.0, 4.0, 6.0],
                // sources: [
                //     // {
                // //     type: "video/mp4",
                // //     src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                // // },
                // {
                //         type: "application/x-mpegURL",
                //         src: "http://httpdvb.slave.homed.me:13164/playurl?accesstoken=R59A3E95FU508C6023KB2D06C01I6F18A8C0P0MF430AWDAD92CC0EF1&programid=4202006972&playtype=live&playtoken=ABCDEFG&protocol=hls"
                // }],
                // poster: "",
                // }
            }
        },
        components: {
            "no-monitor": NoMonitor,
            "edital-info": EditalInfo
        },
        watch:{
            row: {　　　　
                handler(newValue, oldValue) {
                    // alert(newValue.monitorUrl);
                    if(newValue.monitorUrl != null){
                        // this.changeUrl();
                    }
                },
                　　deep: true
            },
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
                    this.removeConfirm();
                }
            },
            //显示解除框
            infoChange(a) {
                this.buttonShow = a;
            },
            //解除确定按钮
            removeConfirm() {
                this.buttonShow = true;
                this.liClick = false;
                var self = this;
                var type = self.$route.query.type;
                //处理按钮
                if (!type) {
                    self.axios({
                            url: self.$iHomed("api", "get_untreated"),
                            method: "get",
                            params: {
                                currentPage: 1,
                                pageSize: 1
                            }
                        })
                        .then((res) => {
                            console.log(res.data);
                            if (res.data.data.data) {
                                if(res.data.data.data[0].monitor){
                                    // alert("第一条是监控报警！");
                                    for (let i = 0; i < res.data.data.data.length; i++) {
                                        var datalist = res.data.data.data;
                                        if (!datalist[i].terminalType) {
                                            datalist[i].terminalType = "无";
                                        }
                                        datalist[i].createDateTran = new Date(datalist[i].createDate).toLocaleDateString() + " " + new Date(datalist[i].createDate).toLocaleTimeString();
                                        datalist[i].pendDate = new Date(datalist[i].pendDate).toLocaleDateString() + " " + new Date(datalist[i].pendDate).toLocaleTimeString();
                                        datalist[i].reportDate = new Date(datalist[i].reportDate).toLocaleDateString() + " " + new Date(datalist[i].reportDate).toLocaleTimeString();
                                    }
                                    self.row = res.data.data.data[0];
                                    self.getToken();
                                }else{
                                    this.$router.push({
                                        path: "/callManage/pending",
                                        replace: true
                                    });
                                }
                            }
                        }).catch((error) => {
                            //地址错误
                            console.log(error);
                        })
                        //视频播放页
                } else {
                    this.$router.push({
                        path: "/callManage/pending",
                        replace: true
                    });
                }
            },
            //获取play_token
            getToken() {
                var self = this;
                console.log(self.row);
                if (!self.row.monitorUrl) {
                    self.axios({
                        method: "get",
                        url: self.$iHomed("api", "paly_url"),
                        params: {
                            accesstoken: localStorage.getItem("token"),
                            chnlid: self.row.monitor
                        },
                        withCredentials: false
                    }).then((res) => {
                        // console.log(res.data.demand_url[0]);
                        self.axios({
                            method: "get",
                            url: self.$iHomed("api", "paly_token"),
                            params: {
                                accesstoken: localStorage.getItem("token"),
                                programid: self.row.monitor
                            },
                            withCredentials: false
                        }).then((response) => {
                            // console.log(response.data);
                            if (response.data.ret == 0) {
                                self.row.monitorUrl = res.data.demand_url[0] + "?accesstoken=" + localStorage.getItem("token") + "&protocol=hls&playtype=lookback&auth=no&rate=org&programid=" + self.row.monitor + "&playtoken=" + response.data.play_token + "&starttime=" +
                                    self.utcChange(Number(self.row.createDate) - 60000) + "&endtime=" + self.utcChange(Number(self.row.createDate) + 400000);
                                // this.row.demandurl = url;
                                if(!self.first){
                                    self.first = true;
                                    SewisePlayer.setup({
                                        server: "vod",
                                        type: "m3u8",
                                        videourl: self.row.monitorUrl,
                                        skin: "vodWhite",
                                        title: "视频监控",
                                        lang: 'zh_CN',
                                        claritybutton: 'disable',
                                        draggable: "true",
                                        topbardisplay: 'disable'
                                    }, "myPlayer");
                                }else{
                                    SewisePlayer.toPlay(self.row.minitorUrl, "监控", 0, true);
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
                        })
                    })
                }
            },
            //获取下一个报警处理
            getNext(){

            },
            // popover(){
            //     $(".el-popover").css("display","none");
            // },
            //  // listen event
            // onPlayerPlay(player) {
            //     // console.log('player play!', player)
            // },
            // onPlayerPause(player) {
            //     // console.log('player pause!', player)
            // },
            // // ...player event

            // // or listen state event
            // playerStateChanged(playerCurrentState) {
            //     // console.log('player current update state', playerCurrentState)
            // },

            // // player is ready
            // playerReadied(player) {
            //     console.log('the player is readied', player)
            //     // you can use it to do something...
            //     // player.[methods]
            // },
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
            }
        },
        computed: {
            // player() {
            //     return this.$refs.videoPlayer.player
            // },
            getProgramID: function() {
                if (this.first && this.row.minitorUrl) { // 触发播放路径更新
                console.log(this.row.minitorUrl);
                    SewisePlayer.toPlay(this.row.minitorUrl, "监控", 0, true);
                }
                return this.row.minitorUrl;
            }
        },
        mounted() {
            var row = this.$route.query.row;
            var type = this.$route.query.type;
            var btnS = this.$route.query.btnS;
            this.status = this.$route.query.status;
            this.btnS = btnS;
            if (type) {
                var myPlayer = document.getElementById("myPlayer");
                $(".player").css("top", "64px");
                $(".mask").css("width", "0");
            }
            //row是点击的信息
            if (row) {
                this.row = JSON.parse(row);
                console.log(this.row);
            }
            //请求接口变成正在处理状态

            this.getToken();
            // this.playerOptions.sources = [{}];
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