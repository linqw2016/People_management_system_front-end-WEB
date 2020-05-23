import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import FriendChat from '../views/chat/FriendChat.vue'


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login,
            hidden: true
        }, {
            path: '/home',
            name: 'Home',
            component: Home,
            hidden: true,

            children: [{
                path: '/chat',
                name: '在线聊天',
                component: FriendChat,
                hidden: true
            }
            ]

            //前端中可以加入meta属性来进行权限控制,如：
            // meta:{
            //     roles:['admin','user']
            // }
        },
        // ,
        // {
        //     path: '*',
        //     redirect: '/home',
        //     hidden: true
        // }
    ]
})

// const routes = [
//     {
//         path: '/',
//         name: 'Login',
//         component: Login
//     },
//     {
//         path: '/home',
//         name: 'Home',
//         component: Home
//     }
//
// ]
//
// const router = new VueRouter({
//     mode: 'history',
//     base: process.env.BASE_URL,
//     routes
// })
//
// export default router
