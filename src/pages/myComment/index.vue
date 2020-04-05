<template>
  <div class="myComment-container">
    <myComment @navTo='navTo' v-for="(data,idx) in dataList" :key="idx" :data="data"></myComment>
  </div>
</template>

<script>
import myComment from "@/components/myComment";
const db = wx.cloud.database({
  env: "test00-ohk"
});

export default {
  data() {
    return {
      openid: "",
      dataList: []
    };
  },
  onShow() {
    if (!this.globalData.userInfo.name) {
        this.$fn.empower();
        return;
    }
    this.openid = this.globalData.userInfo.openid;
    this.getData();
  },
  methods: {
    navTo(id) {
      wx.navigateTo({
        url: "../details/main?id=" + id
      });
    },
    getData() {
      db
        .collection("publicData")
        .where({
          "comments.userInfo.openid": this.openid
        })
        .get()
        .then(res => {
        //   console.log(res.data);
          this.dataList = res.data;
          this.dataList.forEach((val, idx) => {
            let newComments = val.comments.filter((value, index) => {
              return value.userInfo.openid === this.openid;
            });
            this.dataList[idx].comments = newComments;
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  components: {
    myComment
  }
};
</script>

<style scoped>
.myComment-container {
  background: #f2f2f2;
}
</style>
