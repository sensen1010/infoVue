<template>
<div class="loginDiv">
    <div class="loginfrom">
    <el-row>
  <el-col :span="9"><div class="grid-content bg-purple"><p></p></div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple-light">
      <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="账号">
    <el-input v-model="form.no"></el-input>
  </el-form-item>
   <el-form-item label="密码">
    <el-input v-model="form.pow" type="password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onLogin">登录</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form></div></el-col>
  <el-col :span="9"><div class="grid-content bg-purple"><p></p></div></el-col>
</el-row>
</div>
</div>
</template>
<script>
export default {
    data(){
        return{
            form:{
               no:"账号" ,
               pow:"123456"
            }
        }
    },
    methods:{
        onLogin(){ 
       let formData = new FormData();
      formData.append("loginName", this.form.no);
      formData.append("password", this.form.pow);
      this.$axios
        .post(this.GLOBAL.serverSrc+"/admin/login", formData)
        .then(res => {
          // console.log(JSON.parse(res.data));//数据先转换格式
          if (res.data.code == "0") {
            alert(res.data.msg);
            localStorage.setItem("userId",res.data.adminId);  
             this.$router.push('/Main'); 
          } else {
            alert(res.data.msg);
            localStorage.setItem("userId","");
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
}
.loginDiv .loginfrom{
    padding-top: 10%;
}
.loginDiv .loginfrom label{
    color: #ffffff;
}
</style>
