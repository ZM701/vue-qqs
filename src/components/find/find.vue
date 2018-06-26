<template>
    <div>
      <v-nav></v-nav>
      <v-swiper></v-swiper>
    </div>
</template>

<script type="text/ecmascript-6">
  import nav from './nav/nav.vue';
  import swiper from './swiper/swiper.vue';
  export default {
    data(){
      return {}
    },
    components: {
      'v-nav': nav,
      'v-swiper': swiper
    },
    mounted(){
    },
    methods: {},
    watch: {}
  }
</script>

<style scoped>
</style>
