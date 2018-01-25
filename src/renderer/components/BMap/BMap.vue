<template>
<div class="content-wraper">
<div class="content">
         <el-button type="primary" class="return" @click="returnLast" :disabled="returnBack">返回所在区域</el-button>
    <div id="allmap" v-bind:style="mapStyle"></div>
</div>
<div class="edital" v-if="first">
    <div style="margin-top:16px;">实时各区域</div>
    <div>待处理警情数</div>
    <div class="first" :title="first" v-if="first">{{first}}</div>
    <div class="second" :title="second" v-if="second">{{second}}</div>
    <div class="third" :title="third" v-if="third">{{third}}</div>
</div>
    <monitor-info :moniInfoShow="moniInfoShow" :alarmType="alarmType" :configData="configData"  :current="1"></monitor-info>
</div>
</template>
<script>
    var script = document.createElement("script");
    script.setAttribute("src","http://api.map.baidu.com/getscript?v=2.0&ak=5mhvmOt5aZBXKoZyUp8vGhkL9u5IZp59&services=&t=20180102152545");
    script.setAttribute("type","text/javascript");
    document.body.appendChild(script);
    var script1 = document.createElement("script");
    script1.setAttribute("src","http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js");
    script1.setAttribute("type","text/javascript");
    document.body.appendChild(script1);
    var script2 = document.createElement("script");
    script2.setAttribute("src","../../../../static/stomp/src/html/rabbitmq/sockjs-0.3.js");
    script2.setAttribute("type","text/javascript");
    document.body.appendChild(script2);
    var script3 = document.createElement("script");
    script3.setAttribute("src","../../../../static/stomp/src/html/rabbitmq/stomp.js");
    script3.setAttribute("type","text/javascript");
    document.body.appendChild(script3);
     import $ from "jquery"
    import MonitorInfo from "./MonitorInfo"
    import bus from "../../assets/js/bus.js"
    import md5 from "js-md5"
    export default {
        data() {
            return {
                mapStyle: {
                    height: '100%',
                    width: "100%",
                    position: 'fixed',
                    top: "24px",
                    left: "24px",
                },
                overlays: [],
                map: "",
                almActShow: true,
                moniFaultShow: false,
                moniInfoShow: true,
                temp: false,
                allData: [],
                currentPoint: {},
                areaId: null,
                old: null,
                i: 0,
                role: null,
                returnBack: true,
                first: "",
                second: "",
                third: "",
            }
        },
        props: {
            // 地图在该视图上的高度
            mapHeight: {
                type: Number,
                default: 500
            },
            // 经度
            longitude: {
                type: Number,
                default: 104.06
            },
            // 纬度
            latitude: {
                type: Number,
                default: 30.67
            },
            description: {
                type: String,
                default: ''
            },
            alarmType: {
                type: Array,
                default: []
            },
            configData: {
                type: Object,
                default: {}
            },
        },
        mounted() {
            this.areaId = localStorage.getItem("areaId");
            this.role = localStorage.getItem("role");
            this.mapShow();
            // this.newAlarmData();
        },
        watch: {
            areaId(areaId) {
                this.$emit("areaId", areaId);
                this.mapShow();
                if (areaId == localStorage.getItem("areaId")) {
                    this.i = 0;
                } else {
                    if (areaId == this.old) {
                        this.i -= 3;
                    } else {
                        this.i += 3;
                    }
                }
            },
            configData(data){
                 var self = this;
                 console.log(data);
                if (!localStorage.getItem("token")) {
                    var timeDate = self.timeStamp(new Date());
                    self.axios({
                        method: "post",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        withCredentials: false,
                        url:data.homedTerminalLoginUrl,
                        data: {
                            "deviceno": timeDate + "" + md5("" + timeDate)[7],
                            "devicetype": "zdt",
                            "accounttype": 3,
                            "account": localStorage.getItem("tel") + "",
                            "timestamp": timeDate + "",
                            "signature": md5((timeDate + "" + md5("" + timeDate)[7]) + "|zdt|3|" + localStorage.getItem("tel") + "|" + timeDate + ""),
                            "identification": localStorage.getItem("CA").toLowerCase() + ""
                        }
                    }).then((res) => {
                        if (res.data.ret == 0) {
                            localStorage.setItem("token", res.data.access_token);
                            console.log(localStorage.getItem("token"));
                        } else {
                            this.$alert("未获取到有效token,请稍后重试！");
                            localStorage.setItem("token", "");
                        }
                    })
                }
                this.newAlarmData(data.rabbitmqIp,data.rabbitmqPort,data.rabbitmqUsername,data.rabbitmqPassword);
            }
        },
        methods: {
            moniFault(a) {
                this.moniFaultShow = a;
            },
            mapShow() {
                var self = this;
                var map = new BMap.Map("allmap");
                this.map = map;
                self.i = self.i;
                // var point =new BMap.Point(this.longitude,this.latitude);
                // addMarker(point);
                // map.centerAndZoom(point,6);
                // 信息窗的配置信息
                function addNumber(point, number) {
                    var opts = {
                        position: point, // 指定文本标注所在的地理位置
                        offset: new BMap.Size(-10, -50) //设置文本偏移量
                    }
                    var label = new BMap.Label(number, opts); // 创建文本标注对象
                    label.setStyle({
                        color: "red",
                        fontSize: "20px",
                        height: "20px",
                        fontFamily: "微软雅黑",
                        border: "none",
                        background: "rgba(255,255,255,0.3)"
                    });
                    map.addOverlay(label);
                };
                //允许鼠标缩放
                map.enableScrollWheelZoom(true);
                //添加坐标点
                function addMarker(point) {
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);
                    marker.addEventListener("click", function() {
                        //判断当前加载的点是否可以点击
                        if(self.allData.click){
                            //获取点击的areaId
                            for (let i = 0; i < self.allData.data.length; i++) {
                                if (self.allData.data[i].lat == this.point.lat && self.allData.data[i].lng == this.point.lng) {
                                    self.currentPoint = self.allData.data[i];
                                    console.log(self.currentPoint);
                                    self.areaId = self.currentPoint.areaId;
                                    self.returnBack = false;
                                }
                            }
                        }
                    });
                }
                //获取接口的区域未处理的点
                self.allData = [];
                var center = {};
                self.axios({
                    method: "get",
                    url: self.$iHomed("api", "map_point") + self.areaId,
                    params: {
                        codes: localStorage.getItem("codes")
                    }
                }).then((res) => {
                    if (res.data.data) {
                        var datalist = res.data.data;
                        self.first = "";
                        self.second = "";
                        self.third = "";
                        //显示报警数量前三名
                        if (datalist.data.length >= 3) {
                            self.first = datalist.data[0].areaName + " " + datalist.data[0].untreatedTotal+"条";
                            self.second = datalist.data[1].areaName + " " + datalist.data[1].untreatedTotal+"条";
                            self.third = datalist.data[2].areaName + " " + datalist.data[2].untreatedTotal+"条";
                        } else if (datalist.data.length == 2) {
                            self.first = datalist.data[0].areaName + " " + datalist.data[0].untreatedTotal+"条";
                            self.second = datalist.data[1].areaName + " " + datalist.data[1].untreatedTotal+"条";
                
                        } else if (datalist.data.length == 1) {
                            self.first = datalist.data[0].areaName + " " + datalist.data[0].untreatedTotal+"条";
                        }
                        //记录上一层的id
                        self.old = datalist.pid;
                        if (self.old == 0) {
                            self.returnBack = true;
                            self.old = localStorage.getItem("areaId");
                        }
                        function fiter(a) {
                            return a.areaName == "成都市";
                        }
                        var point = new BMap.Point(datalist.data[0].lng, datalist.data[0].lat);
                        addMarker(point);
                        addNumber(point, datalist.data[0].untreatedTotal);
                        if (self.role == 10) {
                            map.centerAndZoom(point, 11 + self.i);
                        } else if (self.role == 50) {
                            map.centerAndZoom(point, 9 + self.i);
                        } else {
                            if (datalist.data.filter(fiter).length != 0) {
                                point = new BMap.Point(datalist.data.filter(fiter)[0].lng, datalist.data.filter(fiter)[0].lat);
                            }
                            map.centerAndZoom(point, 7 + self.i);
                        }
                        self.allData = datalist;

                        for (let i = 1; i < datalist.data.length; i++) {
                            var current = new BMap.Point(datalist.data[i].lng, datalist.data[i].lat);
                            addMarker(current);
                            addNumber(current, datalist.data[i].untreatedTotal);
                        }
                    } else {
                        return false;
                    }
                })
            },
            //返回上一级
            returnLast() {
                var self = this;
                self.areaId = self.old;
            },
            //获取新报警消息
            newAlarmData(rabbitmqIp,rabbitmqPort,rabbitmqUsername,rabbitmqPassword) {
                var self = this;
                if (location.search == '?ws') {
                    // var client = Stomp.client('ws://192.168.18.100:15674/ws');
                    var client = Stomp.client('ws://'+rabbitmqIp+':'+rabbitmqPort+'/ws');
                } else {
                    var ws = new SockJS('http://'+rabbitmqIp+':'+rabbitmqPort+'/stomp');
                    var client = Stomp.over(ws);
                }
                client.heartbeat.outgoing = 20000;
                client.heartbeat.incoming = 0;
                // console.log(client.debug);
                // var print_first = pipe(function(data) {
                //     client.send(localStorage.getItem('reply'), {
                //         "content-type": "application/json"
                //     }, data);
                // });
                var on_connect = function(x) {
                    client.subscribe("/amq/queue/" + localStorage.getItem('queue'), function(d) {
                        // console.log(d.headers);
                        // console.log(d.headers["reply-to"]);
                        localStorage.setItem('reply', d.headers["reply-to"]);
                        // localStorage.setItem('newAlarm',d.body);
                        if (d) {
                            console.log(d);
                            self.temp = true;
                            //全局刷新
                            bus.$emit("temp", true);
                        }
                        //全局提示消息
                        self.$notify({
                            title: '报警信息',
                            message: '新接到一条报警消息',
                            type: 'success',
                            onClick: function() {
                                self.$router.push({
                                    path: '/callManage/pending',
                                    replace: true
                                });
                            }
                        });
                        self.newAlarm = d;
                        var url = localStorage.getItem('reply').split("/")[2];
                        console.log(url);
                        if (d) {
                            client.send("/amq/queue/" + url, {
                                "content-type": "application/json"
                            }, "success");
                            url = "";
                        }
                        // print_first("success");
                    });
                };
                var time = 0;
                var on_error = function() {
                    console.log('error');
                    time = time + 1;
                    if (time == 1) {
                        //退出登录 防止推出多次
                        self.$iHomed("logout");
                    }
                };
                client.connect(rabbitmqUsername, rabbitmqPassword, on_connect, on_error, '/');
            },
        },
        components: {
            "monitor-info": MonitorInfo,
        }
    }
