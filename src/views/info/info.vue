<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="infoIndex"
        class="el-menu-demo el-menu-host"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">节目列表</el-menu-item>
        <el-menu-item index="1">发布历史</el-menu-item>
        <el-menu-item class="el-menu-hostInput">
          <div>
            <el-input size="mini" placeholder="节目名" v-model="selectName"></el-input>
            <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
          </div>
        </el-menu-item>
        <el-menu-item style="float:right">
          <el-button type="primary" size="small" @click="addInfoBtn()">制作节目</el-button>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <template>
        <el-table
          ref="multipleTable"
          border
          size="mini"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          class="infoTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="layoutType" label="布局类型">
            <template slot-scope="scope">
              <p v-if="scope.row.layoutType=='1'">竖版</p>
              <p v-else>横板</p>
            </template>
          </el-table-column>
          <el-table-column prop="contentHtml" label="布局文件">
            <template slot-scope="scope">
              <div v-if="scope.row.layoutType=='1'" style="transform:scale(0.2);height:160px;transform-origin: 0 0;" v-html="scope.row.contentHtml"></div>
              <div v-else style="transform:scale(0.2);height:100px;width:1000px;transform-origin: 0 0;" v-html="scope.row.contentHtml"></div>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="添加时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click="infoReleaseClick(scope.row)" type="text" size="small">发布</el-button>
              <el-button type="text" size="small">修改</el-button>
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
      </template>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      //节目分页
      pageSize: 5,
      pagetotal: 0,
      currentPage: 1,
      //主机选择框
      infoIndex: "0",
      selectName: "",
      tableData: [],
    };
  },
  //页面加载
  created() {
    this.selectProgram();
  },
  methods: {
    handleSelectionChange(val) {
      //获取全选
      console.log(this.$refs.multipleTable.selection[0].name);
      alert(val.selectName);
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
        console.log(val);
        this.selectProgram();
      },
    //制作节目跳转
    addInfoBtn() {
      let routeUrl = this.$router.resolve({
        path: "/infoEditor",
      });
      //打开新页面
      window.open(routeUrl.href, "_blank");
    },
    //查询按钮
    selectClick() {
      this.selectProgram();
    },
    //查询节目列表
    async selectProgram() {
      const enterId = localStorage.getItem("enterId");
      this.$axios
        .get(this.GLOBAL.serverSrc + "/program/pro/" + enterId, {
          params: {
            page: this.currentPage - 1,
            name: this.selectName,
          },
        })
        .then((res) => {
          console.log(res); //数据先转换格式
          let data = JSON.parse(res.data.data);
          //  var data= typeof age=='string'?JSON.parse(res.data.data):res.data.data;
          this.pagetotal = data[0].size; //设置总数据大小
          let redate =
            typeof data[0].data == "string"
              ? JSON.parse(data[0].data)
              : data[0].data;
          this.tableData = redate; //表数据
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //页头
    handleSelect(key, keyPath) {
      if (key != null) {
        console.log(keyPath);
        // if (keyPath == 0) {
        // }
        // if (keyPath == 1) {
        // }
      }
    },
    onSubmit() {
      this.selectProgram();
    },
  },
};
</script>
<style >
.block {
  margin-top: 10px;
}
.el-header {
  background-color: white;
  
}
.infoTable .vdr{
 border: none;
}
</style>