// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'



import $ from 'jquery' ;
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';

Vue.config.productionTip = false;

//引入axios
import axios from 'axios';
Vue.prototype.$http= axios;

// 全局变量的设置
global.uid=5190;
global.unionid='a865f156019cde6fa941a9f649377ed7'
global.device_sn='868403031722678'
global.user_token='X1RcVlpEV1tTQ2BuW19BYgMbFnJFO1IPGwACUw0bAwBcBkldVVYHFFICWFhRV1JYAlEDU20EWlNfV1l+A15ZSVxt'
global.uuid='fb72ae37-5db8-31ee-8c0f-f39a7afa1f46'
global.session_id='47698c15fb83a1e5bb1400accbb17f82'

//全局函数
Vue.prototype.burialPoint = function (params){//changeData是函数名
  this.$http.get("/point", {
    params: params
  }).then(response => {
    console.log(response.status)
  }, response => {
    console.log("获取信息失败");
    console.log(response);
  })
}

//引入mint-ui
import 'mint-ui/lib/style.css';
import 'mint-ui/lib/index.js';
//swiper
import { Swipe, SwipeItem } from 'mint-ui';
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

//引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    eventHub: new Vue() // 使用集中的事件处理器,一劳永逸的在任何组件调用事件发射、接受的方法
  }
})
