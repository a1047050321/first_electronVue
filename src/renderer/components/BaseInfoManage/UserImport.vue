<template>
<div class="userImport">
    <div class="nav-wrapper">
                    <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                <router-link to="/stbManage">机顶盒用户管理</router-link>
                                / 导入数据</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="importInput">
        <el-input type="file" name="fileField"></el-input>
        <el-button @click="addImport">添加</el-button>
    </div>
</div>
</template>
<script>
    
    import axios from 'axios'
    export default {
        data() {
            return {
            }
        },
    mounted(){
    },
    methods:{
         loading(param) {
				
				param = Object.assign({
							target: ".userImport",
							text: "数据导出中，请稍候..."
						}, param || {});
				
				this.Loading = this.$loading(param);
			},
			// 关闭数据加载提示
			closeLoading() {
				this.$nextTick(() => {
					this.Loading.close();
				});				
			},
        addImport(){
            var self = this;
            var files = $('input[name="fileField"]').prop('files');//获取到文件列表
            console.log(files);
            if (files.length == 0) {
                self.$message("请选择文件");
                return;
            } else {
                this.loading();
                var reader = new FileReader();//新建一个FileReader
                reader.readAsText(files[0], "UTF-8");//读取文件
                reader.onload = function (evt) { //读取完文件之后会回来这里
                    var fileString = evt.target.result;
                    //post方式上传图片到后台
                    var date = {"file": fileString};
                    console.log(date);
                    //提交表格的url
                    let url = self.$iHomed("api", "user_add"),
                        params = date;
                        self.$http({
                                url: url,
                                type: "POST",
                                data: params
                            })
                            .then((res) => {
                                console.log(res);
                            })
                }
            }
        }
    }
  }
</script>
<style>
    .importInput{
        margin-top:20px;
        width:400px;
    }
    .el-button{
        margin-top:10px;
    }
</style>