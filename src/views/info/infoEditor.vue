<template>
  <div class="infoEditorHome">
    <el-container v-if="showEditor">
      <el-header>选择布局</el-header>
      <el-main >
        <el-row>
          <el-col :span="8">
            <p></p>
          </el-col>
          <el-col :span="4">
            <el-button @click="clickShowEditor('0')" style="width:240px;height:135px">横向布局(16:9)</el-button>
          </el-col>
          <el-col :span="4">
            <el-button @click="clickShowEditor('1')" style="width:135px;height:240px">竖向布局(9:16)</el-button>
          </el-col>
          <el-col :span="8">
            <p></p>
          </el-col>
        </el-row>
        <el-dialog
            title="节目名称"
            :visible.sync="infoNameDialog"
            width="30%"
            center>
            <el-input v-model="infoName"></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="infoNameDialog = false">取 消</el-button>
              <el-button type="primary" @click="infoNameClick()">确 定</el-button>
            </span>
          </el-dialog>
      </el-main>
    </el-container>
    <el-container v-else>
      <el-header class="editor-header">
        <div class="editor-header"> 
        <el-row>
          <el-col :span="22">
            
            <el-button type="info" size="small" plain @click="saveInfoClick()">保存</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="info" size="small" plain @click="updateRank('up')">上一层</el-button>
            <el-button type="info" size="small" plain @click="updateRank('down')">下一层</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="info" size="small" plain @click="deleteTool()">删除</el-button>
            <!-- <el-button type="info" size="small" plain >锁定</el-button> -->
          </el-col>
        </el-row>
        </div>
      </el-header>
      <el-main class="infoMain">
        <el-row :span="24">
          <el-col :span="22">
            <p style="color:#909399;font-size:14px;margin:0px">
              {{infoName}}|{{infoTypeName}}
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
               <div class="content">
               <div class="editorHome">
                 <div class="toolHome">
                   <ul class="toolList">
                    <li>
                      <el-button @click="showToolType('bj')" >背景</el-button>
                    </li>
                    <!-- <li><el-button @click="addTool('time')" >时间</el-button></li> -->
                    <li><el-button @click="addTool('text')" >文本</el-button></li>
                    <li><el-button @click="addTool('img')" >图片</el-button></li>
                    <li><el-button @click="addTool('video')">视频</el-button></li>
                     <li><el-button @click="addTool('time')">时间</el-button></li>
                     
                  </ul>
                 </div>
                 <div class="editorDiv"  ref="editorDiv">
                  <div  class="editor" :style="'width:'+infoEditor.width+';height:'+infoEditor.height" >
                            <vue-draggable-resizable
                                v-for="(item,index) in datalist" 
                                    :key="index" 
                                    :x="item.x" 
                                    :y="item.y" 
                                    :w="item.w" 
                                    :h="item.h" 
                                    :z="item.z"
                                    :resizable="item.resi"
                                    :draggable="item.drag"
                                    :parent="true"
                                    :snap="true"
                                    :snapTolerance="10"
                                    @activated="onActivated(item)"
                                    @deactivated="onDeactivated(item)"
                                    @refLineParams="getRefLineParams"
                                    @resizing="onResize"
                                    @dragging="onDrag"
                                    :style='"background-color:"+item.bargColor'
                                     >
                                    <div v-if="item.type=='bj'&&item.bargImg!=''" :style='"background-image:url("+showFileUrl+item.bargImg+");background-repeat:no-repeat;background-size:cover;width:100%;height:100%;"'></div>
                                    <div v-if="item.type=='bj'&&item.bargColor!=''" :style='"background:"+item.bargColor+";background-size:100% 100%;width:100%;height:100%;"'></div>
                                    <img  v-if="item.type=='img'"  controls="controls" :src="showFileUrl+item.src" style="width:100%;height:100%" />
                                    <video  v-if="item.type=='video'"  :src="showFileUrl+item.src" :poster="showFileUrl+item.videoImg" style="width:100%;height:100%;object-fit: fill" />
                                    <p v-if="item.type=='time'"
                                     :style='"background-color:transparent;font-size:"+item.size
                                    +";text-align:"+item.textAlign+
                                    ";color:"+item.textColor+";width:100%;height:100%;padding:0px;margin:0px;overflow: hidden;"' 
                                    >
                                    {{item.context}}
                                    </p>
                                    <textarea  v-if="item.type=='text'&&!item.marquee"  @dblclick="editorTextClick(item)" 
                                    :readonly="item.textReadonly"
                                     v-model="item.context"
                                     v-text="item.context"
                                    :style='"background-color:transparent;font-size:"+item.size
                                    +";text-align:"+item.textAlign+
                                    ";color:"+item.textColor+";outline:none;border:0;width:100%;height:100%;resize: none;overflow-y:hidden"' 
                                    >
                                    </textarea>
                                    <marquee v-if="item.type=='text'&&item.marquee" 
                                      :style='"background-color:transparent;font-size:"+item.size+";text-align:"+item.textAlign+";;outline:none;border:0;width:100%;height:100%;resize: none;overflow-y:hidden"' 
                                      behavior=scroll 
                                      :direction="item.marqueeDirection" 
                                      scrolldelay=2000
                                      :scrollamount="item.speed" 
                                     >
                                    <pre
                                    v-if="item.marqueeType=='2'"
                                    :style='"width:100%;margin:0px;color:"+item.textColor'
                                    >{{item.context}}</pre>
                                    <pre
                                    v-else
                                    :style='"text-align:left;width:100%;margin:0px;color:"+item.textColor'
                                    >{{item.context}}</pre>
                                     </marquee>
                             </vue-draggable-resizable>
                             <!--辅助线-->
                                    <span class="ref-line v-line"
                                            v-for="item in vLine"
                                            v-show="item.display"
                                            :key="item.id"
                                            :style="{ left: item.position, top: item.origin, height: item.lineLength}"
                                    />
                                    <span class="ref-line h-line"
                                            v-for="item in hLine"
                                            v-show="item.display"
                                            :key="item.id"
                                            :style="{ top: item.position, left: item.origin, width: item.lineLength}"
                                    />
                             <!--辅助线END-->
                   </div>
                   </div>
                   <div class="toolEditor">
                   <ul class="editorList">
                    <!-- 背景颜色工具集 -->
                    <li class="backgroudTool" v-if="backgroudTool"> 
                      <div  class="toolTitle">背景编辑</div>
                      <div>
                      <el-button class="bagButton" @click="infoFileDialogShow('bj','1')" >
                         <img v-if="datalist[0].bargImg!=''" controls="controls" :src="showFileUrl+datalist[0].bargImg" style="width:200px;" />  
                         <i v-else class="el-icon-plus avatar-uploader-icon"></i>      
                      </el-button>
                      <div> 
                      </div>
                      </div>
                      <div>
                        <ul>
                          <li><el-button style="background:#031634" @click="updateBargColor('')"  circle></el-button></li>
                          <li><el-button style="background:#031634" @click="updateBargColor('#031634')" circle></el-button></li>
                          <li><el-button style="background:#CDB380" @click="updateBargColor('#CDB380')"  circle></el-button></li>
                          <li><el-button style="background:#84AF9B" @click="updateBargColor('#84AF9B')"  circle></el-button></li>
                          <li><el-button style="background:#823835" @click="updateBargColor('#823835')"  circle></el-button></li>
                          <li><el-button style="background:#E6B33D" @click="updateBargColor('#E6B33D')"  circle></el-button></li>
                          <li><el-color-picker v-model="editorBarg.color" size="small" :active-change="elUpdateColor()"></el-color-picker></li>
                        </ul>
                      </div>
                    </li>
                    <!-- 背景颜色end -->
                    <!-- 图片工具集 -->
                    <li class="imgTool" v-if="imgTool">
                      <div class="toolTitle" >图片编辑</div>
                      <div  class="title">轮播间隔</div>
                      <div>
                         <el-select v-model="editorImg.time" placeholder="请选择" style="width:200px;margin-left:5px;" size="mini" @change="editorImgSpeed">
                          <el-option
                            v-for="item in imgSpeedList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div  class="title">轮播图列表</div>
                      <div>
                      <ul>
                          <li v-for="file in activateData.fileList" :key="file.id" style="line-height:100px">
                            <div class="imgList">
                            <img :src='showFileUrl+file.src' style="width:200px;height:100px"/>
                            <el-button class="close" icon="el-icon-close" size="mini" @click="deleteImgList(file)"></el-button>
                            </div>
                          </li>
                          <li>
                        <div style="border: 1px dashed #d9d9d9;" @click="addImgList('addImgList')">
                          <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                          </li>
                      </ul>
                      </div>
                    </li>
                    <!-- 图片工具集end -->
                    <!-- 文字工具集 -->
                    <li class="textTool" v-if="textTool">
                      <div  class="toolTitle" >文字编辑</div>
                      <div  class="title">字体颜色</div>
                      <div>
                        <ul>
                          <li><el-button @click="updateTextColor('#ffffff')"  circle></el-button></li>
                          <li><el-button style="background:#000000" @click="updateTextColor('#000000')" circle></el-button></li>
                          <li><el-color-picker v-model="editorText.color" size="small" :active-change="elUpdateTextColor()"></el-color-picker></li>
                        </ul>
                      </div>
                       <div class="title">背景颜色</div>
                       <div>
                        <ul>
                          <li><el-button @click="updateTextBargColor('')"  circle   size="mini">无</el-button></li>
                          <li><el-button style="background:#ffffff" @click="updateTextBargColor('#ffffff')" circle></el-button></li>
                          <li><el-color-picker v-model="editorText.bargColor" size="small" :active-change="elUpdateTextBargColor()"></el-color-picker></li>
                        </ul>
                      </div>
                      <div v-if="textToolTime">
                      <div class="title">是否启动滚动</div>
                      <div>
                      <el-radio-group v-model="editorText.marqueeType" @change="editorTextMarquee">
                      <div>
                         <el-radio  label="1">不启动</el-radio>
                      </div>
                       <div>
                        <el-radio  label="2">下→上</el-radio>
                      </div>
                       <div>
                        <el-radio label="3">右→左</el-radio>
                      </div>
                      </el-radio-group>
                      </div>
                      <div  class="title">滚动速度</div>
                      <div>
                        <el-select v-model="editorText.speed" placeholder="请选择" style="width:200px;margin-left:5px;" size="mini" @change="editorTextSpeed">
                          <el-option
                            v-for="item in textSpeedList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      </div>
                      <div class="title">字体大小</div>
                      <div>
                        <el-select v-model="editorText.size" placeholder="请选择" style="width:200px;margin-left:5px;" size="mini" @change="editorTextSize">
                          <el-option
                            v-for="item in textSizeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </li>
                    <!-- 文字工具集end -->
                    <!-- 视频工具集 -->
                    <li class="videoTool" v-if="videoTool">
                      <div  class="toolTitle" >视频编辑</div>
                      <div>无</div>
                    </li>
                    <!-- 视频工具集end -->
                  </ul>
                   </div>
               </div>
               </div>
          </el-col>
        </el-row>
  <!-- 文件选择 -->
    <el-dialog custom-class="infoFileDialog" title="选择文件" :visible.sync="infoFileDialog" width="60%" >
      <el-form>
        <el-row>
          <el-col :span="24">
          <el-row >
        <el-col id="info-file-card" :span="3" v-for="file in fileData" :key="file.id" style="font-size: 14px;">
          <el-card :body-style="{ padding: '0px' }" shadow="hover" style="height:100px;width:100%"  >
            <div @click="addinfoFileUrl(file)">
            <img :src='showFileUrl+"/"+file.fileUrl' class="image"  style="height:100px;width:100%"
             v-if="file.fileTypeId=='1'"
            />
            <video
               :src='showFileUrl+"/"+file.fileUrl'
               style="height:100%;width:100%"
               :poster='showFileUrl+"/"+file.videoImg'
               v-else-if="file.fileTypeId=='3'"
            />
            <div class="file-name">
              <span>{{file.fileName}}</span>
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
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>
<script>

