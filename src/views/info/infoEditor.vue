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
          <el-col :span="20">
            <el-button type="info" size="small" plain>保存</el-button>
            <el-button type="info" size="small" plain>另存</el-button>
            <el-button type="info" size="small" plain>删除</el-button>
            <el-button type="info" size="small" plain>置顶</el-button>
            <el-button type="info" size="small" plain>置底</el-button>
            <el-button type="info" size="small" plain>上一层</el-button>
            <el-button type="info" size="small" plain>下一层</el-button>
            <el-button type="info" size="small" plain>锁定</el-button>
          </el-col>
          <el-col :span="4"><p></p></el-col>
        </el-row>
        </div>
        
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="20">
               <div class="content">
               <div class="editorHome">
                 <div class="toolHome">
                   <ul class="toolList">
                    <li> <el-button >背景</el-button></li>
                    <li><el-button >文本</el-button></li>
                    <li><el-button >图片</el-button></li>
                    <li><el-button >视频</el-button></li>
                  </ul>
                 </div>
                   <div class="editor" :style="'width:'+infoEditor.width+';height:'+infoEditor.height" >
                            <vue-draggable-resizable
                                v-for="(item,num) in datalist" 
                                    :key="num" 
                                    :x="item.x" 
                                    :y="item.y" 
                                    :w="item.width" 
                                    :h="item.height" 
                                    :z="item.z"
                                    :parent="true"
                                   
                                    :snap="true"
                                    :snapTolerance="10"
                                    @refLineParams="getRefLineParams"
                                     >
                                    <img  v-if="item.type=='img'"  controls="controls" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594815263697&di=5bb2d9b62db90c3962af776def16644c&imgtype=0&src=http%3A%2F%2Fp2.so.qhimgs1.com%2Ft01dfcbc38578dac4c2.jpg" style="width:100%;height:100%" />
                                    <video  v-if="item.type=='mp4'"  controls="controls" src="https://easyhtml5video.com/assets/video/new/Penguins_of_Madagascar.m4v" style="width:100%;height:100%;object-fit: fill" />
                                    <textarea  v-if="item.type=='text'" 
                                    :style='"background-color:"+item.color+";text-align:"+item.textAlign+";outline:none;border:0;width:100%;resize: none;overflow-y:hidden"' 
                                    />
                             </vue-draggable-resizable>
                             <!--辅助线-->
                                    <span class="ref-line v-line"
                                            v-for="item in vLine"
                                            v-show="item.display"
                                            :key="item"
                                            :style="{ left: item.position, top: item.origin, height: item.lineLength}"
                                    />
                                    <span class="ref-line h-line"
                                            v-for="item in hLine"
                                            v-show="item.display"
                                            :key="item"
                                            :style="{ top: item.position, left: item.origin, width: item.lineLength}"
                                    />
      <!--辅助线END-->
                   </div>
               </div>
               </div>
          </el-col>
          <el-col :span="4">
               <div style="width:100%; background: antiquewhite;">
                   
                   <div class="backgroundTool">
                       
                   </div>
                   <div class="textTool"></div>
                   <div class="imgTool"></div>
                   <div class="videoTool"></div>
               </div>
          </el-col>
        </el-row>
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
      infoEditor:{
          width:'640px',
          height:'360px'
      },
      vLine: [],
      hLine: [],
      datalist:[
              {
                 id:1,
                 type:'img',
                 x:200,
                 y:50,
                 style:'',
                 width: 100,
                 height: 100,
                 z:3,
              },
              {
                 id:1,
                 type:'img',
                 x:200,
                 y:50,
                 style:'',
                 width: 100,
                 height: 100,
                 z:3,
              },
              {
                id:2,
                type:'mp4',
                x:20,
                y:50,
                width: 100,
                height: 100,
                z:2
              },
              {
                id:3,
                type:'text',
                x:200,
                y:200,
                width: 100,
                height: 100,
                z:1,
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
            this.infoEditor.maxWidth='960px';
            this.infoEditor.maxHeight='540px'
        }else{
            //2.5倍
            this.infoEditor.width='432px';
            this.infoEditor.height='768px'
            this.infoEditor.maxWidth='432px';
            this.infoEditor.maxHeight='768px'
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
</style>