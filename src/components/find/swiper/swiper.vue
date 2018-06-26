<template>
  <div class="swiper-box">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in list">
          <keep-alive>
            <component :is="item.component" :userInfo="item.userInfo" :msg="item.msg"></component>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import one from '../one/one.vue';
  import two from '../two/two.vue';
  import three from '../three/three.vue';
  import four from '../four/four.vue';
  import five from '../five/five.vue';
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css';
  import 'swiper/dist/js/swiper.js';
  import qs from 'qs';

  export default {
    data() {
      return {
          //传递数据
        list: [
          {path: '/find/one', component: one},
          {path: '/find/two', component: two},
          {path: '/find/three', component: three},
          {path: '/find/four', component: four},
          {path: '/find/five', component: five}
        ],
        navList:["关注","精选"],//初始化的导航列表
        keyWords:"关注",
        attentionArticle:[],  //获取文章信息
      }
    },
    components: {
      one,
      two,
      three,
      four,
      five
    },
    created(){
      //接收从nav组件中传递的数据
      this.$root.eventHub.$on('keyWords', (keyWords) => {
        this.keyWords = keyWords;
      });
    },
    mounted() {
      var mySwiper = new Swiper('.swiper-container', {
        // 设定初始化时slide的索引
        initialSlide: this.$route.path === '/find/one' ? 0 : this.$route.path === '/find/two' ? 1 : this.$route.path === '/find/three' ? 2 : this.$route.path === '/find/four' ? 3 : this.$route.path === '/find/five' ? 4 : 0
      });
      mySwiper.on('slideChange', () => { // 监控滑动后当前页面的索引，将索引发射到导航组件
        // 左右滑动时将当前slide的索引发送到nav组件
        this.$root.eventHub.$emit('slideTab', mySwiper.activeIndex);
      });
      // 接收nav组件传过来的导航按钮索引值，跳转到相应内容区
      this.$root.eventHub.$on('changeTab', (index) => { // 点击导航键跳转相应内容区
        mySwiper.slideTo(index, 0, false);
      });
      //----------------------------调用相关事件-------------------------------------------
      this.dataInit();   //页面初始化数据
    },
    methods:{
      judge(){
        if(this.$route.path == '/index/one' || this.$route.path == '/index'){
          this.keyWords='关注'
        }else if(this.$route.path == '/index/two'){
          this.keyWords='精选'
        }
      },
      //页面初始化
      dataInit() {
          console.log(this.keyWords)
        this.$http.post('/api/article/index', qs.stringify({
          uid: uid,
          keywords: this.keyWords,
          pageNum: 1,
          pageSize: 10
        })).then((response) => {
          if(this.keyWords=="关注"){
            var temp = response.data.article;
            this.attentionArticle = this.attentionArticle.concat(temp);
          }else if(this.keyWords=="精选"){
            var temp = response.data.article;
            this.attentionArticle = this.attentionArticle.concat(temp);
          }else{
            this.attentionArticle = response.data.article
          }
          /**
           * 导航栏操作
           */
            //1.补充导航栏
          var nav = [];
          for(var i=0;i<response.data.column.length;i++){
              nav.push(response.data.column[i].column_name)
          }
          this.navList = this.navList.concat(nav);
          //将导航部分发射到nav组件
          this.$root.eventHub.$emit('navList', this.navList);
          /**
           * 获取数据
           */
          //1.初始化每个list里面msg的内容
          for(var i=0;i<this.list.length;i++){
            this.list[i].userInfo = response.data.user;  //获取关注列表的用户信息
            this.list[i].msg = this.attentionArticle;
          }
        })
        console.log(this.list)
      },
    },
    watch:{
      '$route' (to,from) {
        this.judge();
        this.dataInit();
      },
      keyWords(val, oldVal){//普通的watch监听
        this.dataInit();  //初始化数据，并在关键词改变的时候调用
      },
    }
  }
</script>

<style scoped>
  .swiper-box{
    margin-top: 100px;
    /*position: absolute;
    width: 100%;
    top: 100px;
    bottom: 50px;*/
  }
</style>
