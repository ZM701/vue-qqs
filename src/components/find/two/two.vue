<template>
  <div class="two">
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
  .two p{
    text-align: center;
    height: 30px;
  }

</style>
