<template>
    <div>
      <v-description @childSay="listenTo" :articleType="articleType"></v-description>
      <!--热门推荐-->
      <div class="hotRecommend">
        <div class="hot">热门推荐</div>
        <v-article :msg="msg" :articleType="articleType"></v-article>
      </div>

    </div>
</template>

<script>
  import article from "../articleDetail/articleDetail"
  import description from "../beforeDescription/beforeDescription"
    export default {
      data(){
        return{
          msg:[],
          articleType:11,   // 传递给子组件让其判断是否显示热门推荐
        }
      },
      components:{
        'v-article':article,
        'v-description':description,
      },
      created(){

      },
      mounted(){


      },
      methods:{
        listenTo(msg){
            this.msg = msg;
        },

      }
    }
</script>

<style scoped>
  /*热门推荐*/
  .hotRecommend{
    margin-bottom: 60px;
  }
</style>
