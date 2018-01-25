import axios from "axios";
// 系统配置文件
var CONFIG = {
    // boss 首页地址
    homepage: "",
    // Homed 后台登录地址
    loginurl: "#/login",
    // 系统 id，需要设置为自身系统的 id 号
    systemid: 40,
    // 系统名称
    systemname: "报警系统",
    // 是否为开发模式，默认为 true ; true 为不用登录即可进入系统，否则必须登录
    dev: true,
    // 开发模式下的默认账户 ID 1000025 1000103 1000056 3120
    userid: "3120",
    // 开发模式下的默认用户名
    username: "熊黎",
    // 开发模式下的默认令牌 
    token: "TOKEN3120",
    // 开发模式下的默认用户角色: 1.超级管理员，2.系统管理员，3.普通用户
    role: 2,
    // 将公共配置放到CONFIG中暴露出去    
    globalDnsConfigVar: window.globalDnsConfigVar,
    // 提供商对象
    // ProviderObject: new window.ProviderObject(1),
    // 所有提供商
    providers: [],
    // 内容类型
    contentType: window.contentType,

    PAGE_SIZES: [20, 30, 50, 100],

    // 菜单模块配置
    menuList: [{
            name: "首页",
            to: "/index",
            iconClass: "icon-home",
        },
        {
            name: "报警管理",
            to: "/index",
            iconClass: "icon-manage",
            children: [{
                    name: "报警信息",
                    to: "/callManage",
                    children: [{
                        name: "待处理",
                        to: "/callManage/pending'",
                    }, {
                        name: "已处理",
                        to: "/callManage/processed'",
                    }]
                },
                {
                    name: "报警控制",
                    to: "/callControl"
                },
                {
                    name: "通知消息",
                    to: "/notifiManage"
                }
            ]
        },
        {
            name: "基础信息",
            iconClass: "icon-person",
            to: "/baseInfoManage",
            children: [{
                    name: "区域管理",
                    to: "/baseInfoManage",
                },
                {
                    name: "用户管理",
                    to: "/STBManage"
                }
            ]
        },

    ]
};
/**
 * 扩展系统接口
 * 
 * 形如：{method}_apiname : "http://***" 
 *      {method} 代表了请求接口的类型：get | post
 *      -> "user_get_info" : "http://access.homed.me/usermanager/user/get_info"
 * 
 * 使用方式：
 *     iHomed( "setData 或 getData", { // 这里面的参数传入类似于 jQuery.ajax
 *         url: "{method}_apiname"
 *     } );
 */
