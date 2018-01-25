<template>
<div class="body">    
    <div class="mask"></div>
     <!--li点击后显示的框-->
        <!--致电-->
        <div class="callLi1" v-if="mode==1 && row">
            <div class="title">核实报警</div>
            <div style="margin-top:22px;">
            <p>报警人:{{row.name}}</p>
            <p>电话:{{row.contact}}</p>
            </div>
            <div class="button" style="text-align:right;margin-top:22px;">
                <el-button type="primary"  @click="cancel_1" style="margin-right:24px;">确定</el-button>
            </div>
        </div>
        <!--上报-->
        <div class="callLi" v-if="mode==2 && row">
            <div class="title">上报理由</div>
        <el-input type="textarea" :rows=4 placeholder="上报理由(必填)" v-model="remark"></el-input>
            <div class="button" style="text-align:right;magin-top:18px;">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary"  @click="confirm"  style="margin-right:24px;">确定</el-button>
            </div>
        </div>
        <!--提交-->
        <div class="callLi" v-if="mode==3 && row">
            <div class="title">提交确认</div>
            <el-input type="textarea" :rows=4 placeholder="备注（选填）" focus="" v-model="submit"></el-input>
            <div class="button" style="text-align:right;magin-top:20px;">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary"  style="margin-right:24px;"  @click="confirm">确定</el-button>
                </div>
        </div>
        <!--解除-->
        <div class="callLi1" v-if="mode==4 && !row.monitor">
            <div class="title">解除确认</div>
            <div style="margin-top:22px;">
                <p>报警人:{{row.name}}</p>
                <p>电话:{{row.contact}}</p>
            </div>
            <div class="button" style="text-align:right;margin-top:22px;">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm" style="margin-right:24px;">确定</el-button>
            </div>
        </div>
        <div class="callLi1" v-if="mode==4 && row.monitor">
            <div class="title">解除确认</div>        
            <p style="text-align:center;margin-top:34px;">请截图监控画面，确认证明无警情</p>
            <div class="button" style="text-align:right;margin-top:34px;">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm"  style="margin-right:24px;">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import bus from "../../assets/js/bus"
    export default{
        props:["mode","row","time"],
        data(){
            return {
                liClick:false,
                buttonShow:false,
                reportReason:"",
                remark:"",
                pictureUrl:"",
                submit:"",
                status:"fail",
            }
        },
        methods:{
            cancel_1(){
                this.$emit("liClick",this.liClick,"false");
            },
            cancel(){
                this.$emit("liClick",this.liClick);
                this.$message("已取消操作！");
                //请求接口变成正在处理状态
            },
            confirm(){
                var self = this;
                switch(self.mode){
                    case 2:
                    if(!self.remark){
                        self.$alert("请填写上报理由");
                    }
                    else{
                        self.axios({
                            method:"put",
                            url:self.$iHomed("api","put_remark")+self.row.id+"/report",
                            data:{
                                    "alarmId": self.row.id,
                                    "remark": self.remark
                                }
                        })
                        .then((res)=>{
                            var ret = res.data.data;
                            if(ret){
                                self.$message({
                                    message: '上报成功',
                                    type: 'success'
                                });
                                if(self.$router.history.current.name == "HandlePending"){
                                    // alert("当前监控页");
                                    self.status = "success";
                                    self.$emit("liClick",self.liClick,self.status);
                                }else{
                                    bus.$emit("temp", true);
                                    self.$emit("liClick",self.liClick);
                                }
                            }
                            else{
                                self.$alert(res.data.msg);
                                self.status = "fail";
                                self.$emit("liClick",self.liClick,self.status);
                            }
                        }) 
                    }
                    break;
                    //提交
                    case 3:
                    console.log(self.$router.history.current.name == "HandlePending");
                        self.axios({
                            method:"put",
                            url:self.$iHomed("api","put_remark")+self.row.id+"/submit",
                            data:{
                                "remark": self.submit
                                }
                            })
                            .then((res)=>{
                                var ret = res.data.data;
                                if(ret){
                                    self.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    if(self.$router.history.current.name == "HandlePending"){
                                        self.status = "success";
                                        self.$emit("liClick",self.liClick,self.status);
                                    }else{
                                        bus.$emit("temp", true);
                                        self.$emit("liClick",self.liClick);
                                    }
                                }
                                else{
                                    self.$alert(res.data.msg);
                                    self.status = "fail";
                                    self.$emit("liClick",self.liClick,self.status);
                                    // bus.$emit("temp", true);
                                }
                            }) 
                    break;
                    case 4:
                        if(!self.row.monitor){
                            self.axios({
                                    method:"put",
                                    url:self.$iHomed("api","put_remark")+self.row.id+"/relieve?time=0",
                                }).then((response)=>{
                                console.log(response);
                                if(response.data.data){
                                    self.$emit("buttonShow",self.buttonShow);
                                    self.atatus = "success";
                                    self.$emit("liClick",self.liClick,self.status);
                                }else{
                                    self.$alert(response.data.msg);
                                    self.atatus = "fail";
                                    self.$emit("liClick",self.liClick,self.status);
                                }
                            })
                        }else{
                            self.axios({
                                method:"put",
                                url:self.$iHomed("api","put_remark")+self.row.id+"/relieve?time="+self.dateTranslate(self.row.createDate,self.time),
                                }).then((response)=>{
                                console.log(response);
                                if(response.data.data){
                                    self.$emit("buttonShow",self.buttonShow);
                                    self.atatus = "success";
                                    self.$emit("liClick",self.liClick,self.status);
                                }else{
                                    self.$alert(response.data.msg);
                                    self.atatus = "fail";
                                    self.$emit("liClick",self.liClick,self.status);
                                }
                            }).catch((err)=>{
                                console.log(err);
                            })
                        }
                    break;
                }
            }
        }
    }
</script>
<style scoped>
.body{
    position:fixed;
    top:50%;
    left:50%;
    z-index:99;
}
.callLi,.callLi1{
    position:absolute;
    left:-142.5px;
    width:285px;
    z-index:99;    
    background:#fff;
    text-align:center;
}
.callLi{
    height:220px;
    top:-110px;    
}
.callLi1{
    height:172px;
    top:-86px;
    overflow:hidden;
}
.callLi p,.callLi1 p{
    height:16px;
    font-size:14px;
    text-align:center;
    margin-top:10px;
    color:#666;
}
.callLi .el-textarea{
    margin:18px 0;
    width:90%;
    height:98px;
}
.title{
    width:100%;
    height:40px;
    line-height:40px;
    text-align:left;
    font-size:16px;
    padding-left:16px;
    background:#20A0FF;
    color:#fff;
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
.el-button{
    width:74px;
    height:28px;
    line-height:5px;
}
</style>