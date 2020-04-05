// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"test00-ohk"
})

const db =cloud.database({
  env:"test00-ohk"
})

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  //_id date value userInfo
  await db.collection('publicData').doc(event.id).update({
    data:{
      comments:_.push({
        each:[
          {userInfo:event.userInfo,value:event.value,date:event.date}
        ],
        sort:{
          date:-1
        }
      })
    }
  }).then(res=>{
    console.log(res);
  }).catch(e=>{
    console.log(e);
  })

  return {
    success:"成功"
  }
}