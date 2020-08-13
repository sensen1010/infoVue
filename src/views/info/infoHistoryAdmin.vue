<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="infoIndex"
        class="el-menu-demo el-menu-host"
        mode="horizontal"
        @select="handleSelect"
      >
        
        <el-menu-item class="el-menu-hostInput">
          <div>
            <el-input size="mini" placeholder="节目名" v-model="selectName"></el-input>
            <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
            <el-select v-model="enterId" filterable placeholder="请选择" size="mini"  @change="selectClick" >
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
        >
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="enterName" label="企业"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="userName" label="发布人"></el-table-column>
          <el-table-column prop="layoutType" label="布局类型">
            <template slot-scope="scope">
              <p v-if="scope.row.layoutType=='1'">竖版</p>
              <p v-else>横板</p>
            </template>
          </el-table-column>
          <el-table-column prop="layoutType" label="发布类型">
            <template slot-scope="scope">
              <p v-if="scope.row.type=='1'">部分</p>
              <p v-else>全部</p>
            </template>
          </el-table-column>
          <el-table-column prop="hostList" label="主机列表">
            <template slot-scope="scope">
              <p v-if="scope.row.type=='1'">
                <el-tag
                v-for="item in JSON.parse(scope.row.hostList)"
                :key="item.hostId"
                type="success"
                effect="plain"
                size="mini"
              >{{ item.name }}</el-tag>
              </p>
              <p v-else></p>
            </template>
          </el-table-column>
          <el-table-column prop="contentHtml" label="布局文件">
            <template slot-scope="scope">
              <div v-if="scope.row.layoutType=='1'" style="transform:scale(0.2);height:160px;transform-origin: 0 0;" v-html="scope.row.contentHtml"></div>
              <div v-else style="transform:scale(0.2);height:100px;width:1000px;transform-origin: 0 0;" v-html="scope.row.contentHtml"></div>
            </template>
          </el-table-column>
          <el-table-column prop="creationTime" label="发布时间"></el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click="infoReleaseClick(scope.row)" type="text" size="small">再次发布</el-button>
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
      //节目Id
      proId:'',
      //发布节目弹出框
      dataOptions: {
          disabledDate(time) {
            return (time.getTime()+86400000) < Date.now();
          }
        },
      relInfoForm: {
          relType: '0',
          relTimeType: '0',
          relTimeDay: '',
          relTime: ''
        },  
      hosts:[],
      infoReleaseDialog:false,
      //企业列表
        enterList: [],
        enterId:'',   
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
    this.selectProgramHis();
  },
   activated() {
     this.selectProgramHis();
     this.selectEnterList();
    },
  methods: {
    //分页选择
    handleCurrentChange(val) {
        console.log(val);
        this.selectProgramHis();
      },
    //弹出选项
    infoReleaseClick(val){
      this.infoReleaseDialog=true;
      this.proId=val.proId;
    },  
    //查询按钮
    selectClick() {
      this.selectProgramHis();
    },
    //查询企业列表
      selectEnterList(){
       // alert(this.currentPage);
        let token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.get(this.GLOBAL.serverSrc+'/enter/enter/list').then(res=> {
              if(res.data.code==0){
                let data = JSON.parse(res.data.data);
                this.enterList=data;
              }       
           }).catch(function (error) {
             console.log(error);
           });
      }, 
    //查询节目历史列表
    async selectProgramHis() {
      const enterId = this.enterId;
      this.$axios
        .get(this.GLOBAL.serverSrc + "/program/proHis/admin" , {
          params: {
            page: this.currentPage - 1,
            name: this.selectName,
            enterId:enterId
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
              console.log(redate);
              console.log(redate);
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
      this.selectProgramHis();
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