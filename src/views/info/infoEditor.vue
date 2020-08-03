<template>
  <div class="infoEditorHome">
    <el-container v-if="showEditor">
      <el-header>选择布局</el-header>
      <el-main>
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
      </el-main>
    </el-container>
    <el-container v-else>
      <el-header class="editor-header">
        <div class="editor-header"> 
        <el-row>
          <el-col :span="22">
            <el-button type="info" size="small" plain>保存</el-button>
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
      <el-main>
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
                  </ul>
                 </div>
                   <div class="editor" :style="'width:'+infoEditor.width+';height:'+infoEditor.height" >
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
                                    :style='"background-color:"+item.color'
                                     >
                                    <div v-if="item.type=='bj'&&item.barg!=''" :style='"background-image:url("+showFileUrl+item.barg+");background-repeat:no-repeat;background-size:cover;width:100%;height:100%;"'></div>
                                    <div v-if="item.type=='bj'&&item.color!=''" :style='"background:"+item.color+";background-size:100% 100%;width:100%;height:100%;"'></div>
                                    <img  v-if="item.type=='img'"  controls="controls" :src="showFileUrl+item.src" style="width:100%;height:100%" />
                                    <video  v-if="item.type=='video'"  :src="showFileUrl+item.src" :poster="showFileUrl+item.videoImg" style="width:100%;height:100%;object-fit: fill" />
                                    <textarea  v-if="item.type=='text'"  @dblclick="editorText(item)" 
                                    :readonly="item.textReadonly"
                                    :style='"background-color:transparent;text-align:"+item.textAlign+";outline:none;border:0;width:100%;height:100%;resize: none;overflow-y:hidden"' 
                                    />
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
                   <div class="toolEditor">
                   <ul class="editorList">
                    <!-- 背景颜色工具集 -->
                    <li class="backgroudTool" v-if="backgroudTool"> 
                      <div style="width:200px;height:40px;background-color:#1989FB;line-height: 40px;color:#ffffff;">背景编辑</div>
                      <div>
                      <el-button class="bagButton" @click="infoFileDialogShow('bj','1')" >
                         <img v-if="datalist[0].barg!=''" controls="controls" :src="showFileUrl+datalist[0].barg" style="width:200px;" />  
                         <i v-else class="el-icon-plus avatar-uploader-icon"></i>      
                      </el-button>
                      <div> 
                      </div>
                      </div>
                      <div>
                        <ul>
                          <li><el-button @click="updateBargColor('#ffffff')"  circle></el-button></li>
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
                      <div style="width:200px;height:40px;background-color:#1989FB;line-height: 40px;color:#ffffff;margin-left:5px;">图片编辑</div>
                      <ul>
                          <li>
                            轮播图片列表
                          </li>
                          <li v-for="file in activateData.fileList" :key="file.id" style="line-height:100px">
                            <img :src='showFileUrl+file.src' style="width:150px;height:100px"/>
                            <el-button icon="el-icon-close" size="mini"></el-button>
                          </li>
                          <li>
                        <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="editorBarg.imageUrl" :src="editorBarg.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                          </li>
                      </ul>
                    </li>
                    <!-- 图片工具集end -->
                    <!-- 文字工具集 -->
                    <li class="textTool" v-if="textTool">
                      <div style="width:200px;height:40px;background-color:#1989FB;line-height: 40px;color:#ffffff;margin-left:5px;">文字编辑</div>
                      <el-button >文字</el-button>
                    </li>
                    <!-- 文字工具集end -->
                    <!-- 视频工具集 -->
                    <li class="videoTool" v-if="videoTool">
                      <div style="width:200px;height:40px;background-color:#1989FB;line-height: 40px;color:#ffffff;margin-left:5px;">视频编辑</div>
                      <el-button >视频</el-button></li>
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
      //数据
      datalist:[
              {
                 id:'1',
                 type:'bj',
                 resi:false,
                 drag:false,
                 w:'',
                 h:'',
                 color:'',
                 barg:'',
                 z:1,
              },
              {
                 id:'2',
                 type:'img',
                 x:200,
                 y:50,
                 style:'',
                 resi:true,
                 drag:true,
                 src:"92452e6a88f34597b739b4d966ca7d91/img//c1eb1a0cda98e8b49c3f433029850769.jpg",
                 w: 100,
                 h: 100,
                 fileList:[{name:"asd",src:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594815263697&di=5bb2d9b62db90c3962af776def16644c&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg"}],
                 z:3,
              },
              {
                id:'3',
                type:'text',
                x:200,
                y:200,
                w: 200,
                resi:true,
                drag:true,
                textReadonly:true,
                h: 100,
                z:2,
                color:"",
                textColor:"",
                textAlign:"center",
                size:"16px"
              }
            ]
    };
  },
  //页面加载
  created() {},
  methods: {
    //添加组件
      addTool(val){
         let num=this.datalist.length;
        if(val=="bj"){
          console.log(val);
        }
        else if(val=="text"){   
          this.datalist.push({
                id:num+1,
                type:'text',
                x:0,
                y:0,
                w: 150,
                h: 100,
                z:num+1,
                resi:true,
                drag:true,
                color:"",
                textReadonly:true,
                textColor:"",
                textAlign:"center",
                size:"16px"
         });
        }
        else if(val=="img"){
          this.datalist.push({
                id:num+1,
                type:'img',
                x:0,
                y:0,
                w: 150,
                h: 100,
                z:num+1,
                src:'',
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
                id:num+1,
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
        this.showToolType(this.activateData.type);
      },
    //删除组件
    deleteTool(){
      let active= this.activate;
      if(active){
       let id= this.activateData.id;
       let z=this.activateData.z;
       let date=this.datalist;
       let a=0;
       for(let item of date){
          if(item.z>z){
            this.datalist[a].z=item.z-1;
          }
          a++;
       }
       this.datalist = this.datalist.filter(t => t.id != id)
       let num=this.datalist.length;
       this.activateData=this.datalist[num-1];
       this.showToolType(this.activateData.type);
      }
    },
    //修改组件层级
    updateRank(val){
      let z=this.activateData.z;
      let id=this.activateData.id;
      let size=this.datalist.length;
      let date=this.datalist;
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
      }
       else if(val=="video"){
        this.videoTool=true;
      }
    },  
    //文件选择弹出
    infoFileDialogShow(type,fileType){
        this.infoActionType=type;
        this.infoFileType=fileType;
        this.selectFileList();
    },
    //查询文件
    selectFileList(){
        const num= localStorage.getItem("userNum");
        let url="";
        let enterId=localStorage.getItem("enterId");
        let userId=localStorage.getItem("userId");
        if(num=="1"){
        url="/file/fileList";
        }else if(num=="0"){
        url="/file/admin/fileList";
        }
        let token=localStorage.getItem("token");
        this.$axios.defaults.headers.common["token"] = token;
        this.$axios.get(this.GLOBAL.serverSrc+url,{ params:{
          userId:userId,
          page: this.filecurrentPage-1,
          fileTypeId:this.infoFileType,
          enterId:enterId,
        }}).then(res=> {
          console.log(res);  
          let data = JSON.parse(res.data.data);
           this.filepagetotal = data[0].size;
           let redate =
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
        this.datalist[0].barg=val.fileUrl;
        this.datalist[0].color="";
      }
      //添加图片
      else if(this.infoActionType=="addImg"){
        let size=this.datalist.length;
        this.datalist[size-1].src=val.fileUrl;
        this.datalist[size-1].fileList.push(
          {
                id:val.fileUrlId,
                name:val.fileName,
                src:val.fileUrl  
         }
        );
      }
      //添加视频
      else if(this.infoActionType=="addVideo"){
        let size=this.datalist.length;
        this.datalist[size-1].src=val.fileUrl;
        this.datalist[size-1].videoImg=val.videoImg;
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
     updateBargColor(val){
        this.datalist[0].color=val;
        this.datalist[0].barg='';
        this.editorBarg.color=val;
     }, 
     elUpdateColor(){
        if( this.datalist[0].barg==''){
        this.datalist[0].color=this.editorBarg.color;
        this.datalist[0].barg='';
        }
     },
    //----------- 背景图操作监听end
    //-----------文字修改
    //双击修改
    editorText(val){
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
      }
      this.showToolType(this.activateData.type);
      console.log(this.activateData);
     },
     //不选中时
    onDeactivated(val){
       if(val.type=="text"){
        this.activateData.drag=true;
        this.activateData.textReadonly=true;
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
        }else{
            //2.5倍
            this.infoEditor.width='432px';
            this.infoEditor.height='768px';
            this.datalist[0].w=432;
            this.datalist[0].h=768;
        }
        //显示编辑界面
        this.showEditor=false;

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