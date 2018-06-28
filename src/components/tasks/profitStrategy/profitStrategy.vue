<template>
    <div>
      <div class="navMy">
        <span @click="goback"><i class="	glyphicon glyphicon-chevron-left"></i></span>
        <span>赚钱攻略</span>
      </div>
      <div class="strategyNav">
        <div @click="f1" :class="flage1?'active':''">图文教程</div>
        <div @click="f2" :class="flage2?'active':''">视频教程</div>
      </div>
      <div v-if="flage1" class="box1_strategy">
        <ul v-for="(item,index) in strategy">
          <li @click="changeContent(index)">{{item.title}}<i class="glyphicon glyphicon-chevron-down glyphicon-chevron-up"></i>
            <transition name="fade">
              <ul class="answer" v-show="false">
              　<li>{{item.content}}</li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
      <div v-if="flage2" class="box2_strategy">
        敬请期待
      </div>

    </div>
</template>

<script>
    export default {
      data(){
        return{
          flage1:true,  //图文教程
          flage2:false,   //视频教程
          flageli:false,  //金币是什么
          strategy:null,  //渲染数据
        }
      },
      created(){
        this.strategyInt();
      },
      methods:{
        changeContent(index){
           var display = $("li>ul").eq(index).css("display");
           if(display=="none"){
             $("li>ul").eq(index).slideDown();
             $("li>i").eq(index).removeClass("glyphicon-chevron-down");
             $("li>i").eq(index).addClass("glyphicon-chevron-up");
           }else{
             $("li>ul").eq(index).slideUp();
             $("li>i").eq(index).removeClass("glyphicon-chevron-up");
             $("li>i").eq(index).addClass("glyphicon-chevron-down");
           }
        },
        // 返回到上一层
        goback() {
          this.$router.push({
            path: '/task',
            name: 'task',
          })
        },
        //文章
        f1(){
          this.flage1 = true;
          this.flage2 = false;
        },
        //视频
        f2(){
          this.flage1 = false;
          this.flage2 = true;
        },
        //页面请求
        strategyInt(){
          this.$http.post('/user/integral/findStrategy').then((response) => {
            this.strategy = response.data.strategy;
            //console.log(response.data)
          });
        }
      }
    }
</script>

<style scoped>
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
  .strategyNav{
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .strategyNav div{
    width: 100%;
    text-align: center;
    padding-bottom: 10px;
  }
  .box1_strategy{
    width: 100%;
  }
  .box1_strategy>ul>li{
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #e4e7ed;
    position: relative;
  }
  .box1_strategy>ul>li i{
    position: absolute;
    right: 5px;
    top:10px;
    color: #ccc;
  }
  .answer{
    padding: 10px;
  }
  .answer li{
    list-style: none;
  }
  .active{
    color: #66B672;
    border-bottom: 1px solid #66B672;
  }
  /*动画效果*/
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>

