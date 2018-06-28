<template>
    <div>
      <div class="userinfo">
        <!--关注页面-->
        <ul v-if="type==1">
          <li v-for="(item,index) in info">
            <span class="box1" v-if="item.image.indexOf('upload')!=0">
              <img :src="item.image">
            </span>
            <span class="box1" v-if="item.image.indexOf('upload')==0">
              <img :src="'https://imgs.nanniwan.com/'+item.image">
            </span>
            <span class="box2">
              <span>{{item.nickname}}</span>
              <span>{{item.followernum}}万个粉丝&nbsp;  {{item.articlenum}}篇&nbsp; 文章</span>
            </span>
            <!--"user_state": 1   0==没关注   1=关注-->
            <span class="box3" v-if="item.user_state == 0" @click="attentionClick(index,item.uid)" >关注</span>
            <span class="box3 already" v-if="item.user_state == 1" @click="attentionClick(index,item.uid)" >已关注</span>
          </li>
        </ul>
        <!--粉丝页面-->
        <ul v-if="type==2">
          <li v-for="(item,index) in fenInfo">
            <span class="box1" v-if="item.image.indexOf('upload')!=0">
              <img :src="item.image">
            </span>
            <span class="box1" v-if="item.image.indexOf('upload')==0">
              <img :src="'https://imgs.nanniwan.com/'+item.image">
            </span>
            <span class="box2">
              <span>{{item.nickname}}</span>
              <span>{{item.followernum}}万个粉丝&nbsp;  {{item.articlenum}}篇&nbsp; 文章</span>
            </span>
            <!--"user_state": 1   0==没关注   1=关注-->
            <span class="box3" v-if="item.user_state == 0" @click="attentionClick(index,item.uid)" >关注</span>
            <span class="box3 already" v-if="item.user_state == 1" @click="attentionClick(index,item.uid)">已关注</span>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import qs from 'qs';
    export default {
      props:{
        "info":{
          type:Array
        },
        "type":{
          type:Number
        },
        "fenInfo":{
          type:Array
        }
      },
      data(){
        return{
          // imgUrl:"https://imgs.nanniwan.com/",
        }
      },
      created(){
     },
      methods:{
        attentionClick(index,relationUid){
          //console.log("id:"+relationUid)
          this.$http.post('/api/user/update_follow.api', qs.stringify({
            uid:uid,
            relation_touid:relationUid
          })).then((response) => {
            this.relation_state=response.data.relation_state;
            if(this.relation_state==1){
              // 1  已关注
               $(".box3").eq(index).html("已关注")
               $(".box3").eq(index).removeClass("cancle")
               $(".box3").eq(index).addClass("already")
            }
            if(this.relation_state==0){
               $(".box3").eq(index).html("关注")
               $(".box3").eq(index).removeClass("already")
               $(".box3").eq(index).addClass("cancle")
            }
          });
        },
      }
    }
</script>

<style scoped>
  .userinfo li{
    list-style: none;
    display:flex;
    padding: 10px;
    border-bottom: 1px solid #e4e7ed;
  }
  .userinfo .box1,.userinfo .box2,.userinfo .box3{
    width: 100%;
    margin-right: 10px;
  }
  .userinfo .box1{
    width: 50px;
    height: 50px;
  }
  .userinfo .box1 img{
    width: 50px;
    height: 50px;
  }
  .userinfo .box2{
    width: 58%;
  }
  .userinfo .box2 span{
    text-align: left;
    margin-bottom: 4px;
  }
  .userinfo .box3{
    float: right;
    margin-right:0;
    border:1px solid red;
    width: 50px;
    height: 30px;
    line-height: 30px;
    margin-top: 5px;
    border-radius: 5px;
  }
  .userinfo .already{
    color: #D4D4D4;
    border: 1px solid #D4D4D4;
  }
  .userinfo .cancle{
    color: #000;
    border:1px solid red;
  }
</style>
