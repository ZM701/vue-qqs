<template>
  <div class="two">
    <div class="swipe-wrapper">
      <mt-swipe :auto="3000" ref="swipeWrapper">
        <mt-swipe-item class="swip-item-1 item" v-for="(item,index) in banner" :key="index"><img :src="item.image"/></mt-swipe-item>
      </mt-swipe>
    </div>
    <v-article :msg="msg"></v-article>
  </div>
</template>

<script type="text/ecmascript-6">
  import article from "../../common/articleDetail/articleDetail.vue"
  export default {
    props: {
      "msg":{
        type:Array
      },
      "banner":{
        type:Array
      },
    },
    data() {
      return {
      }
    },
    components: {
      'v-article':article
    },
    mounted() {
    },
    methods: {
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

</style>
