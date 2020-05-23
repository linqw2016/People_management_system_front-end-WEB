<template>
<div>
    <div style="margin-top: 10px;display: flex;justify-content: center" >
        <el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search" style="width: 500px;margin-right: 20px" size="normal" @keydown.enter.native="doSearch"></el-input>
        <el-button type="primary" icon="el-icon-search" size="normal" @click="doSearch">搜索</el-button>
    </div>
    <div class="hr-container">
        <el-card class="hr-card" v-for="(hr,index) in hrs" :key="index">
            <div slot="header" class="clearfix">
                <span>{{hr.name}}</span>
                <el-button style="float: right; padding: 3px 0;color: #e2051e" type="text" icon="el-icon-delete" @click="deleteHrById(hr)"></el-button>
            </div>
            <div>
                <div style="display:flex;justify-content: center;width:100%">
                    <img :src=imgs[index] :alt="hr.name" :title="hr.name" class="userface_img">
                </div>
                <div class="userinfo_container">
                    <div>用户名：{{hr.name}}</div>
                    <div>手机号码：{{hr.phone}}</div>
                    <div>电话号码：{{hr.telephone}}</div>
                    <div>地址：{{hr.address}}</div>
                    <div style="display: flex;justify-content: flex-start;margin-right: 10px">禁用状态：
                        <el-switch
                                @change="enabledChange(hr)"
                                style="display: block"
                                v-model="hr.enabled"
                                active-color=#13ce66
                                inactive-color="#ff4949"
                                active-text="启用"
                                inactive-text="禁用">
                        </el-switch>
                    </div>
                    <div style="margin-top: 5px">用户角色：
                        <el-tag  style="margin-right: 8px" type="success" v-for="(r,index) in hr.roles"
                                       :key="index">{{r.nameZh}}</el-tag>
                        <el-popover
                                @show="showPop(hr)"
                                @hide="hidePop(hr)"
                                placement="right"
                                title="角色列表"
                                width="200"
                                trigger="click">

                            <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                <el-option
                                        v-for="(r,indexk) in allRoles"
                                        :key="indexk"
                                        :label="r.nameZh"
                                        :value="r.id">
                                </el-option>
                            </el-select>

                            <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                        </el-popover>
                    </div>
                    <div>备注：{{hr.remark}}</div>
                </div>

            </div>
        </el-card>
    </div>
</div>
</template>

<script>
    import img1 from '../../assets/userface1.jpg';
    import img2 from '../../assets/userface2.jpg';
    import img3 from '../../assets/userface3.jpg';
    import img4 from '../../assets/userface4.jpg';

    export default {
        name: "SysHr",
        data(){
            return{
                keywords:'',
                hrs:[],
                imgs:[img1,img2,img3,img4],//用本地图片当头像；
                allRoles:[],
                selectedRoles:[]
            }
        },
        mounted(){
            this.initHrs();
        },
        methods:{
            deleteHrById(hr){
                this.$confirm('此操作将永久删除角色 '+hr.name+' , 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/hr/"+hr.id).then(resp=>{
                        if(resp){
                            this.initHrs();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            doSearch(){
                this.initHrs();
            },
            hidePop(hr){
                let hrRids=[];
                hr.roles.forEach(r=>{
                    hrRids.push(r.id);
                });
                hrRids.sort();
                let sRoles= this.selectedRoles;
                sRoles.sort();
                console.log("sRoles:"+sRoles.toString());
                console.log("hrRids:"+hrRids.toString());
                if(hrRids.toString()!=sRoles.toString()){
                    let url="/system/hr/updateHrRoles/?hrid="+hr.id;
                    this.selectedRoles.forEach(sr=>{
                        url+="&roles="+sr;
                    });
                    this.putRequest(url).then(resp=>{
                        if(resp){
                            this.initHrs();
                        }
                    });
                }
                // console.log(hr);
            },
            showPop(hr){
                this.initAllRoles();
                this.selectedRoles=[];
                let rs = hr.roles;
                rs.forEach(r=>{
                    this.selectedRoles.push(r.id);
                });
            },
            initAllRoles(){
              this.getRequest("/system/hr/roles").then(resp=>{
                 if(resp){
                     this.allRoles=resp;
                 }
              });
            },
            enabledChange(hr){
                delete hr.roles;
                this.putRequest("/system/hr/",hr).then(resp=>{
                   if (resp){
                       this.initHrs();
                   }
                });
            },
            initHrs(){
                this.getRequest("/system/hr/?keywords="+this.keywords).then(resp=>{
                    if (resp){
                        this.hrs=resp;
                        console.log(resp);
                    }
                })
            }
        }
    }
</script>

<style >
    .userinfo_container div{
        font-size: 15px;
        color: blueviolet;
    }
    .userinfo_container{
        margin-top: 20px;
    }
    .userface_img{
        width:100px;
        height: 100px;
        border-radius: 100px;
    }
    .hr-container{
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
        justify-content: space-between;
    }
    .hr-card{
        width: 450px;
        margin-bottom: 20px;
    }

</style>
