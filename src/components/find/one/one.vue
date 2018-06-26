<template>
  <div class="one">
    <div>
      <div class="users">
        <div v-for="(item,index) in userInfo">
          <img :src="item.image"/>
          <span>{{item.nickname}}</span>
        </div>
      </div>
    </div>
    <v-article :msg="msg"></v-article>
  </div>
</template>

<script type="text/ecmascript-6">
  import article from "../../common/articleDetail/articleDetail.vue"
  export default {
    props: {
      "userInfo":{
        type:Array
      },
      "msg":{
        type:Array
      },
    },
    components: {
        'v-article':article
    },
    mounted(){
//        console.log()
    }
  }
</script>

<style scoped>
  .users{
    padding: 5px 5px 0 5px;
    display: flex;
    flex-direction: row;
    height: 95px;
    margin-bottom: -15px;
  }
  .users>div{
    width: 100%;
    text-align: center;
    height: 40px;
    border-radius: 50%;
  }
  .users div:last-of-type{
    margin-right: 0;
  }
  .users div img{
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
  span{
    display: block;
    text-align: center;
    width: 40px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    margin: 0 auto;
  }

</style>
