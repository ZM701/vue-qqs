<template>
  <div>
    <div style="padding-bottom: 10px;" v-if="msgInfo!=null">
      <div class="user">
        <div><img :src="msgInfo.image"/></div>
        <div><span>{{msgInfo.nickname}}</span><span>粉丝{{fansNum}}</span></div>
        <!--<div class="attention">已关注</div>-->
        <!--0=未关注 1=关注-->
        <div class="attentions attention" v-if="total.relation_status == 0" @click="attentionClick(msgInfo.uid)" >关注</div>
        <div class="attentions already" v-if="total.relation_status == 1" @click="attentionClick(msgInfo.uid)" >已关注</div>
      </div>
      <div class="content">
        <div class="content_nav">{{msgInfo.article_title}}</div>
        <div class="content_nav">{{msgInfo.article_sendtime*1000 | formatDate}} 来自{{msgInfo.phone_type}} 浏览数{{msgInfo.article_readnum }}</div>
        <!--对文章的处理-->
        <div v-if="sourceType==0" class="articleHeight">
          <div v-if="msgInfo.article_format==1">
            <div v-for="(item,idex) in article_content" class="content1">
              <span><img :src="'https://nwsapi.nanniwan.com/nws_cms/article/fileDownload.api?name='+item.img"/></span>
              <span>{{item.text}}</span>
            </div>
          </div>
          <div v-if="msgInfo.article_format==0" class="content1">
            <div v-html="article_content" class="imgs"></div>
          </div>
        </div>
        <!--对视频的处理-->
        <div v-if="sourceType==1">
          <video :src="msgInfo.video_url" autoplay id="video"></video>
          <span>{{msgInfo.video_desc}}</span>
        </div>
      </div>
    </div>

    <!--显示相关的评论-->
    <div class="newComment">
      <div class="hot">最新评论</div>
      <div v-if="newComment.length!=0">
        <div v-for="(item,index) in newComment" class="commentList">
          <div class="imgs"><img :src="'https://imgs.nanniwan.com/'+item.image"></div>
          <div class="commentInfo"><span>{{item.nickname}}</span> <span>{{item.comments_info}}</span> <span>{{ item.comments_time*1000 | formatDate1 }}</span></div>
        </div>
      </div>
      <div v-else style="margin-top: 5px;padding-left: 10px;">
        还没有相关评论，赶紧去评论吧！
      </div>
    </div>

    <!--底部信息-->
    <div class="footBanner"  v-if="msgInfo!=null">
      <div class="foot_one" @click="recomment"><i class="glyphicon glyphicon-edit"></i><input placeholder="写评论" readonly/>评论{{msgInfo.article_commentnum}}</div>
      <div class="foot_two" @click="collectionPage(msgInfo.article_id)">收藏{{msgInfo.collectionNum}}</div>
      <div class="foot_three" @click="share">分享{{msgInfo.article_transpondnum}}</div>
    </div>
  </div>
</template>

<script>
//  需要保存的数据    article_id
  import qs from 'qs';
