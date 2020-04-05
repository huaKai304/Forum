<template>
  <div class="myPublish" @click="$emit('goDetails',data._id)">
    <div class="wrapper">
      <div class="left-time">
        <span class="top">{{date[0]}}</span>
        <span class="bottom">{{date[1]}}</span>
      </div>
      <div class="right-content">
        <div class="title-type">
          <span class="title">{{data.textData.titleValue}}</span>
          <span class="type">{{data.selectType}}</span>
        </div>
        <div class="content">{{data.textData.textValue}}</div>
        <img v-if="data.fileIDs.length>0" :src="data.fileIDs[0]" alt>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: String
  },
  computed: {
    date() {
      return this.data.date.split(" ");
    }
  }
};
</script>

<style scoped>
.myPublish {
  width: 100%;
  height: 100%;
  margin-bottom: 10rpx;
  padding: 20rpx;
  background: #fff;
  box-sizing: border-box;
}
.wrapper {
  display: flex;
}
.wrapper .left-time {
  display: flex;
  flex-direction: column;
  text-align: end;
  width: 28%;
}
.left-time .top {
  font-size: 35rpx;
  font-weight: 800rpx;
}
.left-time .bottom {
  color: #616161;
}
.wrapper .right-content {
  margin-left: 10rpx;
  width: 72%;
}
.right-content .title-type {
  border-bottom: 2rpx solid #f1f1f1;
  padding-bottom: 8rpx;
  display: flex;
}
.right-content img {
  width: 200rpx;
  height: 200rpx;
}

.title-type .title {
  display: inline-block;
  width: 200rpx;
  overflow: hidden;
  /* 长单词换行 */
  word-wrap: break-word;
  /* 显示省略符号 */
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  /* 行数 */
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.title-type .type {
  margin-left: 10rpx;
  display: block;
  color: #fff;
  font-size: 26rpx;
  background: rgba(0, 119, 255, 0.76);
  text-align: center;
  border-radius: 13rpx;
  display: block;
  width: 100rpx;
  height: 40rpx;
  line-height: 40rpx;
}
.right-content .content {
  color: #383838;
  font-size: 28rpx;
  margin: 8rpx 0;
  overflow: hidden;
  /* 长单词换行 */
  word-wrap: break-word;
  /* 显示省略符号 */
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  /* 行数 */
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
