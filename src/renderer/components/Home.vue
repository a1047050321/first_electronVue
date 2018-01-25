<template>
  <div id="app">
    <el-row class="app-content">
      <div class="menu-wrapper">
        <!-- 菜单导航头部 -->
        <menu-header class="menu-header"></menu-header>
        <!-- 菜单列表 -->
        <menu-content :contentParam="contentParam" class="menu-content"></menu-content>
      </div>
      <div class="content-wrapper">
          <router-view  :showType="showType" :alarmType="alarmType"  @callType="alarmChange" :newAlarm="newAlarm" :configData="configData">
          </router-view>
      </div>
    </el-row>
    <app-footer :footerParam="footerParam"></app-footer>        
  </div>
</template>

<script>

    import MenuHeader from "@/components/User/MenuHeader";
    import MenuContent from "@/components/User/MenuContent";
    import AppFooter from "@/components/User/AppFooter";
    import $ from "jquery";
    export default {
        components: {
            MenuHeader,
            MenuContent,
            AppFooter,
        },
        name: "app",
        data() {
            return {
                headerParam: {
                    systemname: "",
                    systemids: [],
                    // sysList: sysList
                },
                menuList: [],
                contentParam: {
                    role: null,
                    list: []
                },
                footerParam: {
                    username: ""
                },
                alarmType: [],
                showType: {},
                newAlarm: {},
                configData: {},
            }
        },
        mounted() {
            this.contentParam = {
                role: localStorage.getItem('role')
            };
            this.footerParam = {
                username: localStorage.getItem('username')
            };
            this.getAlarm();
            this.getConfig();
        },
        methods: {
            //获取该管理员报警类型信息
            getAlarm() {
                var self = this;
                self.axios({
                        method: "get",
                        url: self.$iHomed("api", "alarmType_list"),
                        data: {
                            currentPage: self.page,
                            pageSize: self.pagenum
                        }
                    })
                    .then((res) => {
                        res = res.data.data;
                        for (let i = 0; i < res.data.length; i++) {
                            self.alarmType.push({
                                value: res.data[i].id,
                                label: res.data[i].name,
                                text: res.data[i].name,
                            })
                            self.showType[res.data[i].id] = res.data[i].name;
                        }
                        // self.$store.commit("ALARMTYPE",self.alarmType);
                    })
            },
            //获取配置信息
            getConfig() {
                this.axios({
                    method: "get",
                    url: this.$iHomed("api", "get_web"),
                }).then((res) => {
                    this.configData = res.data.data;
                })
            },
            alarmChange(a, b) {
                this.showType = a;
                this.alarmType = b;
            }
        }
    }
</script>
<style>
    .menu-header {
        height: 100%;
    }
    
    .content-wrapper {
        height: 100%;
        position: fixed;
        top: 0;
        left: 264px;
        right: 24px;
    }
</style>