<template>
    <div class="my-history-container" @click="$emit('navTo',data._id)">
        <div class="wrapper">
            <div class="head">
                <div class="head-img">
                    <img :src="data.userInfo.avatar" alt="">
                </div>
                <div class="name">{{data.userInfo.name}}</div>
                <span class="type">{{data.selectType}}</span>
            </div>
            <div class="title">标题 : {{data.textData.titleValue}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        data:Object
    }
}
</script>

<style>
.wrapper{
    background: #fff;
    padding: 16rpx;
    margin-top: 10rpx;
}
.head{
    display: flex;
    padding-bottom: 10rpx;
    border-bottom:2rpx solid #f1f1f1;
    align-items: center;
}
.head .head-img{
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    overflow: hidden;
}
.head .head-img img{
    width: 100%;
    height: 100%;
}
.head .name{
    line-height: 100rpx;
    margin-left: 16rpx;
    font-size: 36rpx;
}
.title{
    padding: 10rpx 0;
}
.type{
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
</style>
