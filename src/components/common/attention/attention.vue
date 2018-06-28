<template>
    <div>
      <div class="navMy">
        <span @click="goback"><i class="glyphicon glyphicon-chevron-left"></i></span>
        <span v-show="type == 1">关注</span>
        <span v-show="type == 2">粉丝</span>
      </div>
      <div class="pull">
        <pull-to :bottom-load-method="loadMore">
          <div>
            <attention-fans :info="info" :type="type" :fenInfo="fenInfo"></attention-fans>
          </div>
        </pull-to>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import PullTo from 'vue-pull-to';
  import attentionFans from '../attentionFans/attentionFans';

  export default {
      components: {
        PullTo,
        attentionFans
      },
      data(){
        return{
          info:[],  //关注数据
          type:null,  //
          fenInfo:[],   //粉丝数据
          pageNum:1,  //
          pageNums:1 ,  //
        }
      },
      methods: {
        //返回上一页
        goback() {
          this.$router.push({
            path: '/my',
            name: 'my',
          })
        },
        //关注请求
        attention(){
          this.$http.get("/api/user/get_follows.api", {
            params: {
              uid:uid,
              pageNum:this.pageNum,
              pageSize:10
            }
          }).then(response => {
            var temp = response.data.follows;
            this.info =  this.info.concat(temp);
            /*console.log("关注:")
            console.log(this.info);*/
          }, response => {
            console.log("获取信息失败");
            console.log(response);
          })
        },
        //粉丝请求
        fans(){
          this.$http.get("/api/user/get_followers.api", {
            params: {
              relation_touid:uid,
              pageNum:this.pageNums,
              pageSize:10
            }
          }).then(response => {
            var temp = response.data.followers;
            this.fenInfo =  this.fenInfo.concat(temp);
          }, response => {
            console.log("获取信息失败");
            console.log(response);
          })
        },
        loadMore(loaded) {
          //console.log(1)
          setTimeout(() => {
            if(this.type==1){
              this.pageNum = this.pageNum+1;
              this.attention();
            }
            if(this.type==2){
              this.pageNums = this.pageNums+1;
              this.fans();
            }
            loaded('done');
          }, 500);
        },
      },
      created(){
        this.type = this.$route.params.type;
        this.attention();   //关注
        this.fans();
      }
    }
</script>

<style scoped>
  .navMy{
    width: 100%;
    overflow: hidden;
    position: absolute;
    top:0px;
    z-index: 999;
    height: 30px;
    line-height: 30px;
    background: #fff;
  }
  .navMy span{
    text-align: left;
    width: auto;
    float: left;
    margin-right: 4px;
  }
  .pull{
    position: absolute;
    top:10px;
    bottom: 20px;
    width: 100%;
    margin-top: 30px;
    z-index: -111;
  }
</style>
