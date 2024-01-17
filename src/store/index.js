import Vue from 'vue';
import Vuex from 'vuex';
import { Login } from '@/api/index';
import router from '@/router';
// 导入AES加密库（crypto-js）
// import GibberishAES from 'gibberish-aes/src/gibberish-aes';

Vue.use(Vuex);
const USER_KEY = 'user';
export default new Vuex.Store({
  state: {
    user: null, // 用户信息
    isLoggedIn: false, // 登录状态
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isLoggedIn = true;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    // },
    logout(state) {
      console.log('调用了退出登录');
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem(USER_KEY);
      router.push({ path: "/login" })
    },
    initializeStore(state) {
      console.log('执行 initializeStore');
      const user = localStorage.getItem(USER_KEY);
      console.log('从本地存储中读取用户信息：', user);
      if (user) {
        state.user = JSON.parse(user);
        state.isLoggedIn = true;
        console.log('用户已登录');
      } else {
        console.log('用户未登录');
      }
    }

  },
  actions: {
    async login({ commit }, { username, password }) {
      const userinfo = {
        name: username,
        pwd: password,
        client: 1
      };
      const Key = 'MNaa59WfNLaoTiLM+aERckO5ksE4-0xw'
      // 使用AES加密用户信息
      const encryptedData = GibberishAES.aesEncrypt(JSON.stringify(userinfo), Key);
      const decryptedText = GibberishAES.aesDecrypt(encryptedData, Key);
      console.log('加密AES', encryptedData);
      var escapedEncryptedString = encodeURIComponent(encryptedData); // 对字符串进行转义
      console.log('转义后', JSON.stringify(escapedEncryptedString));
      console.log('解码后', decryptedText);
      try {
        // 调用后端登录接口
        const response = await Login(escapedEncryptedString);
        console.log('登录成功后端返回数据response', response);
        if (response.data.status === 0) {
          const decodedURL = decodeURIComponent(response.data.data.result)
          const decryptedText = GibberishAES.aesDecrypt(decodedURL, Key)
          // 将解密后的数据对象转换为JSON格式
          const jsonData = JSON.parse(decryptedText)
          console.log('登录成功数据jsonData', jsonData)
          const user = {
            username: username,
            result: jsonData
          };
          commit('setUser', user);
          document.cookie = `cookie=${response.data.data.result}`;
          return { state: 0, msg: '登录成功' };
        } else if (response.data.status === 1000) {
          // 参数错误的处理逻辑
          return { state: 1000, msg: '参数错误' };
        } else if (response.data.status === 1114) {
          // 没有权限的处理逻辑
          return { state: 1114, msg: '账号已被冻结,请联系工作人员！' };
        } else if (response.data.status === 8119) {
          // 用户名或密码错误的处理逻辑
          return { state: 8119, msg: '账号或密码错误' };
        }
      } catch (error) {
        console.error('登录失败', error);
        return false; // 登录失败
      }
    },
    logout({ commit }) {
      commit('logout');
    },
  },
  getters: {
    // 获取数据
    getUser(state) {
      return state.user.username
    }
  },
});
