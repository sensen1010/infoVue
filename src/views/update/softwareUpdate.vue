<template>
<div class="loginDiv">
    <div class="loginfrom">
    <el-row>
  <el-col :span="10"><div class="grid-content bg-purple"><p></p></div></el-col>
  <el-col :span="4"><div class="grid-content bg-purple-light">
      
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>登录</span>
    <el-button style="float: right; padding: 3px 0" type="text">企业注册</el-button>
  </div>
  <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label-width="0">
    <el-input v-model="form.no" placeholder="账号"></el-input>
  </el-form-item >
   <el-form-item label-width="0">
    <el-input v-model="form.pow" type="password" placeholder="密码"></el-input>
  </el-form-item>
  <el-form-item label-width="0">
    <el-button type="primary" @click="onLogin" style="width:100%">登录</el-button>
  </el-form-item>
</el-form>
</el-card>

</div></el-col>
  <el-col :span="10"><div class="grid-content bg-purple"><p></p></div></el-col>
</el-row>
</div>
</div>
</template>
<script>
export default {
    data(){
        return{
            form:{
               no:"" ,
               pow:""
            }
        }
    },
    methods:{
        onLogin(){ 
       let formData = new FormData();
      formData.append("userName", this.form.no);
      formData.append("password", this.form.pow);
      this.$axios
        .post(this.GLOBAL.serverSrc+"/users/login", formData)
        .then(res => {
          console.log(res);
          // console.log(JSON.parse(res.data));//数据先转换格式
          if (res.data.code == "0") {
           // alert(res.data.msg);
            const redata=JSON.parse(res.data.data);
            localStorage.setItem("token",res.data.token);  
            localStorage.setItem("userNum",redata.userType);  
            localStorage.setItem("userId",redata.userId); 
            localStorage.setItem("enterId",redata.enterId);
            this.$router.push('/Main'); 
          } else {
             this.$message({
                message: '登录失败',
                type: 'warning'
              });
            localStorage.setItem("token","");  
            localStorage.setItem("userNum","");  
            localStorage.setItem("userId",""); 
            localStorage.setItem("enterId","");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
        }
    }
}
</script>
<style>
.loginDiv{

    height: 1080px;
    background: -moz-linear-gradient(top, #050D1D 0%, #2F4260 80%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#000000), color-stop(80%,#2F4260));
    background: -webkit-linear-gradient(top, #000000 0%,#2F4260 80%);
    background: -o-linear-gradient(top, #000000 0%,#2F4260 80%);
    background: -ms-linear-gradient(top, #000000 0%,#2F4260 80%);
    background: linear-gradient(to bottom, #000000 0%,#2F4260 80%);
}
.loginDiv .loginfrom{
    padding-top: 10%;
    text-align: left!important;
}
.loginDiv .loginfrom label{
    color: #ffffff;
}
</style>
