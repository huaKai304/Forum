<template>
  <div class="block-wrapper" @click="$emit('storageHistory',data._id)">
    <div class="header">
      <div class="avatar">
        <img :src="data.userInfo.avatar" alt>
      </div>
      <div class="name-select_type">
        <div class="name">{{data.userInfo.name}}</div>
        <div class="select_type">{{data.selectType}}</div>
      </div>
    </div>
    <div class="content">
      <div class="title" @click="navTo(index)">{{data.textData.titleValue}}</div>
      <div class="text-content" @click="navTo(index)">
        <text class="text1" v-if="data.details">{{data.textData.textValue}}</text>
        <text class="text2" v-else>{{data.textData.textValue}}</text>
      </div>
      <div class="imgs">
        <div class="img-box" v-for="(img,idx) in data.fileIDs" :key="idx">
          <image @click="previewImg(data.fileIDs,idx)" mode="aspectFill" :src="img" alt=""></image>
        </div>
      </div>
      <div class="time">
        <span>{{data.date}} 发布</span>
      </div>
    </div>
    <div class="column" v-if="!data.details">
      <div class="comment-num" @click="navTo(index)">
        <i class="fa fa-commenting-o"></i>
        <span >{{data.comments.length?data.comments.length:''}}</span>
      </div>
      <div class="zan" @click="changeZan(index)">
        <i v-show="!select" class="sel fa fa-thumbs-o-up"></i>
        <i v-show="select" class="sel fa fa-thumbs-up"></i>
        <span>{{data.zanNum.length?data.zanNum.length:""}}</span>
      </div>
    </div>
    
  </div>
</template>

<script>


export default {
  data() {
    return {
      imgList:[]
    };
  },
  props: {
    data: Object,
    index:String,
    openid:String
  },
  computed:{
    select(){
        // console.log('[openid] :',this.openid);
      if(this.data.zanNum.indexOf(this.openid) !== -1){
        return true
      }else{
        return false;
      }
    }
  },
  methods:{
    navTo(index){
      this.$emit("navTo",index)
    },
    previewImg(imgs,idx){
        this.$emit("previewImg",{imgs:imgs,idx:idx})
    },
    changeZan(index){
      this.$emit('changeZan',index)
    }
  }
};
</script>

<style scoped>
.block-wrapper {
  background: #fff;
  width: 100%;
  padding: 30rpx 30rpx 10rpx;
  margin-bottom: 10rpx;
  box-sizing: border-box;
}
.block-wrapper:after{
  content:"";
  display: block;
  clear: both;
  height: 0;
}
.header {
  display: flex;
  align-items: center;
  padding: 15rpx 0;
}
.header .avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20rpx;
}
.header .avatar img {
  width: 100%;
  height: 100%;
}

.header .name-select_type .name {
  font-size: 30rpx;
  color: rgb(255, 137, 2);
  margin-bottom: 10rpx;
}
.header .name-select_type .select_type {
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

.content .title {
  letter-spacing: 2rpx;
  padding: 10rpx 0;
  border-bottom: 1rpx solid rgb(231, 229, 229);
}
.content .text-content {
  letter-spacing: 2rpx;
  padding: 10rpx 0 20rpx;
}
.content .text-content .text1{
  word-break:break-all;
  width: 100%;
}

.content .text-content .text2 {
  display: block;
  width: 100%;
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
.content .imgs {
  width: 100%;
}
.content .imgs:after{
  content:"";
  height: 0;
  clear: both;
  display:block;
}
.content .imgs .img-box{
  width: 220rpx;
  padding-top: 220rpx;
  height: 0;
  position: relative;
  float: left;
  margin-right: 15rpx;
  margin-top: 15rpx;
  background: rgba(0, 0, 0, 0.438);
}
.content .imgs .img-box image{
  width: 100%;
  height: 100%;
  position:absolute;
  top: 0;
  left: 0;
}

.content .imgs .img-box:nth-child(3n) {
  margin-right: 0;
}

.content .time {
  padding: 10rpx 0;
  border-bottom: 1rpx solid rgb(231, 229, 229);
}
.content .time:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.content .time span {
  float: right;
  color: #a1a1a1;
}

.column{
  height: 60rpx;
  width: 30%;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10rpx;

}
.column .comment-num,
.column .zan{
  flex: 1;
  text-align: center;
}
.column .comment-num span,
.column .zan span{
  margin-left: 8rpx;
  color: #505050;
  font-size: 30rpx;
}

.column .zan .sel{
  color: orange
}
</style>
