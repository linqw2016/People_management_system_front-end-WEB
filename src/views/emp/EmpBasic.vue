<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-input placeholder="请输入需要搜索的员工名" v-model="keywords"
                              clearable
                              @clear="initForm"
                              prefix-icon="el-icon-search"
                              style="width: 380px;margin-right: 20px"
                              @keydown.native.enter="initForm"
                              :disabled="showAdvanceView">
                    </el-input>
                    <el-button type="primary" icon="el-element-search" @click="initForm" :disabled="showAdvanceView">
                        搜索
                    </el-button>
                    <el-button type="primary" @click="advanceSearchBtn">
                        <i :class="showAdvanceView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
                           aria-hidden="true"></i>
                        高级搜索
                    </el-button>
                </div>
                <div style="margin-left: 5px;margin-right: 5px;display: inline">
                    <el-upload style="display: inline-flex;margin-right: 5px"
                               :before-upload="beforeUpload"
                               :on-success="onSuccess"
                               :on-error="onError"
                               :disabled="importDataDisabled"
                               :show-file-list="false" action="/employee/basic/import">
                        <el-button :disabled="importDataDisabled" size="mini" type="success" :icon="importDataBtnIcon">
                            {{importDataBtnText}}
                        </el-button>
                    </el-upload>
                    <el-button type="success" size="mini" @click="exportEmps" icon="el-icon-download">
                        导出数据
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               @click="showAddEmpView">
                        添加员工
                    </el-button>
                </div>
            </div>

            <!--            高级搜索的div-->
            <transition name="slide-fade">
                <div v-show="showAdvanceView"
                     style="border: 1px solid #8306e2;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px">
                    <el-row>
                        <el-col :span="5">
                            政治面貌:
                            <el-select v-model="searchValue.politicId" placeholder="政治面貌" size="mini"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in politics"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            民族:
                            <el-select v-model="searchValue.nationId" placeholder="民族" size="mini"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in nations"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            职位:
                            <el-select v-model="searchValue.posId" placeholder="职位" size="mini" style="width: 130px;">
                                <el-option
                                        v-for="item in positions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            职称:
                            <el-select v-model="searchValue.jobLevelId" placeholder="职称" size="mini"
                                       style="width: 130px;">
                                <el-option
                                        v-for="item in jobLevels"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="7">
                            聘用形式:
                            <el-radio-group v-model="searchValue.engageForm">
                                <el-radio label="劳动合同">劳动合同</el-radio>
                                <el-radio label="劳务合同">劳务合同</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>

                    <el-row style="margin-top: 10px">
                        <el-col :span="5">
                            所属部门:
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="200"
                                    trigger="manual"
                                    v-model="popVisible2">
                                <el-tree :data="allDeps" :props="defaultProps" @node-click="searchViewHandleNodeClick"
                                         default-expand-all></el-tree>
                                <div slot="reference"
                                     style="width: 130px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;
                                 height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;
                                 box-sizing: border-box;margin-left: 2px"
                                     @click="showDepView2">
                                    {{inputDepName}}
                                </div>
                            </el-popover>
                        </el-col>


                        <el-col :span="10">
                            入职日期:
                            <el-date-picker
                                    v-model="searchValue.beginDateScope"
                                    type="daterange"
                                    size="mini"
                                    unlink-panels
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="5" :offset="4">
                            <el-button size="mini" @click="advanceViewCancel">取消</el-button>
                            <el-button size="mini" icon="el-icon-search" type="primary" @click="initForm('advanced')">搜索
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
            </transition>

        </div>

        <div style="margin-top:10px">
            <el-table
                    max-height="500"
                    :data="emps"
                    v-loading="tableLoading"
                    border
                    stripe
                    @selection-change="handleSelectionChange"
                    size="mini"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        align="left"
                        width="30">
                </el-table-column>
                <el-table-column
                        prop="name"
                        align="left"
                        fixed
                        label="姓名"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="workId"
                        width="85"
                        align="left"
                        label="工号">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        width="50">
                </el-table-column>
                <el-table-column
                        width="120"
                        align="left"
                        label="出生日期">
                    <template slot-scope="scope">{{ scope.row.birthday}}</template>
                </el-table-column>
                <el-table-column
                        prop="idCard"
                        width="150"
                        align="left"
                        label="身份证号码">
                </el-table-column>
                <el-table-column
                        prop="wedlock"
                        width="70"
                        label="婚姻状况">
                </el-table-column>
                <el-table-column
                        width="50"
                        prop="nation.name"
                        label="民族">
                </el-table-column>
                <el-table-column
                        prop="nativePlace"
                        width="80"
                        label="籍贯">
                </el-table-column>
                <el-table-column
                        prop="politicsstatus.name"
                        label="政治面貌">
                </el-table-column>
                <el-table-column
                        prop="email"
                        width="160"
                        align="left"
                        label="电子邮件">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        width="100"
                        label="电话号码">
                </el-table-column>
                <el-table-column
                        prop="address"
                        width="220"
                        align="left"
                        label="联系地址">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        align="left"
                        width="100"
                        label="所属部门">
                </el-table-column>
                <el-table-column
                        width="100"
                        align="left"
                        prop="position.name"
                        label="职位">
                </el-table-column>
                <el-table-column
                        prop="jobLevel.name"
                        width="100"
                        align="left"
                        label="职称">
                </el-table-column>
                <el-table-column
                        prop="engageForm"
                        label="聘用形式">
                </el-table-column>
                <el-table-column
                        width="120"
                        align="left"
                        label="入职日期">
                    <template slot-scope="scope">{{ scope.row.beginDate}}</template>
                </el-table-column>
                <el-table-column
                        width="120"
                        align="left"
                        label="转正日期">
                    <template slot-scope="scope">{{ scope.row.conversionTime}}</template>
                </el-table-column>
                <el-table-column
                        width="120"
                        align="left"
                        label="合同起始日期">
                    <template slot-scope="scope">{{ scope.row.beginContract}}</template>
                </el-table-column>
                <el-table-column
                        width="120"
                        align="left"
                        label="合同截至日期">
                    <template slot-scope="scope">{{ scope.row.endContract}}</template>
                </el-table-column>
                <el-table-column
                        align="left"
                        width="70"
                        label="合同期限">
                    <template slot-scope="scope">{{ scope.row.contractTerm}}年</template>
                </el-table-column>
                <el-table-column
                        align="left"
                        prop="tipTopDegree"
                        label="最高学历">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="195">
                    <template slot-scope="scope">
                        <el-button @click="showEditEmpView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px"
                                   size="mini">编辑
                        </el-button>
                        <el-button style="padding: 3px 4px 3px 4px;margin: 2px" type="primary"
                                   size="mini">查看高级资料
                        </el-button>
                        <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                                   @click="deleteEmp(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px;display: flex;justify-content: flex-end">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-size="size"
                        background
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
            <el-form :model="emp" :rules="rules" ref="addEmpForm" style="margin: 0px;padding: 0px;">
                <div style="text-align: left;">
                    <el-dialog
                            :title="title"
                            style="padding: 0px;"
                            :close-on-click-modal="false"
                            :visible.sync="dialogVisible"
                            width="77%">
                        <el-row>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="姓名:" prop="name">
                                        <el-input prefix-icon="el-icon-edit" v-model="emp.name" size="mini"
                                                  style="width: 150px"
                                                  placeholder="请输入员工姓名"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div>
                                    <el-form-item label="性别:" prop="gender">
                                        <el-radio-group v-model="emp.gender">
                                            <el-radio label="男">男</el-radio>
                                            <el-radio style="margin-left: 15px" label="女">女</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="出生日期:" prop="birthday">
                                        <el-date-picker
                                                v-model="emp.birthday"
                                                size="mini"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                style="width: 150px"
                                                type="date"
                                                placeholder="出生日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="7">
                                <div>
                                    <el-form-item label="政治面貌:" prop="politicId">
                                        <el-select v-model="emp.politicId" style="width: 200px" size="mini"
                                                   placeholder="政治面貌">
                                            <el-option
                                                    v-for="item in politics"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="民族:" prop="nationId">
                                        <el-select v-model="emp.nationId" style="width: 150px" size="mini"
                                                   placeholder="请选择民族">
                                            <el-option
                                                    v-for="item in nations"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div>
                                    <el-form-item label="籍贯:" prop="nativePlace">
                                        <el-input v-model="emp.nativePlace" size="mini" style="width: 120px"
                                                  placeholder="员工籍贯"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="电子邮箱:" prop="email">
                                        <el-input prefix-icon="el-icon-message" v-model="emp.email" size="mini"
                                                  style="width: 150px"
                                                  placeholder="电子邮箱地址..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="7">
                                <div>
                                    <el-form-item label="联系地址:" prop="address">
                                        <el-input prefix-icon="el-icon-edit" v-model="emp.address" size="mini"
                                                  style="width: 200px"
                                                  placeholder="联系地址..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="职位:" prop="posId">
                                        <el-select v-model="emp.posId" style="width: 150px" size="mini"
                                                   placeholder="请选择职位">
                                            <el-option
                                                    v-for="item in positions"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div>
                                    <el-form-item label="职称:" prop="jobLevelId">
                                        <el-select v-model="emp.jobLevelId" style="width: 120px" size="mini"
                                                   placeholder="请选择职称">
                                            <el-option
                                                    v-for="item in jobLevels"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="所属部门:" prop="departmentId">
                                    <el-popover
                                            placement="right"
                                            title="请选择部门"
                                            width="200"
                                            trigger="manual"
                                            v-model="popVisible">
                                        <el-tree :data="allDeps" :props="defaultProps" @node-click="handleNodeClick"
                                                 default-expand-all></el-tree>
                                        <div slot="reference"
                                             style="width:120px;display:inline-flex;font-size:13px;
                                             border: 1px solid #DCDFE6;height:26px;border-radius:4px;
                                             padding: 0 15px;cursor: pointer;align-items: center" @click="showDepView">
                                            {{inputDepName}}
                                        </div>
                                    </el-popover>

                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <div>
                                    <el-form-item label="电话号码:" prop="phone">
                                        <el-input prefix-icon="el-icon-phone" v-model="emp.phone" size="mini"
                                                  style="width: 200px"
                                                  placeholder="电话号码..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="工号:" prop="workID">
                                        <el-input v-model="emp.workId" disabled size="mini" style="width: 150px"
                                                  placeholder="员工工号..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div>
                                    <el-form-item label="学历:" prop="tipTopDegree">
                                        <el-select v-model="emp.tipTopDegree" style="width: 120px" size="mini"
                                                   placeholder="最高学历">
                                            <el-option
                                                    v-for="item in degrees"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="毕业院校:" prop="school">
                                        <el-input prefix-icon="el-icon-edit" v-model="emp.school" size="mini"
                                                  style="width: 150px"
                                                  placeholder="毕业院校名称"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="7">
                                <div>
                                    <el-form-item label="专业名称:" prop="specialty">
                                        <el-input prefix-icon="el-icon-edit" v-model="emp.specialty" size="mini"
                                                  style="width: 200px"
                                                  placeholder="专业名称"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="入职日期:" prop="beginDate">
                                        <el-date-picker
                                                v-model="emp.beginDate"
                                                size="mini"
                                                style="width: 130px"
                                                type="date"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                placeholder="入职日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="转正日期:" prop="conversionTime">
                                        <el-date-picker
                                                v-model="emp.conversionTime"
                                                size="mini"
                                                style="width: 130px"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="date"
                                                placeholder="转正日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="合同起始日期:" prop="beginContract">
                                        <el-date-picker
                                                v-model="emp.beginContract"
                                                size="mini"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                style="width: 135px"
                                                type="date"
                                                placeholder="合同起始日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <el-form-item label="合同终止日期:" prop="endContract">
                                        <el-date-picker
                                                v-model="emp.endContract"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                size="mini"
                                                style="width: 135px"
                                                type="date"
                                                placeholder="合同终止日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <div>
                                    <el-form-item label="身份证号码:" prop="idCard">
                                        <el-input prefix-icon="el-icon-edit" v-model="emp.idCard" size="mini"
                                                  style="width: 180px"
                                                  placeholder="请输入员工身份证号码..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div>
                                    <el-form-item label="聘用形式:" prop="engageForm">
                                        <el-radio-group v-model="emp.engageForm">
                                            <el-radio label="劳动合同">劳动合同</el-radio>
                                            <el-radio style="margin-left: 15px" label="劳务合同">劳务合同</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div>
                                    <el-form-item label="婚姻状况:" prop="wedlock">
                                        <el-radio-group v-model="emp.wedlock">
                                            <el-radio label="已婚">已婚</el-radio>
                                            <el-radio style="margin-left: 15px" label="未婚">未婚</el-radio>
                                            <el-radio style="margin-left: 15px" label="离异">离异</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible=false">取 消</el-button>
    <el-button size="small" type="primary" @click="addEmp">确 定</el-button>
  </span>
                    </el-dialog>
                </div>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        name: "EmpBasic",
        data() {
            return {
                showAdvanceView: false,
                popVisible2: false,
                searchValue: {
                    politicId: '',
                    nationId: '',
                    posId: '',
                    jobLevelId: '',
                    engageForm: '',
                    beginDateScope: '',
                    departmentId: '',
                },
                importDataDisabled: false,
                importDataBtnText: "导入数据",
                importDataBtnIcon: "el-icon-upload2",
                title: '',
                inputDepName: '点击选择所属部门',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                allDeps: [],
                popVisible: false,
                degrees: [{id: 4, name: '大专'}, {id: 5, name: '本科'}, {id: 6, name: '硕士'}, {id: 7, name: '博士'},
                    {id: 3, name: '高中'}, {id: 2, name: '初中'}, {id: 1, name: '小学'}, {id: 8, name: '其他'}],
                positions: [],
                politics: [],
                dialogVisible: false,
                nations: [],
                jobLevels: [],
                emps: [],
                multipleSelection: [],
                tableLoading: false,
                total: 0,
                page: 1,
                size: 10,
                keywords: '',
                emp: {
                    name: "q",
                    gender: "男",
                    birthday: "2020-10-11",
                    idCard: "610122199001011256",
                    wedlock: "已婚",
                    nationId: 1,
                    nativePlace: "陕西",
                    politicId: 13,
                    email: "laowang@qq.com",
                    phone: "18565558897",
                    address: "深圳市南山区",
                    departmentId: null,
                    jobLevelId: 9,
                    posId: 29,
                    engageForm: "劳务合同",
                    tipTopDegree: "本科",
                    specialty: "信息管理与信息系统",
                    school: "深圳大学",
                    beginDate: "2018-01-01",
                    workState: "在职",
                    workId: "202",
                    contractTerm: 2.0,
                    conversionTime: "2018-04-01",
                    notWorkDate: null,
                    beginContract: "2018-01-10",
                    endContract: "2020-01-01",
                    workAge: null
                },
                rules: {
                    name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
                    gender: [{required: true, message: '必填:性别', trigger: 'blur'}],
                    birthday: [{required: true, message: '必填:出生日期', trigger: 'blur'}],
                    idCard: [{
                        required: true,
                        message: '必填:身份证号码',
                        trigger: 'blur'
                    }, {
                        pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message: '身份证号码格式不正确',
                        trigger: 'blur'
                    }],
                    wedlock: [{required: true, message: '必填:婚姻状况', trigger: 'blur'}],
                    nationId: [{required: true, message: '必填:民族', trigger: 'change'}],
                    nativePlace: [{required: true, message: '必填:籍贯', trigger: 'blur'}],
                    politicId: [{required: true, message: '必填:政治面貌', trigger: 'blur'}],
                    email: [{required: true, message: '必填:电子邮箱', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    phone: [{required: true, message: '必填:电话号码', trigger: 'blur'}],
                    address: [{required: true, message: '必填:联系地址', trigger: 'blur'}],
                    departmentId: [{required: true, message: '必填:部门', trigger: 'change'}],
                    jobLevelId: [{required: true, message: '必填:职称', trigger: 'change'}],
                    posId: [{required: true, message: '必填:职位', trigger: 'change'}],
                    engageForm: [{required: true, message: '必填:聘用形式', trigger: 'blur'}],
                    tipTopDegree: [{required: true, message: '必填:最高学历', trigger: 'change'}],
                    specialty: [{required: true, message: '必填:专业', trigger: 'blur'}],
                    school: [{required: true, message: '必填:毕业院校', trigger: 'blur'}],
                    beginDate: [{required: true, message: '必填:入职日期', trigger: 'blur'}],
                    workId: [{required: true, message: '必填:工号', trigger: 'blur'}],
                    conversionTime: [{required: true, message: '必填:转正日期', trigger: 'blur'}],
                    beginContract: [{required: true, message: '必填:合同起始日期', trigger: 'blur'}],
                    endContract: [{required: true, message: '必填:合同终止日期', trigger: 'blur'}],
                    workAge: [{required: true, message: '必填:工龄', trigger: 'blur'}]
                }
            }
        },
        mounted() {
            this.initForm();
            this.initData();
        },
        methods: {
            advanceViewCancel() {
                this.searchValue = {
                    politicId: '',
                    nationId: '',
                    posId: '',
                    jobLevelId: '',
                    engageForm: '',
                    beginDateScope: '',
                    departmentId: '',
                };
                this.showAdvanceView = false;
                this.empEmpty();
                this.initForm();

            },
            advanceSearchBtn() {
                this.searchValue = {
                    politicId: '',
                    nationId: '',
                    posId: '',
                    jobLevelId: '',
                    engageForm: '',
                    beginDateScope: '',
                    departmentId: '',
                };
                this.showAdvanceView = !this.showAdvanceView;
                if (!this.showAdvanceView) {
                    this.empEmpty();
                    this.initForm();
                }
            },
            showDepView2() {
                this.popVisible2 = !this.popVisible2;
            },
            searchViewHandleNodeClick(data) {
                this.inputDepName = data.name;
                this.searchValue.departmentId = data.id;
                this.popVisible2 = !this.popVisible2;
            },
            onError(err, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
            },
            onSuccess(response, file, fileList) {
                this.importDataBtnText = '导入数据';
                this.importDataBtnIcon = 'el-icon-upload2';
                this.importDataDisabled = false;
                this.initForm();
            },
            beforeUpload() {
                this.importDataBtnText = '正在导入';
                this.importDataBtnIcon = 'el-icon-loading';
                this.importDataDisabled = true;
            },
            exportEmps() {
                window.open('/employee/basic/export', '_parent');
            },
            empEmpty() {
                this.emp = {
                    name: "",
                    gender: "",
                    birthday: "",
                    idCard: "",
                    wedlock: "",
                    nationId: 1,
                    nativePlace: "",
                    politicId: 13,
                    email: "",
                    phone: "",
                    address: "",
                    departmentId: null,
                    jobLevelId: 9,
                    posId: 29,
                    engageForm: "",
                    tipTopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    // workState: "",
                    workId: "",
                    contractTerm: '',
                    conversionTime: "",
                    notWorkDate: null,
                    beginContract: "",
                    endContract: "",
                    workAge: null
                }
                this.inputDepName = '';
            },
            showEditEmpView(emp) {
                // this.initPositions();
                this.inputDepName = emp.department.name;
                this.title = '编辑员工信息';
                this.dialogVisible = true;
                this.emp = emp;
            },
            deleteEmp(emp) {
                this.$confirm('此操作将永久删除:' + emp.name + '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employee/basic/" + emp.id).then(resp => {
                        if (resp) {
                            this.initForm();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            addEmp() {
                if (this.emp.id) {
                    this.$refs['addEmpForm'].validate(valid => {
                        if (valid) {
                            this.putRequest("/employee/basic/", this.emp).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initForm();
                                }
                            });

                        }
                    });
                } else {
                    this.$refs['addEmpForm'].validate(valid => {
                        if (valid) {
                            this.postRequest("/employee/basic/", this.emp).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.initForm();
                                }
                            })
                        }
                    });
                }
            },
            handleNodeClick(data) {
                this.inputDepName = data.name;
                this.emp.departmentId = data.id;
                this.popVisible = !this.popVisible;
            },
            showDepView() {
                this.popVisible = !this.popVisible;
            },
            getMaxWorkId() {
                this.getRequest("/employee/basic/maxWorkID").then(resp => {
                    //console.log(resp);
                    this.emp.workId = resp.object;
                })
            },
            initPositions() {
                if (!window.sessionStorage.getItem("positions")) {
                    this.getRequest("/employee/basic/positions").then(resp => {
                        this.positions = resp;
                        window.sessionStorage.setItem("positions", JSON.stringify(resp));
                    });
                } else {
                    this.positions = JSON.parse(window.sessionStorage.getItem("positions"))
                }
            },
            initData() {
                this.initPositions();
                if (!window.sessionStorage.getItem("deps")) {
                    this.getRequest("/employee/basic/departments").then(resp => {
                        this.allDeps = resp;
                        window.sessionStorage.setItem("deps", JSON.stringify(resp));
                    });
                } else {
                    this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
                }
                if (!window.sessionStorage.getItem("nations")) {
                    this.getRequest("/employee/basic/nation").then(resp => {
                        this.nations = resp;
                        window.sessionStorage.setItem("nations", JSON.stringify(resp));
                    });
                } else {
                    this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
                }

                if (!window.sessionStorage.getItem("jobLevels")) {
                    this.getRequest("/employee/basic/jobLevels").then(resp => {
                        this.jobLevels = resp;
                        window.sessionStorage.setItem("jobLevels", JSON.stringify(resp));
                    });
                } else {
                    this.jobLevels = JSON.parse(window.sessionStorage.getItem("jobLevels"));
                }

                if (!window.sessionStorage.getItem("politics")) {
                    this.getRequest("/employee/basic/politics").then(resp => {
                        this.politics = resp;
                        window.sessionStorage.setItem("politics", JSON.stringify(resp));
                    });
                } else {
                    this.politics = JSON.parse(window.sessionStorage.getItem("politics"));
                }


            },
            showAddEmpView() {
                this.empEmpty();
                this.title = '添加员工';
                this.getMaxWorkId();
                this.initPositions();
                if (!window.sessionStorage.getItem("deps")) {
                    this.getRequest("/employee/basic/departments").then(resp => {
                        this.allDeps = resp;
                        window.sessionStorage.setItem("deps", JSON.stringify(resp));
                    });
                } else {
                    this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
                }
                // console.log(this.allDeps);
                this.dialogVisible = true;

            },
            handleSizeChange(val) {
                this.size = val;
                this.initForm();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.initForm();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            initForm(type) {
                this.tableLoading = true;
                let url = "/employee/basic/?page=" + this.page + "&size=" + this.size;
                if (type && type == 'advanced') {
                    // console.log(this.searchValue);
                    if(this.searchValue.politicId){
                        url += '&politicId=' + this.searchValue.politicId;
                    }
                    if (this.searchValue.nationId){
                        url+='&nationId=' + this.searchValue.nationId;
                    }
                    if(this.searchValue.posId){
                        url+='&posId' + this.searchValue.posId;
                    }
                    if(this.searchValue.jobLevelId){
                        url+='&jobLevelId=' + this.searchValue.jobLevelId;
                    }
                    if(this.searchValue.engageForm){
                        url+='&engageForm=' + this.searchValue.engageForm
                    }
                    if(this.searchValue.beginDateScope){
                        url+='&beginDateScope=' + this.searchValue.beginDateScope
                    }
                    if(this.searchValue.departmentId){
                        url+='&departmentId=' + this.searchValue.departmentId;
                    }
                    this.getRequest(url).then(resp => {
                        // console.log(resp);
                        this.emps = resp.data;
                        this.total = resp.total;
                    });
                } else {
                    this.getRequest(url + '&name=' + this.keywords).then(resp => {
                        // console.log(resp);
                        this.emps = resp.data;
                        this.total = resp.total;
                    });
                }

                this.tableLoading = false;
            }
        }
    }
</script>

<style>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(10px);
        opacity: 0;
    }

</style>
