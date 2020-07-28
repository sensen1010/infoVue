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
          <el-col :span="24">
            <el-button type="info" size="small" plain>保存</el-button>
            <el-button type="info" size="small" plain>另存</el-button>
            <el-button type="info" size="small" plain>删除</el-button>
            <el-button type="info" size="small" plain>置顶</el-button>
            <el-button type="info" size="small" plain>置底</el-button>
            <el-button type="info" size="small" plain>上一层</el-button>
            <el-button type="info" size="small" plain>下一层</el-button>
            <el-button type="info" size="small" plain>锁定</el-button>
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
                      <el-button @click="addTool('bj')" >背景</el-button>
                    </li>
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
                                    @refLineParams="getRefLineParams"
                                    @resizing="onResize"
                                    @dragging="onDrag"
                                     >
                                    <div v-if="item.type=='bj'&&item.barg!=''" :style='"background:url("+item.barg+") no-repeat;width:100%;height:100%;background-size:100% 100%;"'></div>
                                    <div v-if="item.type=='bj'&&item.color!=''" :style='"background:"+item.color+";width:100%;height:100%;background-size:100% 100%;"'></div>
                                    <img  v-if="item.type=='img'"  controls="controls" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594815263697&di=5bb2d9b62db90c3962af776def16644c&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg" style="width:100%;height:100%" />
                                    <video  v-if="item.type=='video'"  controls="controls" src="https://easyhtml5video.com/assets/video/new/Penguins_of_Madagascar.m4v" style="width:100%;height:100%;object-fit: fill" />
                                    <textarea  v-if="item.type=='text'" 
                                    :style='"background-color:"+item.color+";text-align:"+item.textAlign+";outline:none;border:0;width:100%;resize: none;overflow-y:hidden"' 
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
                    <li class="backgroudTool"> 
                      <div style="width:200px;height:40px;background-color:#1989FB">编辑</div>
                      <div>
                        <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="editorBarg.imageUrl" :src="editorBarg.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
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
                    <li><el-button >文本</el-button></li>
                    <li><el-button >图片</el-button></li>
                    <li><el-button >视频</el-button></li>
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
                 barg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595913207485&di=99086d5c5dc78689004212475b81a84e&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F4%2F56f62bab021a8.jpg',
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
                 w: 100,
                 h: 100,
                 z:3,
              },
              {
                id:'3',
                type:'video',
                x:20,
                y:50,
                resi:true,
                 drag:true,
                w: 100,
                h: 100,
                z:2
              },
              {
                id:'4',
                type:'text',
                x:200,
                y:200,
                w: 100,
                resi:true,
                drag:true,
                h: 100,
                z:2,
                color:"#FF1493",
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
                color:"#FF1493",
                textAlign:"center",
                size:"16px"
         })
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
                resi:true,
                drag:true,
         })
        }
        else if(val=="video"){
          this.datalist.push({
                 id:num+1,
                type:'video',
                x:0,
                y:0,
                w: 150,
                h: 100,
                z:num+1,
                src:'',
                resi:true,
                drag:true,
         })
        }
      },
    
    //----------- 背景图操作监听
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
    //onActivated，选中时
     onActivated(val){
      this.activateData=val;
      console.log(this.activateData);
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
   .infoEditorHome .editorHome .toolEditor .editorList ul li{
   float: left;
  }
</style>