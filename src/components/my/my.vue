<template>
    <div>
      <div class="navMy">
        <span @click="goback"><i class="glyphicon glyphicon-chevron-left"></i></span>
        <span>我的</span>
      </div>
      <div class="userInfo">
        <div class="userImage"><img :src="infoUser.image"></div>
        <div class="userName">{{infoUser.nickname}}</div>
        <ul>
          <li @click="attention"><span>{{infoUser.followNum}}</span><span>关注</span></li>
          <li @click="fans"><span>{{infoUser.fansNum}}</span><span>粉丝</span></li>
          <li @click="collection"><span>{{infoUser.collectionNum}}</span><span>收藏</span></li>
        </ul>
      </div>
      <div class="contentTitle">
        <ul>
          <li><router-link to="/task">积分攻略宣传图点击跳转到任务页面</router-link></li>
          <li><router-link to="/goldIncome"><span>积分收益</span><span>{{info.integral_now}}</span></router-link></li>
          <li><router-link to="/myArticle"><span>我的文章</span><span><i class="	glyphicon glyphicon-chevron-right"></i></span></router-link></li>
          <li><router-link to="/myActives"><span>参与活动</span><span><i class="	glyphicon glyphicon-chevron-right"></i></span></router-link></li>
        </ul>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs';
    export default {
        data(){
          return{
            flage1:true,  //全部文章
            flage2:false,   //参与活动
            flage3:false,   // 删除或再次编辑
            status:0,   // 0文章  1活动
            info:{},  //数据渲染
            infoUser:{},  //用户信息
            type:null,
          }
        },
      methods:{
          //跳转到关注页面
          attention(){
            this.type = 1;
            this.$router.push({
              path: '/attention',
              name: 'attention',
              params: {
                type:this.type,
              }
            })
          },
        //跳转到粉丝页面
        fans(){
          this.type = 2;
          this.$router.push({
            path: '/attention',
            name: 'attention',
            params: {
              type:this.type,
            }
          })
        },
        //跳转到收藏页面
        collection(){
          this.$router.push({
            path: '/collection',
            name: 'collection',
          })
        },
        //返回上一页
        goback() {
          this.$router.push({
            path: '/find',
            name: 'find',
          })
        },
        information(){
          var _this = this;
          this.$http.post('/api/article/mine', qs.stringify({
            uid: uid,
            pageNum: 1,
            pageSize: 5,
            status:this.status   // 0文章  1活动
          })).then((response) => {
            _this.info = response.data;
            this.infoUser = response.data.user;
            //console.log(_this.info.integral_now)
          });
        },
      },
      created(){
        this.information();
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
  .userInfo{
    text-align: center;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 10px;
  }
  .userInfo .userImage{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 10px auto;
  }
  .userInfo .userImage img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .userInfo ul{
    overflow: hidden;
    margin: 10px;
  }
  .userInfo ul li{
    list-style: none;
    float: left;
    width: 33%;
    text-align: center;
  }
  .contentTitle ul li{
    list-style: none;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e4e7ed;
  }
  .contentTitle ul li span{
    width: auto;
    float: left;
  }
  .contentTitle ul li span:last-of-type{
    float: right;
  }
</style>

