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
              <div v-else style="transform:scale(0.2);height:120px;width:1000px;transform-origin: 0 0;" v-html="scope.row.contentHtml"></div>
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
        <el-dialog
      title="发布节目"
      :visible.sync="infoReleaseDialog"
      width="35%"
      center>
<el-form ref="form" :model="relInfoForm" label-width="80px" size="mini">
  <el-form-item label="发布类型">
    <el-radio-group v-model="relInfoForm.relType" size="medium">
      <el-radio  label="0">全部发布</el-radio>
      <el-radio  label="1">部分发布</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="选择主机" v-if="relInfoForm.relType=='1'">
    <el-select v-model="hosts" multiple placeholder="请选择">
    <el-option
      v-for="item in hostList"
      :key="item.hostId"
      :label="item.hostName"
      :value="item.hostId">
    </el-option>
  </el-select>
  </el-form-item>
  <!-- <el-form-item label="发布时间">
    <el-radio-group v-model="relInfoForm.relTimeType" size="medium">
      <el-radio  label="0">立即发布</el-radio>
      <el-radio  label="1">定时发布</el-radio>
    </el-radio-group>
  </el-form-item>

  <el-form-item label="设置时间">
    <el-col :span="11">
      <el-date-picker type="date" placeholder="选择日期" v-model="relInfoForm.relTimeDay" style="width: 100%;"  :picker-options="dataOptions"></el-date-picker>
    </el-col>
    <el-col class="line" :span="1">-</el-col>
    <el-col :span="11">
      <el-time-picker placeholder="选择时间" v-model="relInfoForm.relTime" style="width: 100%;" :picker-options="{
      selectableRange:  new Date().getHours()+':'+ new  Date().getMinutes()+':'+new  Date().getSeconds()+' - 20:30:00'
    }"></el-time-picker>
    </el-col>
  </el-form-item> -->
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="infoReleaseDialog = false">取 消</el-button>
        <el-button type="primary" @click="infoReleaseOk()">确 定</el-button>
      </span>
    </el-dialog>


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
      hostList:[],  
      hosts:[],
      infoReleaseDialog:false,
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
   // this.selectProgramHis();
   // this.selectHostList();
  },
   activated() {
     this.selectProgramHis();
    this.selectHostList();
    },
  methods: {
    //分页选择
    handleCurrentChange(val) {
        console.log(val);
        this.selectProgramHis();
      },
    //查询主机列表
    selectHostList(){   
      const enterId = localStorage.getItem("enterId");
      this.$axios
        .get(this.GLOBAL.serverSrc + "/host/user/hostList", {
          params: {
            enterId:enterId
          },
        })
        .then((res) => {
          console.log(res); //数据先转换格式
          let data =JSON.parse(res.data.data);
          console.log(data);
          this.hostList = data; //表数据
        })
        .catch(function (error) {
          console.log(error);
        });


    },  
    //发布
    infoReleaseOk(){
      const enterId=localStorage.getItem("enterId");
      const userId=localStorage.getItem("userId");
      const proId=this.proId;
      const type=this.relInfoForm.relType;
      const hostList=this.hosts;
      let formData=new FormData();
      formData.append("enterId",enterId);
      formData.append("userId",userId);
      formData.append("proId",proId);
      formData.append("type",type);
      if(type=="1"){
      formData.append("hostList",hostList);
      }
      this.$axios.post(this.GLOBAL.serverSrc+'/program/proHis/add',formData).then(res=> {
          if(res.data.code=="0"){
            this.$message({
              message: '发布成功',
              duration:1000,
              type: 'success'
            });
             this.selectProgramHis();
            this.infoReleaseDialog=false;
          }
           }).catch(function (error) {
             console.log(error);
      });
    },
    //弹出选项
    infoReleaseClick(val){
      this.infoReleaseDialog=true;
      this.proId=val.proId;
    },  
    //制作节目跳转
    addInfoBtn() {
      let routeUrl = this.$router.resolve({
        path: "/infoEditor"
      });
      //打开新页面
      window.open(routeUrl.href, "_blank");
    },
    //查询按钮
    selectClick() {
      this.selectProgramHis();
    },
    //查询节目历史列表
    async selectProgramHis() {
      const enterId = localStorage.getItem("enterId");
      this.$axios
        .get(this.GLOBAL.serverSrc + "/program/proHis/select" , {
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