export default {
  data() {
    return {
      infoId:'',
      infoName:'',
      infoType:'',
      infoTypeName:'',
      infoNameDialog:false,
      showEditor: true,
      //上传文件
      showFileUrl: this.GLOBAL.serverimg,
      infoActionType:"",
      infoFileType:"",
      infoFileDialog:false,
      filecurrentPage: 1,
      filepageSize: 32,
      filepagetotal: 0,
      fileData: [],
      //上传文件end
      //工具集合显示
      backgroudTool:true,
      imgTool:false,
      textTool:false,
      videoTool:false,
      textToolTime:true,
      //图片编辑工具
      editorImg:{
        time:'5'
      },
      imgSpeedList:[
        {
          value: '3',
          label: '3s'
        }, {
          value: '5',
          label: '5s'
        }, {
          value: '10',
          label: '10s'
        }, {
          value: '20',
          label: '20s'
        }, {
          value: '30',
          label: '30s'
        }, {
          value: '60',
          label: '60s'
        }
      ],
      //文字编辑工具
      editorText:{
        color:'#000000',
        bargColor:'',
        size:'16px',
        speed:'100',
        marqueeType:"1",
        marqueeDirection:'left'
      },
      //编辑框大小
      infoEditor:{
          width:'640px',
          height:'360px'
      },
      //---编辑框部分
      editorBarg:{
      color:'#AEACA8',
       //上传图片url
      imageUrl: '',
      },
       //辅助线
      vLine: [],
      hLine: [],
      //选中时的数据
      activate:false,
      activateData:{},
      //选中的类型
      activateType:"",
       //字体滚动速度数据
      textSpeedList:[{
         value: '20',
         label: '慢'
      },
      {
         value: '100',
         label: '中'
      },
      {
         value: '150',
         label: '快'
      }
      ],
      //字体大小数据
      textSizeList: [{
          value: '12px',
          label: '12px'
        }, {
          value: '16px',
          label: '16px'
        }, {
          value: '20px',
          label: '20px'
        }, {
          value: '24px',
          label: '24px'
        }, {
          value: '36px',
          label: '36px'
        }, {
          value: '48px',
          label: '48px'
        }
        ],
      //数据
      datalist:[
              {
                 id:'1',
                 type:'bj',
                 resi:false,
                 drag:false,
                 w:'',
                 h:'',
                 bargColor:'',
                 bargImg:'',
                 z:1,
              }
            ]
    };
  },
  //页面加载
  created() {},
  methods: {
    //保存节目按钮
    saveInfoClick(){
      const proId=this.infoId;
      if(proId==""||proId==null){
        this.saveInfo();
      }else{
        this.updateInfo();
      }
    },
    //更新节目
    updateInfo(){
      const enterId=localStorage.getItem("enterId");
      let data=JSON.stringify(this.datalist);
      let contentHtml=this.$refs.editorDiv.innerHTML;
      const proId=this.infoId;
       let formData=new FormData();
      formData.append("enterId",enterId);
      formData.append("content",data);
      formData.append("contentHtml",contentHtml);
      this.$axios.patch(this.GLOBAL.serverSrc+'/program/pro/'+proId,formData).then(res=> {
          if(res.data.code=="0"){
           //alert(res.data.proId+"添加成功")
            this.infoId=res.data.proId;
            this.$message({
              message: '保存成功',
              duration:1000,
              type: 'success'
            });
          }
           }).catch(function (error) {
             console.log(error);
      });
    },
    //保存节目
    saveInfo(){
      const enterId=localStorage.getItem("enterId");
      const userId=localStorage.getItem("userId");
      const data=JSON.stringify(this.datalist);
      const infoName=this.infoName;
      const layoutType=this.infoType;
      const contentHtml=this.$refs.editorDiv.innerHTML;
      let formData=new FormData();
      formData.append("enterId",enterId);
      formData.append("userId",userId);
      formData.append("content",data);
      formData.append("name",infoName);
      formData.append("layoutType",layoutType);
      formData.append("contentHtml",contentHtml);
      this.$axios.post(this.GLOBAL.serverSrc+'/program/pro/add',formData).then(res=> {
          if(res.data.code=="0"){
           //alert(res.data.proId+"添加成功")
            this.infoId=res.data.proId;
            this.$message({
              message: '保存成功',
              duration:1000,
              type: 'success'
            });
          }
           }).catch(function (error) {
             console.log(error);
      });
    },
    //设置界面名称
    infoNameClick(){
        //显示编辑界面
        if(this.infoName!=""){
          this.showEditor=false;
        }else{
          this.$message({
          showClose: true,
          duration:1000,
          message: '请设置名称',
          type: 'warning'
        });
        }
        
    },
    //格式化时间
     formatDate(inputTime) {
        const date = new Date(inputTime);
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
//        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
//        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute;
      },
    //添加组件
      addTool(val){
        const num=this.datalist.length;
        const id=this.generateUUID();
        if(val=="bj"){
          console.log(val);
        }
        else if(val=="text"){   
          this.datalist.push({
                id:id,
                type:'text',
                x:0,
                y:0,
                w: 150,
                h: 100,
                z:num+1,
                resi:true,
                drag:true,
                bargColor:"",
                marqueeType:"1",
                marquee:false,
                marqueeDirection:'left',
                speed:'100',
                context:'',
                textReadonly:true,
                textColor:"#000000",
                textAlign:"center",
                size:"16px"
         });
        }
        else if(val=="time"){   
          const dataTime=this.formatDate(new Date());
          this.datalist.push({
                id:id,
                type:'time',
                x:0,
                y:0,
                w: 150,
                h: 20,
                z:num+1,
                resi:true,
                drag:true,
                bargColor:"",
                context:dataTime,
                textReadonly:true,
                textColor:"#000000",
                textAlign:"center",
                size:"16px"
         });
        }
        else if(val=="img"){
          this.datalist.push({
                id:id,
                type:'img',
                x:0,
                y:0,
                w: 150,
                h: 100,
                z:num+1,
                src:'',
                speedTime:'5',
                fileList:[],
                resi:true,
                drag:true,
         })
        this.infoFileDialogShow("addImg","1");
        }
        else if(val=="video"){
          for(let item of this.datalist) {
              if(item.type=="video"){
                 this.$message({
                  message: '只能添加一个视频',
                  type: 'warning'
                });
                return;
              }
          }
          this.datalist.push({
                id:id,
                type:'video',
                x:0,
                y:0,
                w: 150,
                h: 100,
                z:num+1,
                src:'',
                videoImg:'',
                resi:true,
                drag:true,
         })
         this.infoFileDialogShow("addVideo","3");
        }
        this.activateData=this.datalist[num];
        this.activate=true;
        if(val=="text"){
          this.editorText.marqueeType=this.activateData.marqueeType;
          this.editorText.color=this.activateData.textColor;
          this.editorText.bargColor=this.activateData.bargColor;
          this.editorText.size=this.activateData.size;
          this.editorText.speed=this.activateData.speed;
        }
        if(val=="time"){
          this.editorText.color=this.activateData.textColor;
          this.editorText.bargColor=this.activateData.bargColor;
          this.editorText.size=this.activateData.size;
        }
        if(val=="img"){
          this.editorImg.time=this.activateData.speedTime;
        }
        this.showToolType(this.activateData.type);
      },
    //获得唯一标识符
    generateUUID() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
    },
    //删除组件
    deleteTool(){
      const active= this.activate;
      if(active){
       const id= this.activateData.id;
       const z=this.activateData.z;
       const date=this.datalist;
       let a=0;
       for(let item of date){
          if(item.z>z){
            this.datalist[a].z=item.z-1;
          }
          a++;
       }
       this.datalist = this.datalist.filter(t => t.id != id)
       const num=this.datalist.length;
       this.activateData=this.datalist[num-1];
       this.showToolType(this.activateData.type);
      }
    },
    //删除图片
    deleteImgList(val){
       const id= this.activateData.id;
       const date=this.datalist;
       let a=0;
       for(let item of date){
          if(item.id==id){
            const size=this.datalist[a].fileList.length;
             if(size>=2){
             this.datalist[a].fileList = this.datalist[a].fileList.filter(t => t.id != val.id);
             this.activateData.fileList= this.activateData.fileList.filter(t => t.id != val.id);
             this.activateData.src=this.datalist[a].fileList[0].src;
             this.datalist[a].src= this.datalist[a].fileList[0].src;
             }
             
          }
          a++;
       }
      
       
    },
    //修改组件层级
    updateRank(val){
      const z=this.activateData.z;
      const id=this.activateData.id;
      const size=this.datalist.length;
      const date=this.datalist;
      if(val=="up"){
        if(z<size){
            let a=0;
            for(let item of date) {
                  if(item.id==id){
                    this.datalist[a].z=z+1;
                    this.activateData.z=z+1; 
                  }else{
                  if(item.z-1==z){
                    this.datalist[a].z=z;
                  }
                  }
                  a++;
          }
        }
      }
      else if(val=="down"){
        if(z>2){
           let a=0;
            for(let item of date) {
                  if(item.id==id){
                    this.datalist[a].z=z-1;
                    this.activateData.z=z-1;
                  }else{
                  if(item.z+1==z){
                    this.datalist[a].z=z;
                  }
                  }
                  a++;
          }
        }
      }
    },
    //当前显示组件类型
    showToolType(val){
      this.backgroudTool=false;
      this.imgTool=false;
      this.textTool=false;
      this.videoTool=false;
      if(val=="bj"){
      this.backgroudTool=true;
      }
      else if(val=="img"){
        this.imgTool=true;
      }
       else if(val=="text"){
        this.textTool=true;
        this.textToolTime=true;
      }
       else if(val=="video"){
        this.videoTool=true;
      }
      else if(val=="time"){
        this.textTool=true;
        this.textToolTime=false;
      }else{
        this.backgroudTool=true;
      }
    },  
    //文件选择弹出
    infoFileDialogShow(type,fileType){
        this.infoActionType=type;
        this.infoFileType=fileType;
        this.selectFileList();
    },
    //添加图片文件列表
    addImgList(val){
      console.log(val);
      this.infoFileDialogShow("addImgList","1");
    },
    //修改图片轮播时间
    editorImgSpeed(){
      const id=this.activateData.id;
      const date=this.datalist;
      let a=0;
      for(let item of date){
        if(item.id==id){
          this.datalist[a].speedTime=this.editorImg.time;
          this.activateData.speedTime=this.editorImg.time;
        }
        a++;
      }
    },
    //查询文件
    selectFileList(){
        const num= localStorage.getItem("userNum");
        let url="";
        const enterId=localStorage.getItem("enterId");
        const userId=localStorage.getItem("userId");
        if(num=="1"){
        url="/file/fileList";
        }else if(num=="0"){
        url="/file/admin/fileList";
        }
        const token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.get(this.GLOBAL.serverSrc+url,{ params:{
          userId:userId,
          page: this.filecurrentPage-1,
          fileTypeId:this.infoFileType,
          enterId:enterId,
        }}).then(res=> {
          console.log(res);  
          const data = JSON.parse(res.data.data);
           this.filepagetotal = data[0].size;
           const redate =
            typeof data[0].data == "string"
              ? JSON.parse(data[0].data)
              : data[0].data;
              this.fileData=redate;
           this.infoFileDialog=true;   
           }).catch(function (error) {
             console.log(error);
        });
    },
    //文件选择
    addinfoFileUrl(val){
      //选择背景
      if(this.infoActionType=="bj"){
        this.datalist[0].bargImg=val.fileUrl;
        this.datalist[0].bargColor="";
      }
      //添加图片
      else if(this.infoActionType=="addImg"){
        const size=this.datalist.length;
        this.datalist[size-1].src=val.fileUrl;
         const id=this.generateUUID();
        this.datalist[size-1].fileList.push(
          {
                id:id,
                name:val.fileName,
                src:val.fileUrl  
         }
        );
      }
      //添加视频
      else if(this.infoActionType=="addVideo"){
        const size=this.datalist.length;
        this.datalist[size-1].src=val.fileUrl;
        this.datalist[size-1].videoImg=val.videoImg;
      }
      //添加当前图片列表
      else if(this.infoActionType=="addImgList"){
         const id=this.activateData.id;
         const date=this.datalist;
         let a=0;
         for(let item of date){
            if(item.id==id){
              const id=this.generateUUID();
              this.datalist[a].fileList.push(
                {
                        id:id,
                        name:val.fileName,
                        src:val.fileUrl  
                }
              );
              this.activateData=this.datalist[a];
              break;
            }
            a++;
         }
      }
      this.infoFileDialog=false;
    },
    //----------- 背景图操作监听
      //文件列表分页点击
    filehandleCurrentChange(val){
        console.log(val);
    },
    //文件上传监听
      handleAvatarSuccess(res, file) {
        this.editorBarg.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
     //修改背景图片颜色 
     updateBargColor(val){
        this.datalist[0].bargColor=val;
        this.datalist[0].bargImg='';
        this.editorBarg.color=val;
     }, 
     elUpdateColor(){
        if( this.datalist[0].bargImg==''){
        this.datalist[0].bargColor=this.editorBarg.color;
        this.datalist[0].bargImg='';
        }
     },
    //----------- 背景图操作监听end
    //-----------文字修改
    //修改字体颜色
    updateTextColor(val){
        const id=this.activateData.id;
        const date=this.datalist;
        let a=0;
        for(let item of date){
          if(item.id==id){
             this.datalist[a].textColor=val;
             this.activateData.textColor=val;
             this.editorText.color=val;
             break;
          }
          a++;
        }
    },
    elUpdateTextColor(){
        const id=this.activateData.id;
        const date=this.datalist;
        let a=0;
        for(let item of date){
          if(item.id==id){
             this.datalist[a].textColor=this.editorText.color;
             this.activateData.textColor=this.editorText.color;
             break;
          }
          a++;
        }
    },
    //修改字体背景颜色
    updateTextBargColor(val){
        const id=this.activateData.id;
        const date=this.datalist;
        let a=0;
        for(let item of date){
          if(item.id==id){
             this.datalist[a].bargColor=val;
             this.activateData.bargColor=val;
             this.editorText.bargColor=val;
             break;
          }
          a++;
        }
    },
    elUpdateTextBargColor(){
        const id=this.activateData.id;
        const date=this.datalist;
        let a=0;
        for(let item of date){
          if(item.id==id){
             this.datalist[a].bargColor=this.editorText.bargColor;
             this.activateData.bargColor=this.editorText.bargColor;
             break;
          }
          a++;
        }
    },
    //修改字体大小
    editorTextSize(){
        const id=this.activateData.id;
        const date=this.datalist;
        let a=0;
        for(let item of date){
          if(item.id==id){
             this.datalist[a].size=this.editorText.size;
             this.activateData.size=this.editorText.size;
             break;
          }
          a++;
        }
    },
    //修改走马灯效果
    editorTextMarquee(){
        const id=this.activateData.id;
        const date=this.datalist;
        let a=0;
        const marqueeType=this.editorText.marqueeType;
        for(let item of date){
          if(item.id==id){
             this.datalist[a].marqueeType=this.editorText.marqueeType;
             this.activateData.marqueeType=this.editorText.marqueeType;
              if(marqueeType=="1"){
                this.datalist[a].marquee=false;
              }else if(marqueeType=="2"){
                this.datalist[a].marqueeDirection="up";
                this.datalist[a].marquee=true;
              }else{
                this.datalist[a].marqueeDirection="left";
                this.datalist[a].marquee=true;
              }
             break;
          }
          a++;
        }
    },
    //修改滚动速度
    editorTextSpeed(){
        const id=this.activateData.id;
        const date=this.datalist;
        let a=0;
        for(let item of date){
          if(item.id==id){
             this.datalist[a].speed=this.editorText.speed;
             this.activateData.speed=this.editorText.speed;
             break;
          }
          a++;
        }
    },
    //双击修改
    editorTextClick(val){
      if(val.type=="text"){
        this.activateData.drag=false;
        this.activateData.textReadonly=false;
      }
    },
    //onActivated，选中时
     onActivated(val){
       if(val.type!="bj"){
      this.activateData=val;
      this.activate=true;
       if(val.type=="text"){
          this.editorText.marqueeType=val.marqueeType;
          this.editorText.color=val.textColor;
          this.editorText.bargColor=val.bargColor;
          this.editorText.size=val.size;
          this.editorText.speed=val.speed;
          let date=this.datalist;
          let a=0;
           for(let item of date) {
                  if(item.id==val.id){
                    this.datalist[a].marquee=false;
                    break;
                  }
                  a++;
          }
        }
        if(val.type=="time"){
          this.editorText.color=val.textColor;
          this.editorText.bargColor=val.bargColor;
          this.editorText.size=val.size;
        }
        if(val.type=="img"){
          this.editorImg.time=val.speedTime;
        }
      }
      this.showToolType(this.activateData.type);
      console.log(this.activateData);
     },
     //不选中时
    onDeactivated(val){
       if(val.type=="text"){
        this.activateData.drag=true;
        this.activateData.textReadonly=true;
        const date=this.datalist;
          let a=0;
           for(let item of date) {
                  if(item.id==val.id){
                    if(this.editorText.marqueeType!="1"){
                    this.datalist[a].context=val.context;
                    this.datalist[a].marquee=true;
                    break;
                    }
                  }
                  a++;
          }

      //     let formData = new FormData();
      // formData.append("contex",JSON.stringify(this.datalist));
      // this.$axios
      //   .post(this.GLOBAL.serverSrc + "/program/add", formData)
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   }); 

       }
    },
    //监听控件的大小变化
    onDrag(left, top) {
    this.activateData.x = left
    this.activateData.y = top
    },
    onResize(left, top, width, height) {
      this.activateData.x = left
      this.activateData.y = top
      this.activateData.w = width
      this.activateData.h = height
    },
    //辅助线
      getRefLineParams (params) {
      const { vLine, hLine } = params
      this.vLine = vLine
      this.hLine = hLine
        }
      ,
     //返回选择布局
     editorBreak(){
         this.showEditor=true
     }, 
    //选择布局类型
    clickShowEditor(val) {
        console.log(val);
        if(val=="0"){
            //2倍
            this.infoEditor.width='960px';
            this.infoEditor.height='540px'
            this.datalist[0].w=960;
            this.datalist[0].h=540;
            this.infoTypeName="16:9";
            this.infoType="0";
        }else{
            //2.5倍
            this.infoEditor.width='432px';
            this.infoEditor.height='768px';
            this.datalist[0].w=432;
            this.datalist[0].h=768;
            this.infoTypeName="9:16";
            this.infoType="1";
        }
        this.infoNameDialog=true;
    },
  },
};
</script>
<style>
.infoEditorHome {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 1080px;
  margin: 0px auto;
  background: #F8F8F8;
}
.infoEditorHome .infoMain{
  padding: 0px;
}
/* 头部样式 */

