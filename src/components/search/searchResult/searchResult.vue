<template>
  <div>
    <!--<div id="search" style="border:1px solid red;">-->
    <!--<div class="searchBar" style="border:1px solid #000;">-->
    <div class="tops">
      <div @click="goback" class="box1"><i class="glyphicon 	glyphicon-chevron-left"></i></div>
      <el-input
        v-model="input"
        placeholder="请输入内容"
        value="input"
        @keyup.native.enter="search(input)"
        class="searchInput fl box2">
      </el-input>
      <span class="sousuo" @click="search(input)">搜索</span>
    </div>
    <!--</div>-->
    <!--</div>-->

    <div class="atricle">
      <div @click="f1" :class="flage1?'active':'unacticve'">相关用户</div>
      <div @click="f2" :class="flage2?'active':'unacticve'">相关文章</div>
      <div @click="f3" :class="flage3?'active':'unacticve'">相关活动</div>
    </div>



    <!--<div>-->
    <div class="distance">
      <!--相关用户----------------------------------------------------------------------------------------------------------------------------->
      <div class="users relative distanceArticle" v-if="flage1">
        <pull-to :bottom-load-method="loadMore">
          <div v-for="(item,index) in user" class="userIn">
            <img :src="item.image"/>
            <span>{{item.nickname}}</span>
          </div>
        </pull-to>
      </div>
      <!--相关文章----------------------------------------------------------------------------------------------------------------------------->
      <div v-if="flage2" class="distanceArticle">
        <pull-to :bottom-load-method="loadMore">
          <div>
            <div class="mainAtricle" v-for="(item,index) in article" @click.stop="articleClick(item.article_id,item.article_format,item.type,item.uid)">
              <div class="user"><img :src="item.image">{{item.nickname}}</div>
              <div class="time">{{item.article_sendtime*1000 | formatDate}}</div>
              <div class="articleContant">
                <div class="imgs"><img :src="item.article_cover"></div>
                <div class="description">
                  <span>{{item.article_title}}</span>
                  <span>{{item.article_type}}</span>
                  <span>阅读量：{{item.article_readnum}} &nbsp; &nbsp; &nbsp;点赞：{{item.article_agreenum}}</span>
                </div>
              </div>
            </div>
          </div>
        </pull-to>
      </div>

      <!--相关活动----------------------------------------------------------------------------------------------------------------------------->
      <div v-if="flage3" class="distanceArticle">
        <pull-to :bottom-load-method="loadMore">
          <div class="actives" v-for="(item,index) in activity">
            <div class="articleContant">
              <div class="imgs"><img :src="item.goods_banner"></div>
              <div class="description">
                <span>{{item.title}}</span>
                <span>参与人数:{{item.count}}</span>
              </div>
            </div>
          </div>
        </pull-to>
      </div>
    </div>
    <!--<div style="border:10px solid red;">hah</div>-->

  </div>
</template>

<script>
  import qs from "qs";
  import PullTo from 'vue-pull-to';
  import search from "../Search/Search";
  import store from '../../../../static/js/store'
  import {formatDate} from '../../../../static/js/common';
  export default {
    data(){
      return{
        flage1:true,
        flage2:false,
        flage3:false,
        info:[],
        user:[],
        article:[],
        activity:[],
        status:1, // 3:activity相关活动   2:article 相关文章  1:user相关用户  0:所有
        loading:false,
        flag:true,
        con:[],
        pageNum:1,
        test:store.fetch(),
        searchCon:'',
        input:$("el-input").val() || this.$route.params.keyWords,
      }
    },
    watch: {
      test: {
        handler: function(val, oldVal) {
          store.save(val);
        },
        deep: true
      }
    },
    components:{
      'v-search':search,
      PullTo
    },
    created(){
      // console.log(this.$route.params.keyWords)
      this.information();
      //console.log(this.input)

    },
    methods:{
      f1(){
        this.flage1 = true;
        this.flage2 = false;
        this.flage3 = false;
        this.status = 1;
        //this.information();
      },
      f2(){
        this.flage1 = false;
        this.flage2 = true;
        this.flage3 = false;
        this.status = 2;
        // this.information();
      },
      f3(){
        this.flage1 = false;
        this.flage2 = false;
        this.flage3 = true;
        this.status = 3;
        //this.information();
      },
      //返回上一级
      goback(){
        this.$router.push({
          name: 'search',
        })
      },
      //点击文章进入详情页
      articleClick(article_id,article_format,type,uid){
        //console.log(index)
        this.$router.push({
          name: 'beforeDescription',
          params: {
            article_id: article_id,
            article_format:article_format,
            sourceType:type,
            uid:uid
          }
        })
      },

      information(){
        var _this = this;
        this.$http.post('/api/article/search', qs.stringify({
          uid: uid,
          keywords: this.input,
          pageNum: this.pageNum,
          pageSize: 5,
          status:this.status   // 3:activity相关活动   2:article 相关文章  1:user相关用户  0:所有
        })).then((response) => {
          if(this.status==1){
            var temp = response.data.search.user;
            _this.user = _this.user.concat(temp);
          }
          else if(this.status==2){
            var temp = response.data.search.article;
            _this.article = _this.article.concat(temp);
          }
          else if(this.status==3){
            var temp = response.data.search.activity;
            //console.log(response.data)
            _this.activity = _this.activity.concat(temp);
          }
          // _this.info = response.data.search;
          //console.log(_this.article)
          // console.log(response.data.search.article)
        });
      },
      //回车搜索
      search(input){
        //搜索跳转
        this.$router.push({
          name: 'searchResult',
          params: {
            keyWords: this.input,
          }
        })
        //清空原有数据
        this.user=[];
        this.article=[];
        this.activity=[];

        //location.reload();  //刷新页面
        const _this = this;
        input = input.trim();
        if(input){
          if(this.searchCon == input){
            if(this.flag){
              return ;
            }
          }
          _this.loading = true;
          //存储数据
          this.test.unshift(input);
          var val = JSON.parse(JSON.stringify(this.test))
          store.save(val);
          this.searchCon = input;
          this.flag = true;
        }else{
          this.searchCon = '';
          this.con = [];
        }

        this.information();
        //console.log(_this.con)
        //调用搜索文章埋点
        this.burialPoint({
          session_id:session_id,
          action:'search',
          end:'wx',
          target:'article',
          keyword:input
        });
      },
      //下拉加载
      loadMore(loaded) {
        // console.log(this.status)
        setTimeout(() => {
          if(this.status==1){
            this.pageNum = this.pageNum+1;
          }
          if(this.status==2){
            this.pageNum = this.pageNum+1;
          }
          if(this.status==3){
            this.pageNum = this.pageNum+1;
          }
          this.information();
          loaded('done');
        }, 500);
      },
    },
    filters: {
      //时间戳的转换
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
        // return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    watch:{
      status(val, oldVal){//普通的watch监听
        this.pageNum = 1;  //每次改变的时候初始化
        this.user = [];
        this.article = [];
        this.activity = [];
        this.information()
        // console.log(this.pageNum)
        /*this.user = [];
         this.article = [];
         this.activity = [];*/
      },
    }
  }
