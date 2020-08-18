<template>
    <el-container>

  <el-header>
     <el-menu :default-active="enterIndex" 
     class="el-menu-demo el-menu-host" mode="horizontal" @select="handleSelect">
  <el-menu-item  index="0">所有企业</el-menu-item>
  <el-menu-item  index="1">黑名单</el-menu-item >
  <el-menu-item  class="el-menu-hostInput">
    <div>
      <el-input size="mini" placeholder="企业名称" v-model="selectName" >
    </el-input><el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
      </div>
    </el-menu-item>  
   <el-menu-item style="float:right">
    <el-button type="primary" size="small"  @click="addEnterShowDialog= true" >
            添加企业
    </el-button>
    </el-menu-item>
  </el-menu>
  </el-header>
  <el-main>
<el-table
    ref="multipleTable"
    border
     size="mini"
    :data="tableData"
     tooltip-effect="dark"
    style="width: 100%"
    >
    <el-table-column
      prop="enterName"
      label="企业名"
      >
    </el-table-column>
    <el-table-column
      prop="hostNum"
      label="主机数"
      >
    </el-table-column>
    <el-table-column
      prop="enterTime"
      label="到期时间"
      >
    </el-table-column>
    <el-table-column
      prop="creationTime"
      label="添加时间"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="enterClickUpdate(scope.row)" type="text" size="small">修改</el-button>
        <el-button @click="enterClickNo(scope.row)" type="text" size="small" v-if="showEnterClick&&scope.row.enterId!=enterId">拉黑</el-button>
        <el-button @click="enterClickOk(scope.row)" type="text" size="small" v-else-if="scope.row.enterId!=enterId">恢复</el-button>
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
<!-- 添加企业框 -->
<el-dialog title="添加企业" :visible.sync="addEnterShowDialog" width="30%">
  <el-form :model="form" label-position="left" label-width="80px">
    <el-form-item label="名称" >
      <el-input v-model="form.enterName" autocomplete="on"></el-input>
    </el-form-item>
    <el-form-item label="主机数" >
      <el-row>
        <el-col span="10"><el-input v-model="form.hostNum" autocomplete="on" type="number"></el-input></el-col>
        <el-col span="4">台</el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="使用期限" >
      <el-row>
        <el-col span="10"><el-input v-model="form.day" autocomplete="on" type="number"></el-input></el-col>
        <el-col span="4">天</el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="账号" >
      <el-input v-model="form.userName" autocomplete="on"></el-input>
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
    <el-button type="primary" @click="saveEnter">确 定</el-button>
  </div>
</el-dialog>
<!-- 修改企业 -->
<el-dialog title="修改企业" :visible.sync="updateUserShowDialog" width="20%" class="enterUpdateDialog">
  <el-form :model="formUp" label-position="left" label-width="80px">
    <el-form-item label="默认账号">
      <el-tag>{{formUp.userName}}</el-tag>
    </el-form-item>
    <el-form-item label="主机数" >
     <el-input v-model="formUp.hostNum" autocomplete="on" type="number"></el-input>
    </el-form-item>
    <el-form-item label="到期时间" >
    <el-date-picker
      v-model="formUp.enterTime"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
      value-format="yyyy-MM-dd"
      >
    </el-date-picker>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="updateUserShowDialog = false">取 消</el-button>
    <el-button type="primary" @click="updateEnter">确 定</el-button>
  </div>
