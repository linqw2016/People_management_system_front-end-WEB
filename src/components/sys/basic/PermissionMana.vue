<template>
    <div>
        <div class="permissionManaTools">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh" @keydown.enter.native="doAddRole"></el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
        </div>
        <div style="margin-top: 20px;width: 800px">
            <el-collapse accordion @change="change" v-model="activeName">
                <el-collapse-item :title="r.nameZh"
                                  :name="r.id" v-for="(r,index) in roles"
                                  :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0; color: #e2051e" type="text"
                                       icon="el-icon-delete" @click="deleteRole(r)"></el-button>
                        </div>
                        <div>
                            <el-tree :data="allMenus"
                                     :props="defaultProps"
                                     node-key="id"
                                     show-checkbox
                                     ref="tree"
                                     :key="index"
                                     :default-checked-keys="selectedMenus"></el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button @click="cancelUpdate">取消修改</el-button>
                                <el-button type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>

                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    import {initMenu} from "@/utils/menus";

    export default {
        name: "PermissionMana",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: ''
                },
                roles: [],
                allMenus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                selectedMenus: [],
                activeName:''
            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            deleteRole(role){
                this.$confirm('此操作将永久删除'+role.nameZh+'角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permission/role/"+role.id).then(rep=>{
                        this.initRoles();
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddRole(){
                if(this.role.name&&this.role.nameZh){
                    this.postRequest("/system/basic/permission/role",this.role).then(resp=>{
                        if(resp){
                            this.role.nameZh='';
                            this.role.name='';
                            this.initRoles();
                        }
                    })
                }else{
                    this.$message.error("数据不可以为空");
                }
            },
            cancelUpdate(){
              this.activeName='';
            },
            doUpdate(rid, index) {
                let tree = this.$refs.tree[index];
                let selectedKeys = tree.getCheckedKeys(true);
                let url = '/system/basic/permission/?rid=' + rid+'&mids=';
                selectedKeys.forEach(key => {
                    url += key+"&mids=";
                });
                console.log(url);
                this.putRequest(url).then(resp=>{
                    if(resp){
                        // this.initRoles();
                        this.activeName='';
                    }
                })
            },
            change(rid) {
                if (rid) {
                    this.initAllMenus();
                    this.initSelectedMenus(rid);
                }
            },
            deleteRoles() {

            },
            initSelectedMenus(rid) {
                this.getRequest("/system/basic/permission/mids/" + rid).then(resp => {
                    if (resp) {
                        this.selectedMenus = resp;
                    }
                })
            },
            initAllMenus() {
                this.getRequest("/system/basic/permission/menus").then(resp => {
                    if (resp) {
                        this.allMenus = resp;
                    }
                })
            },
            initRoles() {
                this.getRequest("/system/basic/permission/").then(resp => {
                    if (resp) {
                        this.roles = resp;
                    }
                })
            }
        }

    }
</script>

<style>
    .permissionManaTools {
        display: flex;
        justify-content: flex-start;
    }

    /*渲染permissionManaTools class里面的input标签的style*/
    .permissionManaTools .el-input {
        width: 300px;
        margin-right: 10px;
    }

</style>
