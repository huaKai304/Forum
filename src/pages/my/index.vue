<template>
  <div class="my-container">
    <div class="wrapper">
      <div class="header">
        <div class="header-or-name">
          <div class="head">
            <img :src="userInfo.avatar" alt>
          </div>
          <div class="name">
            <button
              open-type="getUserInfo"
              @getuserinfo="getUserInfo"
              :disabled="disabled"
            >{{userInfo.name}}</button>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="history pub"  @click="navTo('myHistory')">
          <span class="fa fa-file-text-o"></span>
          <span class="txt">访问记录</span>
          <span class="icon fa fa-angle-right"></span>
        </div>
        <div class="comment pub" @click="navTo('myComment')">
          <span class="fa fa-commenting-o "></span>
          <span class="txt">我的评论</span>
          <span class="icon fa fa-angle-right"></span>
        </div>
        <div class="publish pub" @click="navTo('myPublish')">
          <span class="fa fa-send-o "></span>
          <span class="txt">我的发布</span>
          <span class="icon fa fa-angle-right"></span>
        </div>
        <div class="we pub" @click="navTo('about')">
          <span class="fa fa-info-circle "></span>
          <span class="txt">关于我们</span>
          <span class="icon fa fa-angle-right"></span>
        </div>
        <div class="setting pub" @click="navTo('mySetting')" v-if="userInfo.openid == 'oBg2I5BZNEf7U08iGaQmzbY1Yxww'">
          <span class="fa fa-cog "></span>
          <span class="txt">发布审核 (仅管理员可见)</span>
          <span class="icon fa fa-angle-right"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const db = wx.cloud.database({
  env: "test00-ohk"
});

export default {
  data() {
    return {
      disabled: false,
      userInfo: {
        avatar: "../../static/images/logo.jpeg",
        name: "点击授权",
        openid: ""
      }
    };
  },
  created() {
    //获取用户openid
    wx.cloud
      .callFunction({
        // 云函数名称
        name: "userInfo"
      })
      .then(res => {
        this.openid = res.result.openid;
        this.globalData.userInfo ={
          openid : this.openid
        }
        // console.log(this.openid);
        this.getIdInfo(this.openid)
      })
      .catch(err => {
        console.log(err);
      });
  },

  methods: {
    navTo(pageName){
      wx.navigateTo({
        url: `../${pageName}/main`
      })
    },
    //根据id获取用户信息，没有该用户信息表示没有授权，则授权指引
    getIdInfo(id) {
      //获取用户信息
      db.collection("userInfoData")
        .where({
          _openid: id
        })
        .get()
        .then(res => {
          console.log(res.data);
          if (res.data.length > 0) {
            //存储在全局
            this.globalData.userInfo = res.data[0];
            //给button加锁，防止重复往数据库添加相同用户信息
            this.disabled = true;
            //渲染当前页面
            this.userInfo = {
              avatar: this.globalData.userInfo.avatar,
              name: this.globalData.userInfo.name,
              openid:this.globalData.userInfo.openid
            };
            wx.showToast({
              title:"登录成功",
              duration:2000
            })
          } else {
            //判断授权状态,无授权弹窗询问
            this.$fn.empower();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //点击弹窗,用户有无授权,有就获取用户信息
    getUserInfo(e) {
      // console.log(e);
      let that = this;
      wx.getSetting({
        success(res) {
          // console.log(res.authSetting);
          if (res.authSetting["scope.userInfo"]) {
            let info = e.target.userInfo;
            that.userInfo = {
              avatar: info.avatarUrl,
              name: info.nickName,
              openid: that.openid
            };
            db.collection("userInfoData")
              .add({
                data: {
                  avatar: info.avatarUrl,
                  name: info.nickName,
                  openid: that.openid,
                  history:[]
                }
              })
              .then(res => {
                console.log(res);
              });
            //存储在全局
            that.globalData.userInfo = that.userInfo;
            //给button加锁，防止重复往数据库添加相同用户信息
            that.disabled = true;
            wx.showToast({
              title:"登录成功",
              duration:2000
            })
          } else {
            wx.showToast({
              title: "授权失败",
              icon: "none",
              duration: 2000
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.my-container {
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
}
.wrapper {
  overflow: hidden;
}
.wrapper .header {
  margin-top: 10rpx;
  background: #fff;
  padding: 20rpx 20rpx;
  background: linear-gradient(to right, #52a0fd 0%, #00e2fa 80%, #00e2fa 100%);
}
.wrapper .header .header-or-name {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
}
.wrapper .header .header-or-name .head {
  width: 150rpx;
  height: 150rpx;
}
.wrapper .header .header-or-name .head img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.wrapper .header .header-or-name .name {
  margin-left: 30rpx;
}
.wrapper .header .header-or-name .name button {
  outline: none;
  background-color: transparent;
  border-color: transparent;
  color: #fff;
}
.wrapper .header .header-or-name .name button:after {
  border: none;
}
.content {
  margin-top: 10rpx;
}

.icon {
  float: right;
  line-height: 70rpx;
}

span:first-of-type {
  width: 60rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
  color: #3f3f3f
}
span:nth-child(2){
  font-size: 30rpx;
}

/* .we span:first-of-type {
  color: #494949;
} */
.pub {
  padding: 10rpx 30rpx;
  background: #fff;
  margin-top: 10rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 36rpx;
}
.pub:last-of-type {
  margin-bottom: 10rpx;
}
.txt {
  margin-left: 20rpx;
}

</style>
