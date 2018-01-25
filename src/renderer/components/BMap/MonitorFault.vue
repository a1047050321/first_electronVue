<template>
    <div class="monitorFault" v-show="moniFaultShow">
        <div class="infoHeader">监控故障</div>
    </div>
</template>
<script>
    export default{
        props:["moniFaultShow"],
        data(){
            return {
            }
        },

    }
</script>
<style lang="">
    .monitorFault {
    position: fixed;
    top: 20px;
    right: 10px;
    width: 300px;
    height: 150px;
    background-color: #fff;
    border: 1px solid #dfe6ec;
}
.infoHeader {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #999;
    color: #fff;
}
</style>