<template>
    <div>
      <div class="navMy">
        <span @click="goback"><i class="	glyphicon glyphicon-chevron-left"></i></span>
        <span>收藏</span>
      </div>
      <div class="collentionNav">
        <div @click="f1" :class="flage1?'active':''">文章</div>
        <div @click="f2" :class="flage2?'active':''">视频</div>
      </div>

      <div v-if="flage1" class="box1_collection">
        <pull-to :bottom-load-method="loadMore">
          <v-article :msg="msg" :icon="icon" @childSay="listenToF3" @childCollectionSay="listenToCollection"></v-article>
        </pull-to>
      </div>
      <div v-if="flage2" class="box2_collection">
        <pull-to :bottom-load-method="loadMore">
          <v-article :msg="msg" :icon="icon" @childSay="listenToF3" @childCollectionSay="listenToCollection"></v-article>
        </pull-to>
      </div>

    </div>
</template>

<script>
  import qs from 'qs';
  import PullTo from 'vue-pull-to';
  import article from "../articleDetail/articleDetail"
    export default {
      data(){
        return{
          msg:[],
          flage1:true,  //文章
          flage2:false,   //视频
          status:0,   // 0文章  1视频
          icon:true,  //是否存在取消收藏的按钮
          pageNum:1
        }
      },
      components:{
        'v-article':article,
        PullTo
      },
      created(){
        this.information();
      },
        methods:{
          //取消收藏的显示隐藏
          listenToF3(index){
            var display = $(".cancleCollection").eq(index).css("display");
            if(display=="none"){
              $(".cancleCollection").eq(index).css("display","block")
            }else{
              $(".cancleCollection").eq(index).css("display","none")
            }
          },
          //点击取消收藏
          listenToCollection(index,article_id){
            var _this = this;
            this.$confirm('确认取消收藏?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                // event.preventDefault();
                this.listenToF3(index);
                //调用删除的接口
                this.$http.post("/api/article/collection", qs.stringify({
                  uid: uid,
                  article_id:article_id,
                  status:1   //0=添加 1=取消
                })).then(response => {
                    console.log(2222)
                  //提示取消成功
                  _this.$message({
                    type: 'success',
                    message: '取消成功!'
                  });
                  //刷新页面
                  _this.msg=[]; //清空存储的信息
                  _this.information();  //重新刷新页面
                })
              })
              .catch(() => {
                this.listenToF3(index);
              });
          },
          information(){
            var _this = this;
            this.$http.post('/api/article/collection_list', qs.stringify({
              uid: uid,
              pageNum: this.pageNum,
              pageSize: 5,
              status:this.status   // 3:activity相关活动   2:article 相关文章  1:user相关用户  0:所有
            })).then((response) => {
                var temp = response.data.list;
                this.msg = this.msg.concat(temp);
              // console.log(this.msg)
            });
          },
          //下拉加载
          loadMore(loaded) {
            setTimeout(() => {
              if(this.flage1){
                this.pageNum = this.pageNum+1;
              }
              if(this.flage2){
                this.pageNum = this.pageNum+1;
              }
              this.information();
              loaded('done');
            }, 500);
          },
          //返回
          goback() {
            this.$router.push({
              path: '/my',
              name: 'my',
            })
          },
          //文章
          f1(){
            this.flage1 = true;
            this.flage2 = false;
            this.status = 0;
            this.pageNum = 1;
            this.msg = [];
            this.information();
          },
          //视频
          f2(){
            this.flage1 = false;
            this.flage2 = true;
            this.status = 1;
            this.pageNum = 1;
            this.msg = [];
            this.information();
          },
        }
    }
</script>

<style scoped>
  .box1_collection,.box2_collection{
    width: 100%;
    bottom: 20px;
    top:80px;
    position: absolute;
    z-index: -99;
  }
  .navMy{
    width: 100%;
    overflow: hidden;
    padding: 10px;
    background: #fff;
  }
  .navMy span{
    text-align: left;
    width: auto;
    float: left;
    margin-right: 4px;
  }
  .collentionNav{
    background: #fff;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }
  .collentionNav div{
    width: 100%;
    text-align: center;
    padding-bottom: 10px;
  }
  .active{
    color: #66B672;
    border-bottom: 1px solid #66B672;
  }
 /* .unacticve{
    color: #000;
    border:none;
  }*/
</style>
