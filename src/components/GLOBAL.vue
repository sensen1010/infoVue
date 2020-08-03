
<script>
  const path=window.location.hostname;
  const serverSrc='http://'+path+':8081';
  const serverimg='http://'+path+':8080/file/';
  const token='';
  const hasEnter=false;
  const userSite="111";
    export default
    {
      serverimg,
      userSite,//用户地址
      token,//用户token身份
      serverSrc,//服务器地址
      hasEnter,//用户登录状态
    }
</script>

<style>
</style>
