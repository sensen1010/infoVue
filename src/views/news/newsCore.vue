<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="playerIndex"
        class="el-menu-demo el-menu-host"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">所有</el-menu-item>
        <el-menu-item index="2">删除</el-menu-item>
        <el-menu-item index="3">草稿</el-menu-item>
        <el-menu-item class="el-menu-hostInput">
          <div>
            <el-input size="mini" placeholder="标题" v-model="selectName"></el-input>
            <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
          </div>
        </el-menu-item>
        <el-menu-item style="float:right">
          <el-button type="primary" size="small" @click="addNewsShow= true">发布</el-button>
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
        @selection-change="handleSelectionChange"
        v-if="newsTableShow"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="typeId" label="类型">
          <template slot-scope="scope">
            <p v-if="scope.row.typeId=='0'">公告</p>
            <p v-if="scope.row.typeId=='1'">新闻</p>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="权重"></el-table-column>
        <!-- <el-table-column prop="newsContext" label="内容">
          <template slot-scope="scope">
            <div v-html="scope.row.newsContext"></div>
          </template>
        </el-table-column>-->
        <el-table-column prop="showState" label="显示类型">
          <template slot-scope="scope">
            <!-- <p v-if="scope.row.showState=='0'">全部可看</p>
            <p v-if="scope.row.showState=='1'">部分可看</p>-->
            <el-tag type="success" v-if="scope.row.showState=='0'">全部可看</el-tag>
            <el-tag type="warning" v-if="scope.row.showState=='1'">部分可看</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hostList" label="主机">
          <template slot-scope="scope">
            <p v-if="scope.row.hostList=='[]'||scope.row.hostList==''"></p>
            <p v-else>
              <el-tag
                v-for="item in JSON.parse(scope.row.hostList)"
                :key="item.hostId"
                type="success"
                effect="plain"
                size="mini"
              >{{ item.hostName }}</el-tag>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="发布人"></el-table-column>
        <el-table-column prop="creationTime" label="发布时间"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="updateNewsCore(scope.row)" type="text" size="small">修改</el-button>
            <el-button
              @click="newsCoreNo(scope.row)"
              type="text"
              size="small"
              v-if="newsCoreNoBtn"
            >删除</el-button>
            <el-button
              @click="newsCoreOk(scope.row)"
              type="text"
              size="small"
              v-if="newsCoreOkBtn"
            >恢复</el-button>
            <el-button
              @click="releaseNewsCore(scope.row)"
              type="text"
              size="small"
              v-if="releaseBtn"
            >发布</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" v-if="newsTableShow">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next"
          :total="pagetotal"
        ></el-pagination>
      </div>
      <!-- 修改弹出框 -->

      <el-dialog title="修改信息" :visible.sync="updateNewsShow" width="51%" center>
        <span>
          <el-form
            :model="formUpdate"
            ref="formUpdate"
            label-width="100px"
            class="demo-ruleForm"
            id="news-from"
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="formUpdate.title"></el-input>
            </el-form-item>
            <el-form-item label="发布类型" prop="typeId" style="width:400px">
              <table style="height: 40px;">
                <th>
                  <tr style="line-height: 40px;">
                    <el-radio v-model="formUpdate.typeId" label="0">公告</el-radio>
                  </tr>
                </th>
                <th>
                  <tr style="line-height: 40px;">
                    <el-radio v-model="formUpdate.typeId" label="1">新闻</el-radio>
                  </tr>
                </th>
              </table>
            </el-form-item>
            <el-form-item label="显示类型" prop="showState" style="width:400px">
              <table style="height: 40px;">
                <th>
                  <tr style="line-height: 40px;">
                    <el-switch
                      style="display: block;width:200px"
                      v-model="formUpdate.showState"
                      active-color="#13ce66"
                      :change="showTypeUpdate()"
                      active-text="部分可看"
                      inactive-text="全部可看"
                    ></el-switch>
                  </tr>
                </th>
                <th>
                  <tr style="line-height: 40px;">
                    <el-select
                      v-model="hostsList"
                      multiple
                      filterable
                      default-first-option
                      placeholder="请选择主机"
                      v-if="showStateHostUpdate"
                      style="width:200px"
                    >
                      <el-option
                        v-for="item in hostsData"
                        :key="item.hostId"
                        :label="item.hostName"
                        :value="item.hostId"
                      ></el-option>
                    </el-select>
                  </tr>
                </th>
              </table>
            </el-form-item>
            <el-form-item label="权重" prop="weight" style="width:200px">
              <el-input v-model="formUpdate.weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="region" style="height:410px">
              <quill-editor
                v-model="formUpdate.newsContext"
                ref="myQuillEditor"
                :options="editorOption"
              ></quill-editor>
              <el-upload
                class="avatar-uploader"
                :action='showimgUrl+"/img/newCord/up"'
                :show-file-list="false"
                :on-success="handleSuccess"
                style="display: none"
              >
                <i class="el-icon-plus avatar-uploader-icon" id="imgInput"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateNewsShow = false">取 消</el-button>
          <el-button type="primary" @click="updateNews()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新闻编辑框 -->
      <el-dialog title="发布公告/新闻" :visible.sync="addNewsShow" width="50.5%" center>
        <span>
          <el-form
            :model="form"
            ref="form"
            label-width="100px"
            class="demo-ruleForm"
            id="news-from"
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="发布类型" prop="typeId" style="width:400px">
              <table style="height: 40px;">
                <th>
                  <tr style="line-height: 40px;">
                    <el-radio v-model="form.typeId" label="0">公告</el-radio>
                  </tr>
                </th>
                <th>
                  <tr style="line-height: 40px;">
                    <el-radio v-model="form.typeId" label="1">新闻</el-radio>
                  </tr>
                </th>
              </table>
            </el-form-item>
            <el-form-item label="显示类型" prop="showState" style="width:400px">
              <table style="height: 40px;">
                <!-- <th>
              <tr @click="showStateType()"><el-radio v-model="form.showState" label="0" >全部可看</el-radio></tr>
            </th>
            <th>
              <tr @click="showStateType()"><el-radio v-model="form.showState" label="1" >部分可看</el-radio></tr>
                </th>-->
                <th>
                  <tr style="line-height: 40px;">
                    <el-switch
                      style="display: block;width:200px"
                      v-model="form.showState"
                      active-color="#13ce66"
                      :change="showStateType()"
                      active-text="部分可看"
                      inactive-text="全部可看"
                    ></el-switch>
                  </tr>
                </th>
                <th>
                  <tr style="line-height: 40px;">
                    <el-select
                      v-model="hostsList"
                      multiple
                      filterable
                      default-first-option
                      placeholder="请选择主机"
                      v-if="showStateHost"
                      style="width:200px"
                    >
                      <el-option
                        v-for="item in hostsData"
                        :key="item.hostId"
                        :label="item.hostName"
                        :value="item.hostId"
                      ></el-option>
                    </el-select>
                  </tr>
                </th>
              </table>
            </el-form-item>
            <el-form-item label="权重" prop="weight" style="width:200px">
              <el-input v-model="form.weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="region" style="height:410px">
              <quill-editor v-model="newsContext" ref="myQuillEditor" :options="editorOption"></quill-editor>
              <el-upload
                class="avatar-uploader"
                :action='showimgUrl+"/img/newCord/up"'
                :show-file-list="false"
                :on-success="handleSuccess"
                style="display: none"
              >
                <i class="el-icon-plus avatar-uploader-icon" id="imgInput"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveNews(0)">发布</el-button>
          <el-button @click="addNewsShow=false">取消</el-button>
          <el-button type="success" @click="saveNews(3)">保存为草稿</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
  ["blockquote", "code-block"], //引用，代码块
  [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ list: "ordered" }, { list: "bullet" }], //列表
  [{ script: "sub" }, { script: "super" }], // 上下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ direction: "rtl" }], // 文本方向
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
  [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
  [{ font: [] }], //字体
  [{ align: [] }], //对齐方式
  ["clean"], //清除字体样式
  ["image", "video"] //上传图片、上传视频
];
export default {
  components: {},
  data() {
    return {
      newsContext: "",
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".el-upload").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      //修改操作数据
      updateNewsShow: false,
      formUpdate: {
        newsContext: "",
        newsId: "",
        title: "",
        typeId: "0",
        weight: "0",
        showState: false
      },
      //表格、修改框显示设置
      newsTableShow: true,
      addNewsShow: false,
      //操作按钮显示
      newsCoreNoBtn: true,
      newsCoreOkBtn: false,
      releaseBtn: false,
      showStateHost: false,
      showimgUrl: this.GLOBAL.serverSrc,
      pageSize: 10,
      pagetotal: 0,
      playerIndex: "0",
      selectName: "",
      currentPage: 1,
      tableData: [],
      hostsData: [],
      hostsList: [],
      options: [],
      form: {
        title: "",
        typeId: "0",
        weight: "0",
        showState: false
      }
    };
  },
  //页面加载
  created() {
    this.selectNews();
    this.selectHosts();
  },
  methods: {
    handleSelectionChange(val) {
      //获取全选
      console.log(this.$refs.multipleTable.selection[0].name);
      alert(val.selectName);
      this.multipleSelection = val;
    },
    selectClick() {
      this.selectNews();
    },
    //显示类型-----选择主机(修改)
    showTypeUpdate() {
      var type = this.formUpdate.showState;
      console.log(type);
      if (type == false) {
        this.showStateHostUpdate = false;
      } else if (type == true) {
        this.showStateHostUpdate = true;
      }
    },
    //显示类型-----选择主机
    showStateType() {
      var type = this.form.showState;
      console.log(type);
      if (type == false) {
        this.showStateHost = false;
      } else if (type == true) {
        this.showStateHost = true;
      }
    },
    handleSuccess(res) {
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        let url = this.GLOBAL.serverNewsimg + "/" + res.url;
        console.log(url);
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(
          length,
          "image",
          this.GLOBAL.serverNewsimg + "/" + res.url
        );
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        // 提示信息，需引入Message
        // Message.error('图片插入失败')
      }
    },
    //查询主机列表
    selectHosts() {
      this.hostsData="";
      let formData = new FormData();
      formData.append("", "");
      this.$axios
        .post(this.GLOBAL.serverSrc + "/host/select", formData)
        .then(res => {
          let data = JSON.parse(res.data.data);
          var redate =
            typeof data[0].data == "string"
              ? JSON.parse(data[0].data)
              : data[0].data;
          this.hostsData = redate;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //修改新闻
    updateNews(){
      var showState = this.formUpdate.showState;
      let formData = new FormData();
      formData.append("newsId",this.formUpdate.newsId);
      formData.append("title", this.formUpdate.title);
      formData.append("typeId", this.formUpdate.typeId);
      formData.append("newsContext", this.formUpdate.newsContext);
      formData.append("weight", this.formUpdate.weight);
      if (showState == true) {
        formData.append("showState", "1");
        formData.append("hosts", this.hostsList);
      } else if (showState == false) {
        formData.append("showState", "0");
      }
      this.$axios
        .post(this.GLOBAL.serverSrc + "/news/update", formData)
        .then(res => {
          console.log(res); //数据先转换格式
          this.selectNews();
          this.updateNewsShow = false;
        })
        .catch(function(error) {
          console.log(error);
        });

    },
    //添加新闻
    saveNews(state) {
      console.log(this.hostsList);
      console.log(this.newsContext);
      var showState = this.form.showState;
      let formData = new FormData();
      formData.append("state", state);
      formData.append("title", this.form.title);
      formData.append("typeId", this.form.typeId);
      formData.append("newsContext", this.newsContext);
      formData.append("creationUsersId", "c1839b7b9987b24b7cc777a64adfc000");
      formData.append("weight", this.form.weight);
      if (showState == true) {
        formData.append("showState", "1");
        formData.append("hosts", this.hostsList);
      } else if (showState == false) {
        formData.append("showState", "0");
      }
      this.$axios
        .post(this.GLOBAL.serverSrc + "/news/add", formData)
        .then(res => {
          console.log(res); //数据先转换格式
          this.selectNews();
          this.addNewsShow = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询新闻
    selectNews() {
      let formData = new FormData();
      formData.append("title", this.selectName);
      formData.append("showType", "");
      formData.append("state", this.playerIndex);
      formData.append("page", this.currentPage - 1);
      this.$axios
        .post(this.GLOBAL.serverSrc + "/news/selectAll", formData)
        .then(res => {
          console.log(res); //数据先转换格式
          let data = JSON.parse(res.data.data);
          //  var data= typeof age=='string'?JSON.parse(res.data.data):res.data.data;
          //typeof data[0].data == "string" ? JSON.parse(data[0].data):data[0].data
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
      this.selectNews();
    },
    //页头
    handleSelect(key, keyPath) {
      console.log(key);
      if (key != null) {
        this.currentPage = 1;
        this.playerIndex = keyPath + "";
        this.selectNews();
        this.newsTableShow = true;
        if (keyPath == 0) {
          this.newsCoreNoBtn = true;
          this.newsCoreOkBtn = false;
          this.releaseBtn = false;
        }
        if (keyPath == 2) {
          this.newsCoreNoBtn = false;
          this.newsCoreOkBtn = true;
          this.releaseBtn = false;
        }
        if (keyPath == 3) {
          this.newsCoreNoBtn = false;
          this.newsCoreOkBtn = false;
          this.releaseBtn = true;
        }
      }
    },
    //新闻修改弹出框
    updateNewsCore(val) {
      //设置新闻id
      this.formUpdate.newsId=val.newsId;
      //清空列表
      this.hostsList = [];
      let data = JSON.parse(val.hostList);
      for (var i = 0, l = data.length; i < l; i++) {
         this.hostsList.push(data[i].hostId);
      }
      this.formUpdate.weight = val.weight;
      if (val.showState == "0") {
        this.formUpdate.showState = false;
      } else {
        this.formUpdate.showState = true;
      }
      this.formUpdate.newsContext = val.newsContext;
      this.formUpdate.title = val.title;
      this.formUpdate.typeId = val.typeId;
      this.updateNewsShow = true;
    },
    //新闻删除
    newsCoreNo(val) {
      this.updateNewsCoreState(val.newsId, "2");
    },
    //新闻恢复
    newsCoreOk(val) {
      this.updateNewsCoreState(val.newsId, "0");
    },
    //新闻发布
    releaseNewsCore(val) {
      this.updateNewsCoreState(val.newsId, "0");
    },
    //修改新闻状态
    updateNewsCoreState(newsId, state) {
      let formData = new FormData();
      formData.append("newsId", newsId);
      formData.append("state", state);
      this.$axios
        .post(this.GLOBAL.serverSrc + "/news/update", formData)
        .then(res => {
          if (res.data.code == 0) {
            this.selectNews();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询
    onSubmit() {
      this.selectNews();
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
.quill-editor {
  height: 300px;
}
#news-from div {
  line-height: normal;
}
</style>