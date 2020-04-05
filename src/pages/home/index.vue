<template>
  <div class="home-container">
    <div class="wrapper">
      <div class="header">
        <div class="search" @click="closeMeun">
          <span class="fa fa-search"></span>
          <input
            type="text"
            v-model="value"
            @confirm="search"
            placeholder="搜索相关的帖名"
            confirm-type="search"
          >
        </div>
        <div class="nav">
          <div class="left" @click="onDefault">
            <div class="def">{{leftMenuTitle}}</div>
            <span class="fa" :class="{'fa-angle-right':flag,'fa-angle-down':!flag}"></span>
            <div class="left-menu" v-show="!flag">
              <ul v-for="(item,idx) in leftMenu" :key="idx">
                <li @click="selectLeft(idx)">{{item}}</li>
              </ul>
            </div>
          </div>
          <div class="right" @click="onOther">
            <div class="other">{{rightMenuTitle}}</div>
            <span class="fa" :class="{'fa-angle-right':flagTwo,'fa-angle-down':!flagTwo}"></span>
            <div class="right-menu" v-show="!flagTwo">
              <ul v-for="(item,idx) in rightMenu" :key="idx">
                <li @click="selectRight(idx)">{{item}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="content" @click="closeMeun">
        <blockCom
          @previewImg="previewImg"
          @navTo="navTo"
          v-for="(item,idx) in dataList"
          :key="idx"
          :data="item"
          :index="idx"
          @changeZan="changeZan"
          :openid="openid"
          @storageHistory="storageHistory"
        ></blockCom>
      </div>
      <div class="bottom">
        <div class="icon" v-show="!empty">
          <i class="fa fa-spinner fa-spin fa-lg"></i>
        </div>
        <div class="empty" v-show="empty">
          <p>没有更多了...</p>
        </div>
        <div v-if="dataList.length == 0" class="mask"></div>
      </div>
    </div>
  </div>
</template>

<script>
import blockCom from "@/components/blockCom";

const db = wx.cloud.database({
  env: "test00-ohk"
});

export default {
  data() {
    return {
      isClose: true, //判断当前页面是打开页还是返回页
      skip: 0, //翻页前的数据
      dataList: [],
      lock: true, //锁
      empty: false,
      value: "",
      flag: true, //class切换
      flagTwo: true,
      leftMenuTitle: "默认",
      leftMenu: ["按评论", "按点赞"],
      rightMenuTitle: "筛选",
      rightMenu: ["主题帖", "吹水帖", "讨论帖", "技术帖"],
      totalComments: [],
      openid: ""
    };
  },
  components: {
    blockCom
  },
  onLoad() {
    this.getData();
  },
  onShow() {
    setTimeout(() => {
      this.openid = this.globalData.userInfo.openid;
    }, 2000);

    //从详情页返回,重新获取评论数并且更新dataList数组
    if (!this.isClose) {
      if (this.globalData.comments.length > 0) {
        let comments = this.globalData.comments;
        this.dataList.forEach((value, index) => {
          comments.forEach((val, idx) => {
            if (value._id === val.id) {
              this.dataList[index].comments.push(comments[idx]);
              this.globalData.comments = [];
            }
          });
        });
      }
      //更新赞
      if (this.globalData.zan != null) {
        let zan = this.globalData.zan;
        this.dataList.forEach((value, index) => {
          if (value._id == zan.id) {
            this.$set(this.dataList[index], "zanNum", zan.zanNum);
            this.globalData.zan = null;
          }
        });
      }
      this.isClose = true;
    }

    //判断是不是发布完帖子过来的，是就触发刷新
    if (this.globalData.add) {
      this.getData();
      delete this.globalData.add;

      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },
  onPullDownRefresh() {
    this.getData();
  },
  onReachBottom() {
    if (!this.lock) {
      return;
    }
    this.skip += 5;
    db
      .collection("publicData")
      .where({
        sign:'true'
      })
      .orderBy("date", "desc")
      .skip(this.skip) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(5) // 限制返回数量为 5 条
      .get()
      .then(res => {
        // console.log(res);
        if (res.data.length < 5) {
          this.empty = true;
          this.lock = false;
        }
        let data = res.data;
        data.forEach((val, idx) => {
          val.date = this.$fn.formatTime(val.date);
          this.dataList.push(val);
        });
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    closeMeun() {
      this.flag = true;
      this.flagTwo = true;
    },
    //左菜单
    selectLeft(idx) {
      wx.showLoading({
        title: "加载中"
      });
      let type = this.leftMenu[idx];
      this.leftMenuTitle = type;
      if (idx == 0) {
        this.selL("comments");
      } else {
        this.selL("zanNum");
      }
    },
    //右菜单
    selectRight(idx) {
      wx.showLoading({
        title: "加载中"
      });
      let type = this.rightMenu[idx];
      this.rightMenuTitle = type;
      this.selR(type);
    },
    //左边
    selL(field) {
      const $ = db.command.aggregate;
      db
        .collection("publicData")
        .aggregate()
        .match({
          sign:'true'
        })
        .project({
          _id: 1,
          _openid: 1,
          date: 1,
          fileIDs: 1,
          selectType: 1,
          textData: 1,
          userInfo: 1,
          zanNum: 1,
          comments: 1,
          total: $.size("$" + field)
        })
        .sort({
          total: -1
        })
        .end()
        .then(res => {
          this.dataList = res.list;
          this.dataList.forEach(val => {
            val.date = this.$fn.formatTime(val.date);
          });

          this.lock = false;
          this.empty = true;
          wx.hideLoading();
        })
        .catch(e => {
          console.log(e);
        });
    },
    //右边
    selR(type) {
      db
        .collection("publicData")
        .where({
          selectType: type,
          sign:'true'
        })
        .orderBy("date", "desc")
        .get()
        .then(res => {
          // console.log(res);
          this.dataList = res.data;
          this.dataList.forEach(val => {
            val.date = this.$fn.formatTime(val.date);
          });

          this.lock = false;
          this.empty = true;
          wx.hideLoading();
        })
        .catch(err => {
          console.log(err);
        });
    },

    onDefault() {
      this.flag = !this.flag;
      if (!this.flag && !this.flagTwo) this.flagTwo = !this.flagTwo;
    },
    onOther() {
      this.flagTwo = !this.flagTwo;
      if (!this.flag && !this.flagTwo) this.flag = !this.flag;
    },
    //搜索
    search() {
      wx.showLoading({
        title: "加载中"
      });
      db
        .collection("publicData")
        .orderBy("date", "desc")
        .where({
          textData: {
            titleValue: new db.RegExp({
              regexp: this.value,
              options: "i"
            })
          },
          sign:'true'
        })
        .get()
        .then(res => {
          this.dataList = res.data;
          this.dataList.forEach(val => {
            val.date = this.$fn.formatTime(val.date);
          });
          this.value = "";
          //不让触发加载
          this.lock = false;
          this.empty = true;
          wx.hideLoading();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //初始化数据
    getData() {
      this.skip = 0;
      this.lock = true;
      this.empty = false;
      this.rightMenuTitle = "筛选";
      (this.leftMenuTitle = "默认"),
        db
          .collection("publicData")
          .where({
            sign:'true'
          })
          .orderBy("date", "desc")
          .skip(0) // 跳过结果集中的前 n 条，从第 n+1 条开始返回
          .limit(5) // 限制返回数量为 5 条
          .get()
          .then(res => {
            console.log(res.data);
            this.dataList = res.data;
            this.dataList.forEach(val => {
              val.date = this.$fn.formatTime(val.date);
            });
            wx.stopPullDownRefresh();
          })
          .catch(err => {
            console.error(err);
          });
    },
    //点击跳转详情页
    navTo(index) {
      wx.showToast({
        icon: "loading",
        duration: 2000
      });
      this.isClose = false;
      let id = this.dataList[index]._id;
      wx.navigateTo({
        url: "../details/main?id=" + id
      });
    },
    //图片预览
    previewImg(obj) {
      wx.showToast({
        icon: "loading",
        duration: 500
      });
      let { imgs, idx } = obj;
      wx.previewImage({
        current: imgs[idx], // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      });
    },
    //赞样式改变
    changeZan(idx) {
      if (!this.globalData.userInfo.name) {
        this.$fn.empower();
        return;
      }
      let openid = this.globalData.userInfo.openid;
      if (this.dataList[idx].zanNum.indexOf(openid) === -1) {
        this.callFunction(openid, "push", idx);
        this.dataList[idx].zanNum.push(openid);
        
      } else {
        this.callFunction(openid, "pull", idx);
        let i = this.dataList[idx].zanNum.indexOf(openid);
        this.dataList[idx].zanNum.splice(i, 1);
      }
    },
    callFunction(openid, type, idx) {
      wx.cloud.callFunction({
        name: "changeZan",
        data: {
          _id: this.dataList[idx]._id,
          openid: openid,
          type: type
        }
      });
    },
    
    storageHistory(id) {
      if (!this.globalData.userInfo.name) {
        this.$fn.empower();
        return;
      }
      let history = this.globalData.userInfo.history;
      let i = history.indexOf(id)
      if (i == -1) {
        history.push(id);
        if(history.length>10){
          history.shift()
        }
        this.changeHistory(history)
      } else {
        return;
      }
    },
    changeHistory(history){
      const _ = db.command;
        db.collection("userInfoData")
          .where({
            _openid: this.openid
          })
          .update({
            data:{
              history: history
            }
          })
          .then(res => {
            // console.log(res);
          });
    }
  }
};
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
}
.wrapper {
  overflow: hidden;
}
.header {
  width: 100%;
}
.header .search {
  display: flex;
  width: 90%;
  margin: 10rpx auto;
  height: 40rpx;
  padding: 15rpx 20rpx;
  background-color: #fff;
  border-radius: 40rpx;
  align-items: center;
}
.header .search span {
  line-height: 40rpx;
  width: 10%;
  text-align: center;
}
.header .search input {
  line-height: 40rpx;
  padding: 10rpx;
  width: 90%;
}
.header .nav {
  box-sizing: border-box;
  padding: 20rpx;
  width: 100%;
  display: flex;
  background: #fff;
  border-bottom: 2rpx solid rgb(231, 229, 229);
}
.header .nav .left,
.header .nav .right {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
}
.header .nav .left span {
  margin-left: 10rpx;
  width: 32rpx;
  height: 32rpx;
}
.header .nav .right span {
  margin-left: 15rpx;
  width: 32rpx;
  height: 32rpx;
}

.header .nav .left .left-menu,
.header .nav .right .right-menu {
  position: absolute;
  top: 120%;
  margin-left: -8rpx;
  border: 2rpx solid #f1f1f1;
  border-top: none;
  background: linear-gradient(135deg, #fff, #fff, #f7f7f7);
  border-bottom-right-radius: 20rpx;
  border-bottom-left-radius: 20rpx;
}

.header .nav .left .left-menu ul li,
.header .nav .right .right-menu ul li {
  padding: 20rpx 50rpx;
  border-bottom: 1rpx solid #e2e2e2;
}
.header .nav .left .left-menu ul li:last-of-type,
.header .nav .right .right-menu ul li:last-of-type {
  border-bottom: none;
}

.bottom {
  width: 100%;
  min-height: 80rpx;
  background: #fff;
}
.bottom p {
  line-height: 80rpx;
  font-size: 36rpx;
}
.mask {
  width: 100%;
  min-height: 350rpx;
  background: #fff;
}
.loading {
  width: 100%;
  height: 80rpx;
  text-align: center;
}
.empty {
  width: 100%;
  height: 80rpx;
  text-align: center;
  background: #fff;
}
.icon{
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
}
</style>