.infoEditorHome .editor-header{
    width: 100%;
    background: #E0DEE0;
    line-height: 60px;
}
 
.infoEditorHome .content{
  width: 100%;
}
.infoEditorHome .editorHome{
    /* border: black 1px dashed; */
    
    background: #F8F8F8;
    margin: 0px auto;
}

.infoEditorHome .editorHome .editorDiv{
    display: inline-block;
    position: relative;
   
}
.infoEditorHome .editorHome .editor{
    display: inline-block;
    position: relative;
    background-color: #ffffff;
    border: #EEEEEE 1px solid;
}
/* ------------左右工具栏部分 ---------*/
/* 工具栏样式 */
.infoEditorHome .editorHome .toolHome{
  vertical-align: top;
  display: inline-block;
  
}
.infoEditorHome .editorHome .toolHome .toolList{
  margin-top: 0px;
  display: inline-block;
  list-style: none;
  margin-right: 5px;
}
/* 工具编辑 */
.infoEditorHome .editorHome .toolEditor{
  vertical-align: top;
  display: inline-block;
 
}
.infoEditorHome .editorHome .toolEditor .editorList{
  margin-top: 0px;
  display: inline-block;
  list-style: none;
  padding-inline-start:5px;
}

.infoEditorHome .editorHome .toolEditor .editorList .title{
  background:#E0DEE0;width:200px;margin-left:5px;
  margin-top: 5px;
  
}
.infoEditorHome .editorHome .toolEditor .editorList .toolTitle{
  width:200px;
  height:40px;background-color:#1989FB;line-height: 40px;color:#ffffff;margin-left:5px;
}

