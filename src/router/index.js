import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import DepartmentComponent from "../components/department/DepartmentComponent";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/DepartmentComponent',
          name: 'DepartmentComponent',
          component: ()=>import('@/components/department/DepartmentComponent')
        },
        {
          path: '/TeachingPlanComponent',
          name: 'TeachingPlanComponent',
          component: ()=>import('@/components/plan/TeachingPlanComponent')
        }
      ]
    }
  ]
})
