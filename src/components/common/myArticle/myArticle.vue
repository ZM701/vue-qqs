<template>
  <div>
    <div class="navMy">
      <span @click="goback"><i class="	glyphicon glyphicon-chevron-left"></i></span>
      <span>我的文章</span>
    </div>
    <!--全部文章------------------------------------------------>
    <div class="total">
      <pull-to :bottom-load-method="loadMore">
        <div class="totalArticle"  v-for="(item,index) in info">
          <div class="edit">
            <!--article_status  0=草稿          article_authority  0=公开-->
            <span v-show="item.article_status==0">草稿</span>
            <span v-show="item.article_status==1">公开</span>
            <span>{{item.article_sendtime*1000 | formatDate}}&nbsp;&nbsp;阅读量{{item.article_readnum}}</span>
            <span class="glyphicon glyphicon-tasks" @click="f3(index)"></span>
            <div style="clear:both;"></div>
            <div class="reEdit" v-show="flage3">
              <ul>
                <li @click="deleted(index,item.article_id)">删除</li>
                <!--<li>再次编辑</li>-->
              </ul>
            </div>
          </div>
          <div class="articleContent">
            <div class="articleTitle">
              {{item.article_title}}
            </div>
            <div class="articleImages" v-show="item.imgSrc.length==0">
              <div><img :src="item.article_cover"/></div>
            </div>
            <div class="articleImages" v-for="(imgs,index) in item.imgSrc">
              <div><img :src="imgs"/></div>
            </div>
          </div>
          <div class="articleDescription">
            <span><img :src="item.image"/>{{item.nickname}}</span>
            <span>评论{{item.article_agreenum}}</span>
            <span>转发{{item.article_agreenum}}</span>
            <!--<span>赏金7869</span>-->
          </div>
        </div>
      </pull-to>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs';
  import PullTo from 'vue-pull-to';
  import {formatDate} from '../../../../static/js/common';
  export default {
    components:{
      PullTo
    },
    data(){
      return{
        status:0,   // 0文章  1活动
        info:[],  //数据渲染
        flage3:false,   // 删除或再次编辑
        pageNum:1,
      }
    },
    created(){
      this.information();
    },
    methods:{
      //下拉加载
      loadMore(loaded) {
        setTimeout(() => {
          this.pageNum = this.pageNum+1;
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
      information(){
        var _this = this;
        this.$http.post('/api/article/mine', qs.stringify({
          uid: uid,
          pageNum: this.pageNum,
          pageSize: 5,
          status:this.status   // 0文章  1活动
        })).then((response) => {
          var temp = response.data.article;
          _this.info = _this.info.concat(temp);
        });
      },
      //删除编辑的显示隐藏
      f3(index){
        //this.flage3 = !this.flage3;
        var display = $(".reEdit").eq(index).css("display");
       if(display=="none"){
         $(".reEdit").eq(index).css("display","block")
       }else{
         $(".reEdit").eq(index).css("display","none")
       }
      },
      //点击删除
      deleted(index,article_id){
        var _this = this;
        this.$confirm('确认删除此篇文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.f3(index);
            //调用删除的接口
            this.$http.get("/api/article/article_del.api", {
              params: {
                uid:uid,
                article_id:article_id,
                deletereason:""
              }
            }).then(response => {
              //提示删除成功
              _this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //刷新页面
              _this.info=[];  //清空数据
              _this.information();  //页面刷新
            })
          })
          .catch(() => {
            this.f3(index);
          });
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time);
        // return formatDate(date, 'yyyy-MM-dd hh:mm');
        return formatDate(date, 'MM-dd hh:mm');
      }
    }
  }
</script>

<style scoped>
  .total{
    position: absolute;
    bottom: 10px;
    top:35px;
    width: 100%;
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
  /*全部文章*/
  .totalArticle{
    padding: 0px 5px;
    margin-bottom: 50px;
  }
  .totalArticle .edit{
    /*overflow: hidden;*/
    position: relative;
  }
  .totalArticle .edit span{
    width: auto;
    margin-right: 5px;
    float: left;
    color: #666;
  }
  .totalArticle .edit span:first-of-type{
    padding:0 5px;
    border:1px solid #e4e7ed;
    border-radius: 5px;
  }
  .totalArticle .edit span:nth-of-type(2){
    padding:0 5px;
    border:1px solid #e4e7ed;
    border-radius: 5px;
  }
  .totalArticle .edit span:last-of-type{
    float: right;
    font-size: 12px;
  }
  .totalArticle .edit .reEdit{
    background: #fff;
    position: absolute;
    right: 2px;
    top:20px;
    z-index: 99;
    width: 50%;
    border-radius: 2px;
    box-shadow: 0px 0px 8px #ccc;
    border-right: 1px solid #e4e7ed;
  }
  .totalArticle .edit .reEdit ul{
    margin: 0;
    padding: 0;
  }
  .totalArticle .edit .reEdit li{
    padding-left: 8px;
    list-style: none;
    line-height: 40px;
    border-bottom: 1px solid #e4e7ed;
  }
  .articleContent .articleTitle,.titles{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap:break-word;
    word-break:break-all;
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .articleContent .articleImages{
    display: flex;
    flex-direction: row;
    margin: 10px auto;
  }
  .articleImages>div{
    width: 100%;
    margin-right: 5px;
  }
  .articleImages>div img{
    width: 100%;
    height: 100%;
  }
  .articleDescription{
    overflow: hidden;
  }
  .articleDescription span{
    width: auto;
    float: left;
    line-height: 25px;
    margin-right: 10px;
  }
  .articleDescription img{
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }

</style>
