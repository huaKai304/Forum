// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "test00-ohk"
})

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('publicData')
    .where({
      _id: event.id
    })
    .update({
      data:{
        sign: event.sign
      }
    })

  return {
    event
  }
}
