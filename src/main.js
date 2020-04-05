import Vue from 'vue'
import App from './App'
import fn from './utils/index'
import 'font-awesome/css/font-awesome.min.css';

Vue.config.productionTip = false
Vue.prototype.$fn = fn
App.mpType = 'app'



const app = new Vue(App)
app.$mount()

getApp().globalData ={
    comments : [],
    zan:null
}
Vue.prototype.globalData = getApp().globalData
