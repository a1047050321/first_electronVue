<template>
    <div id="myPlayer" :data-programid="getProgramID"></div>
</template>
<style>
#myPlayer {
    margin-top:30px;
    width: 1100px;
    height: 500px;
}
</style>
<script>
export default {
    prop:["url"],
    data() {
        return {
            initFlag: false,
            pid:"4202006972",
        }
    },
    methods: {
        getPlayUrl: function () {
            var src = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken=R59A3E95FU508C6023KB2D06C01I6F18A8C0P0MF430AWDAD92CC0EF1&programid=4202001036&playtype=live&playtoken=ABCDEFG&protocol=hls";

            // var props = this._props;

            // for ( var i in props ) {
            //     src = src.replace( "{{" + i + "}}", props[i] );
            // }

            return src;
        }
    },
    computed: {
        getProgramID: function () {
            if (this._isMounted) {// 触发播放路径更新
                SewisePlayer.toPlay(this.url, "视频会议", 0, true);
            }

            return this.url;
        }
    },
    mounted() {
        SewisePlayer.setup({
            server: "vod",
            type: "m3u8",
            videourl: this.getPlayUrl(),
            skin: "vodWhite",
            title: "视频会议",
            lang: 'zh_CN',
            poster: 'static/meeting_sample.png',
            claritybutton: 'disable',
            draggable: "false",
            topbardisplay: 'disable'
        }, "myPlayer");

        SewisePlayer.onPlayTime(function(time, id){
            // console.log(id + " onPlayTime : " + time);
        });
    }
}
</script>