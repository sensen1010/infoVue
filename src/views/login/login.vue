<template>
<div class="loginDiv">
    <div class="loginfrom">
    <el-row>
  <el-col :span="10"><div class="grid-content bg-purple"><p></p></div></el-col>
  <el-col :span="4"><div class="grid-content bg-purple-light">
      
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>登录</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="enterSignUp()">企业注册</el-button>
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
    <p  class="textLink"><el-link type="primary" @click="registrationDiaLog">企业激活</el-link></p>
  </el-form-item>
</el-form>
</el-card>

</div></el-col>
  <el-col :span="10"><div class="grid-content bg-purple"><p></p></div></el-col>
</el-row>
</div>

<el-dialog
  title="企业激活"
  :visible.sync="registDialogVisible"
  width="30%"
  center>
  <el-form ref="form" :model="regist" label-width="0">
  <el-form-item>
    <el-input v-model="regist.no" placeholder="企业注册账号"></el-input>
  </el-form-item>
  <el-form-item>
    <el-input type="textarea" v-model="regist.code" class="codeText" placeholder="注册码"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="registDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="registClick()">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>
<script>
export default {
    data(){
        return{
          registDialogVisible:false,
            form:{
               no:"" ,
               pow:""
            },
            regist:{
               no:"" ,
               code:""
            }
        }
    },
    methods:{
      registrationDiaLog(){
        this.registDialogVisible=true;
      },
      registClick(){
         const no=this.regist.no;
         const code=this.regist.code;
         if(no==""||code==""){
           this.$message({
                message: '请填写完整',
                type: 'warning'
              });
           return;
         }
          let formData = new FormData();
          formData.append("no", no);
          formData.append("code",code);
        this.$axios
        .post(this.GLOBAL.serverSrc+"/enter/enter/regist", formData)
        .then(res => {
          console.log(res);
          // console.log(JSON.parse(res.data));//数据先转换格式
          if (res.data.code == "0") {
           // alert(res.data.msg);
            this.$message({
                message: '激活成功',
                type: 'warning'
              });
          } 
          else if(res.data.code == "-1"){
            this.$message({
                message: '已被禁用，无法激活',
                type: 'warning'
              });
          }
          else {
             this.$message({
                message: '激活失败',
                type: 'warning'
              });
          }
        })
        .catch(function(error) {
          console.log(error);
        });


      },
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
          } 
          else if(res.data.code == "2"){
            this.$message({
                message: '使用已过时',
                type: 'warning'
              });
          }
          else {
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
        },
        enterSignUp(){
          this.$router.push('/EnterSignUp');
        },
    }
}
</script>
<style>
.loginDiv{
    height: 1080px;
    background: -moz-linear-gradient(top, #1F313C 0%, #476374 80%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1F313C), color-stop(80%,#476374));
    background: -webkit-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: -o-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: -ms-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: linear-gradient(to bottom, #1F313C 0%,#476374 80%);
}
.loginDiv .loginfrom{
    padding-top: 10%;
    text-align: left!important;
}

.loginDiv .loginfrom .textLink{
    margin: 0!important;
    padding: 0!important;
    width: 100%;
    line-height: 20px;
    text-align: center!important;
}
.loginDiv .loginfrom label{
    color: #ffffff;
}
.loginDiv .codeText{
  height: 200px;
}
.loginDiv .el-textarea__inner{
  height: 200px;
}
</style>
