<template>
  <div>
    <!--搜索栏-->
    <div class="search">
      <div class="find">
        <router-link to="/search">
          <input/>
          <i class="glyphicon glyphicon-search"></i>
        </router-link>
      </div>
      <div class="my">
        <router-link to="/my"> <span class="glyphicon glyphicon-user"></span></router-link>
      </div>
    </div>
    <!--导航栏-->
    <div class="nav">
      <nav class="nav-list">
        <p class="item" v-for="(item,index) in navList" :class="{'active': nowIndex===index}" @click="tabClick(index)">{{item}}</p>
      </nav>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import VueRouter from 'vue-router';

  export default {
    data() {
      return {
        navList: [],
        nowIndex: 0,
        keyWords:null,
      }
    },
    created(){
        //接收从swiper组件中传递的数据
      this.$root.eventHub.$on('navList', (navList) => {
        this.navList = navList;
      });
    },
    mounted() {
      this.$nextTick(() => {
        // 初始化，保证刷新页面后内容区和导航键一致
        this.initPage();
      });
      // 接收swiper组件发射的index进行导航按钮切换高亮和更新模板地址
      this.$root.eventHub.$on('slideTab', this.slideTab);
    },
    methods: {
      initPage() {
        this.nowIndex = this.$route.path === '/find/one' ? 0 : this.$route.path === '/find/two' ? 1 : this.$route.path === '/find/three' ? 2 : this.$route.path === '/find/four' ? 3 : this.$route.path === '/find/five' ? 4 : 0;
      },
      tabClick(index) {
        this.nowIndex = index;
        //console.log(index);
        // 点击导航按钮时向swiper组件发射index
        this.$root.eventHub.$emit('changeTab', index);
      },
      slideTab(index) {
        this.nowIndex = index;
        let router = new VueRouter();
        let href = index === 0 ? '/find/one' : index === 1 ? '/find/two' : index === 2 ? '/find/three' : index === 3 ? '/find/four' : index === 4 ? '/find/five' : '/find/one';
        // 利用路由的push方法更新路径地址
        router.push(href);

        this.keyWords = $(".item").eq(index).text();
        //发射得到的关键字
        this.$root.eventHub.$emit('keyWords', this.keyWords);
      }
    }
  }
</script>

<style scoped>
  /*搜索栏*/
  .search{
    border:1px solid #7DBE24;
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 50px;
    left: 0;
    top:0;
    background: #7DBE24;
    overflow: hidden;
    padding-left: 10%;
    overflow: hidden;
  }
  .search .find,.search .my{
    float: left;
  }
  .search .my span{
    font-size: 16px;
    color: #fff;
  }
  .search .my{
    height: 50px;
    width: 40px;
    line-height: 50px;
  }
  .search .my a{
    display: block;
    width: 100%;
    height: 100%;
  }
  .search .find{
    position: relative;
    width: 80%;
    margin-right: 4%;
    margin-top: 10px;
  }
  .search .find input{
    padding-left: 30px;
    outline: none;
    width: 100%;
    height: 30px;
    border: none;
    border-radius: 4px;
  }
  .search .find i {
    left: 1%;
    top:10%;
    position: absolute;
    font-size: 16px;
    color:#ccc;
    line-height: 30px;
  }
  /*导航栏*/
  .nav{
    width: 100%;
    overflow:hidden;
    position: fixed;
    top:50px;
    background: #fff;
    z-index: 99;
  }
  .nav nav{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: middle;
    -ms-flex-align: middle;
    align-items: middle;
    overflow: auto;
  }
  .nav p{
    text-align: center;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    padding: 10px 10px 5px 10px;
  }
  .nav p.active{
    color: #66B672;
    border-bottom:1px solid #66B672;
  }
</style>
