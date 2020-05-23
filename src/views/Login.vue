<template>
    <div>
        <el-form
                :model="loginForm"
                :rules="roles"
                v-loading="loading"
                element-loading-text="正在登陆中。。。"
                class="loginContainer"
                ref="loginForm">
            <h3 class="loginTitle">系统登陆</h3>
            <el-form-item prop="username">
                <el-input size="normal" type="text" v-model="loginForm.username" auto-compiler="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="normal" type="password" v-model="loginForm.password" auto-compiler="off" placeholder="请输入密码"
                          @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox size="normal" v-model="check" class="loginRemember">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button size="normal" type="primary" style="width: 100%" @click="submitLogin ">登陆</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    // import {postKeyValueRequest} from "../utils/api.js";
    export default {
        name: "Login.vue",
        data() {
            return {
                loading:false,
                loginForm: {
                    username: "admin",
                    password: '123'
                },
                check: true,
                roles: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }

        },
        methods: {
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
                            this.loading=false;
                            if (resp) {
                                this.$store.commit('init_currentHr',resp.object);
                                console.log("currentHr:");
                                console.log(resp);
                                // alert(JSON.stringify(resp));
                                window.sessionStorage.setItem("user", JSON.stringify(resp.object));
                                //path获取重定向的地址；
                                let path = this.$route.query.redirect;
                                //如有重定向则跳到重定向的地址；
                                this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
                            }
                        })

                    } else {
                        this.$message.error('请输入所有字段！');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .loginContainer {
        border-radius: 15px;
        border: 1px solid #eaeaea;
        background-clip: padding-box;
        margin: 180px auto;
        width: 550px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        box-shadow: 0 0 25px #cac6c6; /*系数 水平位置 垂直位置 模糊的大小 阴影颜色*/
    }

    .loginTitle {
        margin: 5px auto 25px auto;
        text-align: center;
        color: #bcbeca;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 5px 0px;
    }


</style>
