// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'test00-ohk'
})
const db = cloud.database({
  env: 'test00-ohk'
})
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  //参数: 帖子ID,用户ID,类型type
  if(event.type === 'push'){
    await db.collection("publicData").doc(event._id).update({
      data: {
        zanNum: _.push(event.openid)
      }
    });
  }else{
    await db.collection("publicData").doc(event._id).update({
      data: {
        zanNum: _.pull(event.openid)
      }
    });
  }
  return {
    event
  }
}