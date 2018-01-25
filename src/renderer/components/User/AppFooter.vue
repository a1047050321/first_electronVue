<template>
	<div>
		<el-popover ref="nav" placement="top" title="" trigger="hover">
		  <ul class="exit-list">
				<li @click="changePsd">修改密码</li>
		    <li @click="toIndexPage">切换账户</li>
		    <li @click="exit">退出</li>
		  </ul>
		</el-popover>
		<div  v-show="psdDialog" class="psdDialog">
		<div class="mask"></div>
			<div class="changepsd">
					<div  class="title">修改密码</div>
					<div style="margin-top:24px;">
						<span>原始密码</span>
						<el-input type="password" v-model="oldPwd"></el-input>
					</div>
					<div><span>新密码</span>
						<el-input type="password" v-model="newPwd"></el-input>
					</div>
						<div><span>确认新密码</span>
						<el-input type="password" v-model="newPwd1"></el-input>
					</div>
					<div class="buttonPsd" style="margin-top:24px;">
						<el-button @click="cancel">取消</el-button>
						<el-button type="primary" @click="confirm" style="margin-right:24px;">确定</el-button>
					</div>
			</div>
		</div> 
		<el-row class="app-footer">
		  <div style="width:240px;">
		    <div class="nav-exit" v-popover:nav>
		      <i class="icon icon-single"></i>
		      <span style="font-size:14px;">{{ footerParam.username }}</span>          
		    </div>     
		  </div>
		  <div class="footContent" style="background:#fff">
		    <p class="first">版权所有 &copy; <span class="syear"></span>-<span class="cyear">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="company">深圳市茁壮网络股份有限公司</span>&nbsp;<span class="record">粤ICP备12069260</span></p>
        <p>Copyright &copy; <span class="syear"></span>-<span class="cyear">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="companyENG">iPanel.TV Inc.</span>,All Rights Reserved</p>
		  </div>
		</el-row>
	</div>	
</template>

<script>
var script = document.createElement("script");
    script.setAttribute("src","http://boss.homed.me/config/js/copyright.js");
    script.setAttribute("type","text/javascript");
    document.body.appendChild(script);
    import md5 from "js-md5";
    import $ from "jquery";
    // import COPYRIGHT from "http://boss.homed.me/config/js/copyright.js";
    export default {
        props: ["footerParam"],
        data() {
            return {
                psdDialog: false,
                oldPwd: "",
                newPwd: "",
                newPwd1: "",
            };
        },
        computed: {
            nowYear() {
                return new Date().getFullYear();
            }
        },
        mounted() {
            // this.username = this.$iHomed.getCookie("username");
            // 版权信息配置
            $('.syear').html(COPYRIGHT.createYear);
            $('.cyear').html((new Date()).getFullYear());
            $('.company').html(COPYRIGHT.companyName);
            $('.companyENG').html(COPYRIGHT.companyEnglishName);
            $('.record').html(COPYRIGHT.recordNumber);
        },
        methods: {
            //回到登陆页
            toIndexPage() {
                this.$confirm('是否确定切换账号?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$iHomed('logout');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                })
            },
            changePsd() {
                this.psdDialog = true;
                // $(".content-wrapper").css("opacity","0.5");
            },
            confirm() {
                var self = this;
                console.log()
                if (self.oldPwd == self.newPwd) {
                    self.$alert("新旧密码一致，请重新输入！");
                    return false;
                } else if (self.newPwd1 != self.newPwd) {
                    self.$alert("两次输入的新密码不一致，请重新输入");
                    return false;
                }
                self.axios({
                        method: "put",
                        data: {
                            "newPwd": md5(self.newPwd),
                            "oldPwd": md5(self.oldPwd)
                        },
                        url: self.$iHomed("api", "change_guest") + "pwd/" + localStorage.getItem('user_id'),
                    })
                    .then((res) => {
                        console.log(res);
                        if (res.data.code != 0) {
                            self.$alert(res.data.msg);
                            return false;
                        } else {
                            $(".content-wrapper").css("opacity", "1");
                            self.psdDialog = false;
                            // 修改密码接口
                            self.$message({
                                type: 'success',
                                message: '密码修改成功！'
                            });
                            self.oldPwd = "";
                            self.newPwd = "";
                            self.newPwd1 = "";
                        }
                    })

            },
            cancel() {
                this.psdDialog = false;
                $(".content-wrapper").css("opacity", "1");
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            },
            exit() {
                this.$confirm('是否确定退出系统?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$iHomed('logout');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });

            }
        }
    }
</script>

<style scoped>
    .exit-list a {
        color: #000;
    }
    
    .psdDialog {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 99;
    }
    
    .mask {
        position: fixed;
        top: 0;
        bottom: 84px;
        left: -264px;
        right: 0;
        background: #000;
        opacity: 0.3;
        z-index: 9;
    }
    
    .changepsd {
        position: absolute;
        top: -134px;
        left: -175px;
        width: 350px;
        height: 268px;
        background: #fff;
        z-index: 20;
    }
    
    .changepsd .title {
        height: 40px;
        width: 100%;
        padding-left: 14px;
        text-align: left;
        line-height: 40px;
        background: #20A0FF;
        color: #fff;
    }
    
    .changepsd div:not(.title) {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        margin-bottom: 8px;
        margin-left: 24px;
    }
    
    .changepsd div span {
        display: inline-block;
        width: 80px;
    }
    
    .el-input {
        width: 218px;
        height: 40px;
        margin-left: 0!important;
    }
    
    .buttonPsd {
        text-align: right;
    }
    
    .el-button {
        width: 74px;
        height: 28px;
        line-height: 5px;
    }
    
    p:not(.first) {
        margin-bottom: 24px;
    }
</style>