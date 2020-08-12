<template>
<div class="signUpDiv">
    <div class="signUpfrom">
    <el-row>
  <el-col :span="9"><div class="grid-content bg-purple"><p></p></div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple-light">
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>企业注册</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="onClose()">取消</el-button>
  </div>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label-width="0">
    <el-input v-model="form.enterName" placeholder="企业名称"></el-input>
  </el-form-item >
  <el-form-item label-width="0">
    <el-input v-model="form.userName" :change="check_userName()" placeholder="登录账号"></el-input>
  </el-form-item >
   <el-form-item label-width="0">
    <el-input v-model="form.pow" type="password" placeholder="密码"></el-input>
  </el-form-item>
  <el-form-item label-width="0">
    <el-input v-model="form.pow2" type="password" placeholder="确认密码"></el-input>
  </el-form-item>
  <el-form-item label-width="0">
    <el-button type="primary" @click="onSignUp" style="width:100%">注册</el-button>
  </el-form-item>
</el-form>
</el-card>

</div></el-col>
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
               enterName:"" ,
               userName:"",
               pow:"",
               pow2:""
            }
        }
    },
    methods:{
      onSignUp(){ 
       const enterName=this.form.enterName;
       const userName=this.form.userName;
       const pow=this.form.pow;
       const pow2=this.form.pow2;
       if(enterName==""||userName==""||pow==""||pow2==""){
          this.$message({
                message: '请填写完整',
                type: 'warning'
              });
          return;    
       } 
       if(pow!=pow2){
         this.$message({
                message: '密码不一致',
                type: 'warning'
              });
          return;  
       }
       let formData = new FormData();
      formData.append("enterName",enterName); 
      formData.append("userName", userName);
      formData.append("pow",pow);
      this.$axios
        .post(this.GLOBAL.serverSrc+"/enter/enter", formData)
        .then(res => {
          console.log(res);
          // console.log(JSON.parse(res.data));//数据先转换格式
          if (res.data.code == "0") {
            this.$message({
                message: '注册成功',
                type: 'success'
              });
             this.$router.push('/Login');
          } 
           else if(res.data.code == "3"){
           this.$message({
                message: '账号已注册',
                type: 'warning'
              });
          }
          else if(res.data.code == "2"){
           this.$message({
                message: '只能注册一个企业',
                type: 'warning'
              });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
        },
        check_userName:function(){
           this.form.userName = this.form.userName.replace(/[\W]/g,'');
        },
        onClose(){
          this.$router.go(-1);
        }
    }
}
</script>
<style>

.signUpDiv{
    height: 1080px;
    background: -moz-linear-gradient(top, #1F313C 0%, #476374 80%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1F313C), color-stop(80%,#476374));
    background: -webkit-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: -o-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: -ms-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: linear-gradient(to bottom, #1F313C 0%,#476374 80%);
}

.signUpDiv .signUpfrom{
    padding-top: 10%;
     text-align: left!important;
}
.signUpDiv .signUpfrom label{
    color: #ffffff;
}
</style>
