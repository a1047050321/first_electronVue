import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'login',
            component: require('@/components/Login').default
        },
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/home',
            name: 'Home',
            component: require('@/components/Home').default,
            children: [{ // 首页
                    path: '',
                    redirect: {
                        name: 'FIndex'
                    }
                },
                { // 首页
                    path: '/index',
                    name: "FIndex",
                    component: require('@/components/Bmap/FIndex').default,
                    redirect: { name: 'BMap' },
                    children: [{ // 报警地图
                        path: '/index/bMap',
                        name: 'BMap',
                        component: require('@/components/BMap/BMap').default
                    }, { // 折线图
                        path: '/index/echarts',
                        name: 'Echarts',
                        component: require('@/components/BMap/Echarts').default
                    }]
                },
                { // 基本信息管理
                    path: '/baseInfoManage',
                    name: 'BaseInfoManage',
                    component: require('@/components/BaseInfoManage/BaseInfoManage').default
                }, {
                    // 机顶盒用户管理
                    path: '/stbManage',
                    name: 'STBManage',
                    component: require('@/components/BaseInfoManage/STBManage').default
                },
                { // 报警控制
                    path: '/callControl',
                    name: 'CallControl',
                    component: require('@/components/BMap/CallControl').default
                },
                { // 报警信息
                    path: '/callManage',
                    name: 'CallManage',
                    component: require('@/components/BMap/CallManage').default,
                    redirect: { name: 'Pending' },
                    children: [{ // 待处理
                            path: '/callManage/pending',
                            name: 'Pending',
                            component: require('@/components/BMap/Pending').default,
                        },
                        { // 已处理
                            path: '/callManage/processed',
                            name: 'Processed',
                            component: require('@/components/BMap/Processed').default,
                        },
                    ]

                },
                { // 解决待处理报警页面
                    path: '/handlePending',
                    name: 'HandlePending',
                    component: require('@/components/BMap/HandlePending').default,
                },
                { // 通知消息
                    path: '/notifiManage',
                    name: 'NotifiManage',
                    component: require('@/components/BMap/NotifiManage').default,
                },
                { // 管理员管理
                    path: '/systemManage/manager',
                    name: 'Manager',
                    component: require('@/components/SystemManage/Manager').default,
                },
                { // 接入应用
                    path: '/systemManage/accessApp',
                    name: 'accessApp',
                    component: require('@/components/SystemManage/accessApp').default,
                },
                { // 操作记录
                    path: '/systemManage/operate',
                    name: 'Operate',
                    component: require('@/components/SystemManage/Operate').default,
                },
                { // 配置管理
                    path: '/configManage',
                    name: 'configManage',
                    component: require('@/components/SystemManage/configManage').default,
                },

            ]
        }
    ]
})