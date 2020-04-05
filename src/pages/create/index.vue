<template>
  <div class="add-container">
    <div class="wrapper">
      <div class="title pub">
        <input type="text" v-model.lazy="textData.titleValue" placeholder="请填写标题">
      </div>
      <div class="textarea-or-imgs pub">
        <textarea style="width: 100%;" v-model.lazy="textData.textValue" placeholder="请输入内容描述..."></textarea>
        <div class="imgs">
          <div class="img-box" v-for="(img,idx) in uploadImgs" :key="idx">
            <img :src="img" alt>
            <span class="fa fa-close" @click="close(idx)"></span>
          </div>
          <img
            class="img-box"
            v-if="uploadImgs.length < 9"
            src="../../../static/images/upload.png"
            @click="onUpload"
            alt
          >
        </div>
      </div>
      <div class="fenlei pub after" @click="onSelect">
        <span class="left">选择分类</span>
        <span class="icon right fa fa-angle-right"></span>
        <span class="right">{{selectType}}</span>
      </div>
      <div class="name pub after">
        <span class="left">联系人</span>
        <input
          class="right"
          v-model.lazy="textData.nameValue"
          type="text"
          maxlength="5"
          placeholder="请输入联系人名称"
        >
      </div>
      <div class="phone-num pub after">
        <span class="left">联系方式</span>
        <input
          class="right"
          v-model.lazy="textData.numberValue"
          type="number"
          maxlength="11"
          placeholder="请填写有效电话号码"
        >
      </div>
      <div class="warn pub after">
        <checkbox-group @click="checkboxChange">
          <checkbox :checked="readState"/>
        </checkbox-group>
        <span>我已阅读并同意</span>
        <span style="color:red">《发布须知》</span>
      </div>
      <div class="submit pub">
        <button @click="onSubmit" :disabled="disabled">确认发布</button>
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
      textData: {
        titleValue: "",
        textValue: "",
        nameValue: "",
        numberValue: ""
      },
      readState: false,
      uploadImgs: [], //预览图
      fileIDs: [], //云库地址
      itemList: ["主题帖", "吹水帖", "讨论帖", "技术帖"],
      selectType: "",
      userInfo: null
    };
  },
  onLoad() {
    this.userInfo = this.globalData.userInfo;
  },
  onShow() {
    if (!this.globalData.userInfo) {
      this.$fn.empower()
    }
  },
  computed: {
    //判断是否为空设置disabled
    disabled() {
      if (
        !this.textData.titleValue ||
        !this.textData.textValue ||
        !this.textData.nameValue ||
        !this.textData.numberValue ||
        !this.readState ||
        !this.selectType
      ) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    //上传本地用作预览
    onUpload() {
      let that = this;
      wx.chooseImage({
        success(res) {
          //预览图片地址
          // console.log(res.tempFilePaths);
          let Imgs = res.tempFilePaths;
          Imgs.forEach((val, idx) => {
            that.uploadImgs.push(val);
            // console.log(that.uploadImgs);
          });
        }
      });
    },
    //取消图片
    close(idx){
      this.uploadImgs.splice(idx,1)
    },
    //分类选择
    onSelect() {
      let that = this;
      wx.showActionSheet({
        itemList: this.itemList,
        success(res) {
          // console.log(res.tapIndex);
          that.selectType = that.itemList[res.tapIndex];
        },
        fail(res) {
          console.log(res.errMsg);
        }
      });
    },
    //复选框
    checkboxChange(e) {
      this.readState = !this.readState;
    },
    //图片上传至云存储
    onUploadCloul() {
      let that = this;
      this.uploadImgs.forEach((val, idx) => {
        wx.cloud
          .uploadFile({
            cloudPath: `forum/${Math.ceil(Math.random(7) * 1000000000)}.png`, // 上传至云端的路径
            filePath: val // 小程序临时文件路径
          })
          .then(res => {
            that.fileIDs.push(res.fileID);
            if (that.fileIDs.length == that.uploadImgs.length) {
              that.onPutCloud();
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    //button提交数据
    onSubmit() {
      wx.showLoading({
        title: "发布中..."
      });
      //判断有无上传图片,有就执行存储图片到云端,没有就跳过存储
      if (this.uploadImgs.length > 0) {
        this.onUploadCloul();
      } else {
        this.onPutCloud();
      }
    },
    //存储到数据库
    onPutCloud() {
      let that = this;
      const todos = db
        .collection("publicData")
        .add({
          data: {
            textData: this.textData,
            fileIDs: this.fileIDs,
            selectType: this.selectType,
            userInfo: this.userInfo,
            date: new Date(),
            zanNum:[],
            comments:[],
            sign:''
          }
        })
        .then(res => {
          wx.hideLoading({
            success: function(res) {
              //用于表明是由发布页面跳到广场，触发广场刷新的标识
              that.globalData.add = true;
              wx.switchTab({
                url: "../home/main?id",
                success: function() {
                  console.log("成功");

                  //重置
                  (that.textData = {
                    titleValue: "",
                    textValue: "",
                    nameValue: "",
                    numberValue: ""
                  }),
                    (that.readState = false),
                    (that.uploadImgs = []), //预览图
                    (that.fileIDs = []), //云库地址
                    (that.selectType = "");
                },
                fail: function(err) {
                  console.log(err);
                }
              });
            },
            fail: function(err) {
              console.log(err);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.add-container {
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
}

.wrapper {
  overflow: hidden;
}
.pub {
  margin: 10rpx 0 0;
  padding: 10rpx 20rpx;
  background-color: #fff;
}
.wrapper .title input {
  display: block;
  height: 60rpx;
}
.wrapper .textarea-or-imgs {
  background: #fff;
}
.wrapper .textarea-or-imgs .imgs {
  display: inline-block;
  width: 100%;
}

.wrapper .textarea-or-imgs .imgs .img-box{
  display: inline-block;
  width: 230rpx;
  height: 230rpx;
  margin-right: 10rpx;
  margin-top: 10rpx;
  vertical-align: top;
  position: relative;
}
.imgs .img-box img{
  width: 100%;
  height: 100%;
}
.imgs .img-box span{
  position: absolute;
  right: -20rpx;
  top: -20rpx;
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  z-index: 888;
}

/* 3的倍数右外边距清除 */
.add-container .wrapper .textarea-or-imgs .imgs .img-box:nth-child(3n) {
  margin-right: 0;
}

.wrapper .fenlei span {
  height: 60rpx;
  line-height: 60rpx;
}
.wrapper .fenlei .icon {
  margin-left: 10rpx;
}

/* 需要清除浮动的容器 */
.after:after {
  height: 0;
  display: block;
  content: "";
  clear: both;
}
.left {
  float: left;
}
.right {
  float: right;
}
.wrapper .name span {
  line-height: 60rpx;
}
.wrapper .name input {
  text-align: right;
  display: block;
  height: 60rpx;
}

.wrapper .phone-num span {
  line-height: 60rpx;
}
.wrapper .phone-num input {
  text-align: right;
  display: block;
  height: 60rpx;
}
.wrapper .warn {
  height: 60rpx;
}
.wrapper .warn checkbox-group {
  zoom: 70%;
  line-height: 60rpx;
  float: left;
  position: relative;
  top: 10rpx;
}

.wrapper .warn span {
  line-height: 60rpx;
  font-size: 26rpx;
}

.wrapper .submit button {
  background: rgb(231, 3, 3);
  color: white;
}
.wrapper .submit button[disabled] {
  opacity: 0.6;
}
</style>
