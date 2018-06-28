<template>
  <div>
    <div class="swiper-box">
      <pull-to :bottom-load-method="loadMore">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in list">
              <keep-alive>
                <component :is="item.component" :userInfo="item.userInfo" :msg="item.msg" :banner="item.banner"></component>
              </keep-alive>
            </div>
          </div>
        </div>
      </pull-to>
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
  import PullTo from 'vue-pull-to';
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
        keyWords:"",  //关键词
        attentionArticle:[],  //获取文章信息
        nowIndex:0,   //当前索引的下标
        banner:[],   //精选部分banner图的数据
        pageNum:1,   //分页
      }
    },
    components: {
      one,
      two,
      three,
      four,
      five,
      PullTo
    },
    created(){
      //接收从nav组件中传递的数据
      this.$root.eventHub.$on('keyWords', (keyWords) => {
        this.keyWords = keyWords;
      });
      this.$root.eventHub.$on('nowIndex', (nowIndex) => {
        this.nowIndex = nowIndex;
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
      this.judge();  //确定关键词
    },
    methods:{
        //通过路由来指定关键词
      judge(){
        if(this.$route.path == '/find/one' || this.$route.path == '/find'){
          this.keyWords='关注'
        }else if(this.$route.path == '/find/two'){
          this.keyWords='精选'
        }
      },
      //页面初始化
      dataInit() {
        this.$http.post('/api/article/index', qs.stringify({
          uid: uid,
          keywords: this.keyWords,
          pageNum: this.pageNum,
          pageSize: 10
        })).then((response) => {
            //根据关键词判断获取文章内容的信息
          if(this.nowIndex==0){
            var temp = response.data.article;
            this.attentionArticle = this.attentionArticle.concat(temp);
          }else if(this.nowIndex==1){
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

          // banner图的操作
          if(response.data.banner != "undefined"){
            this.banner = response.data.banner;  //精选部分的banner图
          }
          /**
           * 获取数据
           */
            //1.初始化每个list里面msg的内容
//          var self = this
          for(var i=0;i<this.list.length;i++){
            this.$set(this.list[i], 'userInfo', response.data.user)
            this.$set(this.list[i], 'msg', this.attentionArticle)
            this.$set(this.list[i], 'banner', this.banner)
          }

        })

      },
      //上拉加载
      loadMore(loaded) {
        setTimeout(() => {
          if(this.nowIndex==0){
            this.pageNum = this.pageNum+1;
          }else if(this.nowIndex==1){
            this.pageNum = this.pageNum+1;
          }else{
            this.pageNum = 1;
          }
          this.dataInit();
          loaded('done');
        }, 500);
      },
    },
    watch:{
      keyWords(val, oldVal){//普通的watch监听
        //console.log(document.documentElement.scrollTop||document.body.scrollTop)
        this.pageNum = 1;  //每次改变的时候初始化
        this.dataInit();  //初始化数据，并在关键词改变的时候调用
        this.attentionArticle=[]; //清空存储的文章的信息
      },
    }
  }
</script>

<style scoped>
  .swiper-box{
    position: absolute;
    width: 100%;
    top: 100px;
    bottom: 50px;
  }
</style>
