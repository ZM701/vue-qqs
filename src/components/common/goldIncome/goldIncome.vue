<template>
  <div>
    <div class="navMy">
      <span @click="goback"><i class="	glyphicon glyphicon-chevron-left"></i></span>
      <span>积分收益</span>
    </div>
     <div>
       <!--积分收益，兑换规则-->
       <div class="navBar">
         <div>
           <span>积分收益（个）</span>
           <span class="coinNum">{{ incomeData.integral_now }}</span>
         </div>
         <div>
           <span>兑换规则</span>
           <span class="btn" @click="exchangeGoods">去兑换</span>
         </div>
       </div>
       <!--青青说  商城 -->
       <div class="navTab">
         <span>积分明细</span>
       </div>
       <div class="content">
         <dl v-for="(item,index) in incomeData.integralDetail">
           <dt><span>{{detail}}</span><span>{{item.detail_time*1000 | formatDate}}</span></dt>
           <dd v-if="item.amount<0">{{item.amount}}</dd>
           <dd v-if="item.amount>0">+{{item.amount}}</dd>
         </dl>
         <div class="fotter">系统仅展示最近30天的收益</div>
       </div>
     </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs';
  import {formatDate} from '../../../../static/js/common';
  export default {
    data(){
      return{
        incomeData:{}, //页面初始化数据
        detail:null,
        money:null,  //积分个数
      }
    },
    created(){
      this.incomeInt();
      this.type();
    },
    methods:{
      // 返回到上一层
      goback() {
        this.$router.push({
          path: '/my',
          name: 'my',
        })
      },
      //点击跳转到兑换商品页面
      exchangeGoods(){
        this.$router.push({
          path: '/exchangeGoods',
          name: 'exchangeGoods',
          params: {
            money : this.money
          }
        })
      },
      //积分收入数据渲染
      incomeInt(){
        this.$http.post('/user/integral/get_detail.api', qs.stringify({
          user_token: user_token,
          uuid: uuid,
          unionid:unionid,
          pageNum: 1,
          pageSize: 30,
        })).then((response) => {
          this.incomeData = response.data;
          this.money = response.data.integral_now;
          for(var i=0;i<response.data.integralDetail.length;i++){
            this.type(response.data.integralDetail[i].detail_type)
          }
        });
      },
      //1=签到送积分(加),2=购物送积分(加),3=评价送积分(加),4=积分换购订单取消返回(加),5=购物抵现订单取消返回(加),6=积分换购(减),7=购物抵现(减),8=积分抽奖(减),9=积分兑换优惠券(减)),10=阅读完文章视频,11=分享文章视频,12=评论文章视频
      type(n){
        if(n == 1){
          this.detail="签到"
        }
        if(n == 2){
          this.detail="购物"
        }
        if(n == 3){
          this.detail="评价"
        }
        if(n == 4){
          this.detail="积分换购订单取消"
        }
        if(n == 5){
          this.detail="购物抵现订单取消"
        }
        if(n == 6){
          this.detail="积分换购"
        }
        if(n == 7){
          this.detail="购物抵现"
        }
        if(n == 8){
          this.detail="积分抽奖"
        }
        if(n == 9){
          this.detail="积分兑换优惠券"
        }
        if(n == 10){
          this.detail="阅读完文章视频"
        }
        if(n == 11){
          this.detail="分享文章视频"
        }
        if(n == 12){
          this.detail="评论文章视频"
        }
      },
    },
    filters: {
      //时间戳的转换
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
        // return formatDate(date, 'yyyy-MM-dd hh:mm');
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
    overflow: hidden;
    margin: 10px;
  }
  .navMy span{
    text-align: left;
    width: auto;
    float: left;
    margin-right: 4px;
  }
  .navBar,.navTab{
    display: flex;
    flex-direction: row;
    margin: 10px auto;
    border-bottom: 1px solid #e4e7ed;
  }
  .navBar>div,.navTab>span{
    width: 100%;
    text-align: center;
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .navBar div span{
    height: auto;
    margin-bottom: 10px;
  }
  .navBar div .coinNum{
    font-size: 2rem;
    color: red;
    font-weight: bold;
  }
  .navBar div .btn{
    background: #3a8ee6;
    width: 100px;
    color: #fff;
    border-radius: 20px;
  }
  .navTab{
    padding-bottom: 10px;
  }
  .navTab span:first-of-type{
    border-right: 1px solid #e4e7ed;
  }
  .content dl{
    overflow: hidden;
    margin-bottom: 10px;
    padding: 5px 10px;
    border-bottom: 1px solid #e4e7ed;
  }
  .content dl dt{
    float: left;
    font-weight: normal;
  }
  .content dl dt span{
    text-align: left;
  }
  .content dl dd{
    float: right;
    line-height: 42px;
    color: red;
  }
  .fotter{
    text-align: center;
    margin-bottom: 10px;
  }
</style>
