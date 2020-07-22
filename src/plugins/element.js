import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import global_ from '../components/GLOBAL.vue'//引用文件
Vue.prototype.GLOBAL = global_

//富文本编辑器
// import VueQuillEditor from 'vue-quill-editor'

// // require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// Vue.use(VueQuillEditor)

//引入富文本编辑器

Vue.use(Element)
