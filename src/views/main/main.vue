<template>
  <el-container style="height: 1080px; border: 1px solid #eee">
    <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"  @select="handleSelect">
     <img   style="width: 100px; height: 100px"/>
      <el-menu-item index="1">
        <i class="el-icon-user"></i>
        <span slot="title">企业管理</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-user"></i>
        <span slot="title">用户管理</span>
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
        <span slot="title">节目制作</span>
      </el-menu-item>
    </el-menu>
    <el-container>
      <el-main>
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
      created(){
         this.$router.push('/Main/Users');
      },
      methods: {
           handleOpen(key, keyPath) {
             console.log(key, keyPath);
           },
           handleClose(key, keyPath) {
             console.log(key, keyPath);
           },
            handleSelect(key, keyPath){
                console.log(keyPath);
                   switch(key){
                     case '1':
                       this.$router.push('/Main/Users');
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
                       this.$router.push('/Main/Hosts');
                       break;
                     case '6':
                       this.$router.push('/Main/HostsAdmin');
                       break;
                       case '7':
                       this.$router.push('/Main/Info');
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
</style>
