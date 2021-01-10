import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/department',
          name: 'DepartmentComponent',
          component: ()=>import('@/components/DepartmentComponent')
        },
        {
          path: '/teaching-plan',
          name: 'TeachingPlanComponent',
          component: ()=>import('@/components/TeachingPlanComponent')
        },
        {
          path: '/student',
          name: 'StudentComponent',
          component: ()=>import('@/components/StudentComponent')
        },
        {
          path: '/grade',
          name: 'GradeComponent',
          component: ()=>import('@/components/GradeComponent')
        }
      ]
    }
  ]
})
