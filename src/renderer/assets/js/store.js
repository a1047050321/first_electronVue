import Vue from "vue";
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        role: "",
        username: "",
        user_id: null,
        alarmType: [],
        treeData:[],
        option:{
            method:"",
            url:"",
            data:{},
            header:{},
        },

    },
    mutations: {
        ALARMTYPE(state, n) {
            state.alarmType = n;
        },
        getTreeData(state,data){
            state.treeData = data;
        },
        getOptions(state,option){
            state.option = option;
        }
    },
    actions:{
        AJAX(context,option){
            context.commit("getOptions",option);
            console.log(option);
            var tranData = "";
            if(option.method == "get"){
                tranData = "params";
            }
            else if(option.method == "post"){
                tranData = "data";
            }
            axios({
                method:option.method,
                url:option.url,
                withCredentials:true,
                // headers:options.headers?options.headers:null,
                tranData:options.data   
            }).then((res)=>{
                console.log(res);
                 res = res.data.data;
                 context.commit("getTreeData",[res]);
            })
        }
    }
})

export default store