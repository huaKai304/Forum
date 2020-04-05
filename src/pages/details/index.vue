<template>
  <div class="details-container" v-if="dataList">
    <blockCom :data="dataList" @previewImg="previewImg"></blockCom>
    <comment :comments="dataList.comments" :userId="dataList.userInfo.openid" ></comment>
    <div class="empty" v-show="dataList.comments.length === 0">
      <span>还没有人评论...</span>
    </div>
    <div class="comment">
      <div class="comment-list"></div>
      <div class="bottom-input">
        <div class="input">
          <span class="fa fa-smile-o"></span>
          <input
            type="text"
            v-model="newsValue"
            @confirm="onSubmit"
            placeholder="随便说"
            cursor-spacing="10"
            confirm-type="send"
          >
        </div>
        <div class="zan" @click="changeZan">
          <i v-show="!select" class="fa fa-thumbs-o-up"></i>
          <i v-show="select" class="fa fa-thumbs-up"></i>
          <span>{{dataList.zanNum.length?dataList.zanNum.length:''}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import blockCom from "@/components/blockCom";
import comment from "@/components/comment";

const db = wx.cloud.database({
  env: "test00-ohk"
});

export default {
  data() {
    return {
      id: "",
      dataList: null,
      userInfo: null,
      newsValue: "",
      select:false
    };
  },
  components: {
    blockCom,
    comment
  },

  onLoad(e) {  
    this.id = e.id;
    this.userInfo = this.globalData.userInfo;
  },
  onShow() {
    this.getMessageData();
  },

  //页面关闭不会清空数据,需要手动清空
  onUnload(){
      this.id = ""
      this.dataList = null
      this.userInfo = null
      this.newsValue = "",
      this.select = false
  },

  methods: {
    changeZan(){
      //视图更新
      this.select = !this.select
      if(this.select){
        this.dataList.zanNum.push(this.userInfo.openid)
        this.globalData.zan = {
          id:this.id,
          zanNum :this.dataList.zanNum
        };
        wx.cloud.callFunction({
          name:'changeZan',
          data:{
            _id:this.dataList._id,
            openid:this.userInfo.openid,
            type:"push"
          }
        })
      }else{
        let i = this.dataList.zanNum.indexOf(this.userInfo.openid);
        this.globalData.zan = {
          id:this.id,
          zanNum :this.dataList.zanNum
        };
        this.dataList.zanNum.splice(i,1)
        wx.cloud.callFunction({
          name:'changeZan',
          data:{
            _id:this.dataList._id,
            openid:this.userInfo.openid,
            type:"pull"
          }
        })
      }
      
    },
    //获取指定id帖子数据+评论+点赞
    getMessageData() {    
      db
        .collection("publicData")
        .doc(this.id)
        .get()
        .then(res => {
          // console.log(res.data);
          this.dataList = res.data;
          if(this.dataList.zanNum.indexOf(this.userInfo.openid) != -1){
            this.select = true;
          }
          //加个判断属性，是否为details页
          this.dataList.details = true;
          this.dataList.date = this.$fn.formatTime(this.dataList.date);
        });
    },
    
    //图片预览
    previewImg(obj) {
      let { imgs, idx } = obj;
      wx.previewImage({
        current: imgs[idx], // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      });
    },
    //发送评论
    onSubmit(e) {
      //判断授权状态
      if (!this.globalData.userInfo.name) {
        this.$fn.empower();
        return;
      }
      wx.showLoading({
        title:"发送中..."
      })
      let data={
        id:this.id,
        userInfo: this.userInfo,
        value: this.newsValue,
        date:this.$fn.formatTime(new Date())
      }
      
      //添加评论云函数
      wx.cloud.callFunction({
        name:"comment",
        data:{
          id:this.id,
          userInfo: this.userInfo,
          value: this.newsValue,
          date:this.$fn.formatTime(new Date())
        }
      }).then(res=>{
        this.globalData.comments.push(data) ;
        // console.log(this.globalData.comments);
        //更新当前页的视图
        this.dataList.comments.unshift(data);
        this.newsValue = "";
        
        wx.hideLoading();
      })
    }
  }
};
</script>

<style scoped>
.details-container {
  background: #f1f1f1;
}
.bottom-input {
  width: 100%;
  height: 80rpx;
  border-top: 2rpx solid #f1f1f1;
  background: #fff;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
}
.bottom-input .input {
  width: 80%;
  height: 60rpx;
  border-radius: 25rpx;
  background: rgb(248, 248, 248);
  margin-left: 30rpx;
  display: flex;
  align-items: center;
}
.bottom-input .input input {
  flex: 9;
  padding: 0 10rpx;
}
.bottom-input .input span {
  flex: 1;
  text-align: center;
  color: #999999;
}
.bottom-input .zan {
  margin-left: 30rpx;

}
.bottom-input .zan i {
    color: orange;
    width: 40rpx;
    height: 40rpx;
}
.bottom-input .zan span {
  color: #999999;
  font-size: 24rpx;
  position: absolute;
  top: 0rpx;
}
.empty{
  height: 300rpx;
  background: white;
  text-align: center;
  font-size: 38rpx;
}
</style>
