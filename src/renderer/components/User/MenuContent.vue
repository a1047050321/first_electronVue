<template>
	<el-menu default-active="$route.path" :router="true" :default-openeds="['0','1','2','3']">
		<template v-for="(menu, index) in menuList" :keys="index">
			<el-submenu :index="index.toString()" v-if="menu.children">
				<template slot="title">
					<i :class="['icon', menu.iconClass]"></i>
					<el-badge class="item" is-dot v-if="menu.name == '报警管理'&& length!= 0"><span>{{ menu.name }}</span></el-badge>
					<span v-if="menu.name != '报警管理'||(menu.name == '报警管理'&& length == 0)">{{ menu.name}}</span>
				</template>
				<el-menu-item-group >
					<router-link class="el-menu-item" :index="index.toString() + '-' + cindex.toString()" :to="cmenu.to.toString()" tag="li" v-for="(cmenu, cindex) in menu.children" :key="cindex">
						<el-badge is-dot class="item" v-if="cmenu.name == '报警信息'&& length!= 0"><span>{{ cmenu.name}}</span></el-badge>
						<span v-if="cmenu.name != '报警信息'||(cmenu.name == '报警信息'&& length == 0)">{{ cmenu.name}}</span>
					</router-link>
				</el-menu-item-group>
			</el-submenu>
			<router-link class="el-menu-item" :index="index.toString()" v-else :to="menu.to" tag="li">
				<i :class="['icon', menu.iconClass]"></i>
				<span>{{ menu.name }}</span>
			</router-link>			
		</template>
	</el-menu>	
</template>
<script>
	export default {
		props: ["contentParam"],
		data () {
		  return {
			  length:0,
		  };
		},
		mounted(){
			this.getData();
		},
		computed: {
			menuList() {
				let list = this.$iHomed("config", "menuList");
				if(this.contentParam.role == 10){
				list = list.concat({
						name: "系统管理",
						to: "/systemManage",
						iconClass: "icon-setting",
						children: [{
								name: "管理员管理",
								to: "/systemManage/manager",
							}, {
								name: "系统日志",
								to: "/systemManage/operate",
							},
						]
					});
				}
				else{
					if(localStorage.getItem("username") != "admin"){
							list = list.concat({
							name: "系统管理",
							to: "/systemManage",
							iconClass: "icon-setting",
							children: [{
									name: "管理员管理",
									to: "/systemManage/manager",
								}, {
									name: "系统日志",
									to: "/systemManage/operate",
								},
								{
									name: "接入应用",
									to: "/systemManage/accessApp",
								}
							]
						});
					}else{
						list = list.concat({
							name: "系统管理",
							to: "/systemManage",
							iconClass: "icon-setting",
							children: [{
									name: "管理员管理",
									to: "/systemManage/manager",
								}, {
									name: "系统日志",
									to: "/systemManage/operate",
								},
								{
									name: "配置管理",
									to: "/configManage",
									iconClass: "el-icon-question",
								},
								{
									name: "接入应用",
									to: "/systemManage/accessApp",
								}
							]
						});
					}
				}
				// 系统管理员与超级管理员
				return list;
			}
		},
		methods:{
			getData(){
                var self = this;
                self.axios({
                    url:self.$iHomed("api","get_untreated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum
                    }
                })
                .then((res)=>{
                    if(res.data.data.data){
                    	self.length = res.data.data.total;
					}
                })
                .catch((error)=>{
                    //地址错误
                    console.log(error);
                })
            },
		}
	}
</script>

<style>
	.menu-content.el-menu,
	.menu-content .el-submenu .el-menu {
		background-color: #20A0FF;
	}

	.menu-content .el-submenu__title,
	.menu-content .el-menu-item {
		color: #fff;
	}

	.menu-content > li {
		text-align: left;
		margin:0;
	}
	.el-submenu .el-menu-item {
    	height:42px;
		line-height:42px;
		font-size:12px;
		font-size: 14px;
	}
	.el-menu{
		border:none!important;
	}
	.el-menu-item{
		height:42px;
		line-height:42px;
	}
	li.el-menu-item span{
		font-size:12px;
	}
	.menu-content .el-menu-item:hover {
	    background-color: #58B7FF;
	}

	.menu-content .el-submenu__title span,
	.menu-content > .el-menu-item span {
		height:42px;
		line-height:42px;
		font-size: 14px;
	}
	.menu-content .el-submenu__title{
		height:42px;
		line-height:42px;
	}
	.menu-content .el-submenu__title:hover {
	    background-color: #20A0FF;
	}

	.menu-content .router-link-active {
		background-color: #1D8CE0;
	}
	.menu-content > li div i,li.el-menu-item i{
		color:#fff;
		width:24px;
		height:24px;
		margin-left:4px;
		margin-bottom:3px;
	}
	.menu-content > li div span,li.el-menu-item span{
		display:inline-block;
		margin-left:16px;
	}
	.el-menu-item-group ul li.el-menu-item{
		width:100%;
		display:inline-block;
		padding-left:64px;
	}
	.is-opened i.el-icon-arrow-down{
		width:12px;
		height:12px;
	}
	.el-submenu__icon-arrow.el-icon-arrow-down{
		width:12px;
		height:12px;
	}
	.el-badge__content.is-fixed.is-dot{
		right:0;
		top:10px;
	}
	.icon.el-icon-question{
		width:24px;
		height:24px;
	}
</style>