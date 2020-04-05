<template>
  <div class="my-history">
    <div class="header">只展示最新10条记录...</div>
    <myHistory @navTo="navTo" v-for="(data,idx) in dataList" :key="idx" :data="data"></myHistory>
  </div>
</template>

<script>
import myHistory from "@/components/myHistory";
const db = wx.cloud.database({
  env:"test00-ohk"
})
export default {
  data() {
    return {
      userInfo: "",
      dataList:[],
    };
  },
  components: {
    myHistory
  },
  onShow() {
    if (!this.globalData.userInfo.name) {
      this.$fn.empower();
      return;
    }
    this.userInfo = this.globalData.userInfo;
    this.getData()
  },
  methods: {
    navTo(id){
      wx.navigateTo({
        url: '../details/main?id='+id
      })
    },
    getData(){
      let that = this;   
      let data = this.userInfo.history.slice()
      // console.log(data);
      const _ = db.command
      db.collection('publicData').where({
        _id: _.in(data)
      })
      .field({
        userInfo:true,
        textData:true,
        selectType:true
      })
      .get({
        success: function(res){
          // console.log(res.data);
          that.dataList = res.data;
        },
        fail: console.error
      })
    }
  }
};
</script>

<style scoped>
.header{
  height: 80rpx;
  font-size: 36rpx;
  font-weight: 700;
  text-align: center;
  line-height: 80rpx;
  background: #fff;
}
.my-history{
  background: #f5f5f5;
}
</style>