</el-dialog>
</el-container>
</template>
<script>
export default {
    data() {
      return {
        enterId:"",
        pageSize:10,
        pagetotal:0,
        enterIndex: "0",
        selectName:'',
        currentPage:1,
        showEnterClick:true,
        addEnterShowDialog:false,
        updateUserShowDialog:false,
        tableData: [
          
        ],
        form:{
          enterName:'',
          userName:'',
          hostNum:'5',
          day:'3',
          pow:'',
          pow2:''
        },
        formUp:{
          userName:'',
          hostNum:'',
          enterTime:'',
          enterId:'',
        },
         pickerOptions: {
          disabledDate(time) {
            return time.getTime() <=  Date.now();
          }
        },
      }
      
    },
    //页面加载
    created(){
      //  this.thisEnterId();
      //  this.selectEnter();
     // this.convert();
    },
     activated() {
     this.thisEnterId();
       this.selectEnter();
    },
    methods: {
      //
      thisEnterId(){
         const enterId= localStorage.getItem("enterId");
         this.enterId=enterId;
      },
      //修改企业
      updateEnter(){
         const userId= localStorage.getItem("userId");
        const hostNum=this.formUp.hostNum;
        const day=this.formUp.enterTime;
        const enterId=this.formUp.enterId;
        if(hostNum==""||day==""){
           this.$message({
                message: '请填写完整',
                type: 'warning'
              });
          return;
        }
        let formData=new FormData();
        formData.append("hostNum",hostNum);
        formData.append("day",day);
        formData.append("userId",userId);
       // alert(this.currentPage);
        this.$axios.patch(this.GLOBAL.serverSrc+'/enter/enter/'+enterId,formData).then(res=> {
              if(res.data.code==0){
                this.selectEnter(); 
              }
              this.updateUserShowDialog=false;
           }).catch(function (error) {
        this.updateUserShowDialog=false;
             console.log(error);
           });
      },
      enterClickUpdate(val){
        this.formUp.enterId=val.enterId
        this.formUp.userName=val.userName;
        this.formUp.hostNum=val.hostNum;
        this.formUp.enterTime=val.enterTime;
        this.updateUserShowDialog=true;
      },
      //添加企业
      saveEnter(){
        const enterName=this.form.enterName;
        const hostNum=this.form.hostNum;
        const day=this.form.day;
        const userName=this.form.userName;
        const pow=this.form.pow;
        const pow2=this.form.pow2;
        if(enterName==""||hostNum==""||day==""||userName==""||pow==""){
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
        const userId= localStorage.getItem("userId");
        let formData=new FormData();
        formData.append("enterName",enterName);
        formData.append("hostNum",hostNum);
        formData.append("day",day);
        formData.append("userName",userName);
        formData.append("pow",pow);
        formData.append("userId",userId);
       // alert(this.currentPage);
        this.$axios.post(this.GLOBAL.serverSrc+'/enter/admin/enter',formData).then(res=> {
              if(res.data.code==0){
                this.selectEnter();
                this.addEnterShowDialog=false;
                this.$message({
                message: '添加成功',
                type: 'success'
              });
              }
              else if(res.data.code==3){
                this.$message({
                message: '账号已被占用',
                type: 'warning'
              });
              }
           }).catch(function (error) {

             console.log(error);
           });
      },
      //查询企业
      selectEnter(){
        let formData=new FormData();
        formData.append("page",this.currentPage-1);
        formData.append("enterName",this.selectName);
        formData.append("state",this.enterIndex);
        let token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.get(this.GLOBAL.serverSrc+'/enter/enter',{ params:{
          enterName: this.selectName,
          state:this.enterIndex,
          page:this.currentPage-1
        }}).then(res=> {
              console.log(res);//数据先转换格式
              let data = JSON.parse(res.data.data);
              this.pagetotal=parseInt(data[0].size);//设置总数据大小
              this.tableData=JSON.parse(data[0].data);//表数据
           }).catch(function (error) {
             console.log(error);
           });
      },
      handleCurrentChange(val) {
        console.log(val);
        this.selectEnter();
      },
      //页头
      handleSelect(key, keyPath) {
        console.log(key+"");
        if(key!=null){
         this.currentPage=1;
         this.enterIndex=key;
         if(keyPath==0){
           this.showEnterClick=true
         }else{
           this.showEnterClick=false
         }
         this.selectEnter();
        }      
      },
      //恢复
      enterClickOk(val){
        this.$axios.delete(this.GLOBAL.serverSrc+'/enter/enter/'+val.enterId,{ params:{
          state:"0"
        }}).then(res=> {
          if(res.data.code=="0"){
              this.selectEnter();
          } 
           }).catch(function (error) {

             console.log(error);
      });
      },
      //拉黑
      enterClickNo(val){
       this.$axios.delete(this.GLOBAL.serverSrc+'/enter/enter/'+val.enterId,{ params:{
          state:"1"
        }}).then(res=> {
          if(res.data.code=="0"){
              this.selectEnter();
          } 
           }).catch(function (error) {

             console.log(error);
      });
      },
      onSubmit(){ 
         this.selectEnter();
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

.enterUpdateDialog{
  text-align: left;
}
</style>