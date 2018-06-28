<template>
  <div>
    <div v-for="(item,index) in msg">
      <div v-if="item.type == 0 && item.imgSrc.length>1" class="panel" >
        <div @click.stop="articlClick(item.article_id,item.article_format,item.type,item.uid)">
          <div class="panelTitle">{{item.article_title}}</div>
          <div class="sp1">
            <div class="img_con" v-for="(imgs,index) in item.imgSrc">
              <img :src="imgs" class="small"/>
            </div>
          </div>
          <div style="clear: both;"></div>
        </div>
        <div class="user_info">
          <div class='nick_img'>
            <img class="user_img" :src='item.image'/>
            <div class="nickname">{{item.nickname}}</div>
          </div>
          <div class='related'>
            <div class=""> <span class='iconfont icon-conment lightGrey'></span>评论 {{item.article_commentnum}}</div>
            <div class=""> <span class='iconfont icon-turn lightGrey'></span>转发 {{item.article_transpondnum}}</div>
          </div>
          <!--收藏按钮-->
          <div v-if="icon" class="collection" @click.stop="f3(index)">
            <div class="icon" ><span class="glyphicon glyphicon-tasks"></span></div>
          </div>
          <div class="cancleCollection" @click.stop="cancleCollection(index,item.article_id)">取消收藏</div>
        </div>
      </div>

      <div v-if="item.type == 0 && item.imgSrc.length<=1" class='pane2'>
        <div @click.stop="articlClick(item.article_id,item.article_format,item.type,item.uid)">
          <div class='pane2_box'>
            <div class="panelTitle">{{item.article_title}}</div>
            <div class="img_con">
              <img :src="item.image" class="big"/>
            </div>
          </div>
        </div>
        <div class="user_info">
          <div class='nick_img'>
            <img class="user_img" :src='item.image'/>
            <div class="nickname">{{item.nickname}}</div>
          </div>
          <div class='related'>
            <div> <span class='iconfont icon-conment lightGrey'></span>评论 {{item.article_commentnum}}</div>
            <div> <span class='iconfont icon-turn lightGrey'></span>转发 {{item.article_transpondnum}}</div>
          </div>
          <!--收藏按钮-->
          <div v-if="icon" class="collection" @click.stop="f3(index)">
            <div class="icon"><span class="glyphicon glyphicon-tasks"></span></div>
          </div>
          <div class="cancleCollection" @click.stop="cancleCollection(index,item.article_id)">取消收藏</div>
        </div>
      </div>

      <div class="pane3"  v-if="item.type == 1">
        <div @click.stop="articlClick(item.article_id,null,item.type,item.uid)">
          <div class="panelTitle">{{item.article_title}}</div>
          <div class="img_con">
            <div class="cover"><img :src="item.article_cover" class="video_cover"/><img class="playBtn" src='../../../../static/images/play.png'/></div>
          </div>
        </div>
        <div class="user_info">
          <div class='nick_img'>
            <img class="user_img" :src='item.image'/>
            <div class="nickname">{{item.nickname}}</div>
          </div>
          <div class='related'>
            <div class=""> <span class='iconfont icon-conment lightGrey'></span>评论 {{item.article_commentnum}}</div>
            <div class=""> <span class='iconfont icon-turn lightGrey'></span>转发 {{item.article_transpondnum}}</div>
          </div>
          <!--收藏按钮-->
          <div v-if="icon" class="collection" @click.stop="f3(index)">
            <div class="icon"><span class="glyphicon glyphicon-tasks"></span></div>
          </div>
          <div class="cancleCollection" @click.stop="cancleCollection(index,item.article_id)">取消收藏</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs';
  export default {
    props: {
      "msg":{
        type:Array
      },
      "icon":{
        type:Boolean
      },
      "articleType":{
        type:Number
      }
    },
    data(){
      return{
      }
    },
    mounted(){
      //this.shortArticle()
    },
    methods:{
      //取消收藏的显示隐藏   向collection发送事件
      f3(index){
        this.$emit('childSay',index);
      },
      //点击取消收藏    向collection发送事件
      cancleCollection(index,article_id){
        this.$emit('childCollectionSay',index,article_id);
      },
      //点击跳转到详情页传递相关的参数  <!--articleType==11   不显示热门推荐，值不同的时候，跳转的路由不同-->
      articlClick(article_id,article_format,sourceType,uid){
        if(this.articleType==11){
          this.$router.push({
            name: 'beforeDescription',
            params: {
              article_id: article_id,
              article_format:article_format,
              sourceType:sourceType,
              uid:uid
            }
          })
        }else{
          this.$router.push({
            name: 'articleDescription',
            params: {
              article_id: article_id,
              article_format:article_format,
              sourceType:sourceType,
              uid:uid
            }
          })
        }
      },
      //文章过长判断是否读完的处理
      scroll() {
        window.onscroll = () => {
          //变量scrollTop是滚动条滚动时，距离顶部的距离
          var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
          //变量windowHeight是可视区的高度
          var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
          //变量scrollHeight是滚动条的总高度
          var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;

//            console.log("scrollTop:"+scrollTop)
//            console.log("windowHeight:"+windowHeight)
//            console.log("scrollHeight:"+scrollHeight)

          //滚动条到底部的条件
          if(scrollTop!=0){
//              if(scrollTop+windowHeight==scrollHeight){
            if(scrollHeight-scrollTop-windowHeight<=20){
              //调用文章读完的接口
              this.articleEnd();
              //写后台加载数据的函数
              /*this.$confirm('阅读完成', '提示', {
               confirmButtonText: '确定',
               type: 'success'
               }).then(() => {
               //调用文章读完的接口
               this.articleEnd();
               })*/
            }
          }
        }

      },
      //文章读完
      articleEnd(){
//            console.log(this.$route.params.article_id)
        var _this = this;
        _this.$http.post('/api/article/mark_info', qs.stringify({
          uid:uid,
          article_id:this.$route.params.article_id,
          from_type:0,
          status:1 // status 0=文章未读完 1=文章读完 2=文章分享转发
        })).then((response) => {
          console.log(response.data)
        });
      },
    },
    watch: {
      // 监听路由的变化 如果路由有变化，会再次执行该方法
      '$route' (to,from) {
        //console.log(this.$route.path)
        //调用滚动事件
        if(this.$route.path.indexOf("articleDescription")!=-1){
          this.scroll();
          // this.shortArticle();
        }
        if(this.$route.path.indexOf("beforeDescription")!=-1){
          this.scroll();
          // this.shortArticle();
        }
      },
    }
  }
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .panel,.pane2,.pane3{
    padding: 5px;
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
  }
  .panelTitle{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap:break-word;
    word-break:break-all;
    margin-bottom: 5px;
    text-align: left;
  }
  .panel .img_con{
    overflow: hidden;
    width: 32%;
    height: 100px;
    margin-right: 4px;
    float: left;
  }
  .panel .img_con:last-of-type{
    margin-right: 0;
  }
  .panel .img_con img{
    overflow: hidden;
    display: block;
    float: left;
    /*width: 100%;*/
    height: 100px;
  }
  .user_info{
    margin-top: 10px;
    height: 20px;
    position: relative;
  }
  .user_info .nick_img{
    overflow: hidden;
    float: left;
    width: 50%;
  }
  .user_info .related{
    float: left;
    overflow: hidden;
  }
  .user_info .nick_img img{
    float: left;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 2px;
  }
  .user_info .nick_img .nickname{
    float: left;
    width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .user_info .related>div{
    float: left;
    margin-right: 5px;
  }
  .pane2_box{
    overflow: hidden;
  }
  .pane2_box>div{
    float: left;
  }
  .pane2_box .panelTitle{
    text-align: left;
    width: 65%;
    margin-right: 5px;
  }
  .pane2_box .img_con{
    width: 32%;
    height: 100px;
  }
  .pane2_box .img_con img{
    width: 100%;
    height: 100%;
  }
  .sp1{
    overflow:hidden;
    height: 100px;
  }
  /*视频样式*/
  .pane3 .img_con{
    position: relative;
    width: 100%;
    height: 150px;
  }
  .pane3 .img_con .video_cover{
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
  }
  .pane3 .img_con .playBtn{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50px;
    height: 50px;
    margin-left: -25px;
    margin-top: -25px;
  }
  .pane3 .img_con img{
    width: 32%;
    height: 100px;
    margin-right: 5px;
  }
  /*收藏按钮*/
  .collection{
    float: right;
    margin-right: 5px;
  }
  /*取消收藏*/
  .cancleCollection{
    text-align: center;
    background: #fff;
    width: 100px;
    height: 30px;
    line-height: 30px;
    position: absolute;
    right: 5px;top:20px;
    border-radius: 2px;
    box-shadow: 0px 0px 8px #ccc;
    border-right: 1px solid #e4e7ed;
    display: none;
  }
  .content1 img{
    width: 100% !important;
  }
  .content1 span{
    text-align: left !important;
    display: inline;
  }
</style>

