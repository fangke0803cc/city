import Vue from 'vue'
import VueRouter from 'vue-router'
import routerConfig from './routerConfig'

Vue.use(VueRouter)

const routes = []
routerConfig.forEach((item) => {
  routes.push({
    path: '/' + item.path,
    name: item.name,
    component: item.component,
    children: item.children ? item.children : '',
    meta: item.meta ? item.meta : ''
  })
})

const router = new VueRouter({
  routes
})

export default router
