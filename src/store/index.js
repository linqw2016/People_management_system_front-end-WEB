import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "@/utils/api";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs';
import {Notification} from 'element-ui';

Vue.use(Vuex)
const now = new Date();
const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},
        hrs: [],
        currentSession: null,
        currentHr: JSON.stringify(window.sessionStorage.getItem("user")),
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    mutations: {
        init_currentHr(state, hr) {
            state.currentHr = hr;
            // console.log("currentHr:")
            // console.log(state.currentHr);
        },
        initRoutes(state, data) {
            state.routes = data;
            // console.log(state.routes);
        },
        changeCurrentSession(state, currentSession) {
            console.log("in change currentSession,state currentSession:");
            // console.log(currentSession);

            Vue.set(state.isDot, state.currentHr.username + '#' + currentSession.username, false);
            state.currentSession = currentSession;
            console.log(state.currentSession);
        },
        addMessage(state, msg) {
            console.log("index's addMessage:state.currentHr:");
            console.log(msg);
            let mss = state.sessions[state.currentHr.username + '#' + msg.to];

            if (!mss) {
                // state.sessions[state.currentHr.username+'#'+msg.to]=[];
                //给state.session加state.currentHr属性。state.currentHr属性值为[];
                Vue.set(state.sessions, state.currentHr.username + '#' + msg.to, []);
            }
            state.sessions[state.currentHr.username + '#' + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            })
        },

        INIT_DATA(state) {
            //浏览器本地的聊天记录可以在这里完成；
            let data = localStorage.getItem('vue-chat-session');
            //console.log(data)
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_Hrs(state, data) {
            state.hrs = data;
        }
    },
    actions: {
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            context.state.stomp.connect({}, success => {
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    console.log(">>>>>>>>" + msg.body);
                    let receiveMsg = JSON.parse(msg.body);
                    if (!context.state.currentSession || receiveMsg.from != context.state.currentSession.username) {
                        Notification.info({
                                title: '[' + receiveMsg.formNickname + ']发来一条消息',
                                message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
                                position: 'bottom-right'
                            }
                        );
                        // console.log("connect:");
                        // console.log(context);
                        Vue.set(context.state.isDot, context.state.currentHr.username + '#' + receiveMsg.from, true);
                    }
                    receiveMsg.notSelf = true;
                    console.log(receiveMsg);
                    receiveMsg.to = receiveMsg.from;
                    console.log("receiveMsg:")
                    console.log(receiveMsg);
                    context.commit('addMessage', receiveMsg);
                })
            }, error => {

            })
        },
        initData(context) {
            context.commit('INIT_DATA');
            getRequest("/chat/hrs").then(resp => {
                if (resp) {
                    context.commit('INIT_Hrs', resp);
                }
            })
        }
    },
    modules: {}
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})


export default store;
