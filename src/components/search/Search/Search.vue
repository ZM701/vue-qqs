<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <div id="search">
    <div class="searchBar" >
      <div class="top">
        <div @click="goback" class="box1"><i class="glyphicon glyphicon-chevron-left"></i></div>
        <el-input
          v-model="input"
          placeholder="请输入内容"
          @keyup.native.enter="search(input)"
          class="searchInput fl box2">
        </el-input>
        <span class="sousuo" @click="search(input)">搜索</span>
      </div>
      <div>
        <span class="toutiaoIcon box3" v-popover:popover4 >历史记录</span>
        <el-popover
          ref="popover4"
          placement="bottom"
          trigger="click"
          id="popover">
          <ul class="searchList" v-show="test.length != 0">
            <li class="searchListItems" v-for="(item,index) in test">
						<span @click="historySearch(item)">
              <i class="glyphicon glyphicon-search" size="14" style="color: #ccc;vertical-align: middle;margin-right: 3px;"></i>
							{{item}}
						</span>
              <i class="el-icon-delete fr" @click.prevent="clearThisHistory(index)"></i>
              <div style="clear:both;"></div>
            </li>
            <div class="clearHistory" @click="clearHistory" style="margin-top: 10px;">清空历史记录</div>
          </ul>
          <ul class="noHistory" v-show="test.length == 0">
            暂无历史搜索记录
          </ul>
          <div class="hotSearch">
            <span v-popover:popover4 class="hotTitle">热门搜索</span>
            <ul v-for="(item,index) in hot">
              <li @click="hotSearch(index)">{{item}}</li>
            </ul>
          </div>
        </el-popover>
         </div>
      <div style="clear: both;"></div>
    </div>
    <div v-show="loading" v-loading="loading" element-loading-text="拼命加载中" style="width: 100%" class="loading"></div>
  </div>