//  import wx from 'weixin-js-sdk';
  import article from "../articleDetail/articleDetail"
  import {formatDate} from '../../../../static/js/common';
  export default {
    props: {
      "articleType":{
        type:Number
      }
    },
    data(){
      return{
        msgInfo:{},  //获取信息
        msg:[],
        article_content:{}, //内容
        article_format:this.$route.params.article_format,   //0是富文本格式的   1是json格式的
        fansNum:null, //粉丝数
        total:{}, //获取所有信息
        article_id:this.$route.params.article_id,   //文章id
        article_ids:this.$route.params.article_ids,   //文章id
        state:null,   //0=未关注 1=关注
        sourceType:this.$route.params.sourceType,  //0文章  1视频
        newComment:[],   //最新评论的相关信息列表
        //查看文章详情埋点参数
        params1:{
          session_id:session_id,
          action:'view',
          end:'wx',
          target:'article',
          content_id:this.$route.params.article_id,
          provider_id:this.$route.params.uid,  //文章作者id
          from:'home'
        },
        //文章详情停留埋点的参数
        params2:{
          session_id:session_id,
          action:'stay',
          end:'wx',
          target:'article',
          content_id:this.$route.params.article_id
        },
        //文章评论埋点参数
        params3:{
          session_id:session_id,
          action:'comment',
          end:'wx',
          target:'article',
          content_id:this.$route.params.article_id
        },
        //已关注埋点参数
        params4:{
          session_id:session_id,
          action:'follow',
          end:'wx',
          target:'publisher',
          content_id:this.$route.params.article_id
        },
        //取消关注埋点参数
        params5:{
          session_id:session_id,
          action:'unfollow',
          end:'wx',
          target:'publisher',
          content_id:this.$route.params.article_id
        },
      }
    },
    components:{
      'v-article':article
    },
    created(){
      this.detail();

      //评论事件
      this.comment();
    },
    mounted(){
      //文章篇幅过短判断是否读完的处理
      var _this = this;
      /*setTimeout(function(){
        var articleHeight = $(".articleHeight").height();
        /!*var video=document.getElementById("video");
         global.totalTime = video.duration;*!/
        if(articleHeight<=window.innerHeight){
          _this.articleEnd()
        }
      },1000)*/
      //对视频是否看完的处理
      /*setTimeout(function () {
       var video=document.getElementById("video");//video标签对象
       video.currentTime;//获取视频当前播放时间
       var durations = video.duration;
       //当前播放时间大于等于50秒即可获得积分
       if(video.currentTime >= durations/2){
       _this.articleEnd()
       }
       },totalTime*1000)*/

      //初始化渲染并传递数据
      setTimeout(function () {
        _this.transmit();
      },500)

      //查看文章详情埋点调用
      this.burialPoint(this.params1);
      //文章详情停留
      setTimeout(function () {
        _this.burialPoint(_this.params2);
      },5000)

    },
    methods:{
      //像父组件传递信息
      transmit(){
        this.$emit('childSay',this.msg);
      },
      //点击跳转到关注
      attentionClick(relationUid){
        // this.$root.eventHub.$emit('childAttention', relationUid);
        this.$http.post('/api/user/update_follow.api', qs.stringify({
          uid:uid,
          relation_touid:relationUid
        })).then((response) => {
          // console.log(response.data)
          this.state=response.data.relation_state;
          if(this.state==1){
            // 1  已关注
            $(".attentions").html("已关注")
            $(".attentions").removeClass("attention")
            $(".attentions").addClass("already");
            // 调用已关注埋点
            this.burialPoint(this.params4);
            //console.log($(".attentions").html());
          }
          if(this.state==0){
            $(".attentions").html("关注")
            $(".attentions").removeClass("already")
            $(".attentions").addClass("attention")
            // 调用取消关注埋点
            this.burialPoint(this.params5);
           // console.log($(".attentions").html());
          }
        });
      },
      detail(){
        this.$http.get("/api/article/article_find.api", {
          params: {
            uid:uid,
            article_id:this.article_id || this.article_ids,
            tran:0,  //tran 是否为转发 0不是,1是
            article_format:1  // article_format 小程序=1 ,后台=0
          }
        }).then(response => {
          this.total = response.data;
          this.msgInfo = response.data.article;
          this.fansNum = response.data.fansNum;
          this.msg = response.data.sameArticle;
         // console.log(this.msgInfo)

          //对富文本内容的处理   解析html
          var str = response.data.article.article_content;
          if(this.article_format==1){
            this.article_content = "["+str+"]";
            this.article_content = JSON.parse(this.article_content);
          }
          if(this.article_format==0){
            //转义&lt;&gt;
            var strs = str.replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">");
            this.article_content = strs;
          }

         // console.log(response.data.article.article_content);
        }, response => {
          console.log("获取信息失败");
          //console.log(response);
        })
      },
      //点击收藏
      collectionPage(article_id){
        var _this = this;
        this.$confirm('确认收藏?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            //调用添加的接口
            this.$http.post("/api/article/collection", qs.stringify({
              uid: uid,
              article_id:article_id,
              status:0   //0=添加 1=取消
            })).then(response => {
              //提示收藏成功
              _this.$message({
                type: 'success',
                message: '收藏成功!'
              });
              this.detail();
            })
          })
          .catch(() => {
          });
      },
      //评论接口
      comment(){
        this.$http.get("/api/article/article_comments.api", {
          params: {
            article_id:this.article_id,
            pageNum:1,
            pageSize:5
          }
        }).then(response => {
          this.newComment = response.data.pageBean.list;
          //console.log(response.data);
        }, response => {
          console.log("获取信息失败");
          console.log(response);
        })
      },
      //点击评论
      recomment(){
        this.$prompt('', '评论', {
          confirmButtonText: '确定',
          type: 'success'
        })
          .then(() => {
            this.$http.get('/api/article/comments_save.api', {
              params: {
                article_id:this.article_id,
                uid:uid,
                comments_info:$(".el-input input").val()
              }
            }).then((response) => {
              this.comment();
              this.detail();
            });
            this.burialPoint(this.params3);  //评论埋点调用
          })
          .catch(() => {

          });
      },
      //点击分享
      share(){
        this.$http.post('/api/article/mark_info', qs.stringify({
          uid:uid,
          article_id:this.article_id,
          from_type:0,
          status:2 // status 0=文章未读完 1=文章读完 2=文章分享转发
        })).then((response) => {
          //this.detail();
        });
        /* wx.config({
         debug: false,
         appId: "wxe615a9a25d9f626e", // 和获取Ticke的必须一样------必填，公众号的唯一标识
         timestamp:1528770763, // 必填，生成签名的时间戳
         nonceStr: "ZBVcWpj3npo0FZId", // 必填，生成签名的随机串
         signature: "7c225b2044a2c3ec40d0a830b3a7580426d5423b",// 必填，签名，见附录1
         //需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
         jsApiList: [
         'onMenuShareAppMessage','onMenuShareTimeline',
         'onMenuShareQQ','onMenuShareQZone'
         ]
         });*/
        //处理验证失败的信息
        /* wx.error(function (res) {
         logUtil.printLog('验证失败返回的信息:',res);
         });*/
//处理验证成功的信息
        /*wx.ready(function () {

         //       alert(window.location.href.split('#')[0]);

         //分享到朋友圈
         wx.onMenuShareTimeline({
         title: "hhh", // 分享标题
         link: "http://test.traineexp.com/#/index", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
         // imgUrl: _this.newDetailObj.thu_image, // 分享图标
         success: function (res) {
         // 用户确认分享后执行的回调函数
         //logUtil.printLog("分享到朋友圈成功返回的信息为:",res);
         //_this.showMsg("分享成功!")
         _this.beforeShare()
         },
         cancel: function (res) {
         // 用户取消分享后执行的回调函数
         logUtil.printLog("取消分享到朋友圈返回的信息为:",res);
         }
         });
         //分享给朋友
         wx.onMenuShareAppMessage({
         title: "hhh", // 分享标题
         desc: "啦啦啦", // 分享描述
         link: "http://test.traineexp.com/#/index", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
         // imgUrl: _this.newDetailObj.thu_image, // 分享图标
         type: '', // 分享类型,music、video或link，不填默认为link
         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
         success: function (res) {
         _this.beforeShare();
         // 用户确认分享后执行的回调函数
         //logUtil.printLog("分享给朋友成功返回的信息为:",res);
         },
         cancel: function (res) {
         // 用户取消分享后执行的回调函数
         logUtil.printLog("取消分享给朋友返回的信息为:",res);
         }
         });
         //分享到QQ
         wx.onMenuShareQQ({
         title: _this.newDetailObj.title, // 分享标题
         desc: _this.desc, // 分享描述
         link: window.location.href.split('#')[0], // 分享链接
         imgUrl: _this.newDetailObj.thu_image, // 分享图标
         success: function (res) {
         // 用户确认分享后执行的回调函数
         logUtil.printLog("分享到QQ好友成功返回的信息为:",res);
         },
         cancel: function (res) {
         // 用户取消分享后执行的回调函数
         logUtil.printLog("取消分享给QQ好友返回的信息为:",res);
         }
         });

         //分享到QQ空间
         wx.onMenuShareQZone({
         title: _this.newDetailObj.title, // 分享标题
         desc: _this.desc, // 分享描述
         link: window.location.href.split('#')[0], // 分享链接
         imgUrl: _this.newDetailObj.thu_image, // 分享图标
         success: function (res) {
         // 用户确认分享后执行的回调函数
         logUtil.printLog("分享到QQ空间成功返回的信息为:",res);
         },
         cancel: function (res) {
         // 用户取消分享后执行的回调函数
         logUtil.printLog("取消分享到QQ空间返回的信息为:",res);
         }
         });
         });*/

      },
    },
    filters: {
      //时间戳的转换
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
        // return formatDate(date, 'yyyy-MM-dd hh:mm');
      },
      formatDate1(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
  }
