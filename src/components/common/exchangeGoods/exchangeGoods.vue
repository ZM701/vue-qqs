<template>
<div>
  <div class="exchange_box">
    <pull-to :bottom-load-method="loadMores">
    <div class="navMy">
      <span @click="goback"><i class="glyphicon glyphicon-chevron-left"></i></span>
      <span>兑换商品</span>
    </div>
    <div class="navCoin">
      <div><span>总积分（个）</span><span class="coinNum">{{money}}</span></div>
      <div><span>兑换规则</span></div>
    </div>
    <div>
      <exchange-detail ref="child"></exchange-detail>
    </div>

    <div class="footerBar">
      <span>想要兑换更多的商品，马上做任务赚钱吧</span>
      <span @click="goTask">做任务赚钱</span>
    </div>
    </pull-to>
  </div>
</div>
</template>

<script>
  import exchangeDetail from '../exchangeDetail/exchangeDetail'
  import PullTo from 'vue-pull-to';
    export default {
      components:{
        exchangeDetail,
        PullTo
      },
      data(){
        return{
          money:this.$route.params.money
        }
      },
      methods: {
        //向子组件excahngeDetail发送事件
        loadMores(loaded){
          this.$refs.child.loadMore(loaded);
          loaded('done');
        },
        // 返回到上一层
        goback() {
          this.$router.push({
            path: '/goldIncome',
            name: 'goldIncome',
          })
        },
        //点击跳转到任务
        goTask(){
          this.$router.push({
            path: '/tasks',
            name: 'tasks',
            params: {
            }
          })
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
  .exchange_box{
    width: 100%;
    position: absolute;
    top:0;
    left: 0;
    bottom: 40px;
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
  .navCoin{
    overflow: hidden;
    padding: 10px;
  }
  .navCoin>div:first-of-type{
    float: left;
    width: 80%;
    text-align: center;
  }
  .navCoin>div:last-of-type{
    float: right;
  }
  .navCoin div .coinNum{
    font-size: 2.5rem;
    color: red;
    font-weight: bold;
  }
  .footerBar{
    padding-top: 10px;
    background: #fff;
    /*position: fixed;
    bottom: 0px;*/
    width: 100%;
  }
  .footerBar span:last-of-type{
    width: 200px;
    margin: 8px auto;
    height: 40px;
    line-height: 40px;
    background: #3A8EE6;
    color: #fff;
    border-radius: 20px;
  }
</style>
