function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (dateTime) {
  let date = new Date(dateTime)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
export function empower(){
  //判断授权状态
    wx.showModal({
      title: "提示",
      content: "请先去授权登录",
      confirmText: "去设置",
      confirmColor: "#576B95",
      success(res) {
        if (res.confirm) {
          wx.switchTab({
            url: "../my/main"
          });
        } else if (res.cancel) {
          if(getCurrentPages()[0].route === "pages/my/main"){
            wx.switchTab({
              url: '../my/main'
            })
          }else{
            wx.switchTab({
              url: "../home/main"
            });
          }
        }
      }
    });
  
}

export default {
  formatNumber,
  formatTime,
  empower
}
