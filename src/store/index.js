import Vue from 'vue'
import Vuex from 'vuex'
// import storage from '@/utils/storage'
import { getTkoen, setToken } from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 声明token
    user: getTkoen()
  },
  mutations: {
    // 修改token
    setUser (state, payLoad) {
      state.user = payLoad
      // token存放在本地存储
      setToken(payLoad)
    }
  }
})