</script>

<style scoped>
  a,span{
    display: block;
    width: 100%;
    height: 100%;
    color: #000;
    text-align: center;
  }
  .el-input{
    width: 100% !important;
  }
  .navMy{
    width: 100%;
    overflow: hidden;
    margin: 10px;
  }
  .navMy span{
    text-align: left;
    width: auto;
    float: left;
    margin-right: 4px;
  }
  .user{
    overflow: hidden;
    margin: 20px 10px 0px 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
  }
  .user>div{
    float: left;
  }
  .user>div:first-of-type{
    width: 50px;
    height: 50px;
  }
  .user>div:first-of-type img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .user>div:nth-of-type(2){
    width: 30%;
    margin-left: 10px;
    margin-top: 10px;
  }
  .user>div:nth-of-type(2) span{
    text-align: left;
  }
  .user>div.attention{
    margin-top: 5px;
    float: right;
    border: 1px solid red;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: red;
    color: #fff;
    border-radius: 5px;
  }
  .user>div.already{
    margin-top: 5px;
    float: right;
    border: 1px solid #ccc;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #fff;
    color: #ccc;
    border-radius: 5px;
  }
  .content1{
    width: 100%;
    padding: 5px;
  }
  .content1 img{
    width: 100% !important;
  }
  .content1 span{
    text-align: left !important;
    display: inline;
  }
  .content1>div{
    margin: 5px 0px;
  }
  .content1>div:nth-of-type(2){
    margin-bottom: 10px;
  }
  .content_nav{
    padding: 0 5px;
  }
  p,span{
    text-align: left !important;
  }

  .footBanner{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99999;
    background: #fff;
    height: 50px;
    line-height: 50px;
    text-align: center;
    display: flex;
    flex-direction: row;
  }
  .footBanner .foot_three,.footBanner .foot_two{
    width: 150px;
  }
  /*最新评论*/
  .newComment{
    margin-bottom: 10px;
  }
  .hot{
    font-size: 1.5rem;
    padding: 5px;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
  .commentList{
    width: 100%;
    overflow: hidden;
    margin: 5px 5px 10px 5px;
  }
  .commentList .imgs{
    width: 50px;
    height: 50px;
    float: left;
    margin-right: 5px;
  }
  .commentList .commentInfo{
    float: left;
    width: 80%;
  }
  .commentList .commentInfo span{
    text-align: left;
    color: #666;
  }
  .commentList .imgs img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  /*写评论*/
  .footBanner .foot_one{

    text-align: left;
    padding-left: 10px;
    overflow: hidden;
    line-height: 50px;
  }
  .footBanner div:first-of-type i{
    position: absolute;
    left: 5%;
    top:18px;
    z-index: 99;
    float: left;
    vertical-align: middle;
  }
  .footBanner div:first-of-type input{
    display: block;
    float: left;
    background: #fff;
    position: relative;
    width: 50%;
    margin-right: 2px;
    border:1px solid #ccc;
    border-radius: 5px;
    outline: none;
    height: 30px;
    line-height: 30px;
    padding-left: 24px;
    margin-top: 10px;
  }
  video{
    width: 100%;
    object-fit: fill;
  }
  /*最新评论*/
  .newComment{
    margin-bottom: 60px;
  }
  .newComment .commentTitle{
    font-size: 1.5rem;
    padding: 5px;
  }
  .commentList{
    width: 100%;
    overflow: hidden;
    margin: 5px 5px 10px 5px;
  }
  .commentList .imgs{
    width: 50px;
    height: 50px;
    float: left;
    margin-right: 5px;
  }
  .commentList .commentInfo{
    float: left;
    width: 80%;
  }
  .commentList .commentInfo span{
    color: #666;
  }
  .commentList .imgs img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .share{
    margin-bottom: 60px;
  }
  /*热门推荐*/
  .hotRecommend{
    margin-bottom: 60px;
  }
</style>