axios.get("serverconfig.json").then((result) => {
    localStorage.removeItem('ApiUrl');
    localStorage.setItem('ApiUrl', result.data.ApiUrl);
    // console.log(localStorage.getItem('ApiUrl'));
    // 后台地址：113.98.233.208:18181  内网192.168.18.100:18181
    //现场 125.62.47.205:8080
    // rabbitmq：104.128.92.37    端口和之前的一样，账号admin，密码root
}).catch((error) => { console.log(error) });
var root = localStorage.getItem('ApiUrl') ? localStorage.getItem('ApiUrl') : "http://192.168.18.100:18181/";
var API = {
    //登录接口
    'auto_login': root + "AlarmManage/auth/login",
    //登出接口
    "login_out": root + "AlarmManage/auth/logout",
    //获取token接口
    "get_token": "http://access.homed.me/account/user/v2/login",
    //获取地图point
    "map_point": root + "AlarmManage/alarm/index/untreated/",
    //获取echarts图数据
    "get_echarts": root + "AlarmManage/alarm/index/perHourAlarm/",
    //导出折线图数据
    "echarts_data": root + "AlarmManage/alarm/export/perHourAlarm/",
    //区域导入
    // "area_import": root + "http://ip:port/area/getList",
    //获取区域资讯id
    "get_news": root + "AlarmManage/area/zxlm/",
    //监控频道导入
    "monitor_channel": "http://api.slave.homed.me:13160/monitor/channel/get_list",
    //获取监控的playtoken
    // "paly_token": "http://slave.homed.me/media/get_authority_info?playtype=live",
    "paly_url": "http://slave.homed.me:13160/monitor/channel/get_info",
    "mock_monitor": "http://www.easy-mock.com/mock/59ca2601e0dc663341bbb910/monitor/get_monitor",
    //待处理报警信息
    "get_untreated": root + "AlarmManage/alarm/untreated",
    //已处理报警信息
    "get_treated": root + "AlarmManage/alarm/treated",
    //修改待处理报警信息
    "change_untreated": root + "AlarmManage/alarm/change/",
    //获取视频截图url get
    "get_url": "http://slave.homed.me:13160/media/event/get_poster_by_time",
    //待处理报警信息上报  提交
    "put_remark": root + "AlarmManage/alarm/",
    //get 通知消息
    "edit_notify": root + "AlarmManage/message",
    //报警类型管理
    //新增报警类型 删除报警类型
    "add_type": root + "AlarmManage/alarmType",
    //获取当前可编辑的报警类型
    "get_alarmType": root + "AlarmManage/user/alarmtype",
    //查询报警类型列表信息
    "alarmType_list": root + "AlarmManage/alarmType/all",
    //删除或修改 报警类型 
    "edit_type": root + "AlarmManage/alarmType/",
    //标记正在处理 退出处理状态加cancel
    "editing": root + "AlarmManage/alarm/handle/",

    //区域管理
    //添加区域/社区
    "add_area": root + "AlarmManage/area",
    //查询整个区域社区树
    "get_treeList": root + "AlarmManage/area/tree/",
    //删除区域、社区 修改 查看区域
    "change_tree": root + "AlarmManage/area/",
    //查询区域id下面的区域社区树
    "get_list": root + "AlarmManage/area/",
    //搜索接口
    "to_search": "",
    //上传用户下载模板
    "upload": root + "AlarmManage/import_customer.xlsx",

    //STB 用户管理
    //获取用户列表get 新增用户列表post 删除delete
    "edit_stbUser": root + "AlarmManage/customer",
    //修改 put 
    "change_stbUser": root + "AlarmManage/customer/",
    //导入用户接口，返回结果data为导入操作错误日志地址 post
    "user_import": root + "AlarmManage/customer/import/",
    //搜索用户接口
    "search_user": root + "AlarmManage/customer/search",

    //管理员
    //新增管理员post  获取管理员列表get 删除管理员delete
    "edit_guest": root + "AlarmManage/user",
    // 修改管理员put  修改管理员密码
    "change_guest": root + "AlarmManage/user/",
    //操作日志
    "opeator_log": root + "AlarmManage/log",
    //查询管理员
    "search_guest": root + "AlarmManage/user/all",


    //监控管理
    //获取区域管理得table列表
    "edit_monitor": root + "AlarmManage/monitor",
    //获取弹出框的监控截图
    "get_picture": root + "AlarmManage/homed/poster/",
    //监控导入
    "import_monitor": root + "AlarmManage/monitor/import/monitor",
    //查询未绑定摄像头
    "unbinding_monitor": root + "AlarmManage/monitor/unbinding",
    //绑定监控至区域/社区
    "binding_monitor": root + "AlarmManage/monitor/binding",
    //未绑定数据拉黑
    "to_black": root + "AlarmManage/monitor/defriend",
    //搜索监控
    "monitor_search": root + "AlarmManage/monitor/search",

    //配置管理
    //查询后台配置
    "get_system": root + "AlarmManage/config/system",
    //获取后台、页面、app公共配置信息
    "get_common": root + "AlarmManage/config/common",
    //GET /config/webandapp 获取页面和app公共配置
    "get_webApp": root + "AlarmManage/config/web",
    "get_web": root + "AlarmManage/config/webconfig",

};
export {
    API,
    CONFIG
};