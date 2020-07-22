<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="playerIndex"
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
    <el-main >
      <template v-if="infoType">
      <el-table
        ref="multipleTable"
        stripe
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="layoutType" label="布局类型">
          <template slot-scope="scope">
            <p  v-if="scope.row.layoutType=='1'">竖版</p>
             <p  v-else>横板</p>
          </template>
        </el-table-column>
        <el-table-column prop="layoutImgUrl" label="布局">
            <template slot-scope="scope">
            <img
              :src='showimgUrl+"/"+scope.row.layoutImgUrl'
              style="width:100px;height:100px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="布局文件">
            <template slot-scope="scope">
            <span v-for="(item,i) in scope.row.content.split(',')" :key="i">
                <!-- 位置{{i}} -->
                <img
                :src='showimgUrl+"/"+item'
                 style="width:100px;height:50px;"
                 v-if="item.indexOf('png')!= -1||item.indexOf('jpg')!= -1||item.indexOf('jpeg')!= -1"
                 />
                <video
               :src='showimgUrl+"/"+item'
               style="height:50px;width:100px"
               v-else
            />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="creationTime" label="添加时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click="infoReleaseClick(scope.row)"
              type="text"
              size="small"
            >发布</el-button>
            <el-button
              type="text"
              size="small"
            >修改</el-button>
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
      <template v-else>
        <el-table
        :data="infoReleaseTableData"
    border
    style="width: 100%"
      >
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="layoutType" label="布局类型">
          <template slot-scope="scope">
             <p  v-if="scope.row.layoutType=='1'">竖版</p>
             <p  v-else>横板</p>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="显示类型">
          <template slot-scope="scope">
            <p  v-if="scope.row.type=='1'">部分</p>
             <p  v-else>全部</p>
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
        <el-table-column prop="showType" label="开机自启">
          <template slot-scope="scope">
            <p  v-if="scope.row.showType=='1'">是</p>
             <p  v-else>否</p>
          </template>
        </el-table-column>
        <el-table-column prop="horseLamp" label="跑马灯">
          <template slot-scope="scope">
             <p  v-if="scope.row.horseLamp=='1'">开</p>
             <p  v-else>关</p>
          </template>
        </el-table-column>
        <el-table-column prop="layoutImgUrl" label="布局">
            <template slot-scope="scope">
            <img
              :src='showimgUrl+"/"+scope.row.layoutImgUrl'
              style="width:100px;height:100px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="布局文件">
            <template slot-scope="scope">
            <span v-for="(item,i) in scope.row.content.split(',')" :key="i">
                <!-- 位置{{i}} -->
                <img
                :src='showimgUrl+"/"+item'
                 style="width:100px;height:50px;"
                 v-if="item.indexOf('png')!= -1||item.indexOf('jpg')!= -1||item.indexOf('jpeg')!= -1"
                 />
                <video
               :src='showimgUrl+"/"+item'
               style="height:50px;width:100px"
               v-else
            />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="creationTime" label="发布时间"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="infohandleCurrentChange"
          :current-page.sync="infocurrentPage"
          :page-size="infopageSize"
          background
          layout="total, prev, pager, next"
          :total="infopagetotal"
        ></el-pagination>
      </div>
      </template>
    </el-main>
   
     <!-- 节目制作 -->
    <el-dialog custom-class="infoDialog" title="节目制作" :visible.sync="addInfoShowDialog" width="80%" :before-close="infoDialogClose">
      <!-- 第一步 -->
      <el-form>
        <el-row v-if="showInfoDialog">
          <el-col :span="12">
            <el-card class="box-card" >
              <div slot="header" class="clearfix">
                <span>横向布局</span>
              </div>
              <el-card :body-style="{ padding: '0px' }" v-for="traList in transverseList" :key="traList.uuid"  style="width:30%;margin:10px;float:left" shadow="hover">
               <img :src='showimgUrl+"/"+traList.imgUrl'  style="width:100%" @click="showInfo(traList)">
              </el-card>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>竖向布局</span>
              </div>
              <el-card :body-style="{ padding: '0px' }" v-for="verList in verticalList" :key="verList.uuid"  style="width:30%;margin:10px;float:left" shadow="hover">
            <img :src='showimgUrl+"/"+verList.imgUrl'  style="height:300px;" @click="showInfo(verList)">
          </el-card>
            </el-card>
          </el-col>
        </el-row>
        <!-- 第二步 -->
        <el-row v-if="!showInfoDialog">
          <el-col :span="8">
            <el-card class="box-card" >
              <div slot="header" class="clearfix">
                <span>布局</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="showInfoDialog = true">重选</el-button>
              </div>
              <el-card style="width:60%;margin:10px;" shadow="hover">
               <img :src='showimgUrl+"/"+infoFrom.imgUrl'  style="width:100%">
              </el-card>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="box-card" >
              <div slot="header" class="clearfix">
                <span>数据设置</span>
              </div>
               <el-form class="infoFrom"  ref="form" :model="infoFrom" label-width="100px">
              <el-form-item label="节目名称">
                <el-input v-model="infoFrom.name"></el-input>
              </el-form-item>
                <el-row  v-for="(item,index) in infoFrom.layoutNum" :key="index" >
                 <el-form-item :label='"位置"+item' style="width:400px">
                     <el-row>
                       <el-col :span="16">
                         <el-input v-model="infoFrom.content[item-1]" placeholder="输入(视频/图片)url或者选择文件"></el-input>
                       </el-col>
                       <el-col :span="8">
                          <el-button size="small" type="primary" @click="onInfoFile(item-1)" >选择文件</el-button>
                       </el-col>
                     </el-row>
                 </el-form-item>
                </el-row>
                <el-form-item label="开机自启动" style="width:300px">
                 <el-radio v-model="infoFrom.startOn" label="0">不开启</el-radio>
                 <el-radio v-model="infoFrom.startOn" label="1">开启</el-radio>
              </el-form-item>
              <el-form-item label="跑马灯" style="width:300px">
                 <el-radio v-model="infoFrom.horseLamp" label="0">不开启</el-radio>
                 <el-radio v-model="infoFrom.horseLamp" label="1">开启</el-radio>
              </el-form-item>
              <el-form-item label="显示位置" style="width:300px" v-if="infoFrom.horseLamp=='1'">
                  <el-checkbox-group v-model="infoFrom.checkList">
                  <el-checkbox v-model="infoFrom.horseLampUp" label="0" checked>上</el-checkbox>
                  <el-checkbox v-model="infoFrom.horseLampDown" label="1">下</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="上跑马灯内容" v-if="infoFrom.horseLamp=='1'">
                <el-input type="textarea" v-model="infoFrom.horseTextUp"></el-input>
              </el-form-item>
              <el-form-item label="下跑马灯内容" v-if="infoFrom.horseLamp=='1'">
                <el-input type="textarea" v-model="infoFrom.horseTextDown"></el-input>
              </el-form-item>
            </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitAddInfo" v-if="!showInfoDialog">确 定</el-button>
      </div>
    </el-dialog>
