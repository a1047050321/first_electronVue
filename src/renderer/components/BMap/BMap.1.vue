<template>
<div class="content-wraper">
<div class="content">
         <el-button type="primary" class="exportData" @click="exportData">导出数据</el-button>
         <el-button type="primary" class="return" @click="returnLast">返回上一级</el-button>
    <div class="nav-wrapper">
            <!-- 面包屑导航路径 -->
            <el-breadcrumb>
                <el-breadcrumb-item>
                <router-link to="/index/bMap">首页</router-link>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    <div id="allmap" v-bind:style="mapStyle"></div>
    <monitor-info :moniInfoShow="moniInfoShow" :alarmType="alarmType"></monitor-info>
</div>
    <v-echarts :areaId="areaId" style="margin-right:40px;"></v-echarts>
</div>
</template>
<script>
import Echarts from "./Echarts"
import Pie from "./Pie"
import MonitorInfo from "./MonitorInfo"
import bus from "../../assets/js/bus"
import md5 from "js-md5"
export default{
    data:function(){
            return{
                mapStyle:{
                    height:'680px',
                    "margin-top":"20px",
                    "margin-right":"40px",
                    "margin-bottom":"100px",
                },
                overlays:[],
                map:"",
                almActShow:true,
                moniFaultShow:false,
                moniInfoShow:true,
                temp:false,
                allData:[],
                currentPoint:{},
                areaId:null,
                old:null,
                i:0,
                role:null,
            }
        },
    props:{
    // 地图在该视图上的高度
        mapHeight:{
        type:Number,
        default:500
        },
        // 经度
        longitude:{
        type:Number,
        default:104.06	
        },
        // 纬度
        latitude:{
        type:Number,
        default:30.67	
        },
        description:{
        type:String,
        default:''
        },
        alarmType:{
            type:Array,
            default:[]
        },

    },
    mounted(){
       this.areaId = localStorage.getItem("areaId");
       this.role = localStorage.getItem("role");
       this.mapShow();
       this.newAlarmData();
       if( localStorage.getItem("role")){
            this.getToken();
       }
    },
    watch:{
        areaId(areaId){
            this.mapShow();
            if(areaId == localStorage.getItem("areaId")){
                this.i = 0;
            }else{
                if(areaId == this.old){
                    alert("上一步");
                    this.i -=3;
                }else{
                    alert("下一步");
                    this.i +=3;
                }
            }
        }
    },
    methods:{
        moniFault(a){
            this.moniFaultShow = a;
        },
        mapShow(){
            var self = this;
            if(!BMap){
                self.$alert("地图加载不正常，请刷新");
            }else{
                var map =new BMap.Map("allmap");
                this.map = map;
                self.i =  self.i ;
                // var point =new BMap.Point(this.longitude,this.latitude);
                // addMarker(point);
                // map.centerAndZoom(point,6);
                // 信息窗的配置信息
                function addNumber(point,number){
                var opts = {
                    position : point,    // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(-10, -50)    //设置文本偏移量
                }
                var label = new BMap.Label(number, opts);  // 创建文本标注对象
                label.setStyle({
                    color : "red",
                    fontSize : "20px",
                    height : "20px",
                    fontFamily:"微软雅黑",
                    border:"none"
                });
                map.addOverlay(label);  
            };
            //允许鼠标缩放
            map.enableScrollWheelZoom(true);
            //添加坐标点
            function addMarker(point){
                var marker = new BMap.Marker(point);
                map.addOverlay(marker);
                marker.addEventListener("click", function(){
                    //获取点击的areaId
                     for(let i = 0;i< self.allData.length; i++){
                        if(self.allData[i].lat == this.point.lat && self.allData[i].lng ==this.point.lng){
                            self.currentPoint = self.allData[i];
                            console.log(self.currentPoint);
                            self.areaId = self.currentPoint.areaId;
                        }
                     }
                });
            }
            //获取接口的区域未处理的点
            self.allData = [];
            var center = {};
            self.axios({
                method:"get",
                url:self.$iHomed("api","map_point")+self.areaId,
                params:{
                    codes:localStorage.getItem("codes")
                }
            }).then((res)=>{
                console.log(res);
                if(res.data.data){
                    var datalist = res.data.data;
                    var point =new BMap.Point(datalist[0].lng,datalist[0].lat);
                    addMarker(point);
                    addNumber(point,datalist[0].untreatedTotal);
                    if(self.role == 10){
                        map.centerAndZoom(point,12+self.i);
                    }else if(self.role == 50){
                        map.centerAndZoom(point,10+self.i);
                    }else{
                        map.centerAndZoom(point,8+self.i);
                    }
                    // center.lng = datalist.lng;
                    // center.lat = datalist.lat;
                    // center.untreatedTotal = datalist.untreatedTotal;
                    self.old = datalist[0].pid;
                    self.allData = datalist;
                    for(let i = 1;i< datalist.length;i++){
                        var current = new BMap.Point(datalist[i].lng,datalist[i].lat);
                        addMarker(current);
                        addNumber(current,datalist[i].untreatedTotal);
                    }
                }else{
                    return false;
                }
            })
            }
        },
        //导出折线图数据
        exportData(){
            var self = this;
            window.location =  self.$iHomed("api","echarts_data")+self.areaId
        },
        //返回上一级
        returnLast(){
            var self = this;
            self.areaId = $.extend({},self.old);
        },
        //获取新报警消息
        newAlarmData(){
            var self = this;
            if (location.search == '?ws') {
                    var client = Stomp.client('ws://192.168.18.100:15674/ws');
            } else {
                var ws = new SockJS('http://192.168.18.100:15674/stomp');
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
                    client.subscribe("/amq/queue/"+localStorage.getItem('queue'), function(d) {
                    // console.log(d.headers);
                    // console.log(d.headers["reply-to"]);
                    localStorage.setItem('reply',d.headers["reply-to"]);
                    // localStorage.setItem('newAlarm',d.body);
                    if(d){
                        self.temp = true;
                        bus.$emit("temp",true);
                    }
                    console.log(self.$router.history.current.name);
                        self.$notify({
                        title: '报警信息',
                        message: '新接到一条报警消息',
                        type: 'info',
                        onClick:function(){ 
                            self.$router.push({path: '/callManage/pending', replace: true});   
                        }
                    });
                    self.newAlarm = d;
                    var url =localStorage.getItem('reply').split("/")[2];
                    console.log(url);
                    if(d){
                        client.send("/amq/queue/"+url, {
                            "content-type": "application/json"
                        }, "success");
                        url="";
                    }
                    // print_first("success");
                });
            };
            var time = 0;
            var on_error = function() {
                console.log('error');
                time = time +1;
                bus.$emit("error",time);
                self.$iHomed('logout'); 
                return false;
            };
            client.connect('admin', 'admin', on_connect, on_error, '/');
        },
        getToken(){
            var self = this;
            console.log(localStorage.getItem("token"));
            if(!localStorage.getItem("token")){
                var timeDate = self.timeStamp(new Date());
                self.axios({
                    method:"post", 
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    withCredentials: false,
                    url:self.$iHomed("api","get_token"),
                    data:{
                        "deviceno":timeDate+ "" + md5(""+timeDate)[7],
                        "devicetype":"zdt",
                        "accounttype":3,
                        "account":localStorage.getItem("tel")+"",
                        "timestamp":timeDate+"",
                        "signature":md5((timeDate+""+ md5(""+timeDate)[7])+"|zdt|3|"+localStorage.getItem("tel")+"|"+timeDate+""),
                        "identification":localStorage.getItem("CA").toLowerCase()+""
                    }
                }).then((res)=>{
                    if(res.data.ret == 0){
                        localStorage.setItem("token",res.data.access_token);
                        console.log(localStorage.getItem("token"));
                    }else{
                        this.$alert("未获取到有效token,请稍后重试！");
                        localStorage.setItem("token","");
                    }
                })
            }
        },   
    },
    components:{
        "v-echarts":Echarts,
        "monitor-info":MonitorInfo,
    }
}
</script>
<!--Add"scoped" attribute to limit CSS to this component only -->
<style scoped>
.nav-wrapper span{
    font-size:15px;
}
.content-wraper{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left:18%;
    overflow-x:scroll;
    overflow-y:scroll;
}
.content{
    width:100%;
}

.slider {
    width: 30px;
    height: 150px;
    position: absolute;
    top: 200px;
    right: 100px;
    text-align: center;
}
.buttonAll button{
    margin-top:2px;
    width:100px;
    height:35px;
}

.scroll {
    width: 30px;
    height: 90px;
    text-align: left;
    position: relative;
}
 .el-slider{
     margin-top:5px;
 }

.scroll span:first-child {
    display: inline-block;
    width: 2px;
    height: 90px;
    background-color: #ccc;
}
.up.icon,
.down.icon {
    background: url('../../../static/image/tool.png') no-repeat 0 0;
    width: 28px;
    display: inline-block;
    height: 16px;
    margin-top: 9px;
    margin-left:3px;
}
.up.icon {
    background-position: -400px -95px;
}
.down.icon {
    background-position: -425px -95px;
}
.el-button{
        width:110px;
        height:28px;
        line-height:8px;
    }
    .exportData{
        position:absolute;
        top:850px;
        right:40px;
        z-index:99;
    }
    .return{
        position:absolute;
        top:10px;
        right:40px;
        z-index:99;
        width:110px;
    }
</style>