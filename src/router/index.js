import Vue from 'vue'
import Router from 'vue-router'
import find from '@/components/find/find'
import activities from '@/components/activities/activities'
import tasks from '@/components/tasks/tasks'
import my from '@/components/my/my'
import one from '@/components/find/one/one';
import two from '@/components/find/two/two';
import three from '@/components/find/three/three';
import four from '@/components/find/four/four';
import five from '@/components/find/five/five';
import exchangeGoods from '@/components/common/exchangeGoods/exchangeGoods';
import profitStrategy from '@/components/common/profitStrategy/profitStrategy';
import goldIncome from '@/components/common/goldIncome/goldIncome';
import attention from '@/components/common/attention/attention'
import collection from '@/components/common/collection/collection'
import myActives from '@/components/common/myActives/myActives'
import myArticle from '@/components/common/myArticle/myArticle'
import beforeDescription from '@/components/common/beforeDescription/beforeDescription'
import articleDescription from '@/components/common/articleDescription/articleDescription'
import Search from '@/components/search/Search/Search'
import headerBar from '@/components/search/headerBar/headerBar'
import searchResult from '@/components/search/searchResult/searchResult'




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
    },
    {
      path: '/my',
      name: 'my',
      component: my
    },
    {
      path: '/exchangeGoods',
      name: 'exchangeGoods',
      component: exchangeGoods,
    },
    {
      path: '/profitStrategy',
      name: 'profitStrategy',
      component: profitStrategy,
    },
    {
      path: '/goldIncome',
      name: 'goldIncome',
      component: goldIncome,
    },
    {
      path: '/attention',
      name:'attention',
      component: attention
    },
    {
      path: '/collection',
      name:'collection',
      component: collection
    },
    {
      path: '/myActives',
      name:'myActives',
      component: myActives
    },
    {
      path: '/myArticle',
      name:'myArticle',
      component: myArticle
    },
    {
      path: '/articleDescription/:article_id/:article_format/:sourceType/:uid',
      name:'articleDescription',
      component: articleDescription
    },
    {
      path: '/beforeDescription/:article_id/:article_format/:sourceType/:uid',
      name:'beforeDescription',
      component: beforeDescription
    },
    {
      path: '/search',
      name:'search',
      component: Search
    },
    {
      path: '/headerBar',
      name:'headerBar',
      component: headerBar
    },
    {
      path: '/searchResult/:keyWords',
      name:'searchResult',
      component: searchResult
    },

  ]
})
