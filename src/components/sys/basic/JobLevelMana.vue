<template>
    <div>
        <div>
            <el-input
                    class="addJobLevelInput"
                    size="small"
                    placeholder="添加职称"
                    prefix-icon="el-icon-plus"
                    v-model="jl.name">
            </el-input>
            <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small" @keydown.enter.native="addJobLevel">
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item"
                        style="margin-right: 10px;margin-left: 10px">
                </el-option>
            </el-select>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="addJobLevel" style="margin-left: 10px">添加</el-button>
        </div>
        <div style="margin-top: 10px;">
            <el-table
                    size="small"
                    :data="jobLevels"
                    border
                    stripe
                    style="width: 70%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55px">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称级别"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="是否启用"
                        width="150">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)" >编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" class="batchDelet" :disabled="multipleSelection.length==0" @click="deleteMany">批量删除</el-button>
        </div>

        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <el-row>
                    <el-tag style="margin-left: 10px;margin-top: 10px">职称名称</el-tag>
                    <el-input size="small" v-model="updateJobL.name" style="width: 150px; margin-left: 10px"></el-input>
                </el-row>
                <el-row>
                    <el-tag style="margin-left: 10px;margin-top: 10px">职称级别</el-tag>
                    <el-select v-model="updateJobL.titleLevel" size="small" style="width: 100px;margin-left: 10px">
                        <el-option
                                v-for="item in titleLevels"
                                :key="item"
                                :label="item"
                                :value="item"
                        >
                        </el-option>
                    </el-select>
                    <el-switch
                            style="width: 150px;margin-left: 30px"
                            v-model="updateJobL.enabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="启用"
                            inactive-text="禁用">
                    </el-switch>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",

        data() {
            return {
                jl: {
                    name: '',
                    titleLevel: ''
                },
                titleLevels: [
                    '正高级','副高级','中级','初级','员级'
                ],
                jobLevels:[],
                enableds:[
                    {
                        name:'启用',
                        value:true
                    },
                    {
                        name:'禁用',
                        value: false
                    }
                ],
                dialogVisible:false,
                multipleSelection:[],

                updateJobL:{
                    name:'',
                    titleLevel:'',
                    enabled:'',
                }
            }
        },
        mounted(){
            this.initJobLevel();
        },
        methods: {
            initJobLevel(){
                this.getRequest("/system/basic/jobL/").then(resp => {
                    if (resp) {
                        this.jobLevels = resp;
                    }
                })
            },
            deleteMany(){
                this.$confirm('此操作将永久删除 '+this.multipleSelection.length+' 条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids='?';
                    this.multipleSelection.forEach(item=>{
                        ids+=('ids='+item.id+'&');
                    })
                    this.deleteRequest('/system/basic/jobL/'+ids).then(resp => {
                        if (resp) {
                            this.initJobLevel();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            doUpdate(){
                this.putRequest('/system/basic/jobL/',this.updateJobL).then(resp=>{
                    if(resp){
                        this.initJobLevel();
                        this.updateJobL.name='';
                        this.updateJobL.titleLevel='';
                        this.dialogVisible = false;
                    }
                })
            },
            addJobLevel() {
                if (this.jl.name&&this.jl.titleLevel) {
                    this.postRequest('/system/basic/jobL/', this.jl).then(resp => {
                        if (resp) {
                            this.initJobLevel();
                            this.jl.name = '';
                            this.jl.titleLevel = '';
                        }
                    })

                } else {
                    this.$message.error('添加失败，请检查两个字段是否都填完');
                }

            },
            handleSelectionChange(val){
                this.multipleSelection =val;
            },
            showEditView(index, data){
                console.log(data);
                // this.updatePos = data;
                Object.assign(this.updateJobL,data);
                this.dialogVisible = true;
            },
            handleDelete(index, data){
                this.$confirm('此操作将永久删除 职称名称为：' + data.name + ' 职称级别为:'+data.titleLevel+' 的职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/jobL/' + data.id).then(resp => {
                        if (resp) {
                            this.initJobLevel();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style>
    .addJobLevelInput {
        width: 400px;
        margin-right: 15px;
    }


</style>