<!-- 文件选择 -->
    <el-dialog custom-class="infoFileDialog" title="选择文件" :visible.sync="infoFileDialog" width="60%" >
      <el-form>
        <el-row>
          <el-col :span="24">

          <el-row >
        <el-col id="info-file-card" :span="3" v-for="file in fileData" :key="file.id" style="font-size: 14px;">
          <el-card :body-style="{ padding: '0px' }" shadow="hover" style="height:100px;width:100%"  >
            <div @click="addinfoFileUrl(file)">
            <img :src='showimgUrl+"/"+file.imgUrl' class="image"  style="height:100px;width:100%"
             v-if="file.imgType=='jpg'||file.imgType=='png'||file.imgType=='jpeg'"
            />
            <video
               :src='showimgUrl+"/"+file.imgUrl'
               style="height:100px;width:100%"
               v-else-if="file.imgType=='mp4'||file.imgType=='flv'"
            />
            <div class="file-name">
              <p>{{file.imgType}}</p>
            </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
        <div class="block">
        <el-pagination
          @current-change="filehandleCurrentChange"
          :current-page.sync="filecurrentPage"
          :page-size="filepageSize"
          background
          layout="total, prev, pager, next"
          :total="filepagetotal"
        ></el-pagination>
      </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="infoFileDialog = false">上传文件</el-button>
      </div>
    </el-dialog>
