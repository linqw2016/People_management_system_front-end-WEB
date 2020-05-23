<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title" style="margin: 10px">People management system</div>
                <div>
                    <el-button icon="el-icon-bell" type="text" style="margin-right: 8px;color:#ffffff;" size="large" @click="goChat"></el-button>
                    <el-dropdown class="userInfo" @command="commandHandler">
                    <span class="el-dropdown-link">
                        {{user.name}}<i><img :src="userface" alt=""></i>
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销登陆</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>

            <el-container>
                <el-aside width="200px">
                    <el-menu active-text-color=#CE87E2 router unique-opened>
                        <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
                            <template slot="title">
                                <i :class="item.iconCls" style="color: #a384e2;margin-right: 5px"></i>
                                <span>  {{item.name}}</span>
                            </template>

                            <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                                {{child.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                        欢迎来到微人事
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import img5 from '../assets/userface5.jpg';
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user")),
                userface:img5
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            }
        },
        methods: {
            goChat(){
                this.$router.push('/chat');
            },
            commandHandler(cmd) {
                if (cmd == 'logout') {
                    this.$confirm('此操作将注销登陆, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest("/logout");
                        window.sessionStorage.removeItem("user");
                        this.$store.commit('initRoutes', []);
                        this.$router.replace("/");
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            }
        }
    }
</script>

<style>
    .homeRouterView{
        margin-top: 15px;
    }
    .homeWelcome {
        text-align: center;
        padding-top: 180px;
        font-size: 80px;
        font-family: 微软雅黑;
        color: #c874e2;
    }

    .homeHeader {
        background-color: #a384e2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        box-sizing: border-box;
        height: 100px;

    }

    .homeHeader .title {
        font-size: 40px;
        font-family: "Times New Roman";
        color: #ffffff;
    }

    .homeHeader .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link img {
        height: 48px;
        width: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
        color: white;
        font-size: 20px;
    }

</style>
