<template>
  <div class="my-setting">
    <div class="wrapper" v-for="(data,idx) in dataList" :key="data">
      <blockCom :data="data"></blockCom>
      <div class="control">
        <button class="success" @click="onChange(data._id,'true',idx)">通过</button>
        <button class="fail" @click="onChange(data._id,'false',idx)">未通过</button>
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
      dataList: []
    };
  },
  components: {
    blockCom
  },
  onShow() {
    this.getData();
  },
  methods: {
    onChange(id, sign, idx) {
      let that = this;
      wx.showModal({
        title: "提示",
        content: "确定选择？",
        success(res) {
          if (res.confirm) {
            wx.cloud
              .callFunction({
                name: "power",
                data: {
                  id: id,
                  sign: sign
                }
              })
              .then(res => {
                //   console.log(res);
                that.dataList.splice(idx, 1);
                wx.showToast({
                  duration: 1000
                });
              })
              .catch(e => {
                console.log(e);
              });
          } else if (res.cancel) {
            return;
          }
        }
      });
    },
    getData() {
      db
        .collection("publicData")
        .where({
          sign: ""
        })
        .get()
        .then(res => {
          console.log(res.data);
          this.dataList = res.data;
          this.dataList.forEach((val, idx) => {
            this.dataList[idx].date = this.$fn.formatTime(val.date);
            this.dataList[idx].details = true;
          });
        });
    }
  }
};
</script>
<style>
.my-setting {
  background: #f1f1f1;
}
.control {
  display: flex;
  background: #fff;
  position: relative;
  top: -10rpx;
  margin-bottom: 10rpx;
  padding: 0 20rpx 10rpx;
}
.control button {
  background: none;
  flex: 1;
  color: #fff;
  margin: 0 8rpx;
}
.control button:after {
  border: none;
}
.control .success {
  background: rgb(2, 168, 2);
}
.control .fail {
  background: rgb(235, 1, 1);
}
</style>
