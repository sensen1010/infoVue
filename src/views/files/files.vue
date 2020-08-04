<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="fileIndex"
        class="el-menu-demo el-menu-host"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">所有文件</el-menu-item>
        <el-menu-item index="1">回收站</el-menu-item>
        <el-menu-item>
          <el-switch v-model="showType" active-text="缩略图" inactive-text="列表"></el-switch>
        </el-menu-item>
        <el-menu-item class="el-menu-hostInput">
          <div>
            <el-input size="mini" placeholder="文件名" v-model="selectName"></el-input>
            <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
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
          <el-button type="primary" size="small" @click="addFileBtn()">上传文件</el-button>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
       <el-radio-group v-model="fileTypeId"  size="small" @change="clickFileTypeId">
      <el-radio-button label="全部"></el-radio-button>
      <el-radio-button label="图片"></el-radio-button>
      <el-radio-button label="文档"></el-radio-button>
      <el-radio-button label="视频"></el-radio-button>
      <el-radio-button label="音乐"></el-radio-button>
    </el-radio-group>
      <el-row v-if="showType">
        <el-col :span="3" v-for="file in tableData" :key="file.id" style="font-size: 14px;">
          <el-card id="el-file-card" :body-style="{ padding: '0px' }" shadow="hover">
            <img :src='showFileUrl+"/"+file.fileUrl' class="image"  style="height:140px;width:100%"
             v-if="file.fileTypeId=='1'"
            />
            <video
               :src='showFileUrl+"/"+file.fileUrl'
               :poster='showFileUrl+"/"+file.videoImg'
               style="height:100%;width:100%;"
               controls="controls"
               v-else-if="file.fileTypeId=='3'"
            />
            <div class="file-name">
              <span>{{file.fileName}}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-if="!showType"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="fileMd5" label="md5"></el-table-column>
        <el-table-column prop="fileName" label="名称"></el-table-column>
        <el-table-column prop="fileType" label="文件类型"></el-table-column>
        <el-table-column prop="creationTime" label="添加时间"></el-table-column>
        <el-table-column prop="fileUrl" label="文件">
          <template slot-scope="scope">
            <img
              :src='showFileUrl+"/"+scope.row.fileUrl'
              style="width:50px;height:50px;"
              v-if="scope.row.fileTypeId=='1'"
            />
            <img
              src="../../assets/z123.jpg"
              style="width:50px;height:50px;"
               v-else-if="scope.row.fileTypeId=='2'"
            />
            <video
               :src='showFileUrl+"/"+scope.row.fileUrl'
               :poster='showFileUrl+"/"+scope.row.videoImg'
               style="width:50px;height:50px;"
               controls="controls"
               v-else-if="scope.row.fileTypeId=='3'"
            />
            
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click="playerClickOk(scope.row)"
              type="text"
              size="small"
              v-if="okBtnShow"
            >通过</el-button>
            <el-button
              type="text"
              size="small"
              v-if="noBtnShow"
            >下载</el-button>
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
          :total="pagetotal"
        ></el-pagination>
      </div>
    </el-main>
    <!-- 上传文件 -->
    <el-dialog title="上传文件" :visible.sync="addFileShowDialog">
      <el-form :model="form">
        <el-upload
          class="upload-demo"
          drag
          :data="mydata"
          ref="upload"
          :action='upFileUrl+"/file/file"'
          multiple
          :on-success="filesuccess"
          :on-error="fileerror"
          :file-list="fileList"
          :auto-upload="false"
          list-type="picture"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png/mp4文件</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFileShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      fileTypeId:"全部",
      showType: true,
      upFileUrl:this.GLOBAL.serverSrc,
      showFileUrl: this.GLOBAL.serverimg,
      noBtnShow: true,
      okBtnShow: true,
      auditNoMessageShow: false,
      addFileShowDialog: false,
      formLabelWidth: "120px",
      //企业列表选项
        showEnter:false,
        enterList: [],
        enterId: '',
      pageSize: 32,
      pagetotal: 0,
      fileIndex: "0",
      selectName: "",
      currentPage: 1,
      tableColumShow: false,
      selectMatchId: "",
      tableData: [],
      fileList: [],
      mydata: {
        enterId: "",
        userId:""
      },
      options: [],
      form: {
        matchId: "",
        playerName: "",
        age: "",
        phone: "",
        Introduction: ""
      }
    };
  },
  //页面加载
  created() {
    this.selectFile();
    this.showEnterList();
    // this.showMatchItem();
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
      alert(val.selectName);
      this.multipleSelection = val;
    },
    //点击上传按钮，清空文件列
    addFileBtn(){
      this.fileList=[]
      this.addFileShowDialog= true

    }
    ,
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
      //企业下拉列表选中
      selectClick(){
         this.selectFile(); 
      },
      //文件类型选择
      clickFileTypeId(){
        
        this.selectFile();
      },
    //查询
    selectFile() {
      let enterId=localStorage.getItem("enterId");
      let userNum=localStorage.getItem("userNum");
      let userId=localStorage.getItem("userId");
      let fileType=this.fileTypeId;
      let fileTypeId="";
      if(fileType=="全部") fileTypeId="";
      else if(fileType=="图片") fileTypeId="1";
      else if(fileType=="文档") fileTypeId="2";
      else if(fileType=="视频") fileTypeId="3";
      else if(fileType=="音乐") fileTypeId="4";
      let fileUrl="/file/fileList";
      if(userNum=="0"){
          fileUrl="/file/admin/fileList"
          enterId=this.enterId;
      }
      this.$axios
        .get(this.GLOBAL.serverSrc + fileUrl,{
        params:{
          name: this.selectName,
          enterId:enterId,
          fileTypeId:fileTypeId,
          userId:userId,
          state:this.fileIndex,
          page:this.currentPage-1
        }

        })
        .then(res => {
          console.log(res); //数据先转换格式
          let data = JSON.parse(res.data.data);
          //  var data= typeof age=='string'?JSON.parse(res.data.data):res.data.data;
          this.pagetotal = data[0].size; //设置总数据大小
          var redate =
            typeof data[0].data == "string"
              ? JSON.parse(data[0].data)
              : data[0].data;
          this.tableData = redate; //表数据
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //数字
    handleCurrentChange(val) {
      console.log(val);

      this.selectFile();
    },
    //页头
    handleSelect(key, keyPath) {
      console.log(key);
      if (key != null) {
        this.currentPage = 1;
        this.fileIndex = keyPath + "";
        this.selectFile();
        if (keyPath == 0) {
          this.okBtnShow = true;
          this.noBtnShow = true;
          this.auditNoMessageShow = false;
        }
        if (keyPath == 1) {
          this.okBtnShow = false;
          this.noBtnShow = true;
          this.auditNoMessageShow = false;
        }
        if (keyPath == 2) {
          this.okBtnShow = true;
          this.noBtnShow = false;
          this.auditNoMessageShow = true;
        }
      }
    },
    //通过
    playerClickOk(val) {
      let formData = new FormData();
      formData.append("id", val.id);
      formData.append("auditState", "1");
      formData.append("auditNoMessage", "");
      this.$axios
        .post(this.GLOBAL.serverSrc + "/plays/admin/update", formData)
        .then(res => {
          if (res.data.code == 0) {
            this.selectFile();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //不通过
    playerClickNo(val) {
      this.$prompt("请输入退回理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let formData = new FormData();
          formData.append("id", val.id);
          formData.append("auditState", "2");
          formData.append("auditNoMessage", value + "");
          this.$axios
            .post(this.GLOBAL.serverSrc + "/plays/admin/update", formData)
            .then(res => {
              if (res.data.code == 0) {
                this.selectFile();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          //取消
        });
    },
    onSubmit() {
      this.selectFile();
    },
    showMatchItem() {
      this.$axios
        .post(this.GLOBAL.serverSrc + "/mat/admin/matchList")
        .then(res => {
          if (res.data.code == 0) {
            this.options = JSON.parse(res.data.data); //表数据
            console.log(res.data.data);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    submitUpload() {
      this.mydata.enterId=localStorage.getItem("enterId");
      this.mydata.userId=localStorage.getItem("userId");
      this.$refs.upload.submit();
    },
    fileerror(err, file, fileList){
          console.log(err);
          console.log(fileList);
          console.log(file);
    },
    filesuccess(response, file, fileList) {
          console.log(response);
          console.log(fileList);
          console.log(file);
      this.selectFile();
    }
  }
};
</script>
<style >
.block {
  margin-top: 10px;
}
.el-header {
  background-color: white;
}

.playerLook {
  line-height: 60px;
 
}
#el-file-card{
  height:135px;margin:10px;
  position:relative;
  background: #000000;
}
#el-file-card .file-name{
  width: 100%;
  position: absolute;
  bottom: 0px;
  text-align: center;
  color: aliceblue;
  background: #000000;
  opacity:0.8;
  padding: 0px 2px;
}
#el-file-card .file-name span{
  width: 100%;
  padding: 0px 1px;
  font-size: 12px;
  word-break: break-all;
}
</style>