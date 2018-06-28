<template>
  <div>
    <div class="voteBox">
      <pull-to :bottom-load-method="loadMore">
        <div class="swipe-wrapper">
          <mt-swipe :auto="3000" ref="swipeWrapper">
            <mt-swipe-item class="swip-item-1 item"><img src="../../../static/images/p1.jpg"/></mt-swipe-item>
            <mt-swipe-item class="swip-item-1 item"><img src="../../../static/images/p2.jpg"/></mt-swipe-item>
          </mt-swipe>
        </div>
        <!--投票活动-->
        <div class="vote">
          <div class="titles">投票活动</div>
          <!--<div class="voteBox">-->
          <!--<pull-to :bottom-load-method="loadMore">-->
          <div>
            <dl v-for="(item,index) in activeList">
              <dd class="titles">{{item.title}}</dd>
              <dd class="time"><i class="glyphicon glyphicon-time"></i>{{ item.start_time }}~{{ item.end_time }}</dd>
              <dt @click="loopVote"><img :src="item.goods_banner"/></dt>
            </dl>
          </div>
          <!--</pull-to>-->
          <!--</div>-->
        </div>
      </pull-to>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs';
  import PullTo from 'vue-pull-to';
  export default {
    route: {
      canReuse: false,
    },
    components:{
      PullTo
    },
    data(){
      return{
        activeList:[],  //活动列表数据
        page:1
      }
    },
    methods:{
      //跳转到投票首页
      loopVote(){
        window.location = 'http://wechat.nanniwan.com/?vote_id=221&c=vote&a=index';
      },
      //上拉加载更多
      loadMore(loaded) {
        setTimeout(() => {
          this.page = this.page+1;
          this.info();
          loaded('done');
        }, 500);
      },
      //获取数据列表
      info(){
        this.$http.post('/vote/vote_list.api', qs.stringify({
          xcx: "nnw",
          uid: uid,
          page: this.page
        })).then((response) => {
          var temp = response.data.data;
          this.activeList = this.activeList.concat(temp)
        });
      }
    },
    created(){
      this.info()
    }
  }
</script>

<style scoped>
  /*swiper开始*/
  .swipe-wrapper{
    width: 100%;
    height: 150px;
  }
  .swip-item-1{
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .item img{
    width: 100%;
    max-width: 100%;
  }
  /*投票活动*/
  .vote{
    margin-bottom: 50px;
    /*position: relative;*/
    height: 100%;
  }
  .voteBox{
    /*background: #fff;*/
    width: 100%;
    position: absolute;
    top:0;
    /*height: 500px;*/
    /*top:185px;*/
    bottom: 50px;
    /*z-index: -99;*/
  }
  .vote div.titles{
    background: rgba(228,231,237,0.5);
    /*background: #e4e7ed;*/
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
  }
  .vote dl dd.titles{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .vote dl dd.time{
    color: #8c939d;
  }
  .vote dl dd.time i{
    margin: 0 5px;
    font-weight: normal;
    top:2px;
  }
  .vote dl{
    padding: 5px;
    margin-bottom: 0px;
  }
  .vote dl dt{
    width: 100%;
    height: 130px;
  }
  .vote dl dt img{
    width: 100%;
    height: 100%;
  }

</style>