</script>
<!--Add"scoped" attribute to limit CSS to this component only -->
<style scoped>
    .content-wraper {
        position: fixed;
        top: 64px;
        bottom: 84px;
        right: 24px;
        left: 240px;
        overflow: hidden;
    }
    
    .content {
        width: 100%;
        height: 100%;
    }
    
    .slider {
        width: 30px;
        height: 150px;
        position: absolute;
        top: 200px;
        right: 100px;
        text-align: center;
    }
    
    .buttonAll button {
        margin-top: 2px;
        width: 100px;
        height: 35px;
    }
    
    .scroll {
        width: 30px;
        height: 90px;
        text-align: left;
        position: relative;
    }
    
    .el-slider {
        margin-top: 5px;
    }
    
    .scroll span:first-child {
        display: inline-block;
        width: 2px;
        height: 90px;
        background-color: #ccc;
    }
    
    
    .el-button.return {
        position: fixed;
        top: 30px;
        right: 264px;
        z-index: 99;
        height: 28px;
        line-height: 5px;
    }
    
    .edital {
        position: fixed;
        top: 88px;
        left: 264px;
        width: 164px;
        background: #fff;
        box-shadow:2px 2px 5px #333333;
        text-align: center;
        font-size: 14px;
        border-radius: 2px;
    }
    
    .edital div {
        margin-bottom: 8px;
    }
    
    .first,
    .second,
    .third {
        width: 132px;
        height: 32px;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space:nowrap;
        line-height: 32px;
        margin-left: 16px;
        border-radius: 5px;
        color: #fff;
    }
    
    .first {
        background: #fa5555;
    }
    
    .second {
        background: #EB9E05;
    }
    
    .third {
        background: #409EFF;
    }
</style>