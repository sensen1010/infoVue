<template>
  <el-container style="height: 1080px; border: 1px solid #eee">
    <el-menu :default-active="active" class="el-menu-vertical-demo info-menu"
     @open="handleOpen" @close="handleClose"  @select="handleSelect"
     text-color="#ffffff"
    
     >
     <img style="width: 100px; height: 100px;margin-top:10px;"/>
      <el-menu-item index="1" v-if="userType=='0'">
        <i class="el-icon-s-cooperation"></i>
        <span slot="title">企业管理</span>
      </el-menu-item>
      <el-menu-item index="2" v-if="userType!='2'" >
        <i class="el-icon-user"></i>
        <span slot="title">账号管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-folder-opened"></i>
        <span slot="title">文件管理</span>
      </el-menu-item>
      <el-menu-item index="5">
        <i class="el-icon-monitor"></i>
        <span slot="title">客户端管理</span>
      </el-menu-item>
      <el-menu-item index="7">
        <i class="el-icon-video-camera-solid"></i>
        <span slot="title">节目管理</span>
      </el-menu-item>
      <el-menu-item index="8">
        <i class="el-icon-edit-outline"></i>
        <span slot="title">发布历史</span>
      </el-menu-item>
       <el-menu-item index="9" v-if="false">
        <i class="el-icon-refresh"></i>
        <span slot="title">软件更新</span>
      </el-menu-item>
      <el-menu-item index="10">
        <i class="el-icon-close"></i>
        <span slot="title">退出登录</span>
      </el-menu-item>
    </el-menu>
    <el-container>
      <el-main class="info-main">
        <keep-alive>
        <router-view name="mianView">
        </router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
      beforeCreate(){
      },
      data(){
        return{
            active:"1",
            userType:'2'
        }
    },
      created(){
         const num= localStorage.getItem("userNum");
         this.userType=num;
         if(num=="0"){
            this.active="1";
            this.$router.push('/Main/Enter');
         }
         else if(num=="1"){
           this.active="2";
            this.$router.push('/Main/Users');
         }
         else if(num=="2"){
            this.active="3";
            this.$router.push('/Main/Files');
         }
         else{
            this.$router.push('/Login');
         }
      },
      activated(){
        //  const num= localStorage.getItem("userNum");
        //  this.userType=num;
        //  if(num=="0"){
        //     this.active="1";
        //     this.$router.push('/Main/Enter');
        //  }
        //  else if(num=="1"){
        //    this.active="2";
        //     this.$router.push('/Main/Users');
        //  }
        //  else if(num=="2"){
        //     this.active="3";
        //     this.$router.push('/Main/Files');
        //  }
        //  else{
        //     this.$router.push('/Login');
        //  }
      },
      methods: {
           handleOpen(key, keyPath) {
             console.log(key, keyPath);
           },
           handleClose(key, keyPath) {
             console.log(key, keyPath);
           },
            handleSelect(key, keyPath){
               const num= localStorage.getItem("userNum");
                console.log(keyPath);
                   switch(key){
                     case '1':
                       this.$router.push('/Main/Enter');
                       break;
                     case '2':
                       this.$router.push('/Main/Users');
                       break;
                     case '3':
                       this.$router.push('/Main/Files');
                       break;
                     case '4':
                       this.$router.push('/Main/News');
                       break;
                     case '5':
                       if(num=='0'){
                         this.$router.push('/Main/HostsAdmin'); 
                       }else{
                         this.$router.push('/Main/Hosts');
                       }
                       break;
                     case '6':
                       this.$router.push('/Main/HostsAdmin');
                       break;
                       case '7':
                       if(num=='0'){
                         this.$router.push('/Main/InfoAdmin'); 
                       }else{
                         this.$router.push('/Main/Info');
                       }
                       break;
                       case '8':
                       if(num=='0'){
                         this.$router.push('/Main/InfoHistoryAdmin'); 
                       }else{
                         this.$router.push('/Main/InfoHistory');
                       }
                       break;
                        case '9':
                       this.$router.push('/Main/Update');
                       break;
                        case '10':
                        localStorage.setItem("token","");  
                        localStorage.setItem("userNum","");  
                        localStorage.setItem("userId",""); 
                        localStorage.setItem("enterId","");
                        this.$router.push('/login');
                       break;
                   }
                 }
           
      }
    };

</script>
<style>
    .el-header {
      background-color: #B3C0D1;
      color: #333;
      line-height: 60px;
    }

    .el-aside {
      color: #333;
    }
    .info-menu{
      background: -moz-linear-gradient(top, #1F313C 0%, #476374 80%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1F313C), color-stop(80%,#476374));
    background: -webkit-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: -o-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: -ms-linear-gradient(top, #1F313C 0%,#476374 80%);
    background: linear-gradient(to bottom, #1F313C 0%,#476374 80%);
    }
    .info-main{
      padding: 0px!important;
    }
</style>
