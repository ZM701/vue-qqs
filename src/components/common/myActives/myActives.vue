<template>
    <div>
      <div class="navMy">
        <span @click="goback"><i class="	glyphicon glyphicon-chevron-left"></i></span>
        <span>参与活动</span>
      </div>
      <!--参与活动-------------------------------------------------------------->
       <div class="joinActivities">
         <pull-to :bottom-load-method="loadMore">
         <div class="myJoin">
           <!--state :1 我参与的      state :2   我投票的活动-->
           <div class="changeTab">
             <span @click="f1" :class="flage1?'active':'unacticve'">我参与的</span>
             <span @click="f2" :class="flage2?'active':'unacticve'">我投票的</span>
           </div>
           <div class="change" v-show="flage1" v-for="(item,index) in myActivity">
             <div class="imgs"><img :src="item.goods_banner"/></div>
             <div class="titles">{{item.title}}</div>
             <div class="time">{{item.start_time*1000 | formatDate}} &nbsp;参与人数{{item.activityNum}}</div>
           </div>
           <div class="change" v-show="flage2" v-for="(item,index) in activity">
             <div class="imgs"><img :src="item.goods_banner"/></div>
             <div class="titles">{{item.title}}</div>
             <div class="time">{{item.start_time*1000 | formatDate}} &nbsp;参与人数{{item.activityNum}}</div>
           </div>
         </div>
         </pull-to>
       </div>

    </div>
</template>

<script type="text/ecmascript-6">
  import qs from "qs";
  import PullTo from 'vue-pull-to';
  import {formatDate} from '../../../../static/js/common';
    export default {
      components:{
        PullTo
      },
      data(){
        return{
          flage1:true,  //我参与的
          flage2:false,   //我投票的
          myActivity:[],
          activity:[],
          pageNum:1,
          status:1,   // 1参与的   2投票的
        }
      },
      methods:{
        //下拉加载
        loadMore(loaded) {
          setTimeout(() => {
            this.pageNum = this.pageNum+1;
            this.information();
            loaded('done');
          }, 500);
        },
        //返回
          goback() {
            this.$router.push({
              path: '/my',
              name: 'my',
            })
          },
        //我参与的
        f1(){
          this.flage1 = true;
          this.flage2 = false;
          this.status = 1;
          this.pageNum = 1;
          this.myActivity = [];
          this.activity = [];
          this.information();
        },
        //我投票的
        f2(){
          this.flage1 = false;
          this.flage2 = true;
          this.status = 2;
          this.pageNum = 1;
          this.activity = [];
          this.myActivity = [];
          this.information();
        },
        information(){
          var _this = this;
          this.$http.post('/api/article/mine', qs.stringify({
            uid: uid,
            pageNum: this.pageNum,
            pageSize: 8,
            status:this.status,   // 1活动
          })).then((response) => {
            var temp1 = response.data.myActivity;
            var temp2 = response.data.activity;
            if(temp1!=undefined){
              _this.myActivity = _this.myActivity.concat(temp1);
            }
            if(temp2!=undefined){
              _this.activity = _this.activity.concat(temp2);
            }
          });
        },
      },
      created(){
        this.information()
      },
      filters: {
        formatDate(time) {
          var date = new Date(time);
          // return formatDate(date, 'yyyy-MM-dd hh:mm');
          return formatDate(date, 'MM-dd hh:mm');
        }
      }
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
  .navMy{
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 10px;
    background: #fff;
  }
  .navMy span{
    text-align: left;
    width: auto;
    float: left;
    margin-right: 4px;
  }
  .active{
    color: #66B672;
    border-bottom: 1px solid #66B672;
  }
  .unacticve{
    color: #000;
    border:none;
  }
  /*参与活动*/
  .changeTab{
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }
  .changeTab span{
    width: 100%;
    line-height: 30px;
  }
  .joinActivities{
    width: 100%;
    position: absolute;
    top:35px;
    bottom: 20px;
    padding: 5px;
    z-index: -99;
  }
  .joinActivities .myJoin{
    overflow: hidden;
    margin-bottom: 10px;
  }
  .joinActivities .myJoin .change{
    font-size: 1rem;
    float: left;
    width: 49%;
    margin-right: 5px;
    margin-bottom: 10px;
  }
  .change .titles{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-wrap:break-word;
    word-break:break-all;
    margin-bottom: 2px;
    margin-top: 3px;
  }
  .joinActivities .myJoin .change:nth-of-type(2n+1){
    margin-right: 0px;
    padding-right: 0;
  }
  .joinActivities .myJoin .imgs{
    width: 100%;
    height: 100px;
  }
  .joinActivities .myJoin .imgs img{
    width: 100%;
    height: 100%;
  }
</style>
