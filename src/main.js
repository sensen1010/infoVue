import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import axios from 'axios'
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';

//引入自定义拖拽插件
import vdr from 'vue-draggable-resizable-gorkys'

// 导入默认样式
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', vdr)

//引入富文本编辑器
import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
Vue.use(QuillEditor)



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
