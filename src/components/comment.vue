<template>
  <div class="comment-container" >
    <div class="wrapper" v-for="(item,idx) in comments" :key="item">
      <div class="left-head">
        <div class="img-box">
          <img :src="item.userInfo.avatar" alt>
        </div>
      </div>
      <div class="right-content">
        <div class="name-time">
          <div class="name-lz">
            <div class="name">{{item.userInfo.name}}</div>
            <div v-if="item.userInfo.openid === userId" class="lz">楼主</div>
          </div>
          <div class="time">{{item.date}}</div>
        </div>
        <div class="txt">
          <text>{{item.value}}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comments: Array,
    userId:String,
  }
};
</script>

<style scoped>
.comment-container {
  margin-top: 10rpx;
  padding: 0 30rpx 90rpx 30rpx;
  background: #fff;
}
.wrapper {
  width: 100%;
  border-bottom: 2rpx solid #f1f1f1;
  display: flex;
  padding: 20rpx 0;
}
.wrapper:last-of-type {
  border: none;
}

.left-head {
  width: 15%;
}
.left-head .img-box {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  overflow: hidden;
}
.left-head img {
  width: 100%;
  height: 100%;
}
.right-content {
  width: 85%;
}
.right-content .name-time {
  height: 100rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10rpx;
}
.right-content .name-time .name-lz {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.right-content .name-time .name-lz .name {
  margin-bottom: 10rpx;
}
.right-content .name-time .name-lz .lz{
    display: inline-block;
    color: #fff;
    background: rgb(255, 145, 0);
    border-radius: 6rpx;
    font-size: 24rpx;
    height: 34rpx;
    /* line-height: 36rpx; */
    margin-left: 10rpx;
}
.right-content .name-time .time {
  color: #6d6d6d;
  font-size: 28rpx;
}
.right-content .txt {
    padding: 10rpx 0;
}
.right-content .txt text {
  word-break: break-all;
  width: 100%;
}

</style>