<!-- 发布主机选择 -->
    <el-dialog custom-class="infoReleaseDialog" title="发布节目" :visible.sync="infoReleaseDialog" width="50%" >
      <el-form>
        <el-row>
          <el-col :span="24">
          <el-row >
               <el-form
            :model="form"
            ref="form"
            label-width="100px"
            class="demo-ruleForm"
            id="release-from"
          >
            <el-form-item label="开机自启动" prop="showType" style="width:400px">
              <table style="height: 40px;">
                <th>
                  <tr style="line-height: 40px;">
                    <el-radio v-model="form.showType" label="0">开启</el-radio>
                  </tr>
                </th>
                <th>
                  <tr style="line-height: 40px;">
                    <el-radio v-model="form.showType" label="1">关闭</el-radio>
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
                      v-model="form.showState"
                      active-color="#13ce66"
                      :change="showStateType()"
                      active-text="部分发布"
                      inactive-text="全部发布"
                    ></el-switch>
                  </tr>
                </th>
                <th>
                  <tr style="line-height: 40px;">
                    <el-select
                      v-model="form.hostsList"
                      multiple
                      filterable
                      default-first-option
                      placeholder="请选择主机"
                      v-if="form.showStateHost"
                      style="width:200px"
                    >
                      <el-option
                        v-for="item in form.hostsData"
                        :key="item.hostId"
                        :label="item.hostName"
                        :value="item.hostId"
                      ></el-option>
                    </el-select>
                  </tr>
                </th>
              </table>
            </el-form-item>
          </el-form>
          </el-row>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="infoRelease()">发布</el-button>
      </div>
    </el-dialog>  
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      showimgUrl: this.GLOBAL.serverimg,
      noBtnShow: true,
      okBtnShow: true,
      auditNoMessageShow: false,
      addInfoShowDialog: false,
      infoType:true,//显示
      //文件选择分页
      filecurrentPage: 1,
      filepageSize: 32,
      filepagetotal: 0,
      fileData: [],
      //节目分页
      pageSize: 10,
      pagetotal: 0,
      currentPage: 1,
      //节目历史分页
      infopageSize: 10,
      infopagetotal: 0,
      infocurrentPage: 1,
      infoReleaseTableData:[],
      //主机选择框
      infoReleaseDialog:false,
      form: {
        showType: "0",
        showState: false,
        hostsList:[],
        hostsData:[],
        showStateHost:false,
        proId:""
      },
      playerIndex: "0",
      selectName: "",
      showInfoDialog:true,
      infoFileDialog:false,//文件选择框
      infoFileNum:"",//当前第几个文件选择框
      verticalList:[],//竖
      transverseList:[],//横向
      tableColumShow: false,
      selectMatchId: "",
      infoFrom:{
        name:"",
        content:[],
        content2:[],
        horseLamp:"0",
        horseLampUp:"",
        horseLampDown:"",
        horseTextUp:"",
        horseTextDown:"",
        imgUrl:"",
        layoutId:"",
        layoutNum:0,
        startOn:"0",
        checkList:[]
      },
      tableData: [],
      
      options: []
    };
  },
  //页面加载
  created() {
    this.selectProgram();
    this.selectHosts();
    // this.showMatchItem();
    // this.convert();
  },
  methods: {
    //显示添加数据栏
    showInfo(val){
      this.infoFrom.imgUrl=val.imgUrl;
      this.infoFrom.layoutNum=parseInt(val.layoutNum);
      // const num=parseInt(val.layoutNum)+1;
      // for (var i = 1; i < num; i++) { 
      // this.infoFrom.layoutNum.push(i)
      // }
      this.infoFrom.layoutId=val.uuid;
      this.showInfoDialog=false;
    },
    //关闭添加界面弹出框,清除数据
    infoDialogClose(){
        this.infoFrom.name="";
        this.infoFrom.content=[];
        this.infoFrom.content2=[];
         this.infoFrom.horseLamp="0";
         this.infoFrom.horseLampUp="";
        this.infoFrom. horseLampDown="";
         this.infoFrom.horseTextUp="";
         this.infoFrom.horseTextDown="";
         this.infoFrom.imgUrl="";
         this.infoFrom.layoutId="";
         this.infoFrom.layoutNum=0;
        this.infoFrom. startOn="0";
         this.infoFrom.checkList=[];
        this.addInfoShowDialog=false;
    },
    //显示类型-----选择主机
    showStateType() {
      let type = this.form.showState;
      console.log(type);
      if (type == false) {
        this.form.showStateHost = false;
      } else if (type == true) {
        this.form.showStateHost = true;
      }
    },
     //查询主机列表
    async  selectHosts() {
      this.form.hostsData="";
      let formData = new FormData();
      formData.append("", "");
      this.$axios
        .post(this.GLOBAL.serverSrc + "/host/select", formData)
        .then(res => {
          let data = JSON.parse(res.data.data);
          let redate =
            typeof data[0].data == "string"
              ? JSON.parse(data[0].data)
              : data[0].data;
          this.form.hostsData = redate;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //添加节目
    submitAddInfo(){
      let formData = new FormData();
      this.infoFrom.content2=[];
      formData.append("name", this.infoFrom.name);
      formData.append("layoutId", this.infoFrom.layoutId);//布局id
      formData.append("content", this.infoFrom.content);//布局
      console.log(this.infoFrom.content2);
      // for(var i = 0; i < this.infoFrom.content.length; i++){
      //    // this.infoFrom.content2.push({'layout':this.infoFrom.content[i]});
      //     this.infoFrom.content2.push({'layout':this.infoFrom.content[i]});
      // }
      // formData.append("content",JSON.stringify(this.infoFrom.content2) );//布局
      formData.append("horseLamp",  this.infoFrom.horseLamp);//是否开启跑马灯
      if(this.infoFrom.horseLamp=="1"){
         if(this.infoFrom.horseTextUp!=""||this.infoFrom.horseTextDown!=""){
        var horseText;
      if(this.infoFrom.checkList.length==2){
          //horseText=[this.infoFrom.horseTextUp,this.infoFrom.horseTextDown];
          horseText=[{'u':this.infoFrom.horseTextUp,'d':this.infoFrom.horseTextDown}];
          //formData.append("horseText", "type");
      }else if(this.infoFrom.checkList=="0"){
         //horseText=[this.infoFrom.horseTextUp,''];
          horseText=[{'u':this.infoFrom.horseTextUp,'d':""}];
         // alert(this.infoFrom.checkList+"#0000")
      }else if(this.infoFrom.checkList=="1"){
         //horseText=['',this.infoFrom.horseTextDown];
          horseText=[{'u':"",'d':this.infoFrom.horseTextDown}];
          //alert(this.infoFrom.checkList+"#1111")
      }
       formData.append("horseText",JSON.stringify(horseText));//内容
         } 
          else{
            alert("请填写跑马灯内容");
            return;
          }
     
      }
      this.$axios.post(this.GLOBAL.serverSrc+"/program/pro/add",formData)
      .then(res =>{
      console.log(res);
          alert("asd")
      })
      .catch(function(error){
          console.log(error);
      })
    },
    //发布节目(选择主机)
    infoReleaseClick(val){
        this.form.proId=val.proId;
        this.infoReleaseDialog=true;
    },
    //发布节目
    infoRelease(){
        let formData=new FormData();
        formData.append("proId",this.form.proId);
        var type = this.form.showState;
        if(type){
          formData.append("type","1");
        }else{
          formData.append("type","0");
        }
        formData.append("hostList",this.form.hostsList);
        formData.append("showType",this.form.showType);
        console.log(formData);
        this.$axios.post(this.GLOBAL.serverSrc+"/program/proHis/add",formData).then(
          res =>{
              console.log(res);
              this.infoReleaseDialog=false;
          }
        ).catch(function(error){
          console.log(error);
        })
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
    handleSelectionChange(val) {
      //获取全选
      console.log(this.$refs.multipleTable.selection[0].name);
      alert(val.selectName);
      this.multipleSelection = val;
    },
    //点击上传按钮，清空文件列
    addInfoBtn() {
      this.selectLayout("0");
      this.showInfoDialog=true;
      this.addInfoShowDialog = true;
    },
    selectClick() {
      this.selectProgram();
    },
    //选择文件列表的文件,并添加到数组中
    addinfoFileUrl(val){
        this.infoFrom.content[parseInt(this.infoFileNum)]=val.imgUrl;
      //  this.infoFrom.comtent2.push({"url":val.imgUrl,"type":val.imgType},parseInt(this.infoFileNum));
        this.infoFileDialog=false;
    },
    //选择文件
    onInfoFile(val){
      this.infoFileDialog=true;
      this.infoFileNum=parseInt(val);
      this.selectFileList();
    },
     //文件列表分页点击
    filehandleCurrentChange(val){
        console.log(val);
        this.selectFileList();
    },
     //查询文件列表
   async  selectFileList() {
      let formData = new FormData();
      formData.append("type", "0");
      formData.append("page", this.filecurrentPage - 1);
      this.$axios
        .post(this.GLOBAL.serverSrc + "/img/isImgList", formData)
        .then(res => {
 console.log(res);
          let data = JSON.parse(res.data.data);
          this.filepagetotal = data[0].size;
          let redate =
            typeof data[0].data == "string"
              ? JSON.parse(data[0].data)
              : data[0].data;
              this.fileData=redate;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询布局
   async  selectLayout(type) {
      let formData = new FormData();
      formData.append("type", type);
      this.$axios
        .post(this.GLOBAL.serverSrc + "/program/layout/select", formData)
        .then(res => {
 console.log(res);
          let data = JSON.parse(res.data.data);
          // var redate =
          //   typeof data[0].data == "string"
          //     ? JSON.parse(data[0].data)
          //     : data[0].data;
              if(type=="0"){
                this.transverseList = data; //表数据
                this.selectLayout("1");
              }else if(type=="1"){
                this.verticalList = data;
              }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询节目列表
   async  selectProgram() {
      let formData = new FormData();
      formData.append("name", this.selectName);
      formData.append("showType", "");
      formData.append("state", this.playerIndex);
      formData.append("page", this.currentPage - 1);
       this.$axios
        .post(this.GLOBAL.serverSrc + "/program/pro/select", formData)
        .then(res => {
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
        .catch(function(error) {
          console.log(error);
        });
    },
     //查询节目历史
   async   infoReleaseData(){
      let formData = new FormData();
      formData.append("name", this.selectName);
      formData.append("page", this.infocurrentPage - 1);
      this.$axios
        .post(this.GLOBAL.serverSrc + "/program/proHis/select", formData)
        .then(res => {
          console.log(res); //数据先转换格式
          let data = JSON.parse(res.data.data);
          //  var data= typeof age=='string'?JSON.parse(res.data.data):res.data.data;
          this.infopagetotal = data[0].size; //设置总数据大小
          let redate =
            typeof data[0].data == "string"
              ? JSON.parse(data[0].data)
              : data[0].data;
          this.infoReleaseTableData = redate; //表数据
        })
        .catch(function(error) {
          console.log(error);
        });
     },
    //查询发布历史分页点击
    infohandleCurrentChange(){
      this.infoReleaseData();
    },
    //节目列表分页点击
    handleCurrentChange() {
      
      this.selectProgram();
    },
    //页头
    handleSelect(key, keyPath) {
      if (key != null) {
        if (keyPath == 0) {
           this.selectProgram();
           this.infoType=true;
        }
        if (keyPath == 1) {
          this.infoReleaseData();
          this.infoType=false;
        }
      
      }
    },
    onSubmit() {
      this.selectProgram();
    },
    submitUpload() {
      console.log(this.fileList);
      this.$refs.upload.submit();
    },
    filesuccess() {
      this.selectProgram();
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
.infoDialog {
  margin-top: 30px!important;
  }
#release-from div {
  line-height: normal;
}  
#info-file-card{
  height:100px;
  position:relative;
}
#info-file-card .file-name{
  width: 100%;
  height: 20px;
  position: absolute;
  bottom: 0px;
  text-align: center;
  color: aliceblue;
  background: #000000;
  opacity:0.8;
  padding: 0px!important;
}
#info-file-card .file-name p{
  width: 100%;
  font-size: 8px;
  line-height: 8px;
  padding: 0px!important;
}
.infoFrom .el-form-item{
  margin-bottom: 0px;
}
</style>