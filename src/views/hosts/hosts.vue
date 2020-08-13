<template>
    <el-container>
  <el-header>
     <el-menu :default-active="hostsIndex" 
     class="el-menu-demo el-menu-host" mode="horizontal" @select="handleSelect">
  <el-menu-item  index="0">所有设备</el-menu-item>
  <!-- <el-menu-item  index="1">禁用</el-menu-item >
  <el-menu-item  index="2">回收站</el-menu-item> -->
  <el-menu-item  class="el-menu-hostInput">
    <div>
      <el-input size="mini" placeholder="主机名" v-model="selectName" >
    </el-input><el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
      </div>
    </el-menu-item>  
   <!-- <el-menu-item style="float:right">
    <el-button type="primary" size="small"  @click="addHostShowDialog= true">
            添加设备
    </el-button>
    </el-menu-item> -->
  </el-menu>
  </el-header>

  <el-main>
<el-table
    ref="multipleTable"
    border
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    >
   <el-table-column
      prop="id"
      label="id"
      >
    </el-table-column>
    <el-table-column
      prop="hostId"
      label="主机UUID"
      >
    </el-table-column>
    <el-table-column
      prop="hostName"
      label="主机名称"
      >
    </el-table-column>
    <el-table-column
      prop="hostLinkId"
      label="链接Id"
      >
    </el-table-column>
    <el-table-column
      prop="linkState"
      label="链接状态"
      >
      <template slot-scope="scope">

      <el-tag type="success" v-if="scope.row.linkState=='0'">已连接</el-tag>
      <el-tag type="danger" v-if="scope.row.linkState=='1'">未连接</el-tag>
   
      </template>
    </el-table-column>
    <el-table-column
      prop="linkTime"
      label="最近链接时间"
      >
    </el-table-column>
    <el-table-column
      prop="creationTime"
      label="添加时间"
      >
    </el-table-column>
    <!-- <el-table-column
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="hostClickDis(scope.row)" type="text" size="small">发布节目</el-button>
      </template>
    </el-table-column> -->
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
<!-- 添加主机框 -->
<el-dialog title="添加主机" :visible.sync="addHostShowDialog">
  <el-form :model="form">
    <el-form-item label="主机名" >
     <el-input v-model="form.hostName" autocomplete="on"></el-input>
    </el-form-item>
    <el-form-item label="链接id（不能为中文）" >
      <el-input v-model="form.hostLinkId" autocomplete="on"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addHostShowDialog = false">取 消</el-button>
    <el-button type="primary" @click="saveHost">确 定</el-button>
  </div>
</el-dialog>

</el-container>
</template>
<script>
export default {
     data() {
      return {
        addHostShowDialog:false,
        pageSize:10,
        pagetotal:0,
        hostsIndex:"0",
        selectName:'',
        currentPage:1,
        tableColumShow:false,
        selectMatchId:"",
        tableData: [
        ],
        form:{
          matchId:"",
          playerName:'',
          age:'',
          phone:'',
          Introduction:''
        }
      }
      
    },
    //页面加载
    created(){
       this.selectHosts();
     // this.convert();
    },
    activated() {
      console.log('我这个页面显示就会执行');
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
      selectClick(){
        this.selectHosts();
      },
      //添加客户端
      saveHost(){
        let formData = new FormData();
      formData.append("hostName", this.form.hostName);
      formData.append("hostLinkId", this.form.hostLinkId);
      this.$axios
        .post(this.GLOBAL.serverSrc+"/host/add", formData)
        .then(res => {
          // console.log(JSON.parse(res.data));//数据先转换格式
          if (res.data.code == "0") {
            alert(res.data.msg);  
            this.selectHosts(); 
            this.addHostShowDialog=false;    
          } else {
            alert(res.data.msg);
           
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      },
      //查询客户端
      selectHosts(){
         const enterId = localStorage.getItem("enterId");
        let formData=new FormData();
        formData.append("hostName",this.selectName);
        formData.append("state",this.hostsIndex);
        formData.append("linkState","");
        formData.append("enterId",enterId);
        formData.append("page",this.currentPage-1);
        console.log(formData);
        this.$axios.post(this.GLOBAL.serverSrc+'/host/userSelect',formData).then(res=> {
              console.log(res.data.data);//数据先转换格式
              let data = JSON.parse(res.data.data);
            //  var data= typeof age=='string'?JSON.parse(res.data.data):res.data.data;
              this.pagetotal=data[0].size;//设置总数据大小
              var redate= typeof data[0].data=='string'?JSON.parse(data[0].data):data[0].data;
              this.tableData=redate;//表数据
           }).catch(function (error) {
             console.log(error);
           });
      },
      hostClickDis(val){
        this.updateHostState(val.hostId,"1");
      },
      updateHostState(hostId,state){
        let formData=new FormData();
        formData.append("hostId",hostId);
        formData.append("state",state);
       this.$axios.post(this.GLOBAL.serverSrc+'/host/update/state',formData).then(res=> {
              if(res.data.code==0){
                this.selectHosts();
              }
           }).catch(function (error) {
             console.log(error);
      });
      }
      ,
      //数字
      handleCurrentChange(val) {
        console.log(val);
        this.selectHosts();
      },
      //页头
      handleSelect(key, keyPath) {
        console.log(key);
        if(key!=null){
        this.currentPage=1;
         this.hostsIndex=keyPath+"";
         this.selectHosts(); 
        }
         

      },
      onSubmit(){
         this.selectHosts();
      }
      
    }
}
</script>
<style >
.block{
  margin-top: 10px;
}
 /**  */
.el-header{
 background-color:white;
}
.el-icon-plus{
  color:white;
}
.playerLook{
  line-height: 60px;
}
/**设置输入框没有下横线 */
#el-menu-hostInput{
  border-bottom: none;
}
/**设置输入框剧中 */
.el-menu-hostInput{
  width: 50%;
}
.el-menu-hostInput div{
  width: 50%;
  text-align: center;
  margin: 0 auto;
}

</style>