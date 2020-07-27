import Vue from 'vue'
import VueRouter from 'vue-router'
const Main = () => import('../views/main/main.vue')
const Users = () => import('../views/users/users.vue')
const Hosts = () => import('../views/hosts/hosts.vue')
const HostsAdmin = () => import('../views/hosts/hostsAdmin.vue')
const Files = () => import('../views/files/files.vue')
const News = () => import('../views/news/newsCore.vue')
const Info = () => import('../views/info/info.vue')
const InfoEditor = () => import('../views/info/infoEditor.vue')
const Enter = () => import('../views/enterprise/enterprise.vue')
const Login = () => import('../views/login/login.vue')

//解决路由重复报错问题
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

  const routes = [
    {
      path:'',
      redirect:"login"
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta:{
        title: "登录"
      }
    },
    {
      path: "/infoEditor",
      name: "infoEditor",
      component: InfoEditor,
      meta:{
        title: "节目编辑"
      }
    },
  {
    path: '/Main',
    name: 'Main',
    component: Main,
    meta:{
      title:"主页"
    },
    children:[
    {
      path:"Users",
      name:'Users',
      meta:{
        title:"账号管理"
      },
      components:{
        default:Users,
        'mianView':Users
      }
    },
    {
      path:"Hosts",
      name:'Hosts',
      meta:{
        title:"客户端管理"
      },
      components:{
        default:Hosts,
        'mianView':Hosts
      }
    },
    {
      path:"HostsAdmin",
      name:'HostsAdmin',
      meta:{
        title:"客户端管理员"
      },
      components:{
        default:HostsAdmin,
        'mianView':HostsAdmin
      }
    },
    {
      path:"Files",
      name:'Files',
      meta:{
        title:"文件管理"
      },
      components:{
        default:Files,
        'mianView':Files
      }
    },
    {
      path:"News",
      name:'News',
      meta:{
        title:"发布管理"
      },
      components:{
        default:News,
        'mianView':News
      }
    },
    {
      path:"Info",
      name:'Info',
      meta:{
        title:"节目管理"
      },
      components:{
        default:Info,
        'mianView':Info
      }
    },
    {
      path:"Enter",
      name:'Enter',
      meta:{
        title:"企业管理"
      },
      components:{
        default:Enter,
        'mianView':Enter
      }
    }
  
  ]

  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: "dist",
  routes
})
const whiteList = ['/login']
router.beforeEach((to,from,next) => {
  //设置标题
 // document.title=to.matched[0].meta.title;无效
  document.title=to.meta.title;
  const token= localStorage.getItem("token");
  if (token!==null&&token!="") {
    if (to.path === '/login') {
      next()
    }
    next()
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') //否则全部重定向到登录页
    }
  }
  next()
})

export default router
