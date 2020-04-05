<template>
  <div class="my-publish-container">
    <div class="tab">
      <ul>
        <li @click="currentTab(idx)" v-for="(item,idx) in tab" :key="idx">
          <span :class="currentIdx === idx?'active':''">{{item}}</span>
        </li>
      </ul>
    </div>
    <myPublish v-for="(data,idx) in newDataList" :key="idx" :data="data" @goDetails="goDetails"></myPublish>
  </div>
</template>

<script>
import myPublish from "@/components/myPublish";
import { setTimeout } from "timers";

const db = wx.cloud.database({
  env: "test00-ohk"
});
export default {
  data() {
    return {
      dataList: [],
      newDataList: [],
      tab: ["全部", "审核中", "已通过", "未通过"],
      currentIdx: 0,
      userInfo_openid: ""
    };
  },
  onUnload() {
    (this.dataList = []), (this.newDataList = []), (this.currentIdx = 0);
  },
  onShow() {
    if (!this.globalData.userInfo.name) {
      this.$fn.empower();
      return;
    }
    this.userInfo_openid = this.globalData.userInfo.openid;
    this.getData();
  },
  methods: {
    //切换标签栏
    currentTab(idx) {
      this.currentIdx = idx;
      switch (idx) {
        case 0:
          this.getData();
          break;
        case 1:
          this.assignData();
          break;
        case 2:
          this.assignData("true");
          break;
        case 3:
          this.assignData("false");
          break;
      }
    },
    //筛选
    assignData(sign) {
      this.newDataList = this.dataList.filter((val, idx) => {
        if (!sign) {
          return val.sign == "";
        } else {
          return val.sign == sign;
        }
      });
    },
    //跳转
    goDetails(id) {
      wx.navigateTo({
        url: "../details/main?id=" + id
      });
    },
    //获取数据
    getData() {
      wx.showLoading();
      db
        .collection("publicData")
        .aggregate()
        .match({
          _openid: this.userInfo_openid
        })
        .project({
          _id: 1,
          _openid: 1,
          textData: 1,
          date: 1,
          fileIDs: 1,
          selectType: 1,
          sign: 1
        })
        .end()
        .then(res => {
          // console.log(res);
          this.dataList = res.list;
          this.newDataList = this.dataList;
          this.dataList.forEach(val => {
            val.date = this.$fn.formatTime(val.date);
          });
          wx.hideLoading();
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  components: {
    myPublish
  }
};
</script>

<style scoped>
.my-publish-container {
  background: #f5f5f5;
}
.tab {
  height: 70rpx;
  background: #fff;
  margin-bottom: 10rpx;
}
.tab ul {
  display: flex;
  height: 100%;
  align-items: center;
}
.tab ul li {
  font-size: 34rpx;
  flex: 1;
  text-align: center;
  color: rgb(54, 54, 54);
  font-weight: 700;
}
.tab ul li span {
  line-height: 70rpx;
}
.active {
  color: orange;
  border-bottom: 5rpx solid orange;
}
/* .activf{
  color: black;
} */
</style>