/* ------------左右工具栏部分end ---------*/
/* ------------背景图部分 ---------*/
/* 上传组件 */
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 112px;
    line-height: 112px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height:112px;
    display: block;

  }
  /* 颜色选择 */
  .infoEditorHome .editorHome .toolEditor .editorList ul{
  margin-top: 0px;
  display: inline-block;
  list-style: none;
  padding-inline-start:5px;
  }
   .infoEditorHome .editorHome .toolEditor .editorList .backgroudTool ul li{
   float: left;
  }
  .infoEditorHome .editorHome .toolEditor .editorList .backgroudTool .bagButton{
    padding: 0px;
  }
/* ------------背景图部分end ---------*/
/* ------------文字部分 ---------*/
/* 颜色选择 */
  .infoEditorHome .editorHome .toolEditor .editorList .textTool ul li{
  float: left;
  }
/* ------------文字部分end ---------*/
/* ------------图片部分 ---------*/

  .infoEditorHome .editorHome .toolEditor .editorList .imgTool .imgList{
   position:relative;
   height: 100px;
   margin-top: 5px;
  }
 .infoEditorHome .editorHome .toolEditor .editorList .imgTool .imgList .close{
   position: absolute;
   right: 0px;
   top: 0px;
   background-color:transparent;
            border-style:none;
  }
/* ------------图片部分end ---------*/
/* 文件选择框样式 */
#info-file-card{
  height:100px;margin:10px;
  position:relative;
}
#info-file-card .file-name{
  width: 100%;
  position: absolute;
  bottom: 0px;
  text-align: center;
  color: aliceblue;
  background: #000000;
  opacity:0.8;

}
#info-file-card .file-name span{
  width: 100%;
  padding: 0px 1px;
  font-size: 12px;
  word-break: break-all;
}
</style>