<template>
<div>
    <div class="buttonRight" v-show="rightMenu && treeData.type == 0" @mouseleave="mouseleave" >
    <el-button icon="el-icon-plus" @click="addSer">增加区域</el-button>
        <br/>
         <el-button icon="el-icon-plus" @click="add">增加社区</el-button>
        <br/>
        <el-button icon="el-icon-delete" @click="deleteTree">删除</el-button>
        <br/>
        <el-button icon="el-icon-edit" @click.prevent="edit">修改</el-button>
    </div>
     <div class="buttonRight" v-show="rightMenu && treeData.type == 1" @mouseleave="mouseleave">
        <el-button icon="el-icon-delete" @click="deleteTree">删除</el-button>
        <br/>
        <el-button icon="el-icon-edit" @click="edit">修改</el-button>
    </div>
</div>
</template>
<script>
import $ from "jquery"
    export default{
        props:["rightMenu","top","left","node","treeData"],
        data(){
            return{
               _rightMenu :this.rightMenu,
               newNode:{}
            }
        },

         watch: {
             top: {
                immediate: true,
                handler (newValue,oldValue) {
                    var top = newValue+"px";
                    $(".buttonRight").css("top",top);
                },
             },
             left:{
                 immediate: true,
                 handler(newValue,oldValue){
                 var left = newValue+"px";
                    $(".buttonRight").css("left",left);
                }
             }
             
         },
         methods:{
             //增加区域
             addSer(){
                this._rightMenu=false;
                this.$emit("rightMenu",this._rightMenu,"增加区域",1);
                console.log(this.node.data.label);
             },
             add(){
                this._rightMenu=false;
                this.$emit("rightMenu",this._rightMenu,"增加社区", 2);
             },
             edit(e){
                 e.preventDefault();
                 e.stopPropagation();
                //获取当前选择节点的id值
                this.$emit("rightMenu",this._rightMenu,this.treeData,3);
             },
             deleteTree(){
                //  this.node.store.remove(this.treeData);
                this._rightMenu=false;
                this.$emit("rightMenu",this._rightMenu,this.treeData,4);
             },
             mouseleave(){
                this._rightMenu=false;
                this.$emit("rightMenu",this._rightMenu);
             },
         }
    }
</script>
<style lang="" scoped>
    .buttonRight{
        position:fixed;
        width:122px;
        border:1px solid #dfe6ec;
        z-index:99;
    }
    .buttonRight .el-button{
        width:120px;
        height:36px;
        border-radius:0;
        border-bottom:1px solid #dfe6ec;
    }
</style>