</template>
<script>
  import qs from 'qs';
  import store from '../../../../static/js/store'
  export default{
    data(){
      return {
        loading:false,
        flag:true,
        input:'',
        con:[],
        test:store.fetch(),
        searchCon:'',
        status:0,   //  0=搜索结果  1=查看更多用户   2=查看更多文章  3=查看更多活动
        hot:[],   //热门搜索
      }
    },
    watch: {
      test: {
        handler: function(val, oldVal) {
          store.save(val);
        },
        deep: true
      }
    },
    created(){
        var _this = this;
        this.$http.post('/api/article/searchPage', qs.stringify({
          uid: uid,
        })).then((response) => {
          this.hot = response.data.hot;
        });
      //数组去重
      this.test = [...new Set(this.test)];
    },
    beforeRouteLeave (to, from, next){
      if(to.name == 'home'){
        this.con = [];
        this.input = '';
        //document.getElementsByClassName('el-popover')[0].style.display = 'none';
        next();
      }
      next();
    },
    methods:{
      //返回
      goback(){
        this.$router.push({
          path: '/find',
          name: 'find',
        })
      },
      //热门搜索
      hotSearch(index){
        this.input =  $(".hotSearch li").eq(index).text();
        this.search(this.input);
        //console.log($(".hotSearch li").eq(index).text())
      },
      replace(title,inp){
        const reg = new RegExp(''+inp+'','gim');
        if(title){
          return title.replace(reg,'<font class="red">'+inp+'</font>')
        }else{
          return title;
        }
      },
      historySearch(item){
        this.input = item;
        this.flag = false;
        this.search(item);
        this.con = [];
        this.$nextTick(function(){
          //document.getElementsByClassName('el-popover')[0].style.display = 'none';
        })
      },
      clearHistory() {
        this.$confirm('确认清空历史记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.test = [];
            var val = JSON.parse(JSON.stringify(this.test))
            store.save(val);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .catch(() => {

          });
      },
      clearThisHistory(index){
        this.$confirm('确认删除此条历史记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.test.splice(index,1);
            var val = JSON.parse(JSON.stringify(this.test))
            store.save(val);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .catch(() => {

          });
      },
      //回车搜索
      search(input){
        //搜索跳转
        this.$router.push({
//          path: '/searchResult',
          name: 'searchResult',
          params: {
            keyWords: this.input,
//            keyWords: input,
          }
        })
        const _this = this;
        input = input.trim();
        if(input){
          if(this.searchCon == input){
            if(this.flag){
              return ;
            }
          }
          _this.loading = true;
          //存储数据
          this.test.unshift(input);
          var val = JSON.parse(JSON.stringify(this.test))
          store.save(val);
          this.searchCon = input;
          this.flag = true;
        }else{
          this.searchCon = '';
          this.con = [];
        }
        //调用搜索文章埋点
        this.burialPoint({
          session_id:session_id,
          action:'search',
          end:'wx',
          target:'article',
          keyword:input
        });
      }
    },
  }
</script>
<style>
  a,span{
    display: block;
    width: 100%;
    height: 100%;
    color: #000;
    text-align: center;
  }
  .glyphicon-chevron-left{
    color: #ccc;
  }
  .box1{
    width: 30px;
    padding-right: 10px;
    line-height: 40px;
    text-align: right;
  }
  .box2{
    margin: 0 2%;
    width: 70% !important;
  }
  .box1,.box2{
    float: left;
  }
  .red{
    color: red;
  }
  .box3{
    margin-top: 50px;
  }
  .searchBar {
    margin-top: 1.3rem;
    width: 100%;
  }
  .top{
    width: 100%;
    height: 50px;
    position: fixed;
    z-index: 99999999;
    top:0px;
    padding-top: 10px;
    padding-left: 10px;
    background: #fff;
  }
  .sousuo{
    line-height: 40px;
  }
  .toutiaoIcon{
    display: inline-block;
    padding: 0 .05rem;
    font-size: 13px;
    text-align: center;
    width: 20%;
    line-height: 40px;
  }
  .searchInput{
    width: 60%;
  }

  .loading{
    margin-top: 1rem;
  }

  .searchNewsItem {
    width: 94%;
    display: block;
    position: relative;
    margin: 0 auto;
    padding-bottom: 0.15rem;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    padding-top: 0.2rem;
    padding-bottom: 0.15rem;
  }
  .searchNewsItem img {
    width: 31.1%;
    margin-right: 0.21rem;
    height: 2.3rem;
  }
  .bottomInfo {
    font-size: 10px;
    margin-top: 0.15rem;
  }
  .writer {
    color: #000;
  }
  .comment_count {
    color: #000;
  }
  .datetime {
    float: right;
    color: #000;
  }
  .avIcon {
    display: inline-block;
    height: 0.4rem;
    width: 0.9rem;
    text-align: center;
    line-height: 0.4rem;
    border-radius: 4px;
    border: 1px solid #39f;
    font-size: 10px;
    margin-right: 0.1rem;
  }

  .el-popover {
    display: block !important;
    width: 100%;
    top:100px;
    margin-bottom: 50px;
    box-shadow: none;
    border-bottom: none;
  }
  .searchListItems{
    height: 30px;line-height: 30px;
    border-bottom: 1px solid #F1F1F1;
    display: block;
    position: relative;
    font-size: 16px;
  }
  .searchListItems span{
    width: 90%;
    text-align: left;
    padding-left: 10px;
    float:left;
  }
  .searchListItems>i{
    float: left;
    line-height: 30px;
  }
  i{
    padding: 0 .2rem;
    line-height: .9rem;
  }

  .clearHistory{
    font-size: 14px;
    height: .7rem;
    line-height: 1rem;
    text-align: center;
  }
  .noHistory{
    font-size: 14px;
  }
  /*删除对话框*/
  .el-input {
    width: 68% !important;
  }
  .el-message-box{
    width: 100% !important;
  }
  .el-message--success{
    padding-left: 20% !important;
    width: 100% !important;
  }
  /*热门搜索*/
  .hotSearch{
    margin-left: -8px;
    margin-right: -8px;
    padding-top: 10px;
  }
  .hotSearch .hotTitle{
    text-align: left;
    padding-bottom: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ECEFF6;
  }
  .hotSearch li{
    list-style: none;
    width: 50%;
    float: left;
    padding-left: 10%;
    line-height: 30px;
    border:1px solid #ECEFF6;
    margin-top:-1px;
  }

</style>
