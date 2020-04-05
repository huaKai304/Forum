<template>
  <div class="myComment">
    <div class="wrapper" v-for="(item,idx) in data.comments" :key="idx">
      <div class="date">{{item.date}} 发布</div>
      <div class="my-comment">{{item.value}}</div>
      <div class="target" @click="$emit('navTo',data._id)">
        <div class="left-head">
            <img :src="data.userInfo.avatar" alt="">
        </div>
        <div class="right-content">
          <div class="name">{{data.userInfo.name}}</div>
          <div class="title">{{data.textData.titleValue}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
};
</script>

<style scoped>
.myComment{
    padding: 16rpx;
    margin-bottom: 16rpx;
    background: #fff;
}
.wrapper{
    
}
.target{
    margin-top: 10rpx;
    display: flex;
    background: #f5f5f5;
    padding: 16rpx;
    border-radius: 16rpx;
}
.date{
    margin-top: 10rpx;
    color: #aaaaaa
}
.my-comment{
    margin-top: 10rpx;
    font-size: 36rpx;
}
.target .left-head{
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
}   
.target .left-head img{
    width: 100%;
    height:100%;
}
.target .right-content{
    margin-left: 10rpx;
    display: flex;
    flex-direction:column;
    justify-content: center;
}
.right-content .name{
    color: rgb(255, 166, 0);
    margin-bottom: 8rpx;
}
</style>
