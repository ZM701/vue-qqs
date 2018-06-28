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
import exchangeGoods from '@/components/tasks/exchangeGoods/exchangeGoods';
import profitStrategy from '@/components/tasks/profitStrategy/profitStrategy';




Vue.config.productionTip = false;


Vue.use(Router)

export default new Router({
  // mode: 'history',
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
        { path: 'one', name:'one', component: one},
        { path: 'two', name:'two', component: two},
        { path: 'three', name:'three', component: three},
        { path: 'four', name:'four', component: four},
        { path: 'five', name:'five', component: five}
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
      component: tasks,
      children:[
        { path: 'exchangeGoods', name:'exchangeGoods', component: exchangeGoods},
        { path: 'profitStrategy', name:'profitStrategy', component: profitStrategy}
      ],
    },
  ]
})
