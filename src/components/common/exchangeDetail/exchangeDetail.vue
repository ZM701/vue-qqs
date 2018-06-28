<template>
    <div>
      <div class="exchangeDetail" v-if="productList">
        <div class="navChange" @click="exchangeGoods"><span>兑换商品</span><span class="arrow"><i class="glyphicon glyphicon glyphicon-chevron-right"></i></span></div>
        <dl v-for="(item,index) in productList" @click="detail(index)">
          <dt><img :src="'https://imgs.nanniwan.com/'+item.goods_img"></dt>
          <dd><span>{{item.goods_name}}</span><span class="money">{{item.goods_price}}元</span></dd>
        </dl>
      </div>
      <div class="exchangeDetail" v-else>
        <div class="navChange"><span>兑换商品</span></div>
          <div class="loaded">
            <dl v-for="(item,index) in goods" @click="detail(index)">
              <dt><img :src="'https://imgs.nanniwan.com/'+item.goods_img"></dt>
              <dd><span>{{item.goods_name}}</span><span class="money">{{item.price}}元 <span class="oldPrice" v-if="item.goods_price==0">{{item.price}}元</span><span class="oldPrice" v-else>{{item.wholesale_price}}元</span> </span></dd>
            </dl>
          </div>
      </div>
    </div>
</template>

<script>
  import qs from 'qs';
    export default {
      props:{
        'productList':{
          type:Array
        },
        'money':{
          type:Number
        }
      },
      data(){
        return{
          goods:[],  //存储获取的商品信息列表
          pageNum:1,   //当前页数
        }
      },
      created(){
        this.exchangeGoodsInt()
      },
      methods:{
        exchangeGoods(){
          this.$router.push({
            path: '/exchangeGoods',
            name: 'exchangeGoods',
            params: {
              money:this.money
            }
          })
        },
        //页面请求
        exchangeGoodsInt(){
          var _this = this;
          this.$http.post('/user/integral/get_productList.api', qs.stringify({
            pageNum: this.pageNum,
            pageSize: 8
          })).then((response) => {
            var temp = response.data.productList
            this.goods = this.goods.concat(temp)
            //console.log(this.goods)
          });
        },
        //下拉加载(接收父组件传过来的事件 exchangeGoods)
        loadMore() {
          setTimeout(() => {
            this.pageNum = this.pageNum+1;
            this.exchangeGoodsInt();
           // loaded('done');
          }, 500);
        },
        //点击兑换，弹出弹层
        detail(index){
          this.$confirm('需要访问南泥湾APP才能兑换商品哦！', '提示', {
            confirmButtonText: '打开APP',
            cancelButtonText: '再逛逛',
            type: 'warning'
          })
            .then(() => {
              window.location.href = "http://wechat.nanniwan.com/?c=index&a=download";
            })
            .catch(() => {
            });
        }
    }
    }
</script>

<style scoped>
  a,span{
    display: block;
    width: 100%;
    height: 100%;
    color: #000;
    text-align: center;
  }
  .navChange{
    background: #e0e0e0;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    font-weight: bolder;
    font-size: 1.5rem;
  }
  .navChange span{
    width: auto;
    float: left;
    text-align: left;
  }
  .navChange span.arrow{
    float: right;
  }
  .exchangeDetail{
    margin-bottom: 40px;
    height: auto;
  }
  .exchangeDetail dl{
    padding: 5px;
    overflow: hidden;
    margin-bottom: 5px;
    border-bottom:1px solid #e4e7ed;
  }
  .exchangeDetail dl dt{
    float: left;
    width: 28%;
    margin-right: 10px;
  }
  .exchangeDetail dl dt img{
    width: 100px;
    height: 100px;
  }
  .exchangeDetail dl dd{
    width: 66%;
    float: left;
    padding: 5px 0;
    margin-left: 5px;
  }
  .exchangeDetail dl dd span:first-of-type{
    text-align: left;
    height: 55px;
  }
  .exchangeDetail dl dd .money{
    width: 100%;
    text-align: right;
    color: red;
    font-size: 2rem;
    height: 30px;
  }
  .exchangeDetail dl dd .money .oldPrice{
    width: auto;
    display: inline-block;
    font-size: 1.5rem;
    text-decoration: line-through;
    color: #ccc;
  }
</style>
