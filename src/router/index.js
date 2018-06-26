import Vue from 'vue'
import Router from 'vue-router'
import find from '@/components/find/find'
import activities from '@/components/activities/activities'
import tasks from '@/components/tasks/tasks'

import one from '@/components/find/one/one';
import two from '@/components/find/two/two';
import three from '@/components/find/three/three';
import four from '@/components/find/four/four';
import five from '@/components/find/five/five';
/*import nav from '@/components/find/nav/nav';
import swiper from '@/components/find/swiper/swiper';*/

Vue.config.productionTip = false;


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/find',
    },
    {
      path: '/find',
      name: 'find',
      component: find,
      children:[
        { path: '/find/one', name:'one', component: one},
        { path: '/find/two', name:'two', component: two},
        { path: '/find/three', name:'three', component: three},
        { path: '/find/four', name:'four', component: four},
        { path: '/find/five', name:'five', component: five}
      ],
    },
    {
      path: '/activities',
      name: 'activities',
      component: activities
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: tasks
    }
  ]
})
