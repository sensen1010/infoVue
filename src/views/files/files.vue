<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="playerIndex"
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
          </div>
        </el-menu-item>
        <el-menu-item style="float:right">
          <el-button type="primary" size="small" @click="addFileBtn()">上传文件</el-button>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
       <el-radio-group v-model="radio3" size="small">
      <el-radio-button label="全部"></el-radio-button>
      <el-radio-button label="图片"  ></el-radio-button>
      <el-radio-button label="视频"></el-radio-button>
      <el-radio-button label="音乐"></el-radio-button>
      <el-radio-button label="文档"></el-radio-button>
    </el-radio-group>
      <el-row v-if="showType">
        <el-col :span="3" v-for="file in tableData" :key="file.id" style="font-size: 14px;">
          <el-card id="el-file-card" :body-style="{ padding: '0px' }" shadow="hover">
            <img :src='showimgUrl+"/"+file.imgUrl' class="image"  style="height:140px;width:100%"
             v-if="file.imgType=='jpg'||file.imgType=='png'"
            />
            <video
               :src='showimgUrl+"/"+file.imgUrl'
               style="height:100%;width:100%"
               controls="controls"
               v-else-if="file.imgType=='mp4'||file.imgType=='flv'"
            />
            <div class="file-name">
              <span>{{file.imgName}}</span>
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
        <el-table-column prop="imgMd5" label="md5"></el-table-column>
        <el-table-column prop="imgName" label="名称"></el-table-column>
        <el-table-column prop="imgType" label="文件类型"></el-table-column>
        <el-table-column prop="showType" label="显示类型"></el-table-column>
        <el-table-column prop="creationTime" label="添加时间"></el-table-column>
        <el-table-column prop="imgUrl" label="文件">
          <template slot-scope="scope">
            <img
              :src='showimgUrl+"/"+scope.row.imgUrl'
              style="width:50px;height:50px;"
              v-if="scope.row.imgType=='jpg'||scope.row.imgType=='png'"
            />
            <img
              src="../../assets/z123.jpg"
              style="width:50px;height:50px;"
               v-else-if="scope.row.imgType=='zip'"
            />
            <video
               :src='showimgUrl+"/"+scope.row.imgUrl'
               style="width:50px;height:50px;"
               controls="controls"
               v-else-if="scope.row.imgType=='mp4'"
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
              @click="playerClickNo(scope.row)"
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
          action="http://192.168.1.52:8081/file/file"
          multiple
          :on-success="filesuccess"
          :on-error="fileerror"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :on-change="onFileChange"
          :before-remove="beforeRemove"
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
      radio3:"全部",
      showType: true,
      showimgUrl: this.GLOBAL.serverimg,
      noBtnShow: true,
      okBtnShow: true,
      auditNoMessageShow: false,
      addFileShowDialog: false,
      formLabelWidth: "120px",
      pageSize: 32,
      pagetotal: 0,
      playerIndex: "0",
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
    this.selectPlayer();
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
    selectClick() {
      this.selectPlayer();
    },
    //添加
    savePlayer() {
      let formData = new FormData();
      formData.append("playerName", this.form.playerName);
      formData.append("age", this.form.age);
      formData.append("phone", this.form.phone);
      formData.append("Introduction", this.form.Introduction);
      formData.append("matchId", this.form.matchId);
      formData.append("userId", "admin");
      this.$axios
        .post(this.GLOBAL.serverSrc + "/plays/add", formData)
        .then(res => {
          // console.log(JSON.parse(res.data));//数据先转换格式
          if (res.data.code == "0") {
            alert(res.data.msg);
            this.selectPlayer();
            this.addPlayerShowDialog = false;
          } else {
            alert(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询
    selectPlayer() {
      let formData = new FormData();
      formData.append("name", this.selectName);
      formData.append("showType", "");
      formData.append("state", this.playerIndex);
      formData.append("page", this.currentPage - 1);
      this.$axios
        .post(this.GLOBAL.serverSrc + "/img/imgList", formData)
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

      this.selectPlayer();
    },
    //页头
    handleSelect(key, keyPath) {
      console.log(key);
      if (key != null) {
        this.currentPage = 1;
        this.playerIndex = keyPath + "";
        this.selectPlayer();

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
            this.selectPlayer();
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
                this.selectPlayer();
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
      this.selectPlayer();
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
      this.selectPlayer();
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