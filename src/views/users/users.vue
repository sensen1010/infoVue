<template>
    <el-container>

  <el-header>
  <el-menu :default-active="userIndex" 
     class="el-menu-demo el-menu-host" mode="horizontal" @select="handleSelect"
     >
  <el-menu-item  index="0">所有用户</el-menu-item>
  <el-menu-item  index="1">黑名单</el-menu-item >
  <el-menu-item  class="el-menu-hostInput">
    <div>
      <el-input size="mini" placeholder="名称" v-model="selectName" >
    </el-input><el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
    <el-select v-model="enterId" filterable placeholder="请选择" size="mini" v-if="showEnter" @change="selectClick" >
     <el-option
      v-for="item in enterList"
      :key="item.enterId"
      :label="item.enterName"
      :value="item.enterId"
      >
    </el-option>
    </el-select>
    </div>
  </el-menu-item>  
   <el-menu-item style="float:right">
    <el-button type="primary" size="small"  @click="addUserShowDialog= true" >
            添加账号
    </el-button>
    </el-menu-item>
  </el-menu>
  </el-header>

  <el-main>
<el-table
    ref="multipleTable"
    border
    :data="tableData"
    size="mini"
     tooltip-effect="dark"
    style="width: 100%"
    >
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
      prop="userName"
      label="登录名"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      >
    </el-table-column>
    <el-table-column
      prop="enterName"
      label="所属企业"
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
        <el-button @click="userClickNo(scope.row)" type="text" size="small" v-if="showUserClick&&scope.row.userId!=userId">拉黑</el-button>
        <el-button @click="userClickOk(scope.row)" type="text" size="small" v-else-if="scope.row.userId!=userId">恢复</el-button>
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
<el-dialog title="添加账号" :visible.sync="addUserShowDialog" width="20%">
  <el-form :model="form" label-position="left">
    <el-form-item label="所属企业" v-if="showEnter">
     <el-select v-model="form.addEnterId" filterable placeholder="请选择">
     <el-option
      v-for="item in enterList.slice(1)"
      :key="item.enterId"
      :label="item.enterName"
      :value="item.enterId"
      >
    </el-option>
    </el-select>
    </el-form-item>
    <el-form-item>
      <el-input v-model="form.name" autocomplete="on" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="form.userName" autocomplete="on" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item >
     <el-input v-model="form.pow" autocomplete="on" type="password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="form.pow2" type="password" placeholder="确认密码"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addUserShowDialog = false">取 消</el-button>
    <el-button type="primary" @click="saveUser">确 定</el-button>
  </div>
