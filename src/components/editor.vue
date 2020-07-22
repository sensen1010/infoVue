<template>
  <div>
    <el-upload
    :show-file-list="false"
    :on-success="handleSuccess"
    :format="['jpg','jpeg','png','gif']"
    :max-size="2048"
    multiple
    :action='imgUrl+"/img/newCord/up"'
    >
</el-upload>
    <div class="editor"  ref="QuillEditor"></div>
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  name: 'editor',
  props: {
    value: String
  },
  data() {
    return {
      imgUrl:this.GLOBAL.serverSrc,
      editor:null,
      options: {
      theme: 'snow',
      modules: {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image', 'video'],
                [
                    { 'table': 'TD' },
                    { 'table-insert-row': 'TIR' },
                    { 'table-insert-column': 'TIC' },
                    { 'table-delete-row': 'TDR' },
                    { 'table-delete-column': 'TDC' }
                ]
            ],
            handlers: {
              'image': function (value) {
                   if (value) {
                     //document.querySelector('.ivu-upload').click();
                     //document.getElementById("#ivu-upload").click();
                     //this.$refs.upNewsImg[0].$el.click()
                      document.querySelector('.el-upload').click()
                   } else {
                      this.quill.format('image', false);
                }
               },
                'table': function (val) {
                    console.log(val); 
                    this.quill.getModule('table').insertTable(2, 3)
                },
                'table-insert-row': function () {
                    this.quill.getModule('table').insertRowBelow()
                },
                'table-insert-column': function () {
                    this.quill.getModule('table').insertColumnRight()
                },
                'table-delete-row': function () {
                    this.quill.getModule('table').deleteRow()
                },
                'table-delete-column': function () {
                    this.quill.getModule('table').deleteColumn()
                }
            },
        },
        table: true,
    },
    placeholder: '点击输入 ...'
}
    }
  },
   watch: {
      // 监听外部值的传入，用于将值赋予编辑器
      'value' (val) {
        // 如果编辑器没有初始化，则停止赋值
        if (!this.editor) {
          return
        }
        // 获取编辑器当前内容
        let content = this.editor.root.innerHTML
        // 外部传入了新值，而且与当前编辑器的内容不一致
        if (val && val !== content) {
          // 将外部传入的HTML内容转换成编辑器识别的delta对象
          let delta = this.editor.clipboard.convert({
            html: val
          })
          // 编辑器的内容需要接收delta对象
          this.editor.setContents(delta)
        }
      }
    },
  methods: {
    onEditorBlur() {
        //失去焦点事件
    },
    onEditorFocus() {
        //获得焦点事件
    },
    onEditorChange() {
        //内容改变事件
        console.log("ce");
        //this.$refs.upNewsImg.$el.click()
        this.$emit("input", this.content);
    },
    handleSuccess (res) {
         let quill = this.$refs.QuillEditor.quill
         console.log(quill);
         
       // 如果上传成功
        if (res) {
            // 获取光标所在位置
            //let length = quill.getSelection().index;
             let length = this.$refs.QuillEditor.quill.selection.savedRange.index;
                 
            // 插入图片，res为服务器返回的图片链接地址
            quill.insertEmbed(length, 'image', res);
            // 调整光标到最后
           // quill.setSelection(length + 1)
        } else {
            // 提示信息，需引入Message
           // Message.error('图片插入失败')
        }
    },
},
  mounted() {
    let dom = this.$el.querySelector('.editor')
    this.editor = new Quill(dom, this.options);
//    this.quill.setContents(this.value)
    this.editor.on('text-change', () => {
      this.$emit('input', this.editor.root.innerHTML)
    });
    //设置图标
    this.$el.querySelector('.ql-table-insert-row').innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">  <image id="image0" width="20" height="20" x="0" y="0"
    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAB4CAAAAACvR0EUAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
cwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBhgLOiKncAmYAAAAlklEQVRo3u3XwQ2AIAyF4eJKTsOE
TONM9aBeCA9jQhPR/1081H5BgzYktyvbaoQ8STou3i666nJtLcPXiIiIiIiIGBlmISIiIiJipDg+
TC5ERERExEhxfM7JlZvFkkVXu1CCnhoREREREZH8MfIIXd9npk7hVWbY4YhvFTv7MXUbZZ9eYx/U
5RneoxZvPmJZ5k+B+G1xB93HFselITe0AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA2LTI0VDEx
OjU4OjM0KzAzOjAw2yHp+gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNi0yNFQxMTo1ODozNCsw
MzowMKp8UUYAAAAASUVORK5CYII=" />
</svg>`
    this.$el.querySelector('.ql-table-insert-column').innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">  <image id="image0" width="20" height="20" x="0" y="0"
    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABjCAAAAABMeSoNAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
cwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBhgLOifXGv0XAAAArklEQVRo3u3awQ2AIAyF4dawkdPo
gkzjTHhQkx7ggKEo5H8XIwe+gNg0Rk3y5FjFLdp8xpQbXPxWADMGE65L9niI5odlj1tuOH6+GhgY
GBgYGJifMp2aWzobGJj6BL+p1byOfqtRMTVmrmcDAzMV077YaPHGPzdHy1GT9kfg2Wi1N3NtGgzM
6EwSUyodu05bd4ffNJhBGL5yvAgMDAwMDAzMTxl+ToLpw5T618Y5AXGqHcZRfryJAAAAJXRFWHRk
YXRlOmNyZWF0ZQAyMDIwLTA2LTI0VDExOjU4OjM5KzAzOjAwuvaIOgAAACV0RVh0ZGF0ZTptb2Rp
ZnkAMjAyMC0wNi0yNFQxMTo1ODozOSswMzowMMurMIYAAAAASUVORK5CYII=" />
</svg>`
    this.$el.querySelector('.ql-table-delete-row').innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">  <image id="image0" width="20" height="20" x="0" y="0"
    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAB4CAAAAACvR0EUAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
cwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBhgLOiPQdzkOAAAAkUlEQVRo3u3XwQ2AIAyFYTBu5DRM
yDTOVA/q7TUB0x6I/7uYWPgCBtJYrbw5j0LITOr9MF00b5b51ha+RkRERERExMzQCxERERERM8X4
0LkQERERETPF+Dydq8lib84sXehJu0ZERERERCR/jPsL/TkrnHDEmOzybR2dLs6eXOMwqEau8B2l
OH4zxUjuNSLiXC4hAxPLrbnOTwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNi0yNFQxMTo1ODoz
NSswMzowMH1W4k4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDYtMjRUMTE6NTg6MzUrMDM6MDAM
C1ryAAAAAElFTkSuQmCC" />
</svg>`
    this.$el.querySelector('.ql-table-delete-column').innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">  <image id="image0" width="20" height="20" x="0" y="0"
    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABjCAAAAABMeSoNAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
cwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBhgLOifXGv0XAAAAq0lEQVRo3u3asQ1AQBTG8TtRGIMZ
TEOls4JtlEYwhR1soXwKNJxG3nH4f43kSe6Xkyu+XFgxW4bceItVX1Fcw8jfDmDewcTLw3k8jHWP
TdkVrnH3+G5gYGBgYGBgAmVuKrc0GxgYGBgYmH8z+pE+3U3SVtZmo1g5JBv3L5LJw0erD5NqK1Ca
aZrj7FsnDQYGBgbm5wy3HBcCAwMDAwMDEyjDz0kw9zBn/VU5M61jIAqnaHfWAAAAJXRFWHRkYXRl
OmNyZWF0ZQAyMDIwLTA2LTI0VDExOjU4OjM5KzAzOjAwuvaIOgAAACV0RVh0ZGF0ZTptb2RpZnkA
MjAyMC0wNi0yNFQxMTo1ODozOSswMzowMMurMIYAAAAASUVORK5CYII=" />
</svg>`
  }
}
</script>
<style>
.ivu-upload {
    display: none;
}
</style>