</script>

<style scoped>
  .distanceArticle{
    width: 100%;
    position: absolute;
    top:90px;
    bottom: 40px;
  }
  /*搜索功能 开始*/
  .box1{
    width: 30px;
    padding-right: 10px;
    line-height: 40px;
    text-align: right;
  }
  .box2{
    margin: 0 2%;
    width: 68% !important;
  }
  .box1,.box2{
    float: left;
  }
  .tops{
    margin-top: 0.8rem;
    margin-bottom: 10px;
    width: 100%;
    height: 50px;
    position: fixed;
    z-index: 99999999;
    top:0px;
    /*padding-top: 10px;*/
    padding-left: 10px;
    background: #fff;
    /*border:1px solid red;*/
  }
  .sousuo{
    line-height: 40px;
  }
  /*搜索功能 结束*/

  .atricle{
    position: fixed;
    width: 100%;
    top:16px;
    left: 0;
    padding-top: 10px;
    margin-top:34px;
    padding-bottom: 10px;
    display: flex;
    background: #fff;
    flex-direction: row;
    z-index: 9999;
  }
  .atricle>div{
    width: 100%;
    text-align: center;
    padding-bottom: 3px;
  }
  .atricle>div a{
    display: block;
    width: 100%;
    height: 100%;
  }
  .active{
    color: #66B672;
    border-bottom: 1px solid #66B672;
  }
  .unacticve{
    color: #000;
  }
  /*相关用户*/
  .users{
    padding: 5px 5px 0 5px;
    overflow: hidden;
    margin-bottom: -15px;
  }
  .users .userIn{
    float: left;
    width: 60px;
    height: 60px;
    margin-left: 3%;
    margin-bottom: 20px;
    text-align: center;
  }
  .users div:last-of-type{
    margin-right: 0;
  }
  .users div img{
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }
  .users span{
    display: block;
    text-align: center;
    width: 100%;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /*相关文章*/
  .mainAtricle{
    overflow: hidden;
    margin-top: 5px;
  }
  .mainAtricle>div{
    float: left;
  }
  .user{
    width: 75%;
  }
  .user img{
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  .time{
    float: right;
  }
  .articleContant{
    margin-top: 5px;
    padding-bottom: 5px;
    width: 100%;
    height: 100px;
    overflow: hidden;
    border-bottom: 1px solid #F5F5F5;
  }
  .articleContant .imgs{
    float: left;
    margin-right: 5px;
    width: 40%;
    height: 100%;
  }
  .articleContant img{
    width: 100%;
    height: 100%;
  }
  .articleContant .description{
    float: right;
    height: 100%;
    width:58%;
  }
  .description span:nth-of-type(1),.description span:nth-of-type(2),.description span:nth-of-type(3){
    text-align: left;
    font-size: 1rem;
    height: 35px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap:break-word;
    word-break:break-all;
    margin-bottom: 2px;
  }
</style>
