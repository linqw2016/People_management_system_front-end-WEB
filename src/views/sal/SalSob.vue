<template>
    <div>
        <div class="salSobFirstLine">
            <el-button icon="el-icon-plus" type="primary" @click="showAddSalaryView">添加帐套</el-button>
            <el-button icon="el-icon-refresh" type="success" style="width: 50px" @click="refresh"></el-button>
            <el-dialog
                    :title="dialogTitle"
                    :visible.sync="dialogVisible"
                    width="50%">
                <div style="display:flex;justify-content: space-around;align-items: center">
                    <el-steps direction="vertical" :active="activeItemIndex">
                        <el-step :title="itemName" v-for="(itemName,index) in salaryItemName" :key="index"></el-step>
                    </el-steps>
                    <el-input v-model="salary[title]" :placeholder="'请输入'+salaryItemName[index]"
                              v-for="(value,title,index) in salary"
                              :key="index" v-show="activeItemIndex==index" style="width: 300px"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button @click="preStep">{{activeItemIndex>0?"上一步":"取消"}}</el-button>
    <el-button type="primary" @click="nextStep">{{activeItemIndex==10?"完成":"下一步"}}</el-button>
  </span>
            </el-dialog>
        </div>
        <div>
            <el-table
                    v-loading="loading"
                    element-loading-text="正在获取数据中。。。"
                    stripe
                    @selection-change="handleSelectionChange"
                    :cell-style="cellStyle"
                    :header-cell-style="tableHeaderStyle"
                    class="salSobTable"
                    :data="salarySobs">
                <el-table-column
                        type="selection"
                        width="55px">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="帐套名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="basicSalary"
                        label="基本工资"
                        width="110">
                </el-table-column>
                <el-table-column
                        prop="trafficSalary"
                        label="交通补助"
                        width="110">
                </el-table-column>
                <el-table-column
                        prop="lunchSalary"
                        label="午餐补助"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="bonus"
                        label="奖金"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="启用时间"
                        width="130">
                </el-table-column>
                <el-table-column label="养老金">
                    <el-table-column
                            prop="pensionPer"
                            label="比率"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="pensionBase"
                            label="基数"
                            width="90">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="医疗保险">
                    <el-table-column
                            prop="medicalPer"
                            label="比率"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="medicalBase"
                            label="基数"
                            width="90">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="公积金">
                    <el-table-column
                            prop="accumulationFundBase"
                            label="比率"
                            width="90">
                    </el-table-column>
                    <el-table-column
                            prop="accumulationFundPer"
                            label="基数"
                            width="90">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="操作">
                    <el-table-column
                            label="编辑">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.row)">编辑
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="删除">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="DeleteSob(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 10px;">
            <el-button type="danger" round size="medium" :disabled="multipleSelection.length==0" @click="deleteMany">
                批量删除
            </el-button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "SalSob",
        data() {
            return {
                loading: false,
                dialogTitle: '添加工资帐套',
                dialogVisible: false,
                activeItemIndex: 0,
                salarySobs: [],
                multipleSelection: [],
                salary: {
                    basicSalary: '',
                    trafficSalary: '',
                    lunchSalary: '',
                    bonus: '',
                    pensionPer: '',
                    pensionBase: '',
                    medicalPer: '',
                    medicalBase: '',
                    accumulationFundPer: '',
                    accumulationFundBase: '',
                    name: '',
                },
                salaryItemName: [
                    '基本工资',
                    '交通补助',
                    '午餐补助',
                    '奖金',
                    '养老金比率',
                    '养老金基数',
                    '医疗保险比率',
                    '医疗保险基数',
                    '公积金比率',
                    '公积金基数',
                    '账套名称'
                ]
            }
        },
        mounted() {
            this.initSalSob();
        },
        methods: {
            deleteMany() {
                this.$confirm('此操作将永久删除 ' + this.multipleSelection.length + ' 条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += ('ids=' + item.id + '&');
                    });
                    // console.log("ids:" + ids);
                    this.deleteRequest('/salary/sob/' + ids).then(resp => {
                        if (resp) {
                            this.initSalSob();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            refresh() {
                this.initSalSob();
                // this.$message.success("刷新完成！");
            },
            preStep() {
                if (this.activeItemIndex == 0) {
                    this.dialogVisible = false;
                    return;
                }
                if (this.activeItemIndex == 10) {
                    this.emptySalary();
                    this.dialogVisible = false;
                    this.activeItemIndex = 0;
                    return;
                }
                this.activeItemIndex--;
            },
            nextStep() {
                if (this.activeItemIndex == 10) {
                    console.log(this.salary);
                    if (this.dialogTitle != '添加工资帐套') {
                        this.putRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                this.emptySalary();
                                this.initSalSob();
                            }
                        });
                    } else {
                        if (this.salary.name != null) {
                            this.postRequest("/salary/sob/", this.salary).then(resp => {
                                this.initSalSob();
                                this.emptySalary();
                            })
                        } else {
                            this.$message.error("添加失败,帐套名称不能为空！");
                        }
                    }
                    this.dialogVisible = false;
                }
                this.activeItemIndex++;
            },
            emptySalary() {
                this.salary = {
                    basicSalary: '',
                    trafficSalary: '',
                    lunchSalary: '',
                    bonus: '',
                    pensionPer: '',
                    pensionBase: '',
                    medicalPer: '',
                    medicalBase: '',
                    accumulationFundPer: '',
                    accumulationFundBase: '',
                    name: '',
                }
            },
            showAddSalaryView() {
                this.emptySalary();
                this.activeItemIndex = 0;
                this.dialogTitle = '添加工资帐套';
                this.dialogVisible = true;
            },
            initSalSob() {
                this.loading = true;
                this.getRequest("/salary/sob/").then(resp => {
                    if (resp) {
                        this.salarySobs = resp;
                        this.loading = false;
                        // console.log(this.salarySobs);
                    }
                })
            },
            cellStyle(row, column, rowIndex, columnIndex) {
                return "text-align:center;"
            },
            tableHeaderStyle(row, rowIndex) {
                return "text-align:center;";
            },
            DeleteSob(sob) {
                this.$confirm('此操作将永久删除:' + sob.name + '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/salary/sob/" + sob.id).then(resp => {
                        if (resp) {
                            this.initSalSob();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleEdit(row) {
                this.activeItemIndex = 0;
                this.dialogVisible = true;
                this.dialogTitle = '编辑' + row.name + '的信息';
                // console.log(row);
                this.salary.accumulationFundBase = row.accumulationFundBase;
                this.salary.accumulationFundPer = row.accumulationFundPer;
                this.salary.basicSalary = row.basicSalary;
                this.salary.bonus = row.bonus;
                this.salary.createDate = row.createDate;
                this.salary.lunchSalary = row.lunchSalary;
                this.salary.medicalBase = row.medicalBase;
                this.salary.medicalPer = row.medicalPer;
                this.salary.name = row.name;
                this.salary.pensionBase = row.pensionBase;
                this.salary.pensionPer = row.pensionPer;
                this.salary.trafficSalary = row.trafficSalary;
                this.salary.id = row.id;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

        }
    }
</script>

<style>
    .salSobFirstLine {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .salSobTable {
        font-size: small;
        text-align: center;
        width: 100%;
        margin-top: 10px;
    }


</style>
