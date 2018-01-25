<template>
	<div class="headerBar">报警系统</div>
</template>

<script>	
	export default {
		data () {
		  return {
		  };
		},
	}
</script>

<style scoped>
	.headerBar{
		position:absolute;
		top:0;
		left:0;
		width:240px;
		height:64px;
		line-height:64px;
		font-size:20px;
		font-weight:900;
		margin-left:-1px;
		color: #fff;	
		text-align: center;
	}
	.el-menu-item.headerBar.is-active{
		color:#fff;
	}
	.menu-wrapper .menu-header,
	.menu-wrapper .el-menu--horizontal .el-submenu__title:hover {
		background-color: #20A0FF;
	}
</style>