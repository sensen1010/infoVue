<template>
    <el-container>

  <el-header>
     <el-menu :default-active="userIndex" 
     class="el-menu-demo el-menu-host" mode="horizontal" @select="handleSelect">
  <el-menu-item  index="0">正常用户</el-menu-item>
  <el-menu-item  index="1">黑名单</el-menu-item >
  <el-menu-item  class="el-menu-hostInput">
    <div>
      <el-input size="mini" placeholder="账号" v-model="selectName" >
    </el-input><el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
      </div>
    </el-menu-item>  
   <el-menu-item style="float:right">
    <el-button type="primary" size="small"  @click="addUserShowDialog= true" >
            添加用户
    </el-button>
    </el-menu-item>
  </el-menu>
  </el-header>

  <el-main>
<el-table
    ref="multipleTable"
    border
    :data="tableData"
     tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
   <el-table-column
      prop="id"
      label="id"
      >
    </el-table-column>
    <el-table-column
      prop="userId"
      label="用户id"
      >
    </el-table-column>
    <el-table-column
      prop="loginName"
      label="登录名"
      >
    </el-table-column>
    <el-table-column
      prop="userName"
      label="名称"
      >
    </el-table-column>
    <el-table-column
      prop="creationTime"
      label="创建时间"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="userClickUpdate(scope.row)" type="text" size="small">修改</el-button>
        <el-button @click="userClickNo(scope.row)" type="text" size="small" v-if="showUserClick">拉黑</el-button>
        <el-button @click="userClickOk(scope.row)" type="text" size="small" v-else>恢复</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="block">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      background
      layout="total, prev, pager, next"
      :total="pagetotal">
    </el-pagination>
  </div>
  
  </el-main>
<!-- 添加用户框 -->
<el-dialog title="添加用户" :visible.sync="addUserShowDialog">
  <el-form :model="form">
    <el-form-item label="姓名" >
      <el-input v-model="form.userName" autocomplete="on"></el-input>
    </el-form-item>
    <el-form-item label="账号" >
      <el-input v-model="form.loginName" autocomplete="on"></el-input>
    </el-form-item>
    <el-form-item label="密码" >
     <el-input v-model="form.pow" autocomplete="on" type="password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" >
      <el-input v-model="form.pow2" type="password"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addPlayerShowDialog = false">取 消</el-button>
    <el-button type="primary" @click="saveUser">确 定</el-button>
  </div>
</el-dialog>
<!-- 修改用户 -->
<el-dialog title="修改用户" :visible.sync="updateUserShowDialog">
  <el-form :model="formUp">
    <el-form-item label="账号">
      {{formUp.no}}
    </el-form-item>
    <el-form-item label="密码" >
     <el-input v-model="formUp.pow" autocomplete="on" type="password"></el-input>
    </el-form-item>
    <el-form-item label="用户id" >
        {{formUp.userId}}
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="updateUserShowDialog = false">取 消</el-button>
    <el-button type="primary" @click="updateUser">确 定</el-button>
  </div>
</el-dialog>
</el-container>
</template>
<script>
export default {
    data() {
      return {
        pageSize:10,
        pagetotal:0,
        userIndex: "0",
        selectName:'',
        currentPage:1,
        showUserClick:true,
        addUserShowDialog:false,
        updateUserShowDialog:false,
        tableData: [
          
        ],
        form:{
          loginName:'',
          userName:'',
          pow:'',
          pow2:''
        },
        formUp:{
          no:'',
          pow:'',
          userId:'',
          id:'',
        }
      }
      
    },
    //页面加载
    created(){
       this.selectUser();
     // this.convert();
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
         //获取全选
        console.log(this.$refs.multipleTable.selection[0].name);
        this.multipleSelection = val;
      },
      //修改用户
      updateUser(){
         let formData=new FormData();
        formData.append("id",this.formUp.id);
        formData.append("pow",this.formUp.pow);
       // alert(this.currentPage);
        this.$axios.post(this.GLOBAL.serverSrc+'/users/update',formData).then(res=> {
              if(res.data.code==0){
                this.selectUser(); 
              }
              alert(res.data.msg);
              this.updateUserShowDialog=false;
           }).catch(function (error) {
        this.updateUserShowDialog=false;
             console.log(error);
           });
      },
      userClickUpdate(val){
        this.formUp.id=val.id
        this.formUp.no=val.no;
        this.formUp.userId=val.userId;
        this.updateUserShowDialog=true;
      },
      //添加用户
      saveUser(){
         let formData=new FormData();
        formData.append("loginName",this.form.loginName);
        formData.append("password",this.form.pow);
        formData.append("userName",this.form.userName);
        let pow1=this.form.pow;
        let pow2=this.form.pow2;
        if(pow1!=pow2){
          alert("密码不一致");
          return;
        }
       // alert(this.currentPage);
        this.$axios.post(this.GLOBAL.serverSrc+'/users/add',formData).then(res=> {
              if(res.data.code==0){
                this.selectUser();
                this.addUserShowDialog=false;
                alert(res.data.msg);
              }else{
              alert(res.data.msg);
              }
           }).catch(function (error) {

             console.log(error);
           });
      },
      //查询用户
      selectUser(){
        let formData=new FormData();
        formData.append("page",this.currentPage-1);
        formData.append("loginName",this.selectName);
        //formData.append("page",this.currentPage);
       // alert(this.currentPage);
        this.$axios.post(this.GLOBAL.serverSrc+'/users/select',formData).then(res=> {
              console.log(res);//数据先转换格式
              let data = JSON.parse(res.data.data);
              this.pagetotal=data[0].size;//设置总数据大小
              this.tableData=JSON.parse(data[0].data);//表数据
              
           }).catch(function (error) {

             console.log(error);
           });
      },
      handleCurrentChange(val) {
        console.log(val);
        this.selectUser();
      },
      //页头
      handleSelect(key, keyPath) {
        console.log(key+"");
        if(key!=null){
         this.currentPage=1;
         this.userIndex=keyPath+"";
         if(keyPath==0){
           this.showUserClick=true
         }else{
           this.showUserClick=false
         }
         this.selectUser();
        }      
      },
      //恢复
      userClickOk(val){
        let formData=new FormData();
        formData.append("id",val.id);
        formData.append("state","0");
        this.$axios.post(this.GLOBAL.serverSrc+'/users/update',formData).then(res=> {
          if(res.data.code=="0"){
  this.selectUser();
          }
            
           }).catch(function (error) {

             console.log(error);
      });
      },
      //拉黑
      userClickNo(val){
        let formData=new FormData();
        formData.append("id",val.id);
        formData.append("state","1");
        this.$axios.post(this.GLOBAL.serverSrc+'/users/update',formData).then(res=> {
          if(res.data.code=="0"){
        this.selectUser();
          }
           }).catch(function (error) {

             console.log(error);
      });
      },
      onSubmit(){ 
         this.selectUser();
      }
    }
}
</script>
<style>
.block{
  margin-top: 10px;
}
.el-header{
 background-color:white;
 text-align: center;
}

.el-form div{
  line-height: 60px;
}
.el-form button{
  margin-top: 15px;
}
</style>