</el-dialog>
<!-- 修改用户 -->
<el-dialog title="修改信息" :visible.sync="updateUserShowDialog" width="20%">
<el-form ref="form" :model="formUp" size="mini">
  <el-form-item label="用户id">
     {{formUp.userId}}
  </el-form-item>
  <el-form-item label="名称">
    {{formUp.name}} ({{formUp.no}})
  </el-form-item>
  <el-form-item label="新密码">
    <el-input  v-model="formUp.pow" type="password"></el-input>
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
        userId:"",
        pageSize:10,
        pagetotal:0,
        userIndex: "0",
        selectName:'',
        currentPage:1,
        showUserClick:true,
        addUserShowDialog:false,
        updateUserShowDialog:false,
        //企业列表选项
        showEnter:false,
        enterList: [],
        enterId: '',
        //用户数据
        tableData: [
          
        ],
        form:{
          addEnterId:'',
          name:'',
          userName:'',
          pow:'',
          pow2:''
        },
        formUp:{
          no:'',
          name:'',
          pow:'',
          userId:'',
          id:'',
        }
      }
      
    },
    //页面加载
    created(){
       this.thisUserId();
       this.selectUser();
       this.showEnterList();
     // this.convert();
    },
    methods: {
      thisUserId(){
         const userId= localStorage.getItem("userId");
         this.userId=userId;
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      //企业下拉列表选中
      selectClick(){
         this.selectUser(); 
      },
      //判断是否显示企业下拉列表
      showEnterList(){
       const num= localStorage.getItem("userNum");
       if(num=="0"){
         this.selectEnterList();
       }else{
         this.showEnter=false;
       }

      },
      //查询企业列表
      selectEnterList(){
       // alert(this.currentPage);
        let token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.get(this.GLOBAL.serverSrc+'/enter/enter/list').then(res=> {
              if(res.data.code==0){
                this.showEnter=true;
                let data = JSON.parse(res.data.data);
                console.log(data);
                this.enterList=data;
              }       
           }).catch(function (error) {
             console.log(error);
           });
      },
      //修改用户
      updateUser(){
        const pow=this.formUp.pow;
        if(pow==null||pow==""){
          this.$message.error('不能为空');
          return;
        }
        const userId=this.formUp.userId;
        const enterId=localStorage.getItem("enterId");
        let formData=new FormData();
        formData.append("pow",pow);
        formData.append("enterId",enterId);
        let token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.patch(this.GLOBAL.serverSrc+'/users/users/'+userId,formData).then(res=> {
             console.log(res);
             if(res.data.code==0){
                this.selectUser(); 
                 this.updateUserShowDialog=false;
                 this.$message({
                  message: "修改成功",
                  type: 'success'
                });
              }else{
                 this.$message.error("修改失败"); 
              }
             
           }).catch(function (error) {
        this.updateUserShowDialog=false;
             console.log(error);
           });
      },
      userClickUpdate(val){
        this.formUp.id=val.id
        this.formUp.no=val.userName;
        this.formUp.name=val.name;
        this.formUp.userId=val.userId;
        this.updateUserShowDialog=true;
      },
      //添加用户
      saveUser(){
         let formData=new FormData();
        formData.append("name",this.form.name);
        formData.append("password",this.form.pow);
        formData.append("userName",this.form.userName);
        const num= localStorage.getItem("userNum");
        let enterId="";
        if(num=="1"){
        enterId=localStorage.getItem("enterId");
        }else if(num=="0"){
        enterId=this.form.addenterId;
        }
        formData.append("enterId",enterId);
        let pow1=this.form.pow;
        let pow2=this.form.pow2;
        if(pow1!=pow2){
           this.$message.error('密码不一致');
          return;
        }
       // alert(this.currentPage);
        this.$axios.post(this.GLOBAL.serverSrc+'/users/users',formData).then(res=> {
              if(res.data.code==0){
                this.selectUser();
                this.addUserShowDialog=false;
                this.$message({
                  message: "添加成功",
                  type: 'success'
                });
              }else{
                 this.$message.error("添加失败");
              }
           }).catch(function (error) {

             console.log(error);
           });
      },
      //查询用户
      selectUser(){
        const num= localStorage.getItem("userNum");
        let url="";
        let enterId="";
        if(num=="1"){
        enterId=localStorage.getItem("enterId");
        url="/users/enterUser";
        }else if(num=="0"){
        url="/users/adminUser";
        enterId=this.enterId;
        }
        let token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.get(this.GLOBAL.serverSrc+url,{ params:{
          page: this.currentPage-1,
          name:this.selectName,
          state:this.userIndex,
          enterId:enterId,
        }}).then(res=> {
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
        const enterId=localStorage.getItem("enterId");
        const userId=val.userId;
        let token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.delete(this.GLOBAL.serverSrc+'/users/users/'+userId,
        {params:{
          enterId:enterId,
          state:"0"
        }}
        ).then(res=> {
          if(res.data.code=="0"){
             this.selectUser();
          }
            
           }).catch(function (error) {

             console.log(error);
      });
      },
      //拉黑
      userClickNo(val){
        const enterId=localStorage.getItem("enterId");
        const userId=val.userId;
        let token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.delete(this.GLOBAL.serverSrc+'/users/users/'+userId,
        {params:{
          enterId:enterId,
          state:"1"
        }}).then(res=> {
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