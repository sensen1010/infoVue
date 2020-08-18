<template>
<div class="updateDiv">
  <div class="updatefrom" v-if="!clientShow">
  <el-row>
  <el-col :span="10"><div class="grid-content bg-purple"><p></p></div></el-col>
  <el-col :span="4">
      <el-button  style="width:100%;height:200px" @click="client()">客户端更新</el-button>
  </el-col>
  <el-col :span="10"><div class="grid-content bg-purple"><p></p></div></el-col>
</el-row>
 <!-- <el-row>
  <el-col :span="7"><div class="grid-content bg-purple"><p></p></div></el-col>
  <el-col :span="4">
     <el-button  style="width:100%;height:200px">管理端更新</el-button>
  </el-col>
  <el-col :span="2">
    <p></p>
  </el-col>
  <el-col :span="4">
      <el-button  style="width:100%;height:200px" @click="client()">客户端更新</el-button>
  </el-col>
  <el-col :span="7"><div class="grid-content bg-purple"><p></p></div></el-col>
</el-row> -->
</div>
 <el-row v-if="clientShow" class="clientDiv">
  <el-col :span="14">
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
      prop="apkMd5"
      label="apkMd5"
      >
    </el-table-column>
    <el-table-column
      prop="apkName"
      label="apk名称"
      >
    </el-table-column>
    <el-table-column
      prop="apkSize"
      label="apk大小"
      >
    </el-table-column>
    <el-table-column
      prop="modifyContent"
      label="更新说明"
      >
    </el-table-column>
    <el-table-column
      prop="updateTime"
      label="更新时间"
      >
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
   </el-main></el-col>
  <el-col :span="10" class="upFileDiv">
<el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="选择文件">
    <el-upload
      class="upload-demo"
      :action='upFileUrl+"/clientUpdate/file"'
      :on-success="filesuccess"
      multiple
      :data="form"
      ref="upload"
      :limit="1"
      :file-list="fileList"
      :auto-upload="false"
      >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传apk文件</div>
    </el-upload>
  </el-form-item>
  <el-form-item label="更新描述">
    <el-input type="textarea" v-model="form.modifyContent" class="text"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitUpload">发布更新</el-button>
    <el-button @click="clientShow=false">取消</el-button>
  </el-form-item>
  </el-form>
  </el-col>
</el-row>
</div>

</template>
<script>
export default {
    data(){
        return{
            pageSize:10,
            pagetotal:0,
            currentPage:1,
            clientShow:false,
            upFileUrl:this.GLOBAL.serverSrc,
            fileList:[],
            tableData:[],
            form: {
              modifyContent:'1、更新描述1\n2、更新描述2\n3、........'
            }
            
        }
    },
    activated() {
     
    },
    methods:{
      client(){
        this.clientShow=true;
         this.selectUpdate();
      },
       submitUpload() {
         const fileList=this.fileList;
         const modifyContent=this.form.modifyContent;
         console.log(fileList.length);
         if(modifyContent==""){
           return;
         }
        this.$refs.upload.submit();
      },
      filesuccess(response, file, fileList) {
          console.log(response);
          console.log(fileList);
          console.log(file);
          this.fileList=[]
          this.selectUpdate();
     },
       //查询更新记录
      selectUpdate(){
        this.$axios.get(this.GLOBAL.serverSrc+'/clientUpdate/update',
        {
          params: {
            page: this.currentPage - 1
          },
        }
        ).then(res=> {
              if(res.data.code==0){
              let data = JSON.parse(res.data.data);
              this.pagetotal=data[0].size;//设置总数据大小
              this.tableData=JSON.parse(data[0].data);//表数据
              }       
           }).catch(function (error) {
             console.log(error);
           });
      },
       handleCurrentChange() {
        this.selectUpdate();
      },
    }
}
</script>
<style>
.updateDiv{
    height: 1080px;
    
}
.updateDiv .updatefrom{
    padding-top: 10%;
    text-align: left!important;
}
.updateDiv .updatefrom label{
    color: #ffffff;
}
.clientDiv{
  padding-top: 3%; 
}
.clientDiv .upFileDiv{
  border: 1px solid #EBEEF5;
  line-height: 0px;;
}
.clientDiv .upFileDiv .text{
  height: 600px;
}
.clientDiv .upFileDiv .el-textarea__inner{
  height: 600px;
}
</style>
