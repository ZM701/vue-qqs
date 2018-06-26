<template>
  <div id="app">
    <div><router-view></router-view></div>
    <div class="footer">
      <div><router-link to="/find"><span><i class="	glyphicon glyphicon-search"></i></span><span>发现</span></router-link></div>
      <div><router-link to="/activities"><span><i class="glyphicon glyphicon-fullscreen"></i></span><span>活动</span></router-link></div>
      <div><router-link to="/tasks"><span><i class="glyphicon glyphicon-folder-open"></i></span><span>任务</span></router-link></div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .footer{
    background: #fff;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    z-index: 9999;
    padding-top: 5px;
    height: 40px;
  }
  .footer>div{
    height: 50px;
    width: 100%;
    text-align: center;
  }
  .footer>div span{
    height: 15px;
    font-size: 1rem;
  }
  .footer a,.footer span{
    display: block;
    width: 100%;
    height: 100%;
    color: #000;
    text-align: center;
    text-decoration: none;
  }
  .router-link-active span{
    color: green;
  }
</style>
