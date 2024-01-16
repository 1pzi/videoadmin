import axios from 'axios'
import { Loading } from 'element-ui';
import router from '@/router';
let loadingInstance; // 用于保存Loading实例
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 3000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // 设置请求头
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    loadingInstance = Loading.service(); // 开启加载动画
    console.log('请求成功config', config);
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    if (res.status === 200) {
      loadingInstance.close(); // 关闭加载动画
      if (res.data.status === 1113||res.data.status === 1114) {
        Vue.prototype.$message.error('用户无权限');
        this.$store.commit('logout')
        location.reload(); // 刷新页面
        return
      } 
      console.log('请求成功response', res.data);
      return res;
    }
    return Promise.reject(res.data);
  },
  (err) => {
    if (err.code === 'ECONNABORTED' && err.message.includes('timeout')) {
      // 超时错误，重新发起请求
      return instance(err.config);
    }
    // 其他错误处理
    Vue.prototype.$message.error('请求失败');
    loadingInstance.close(); // 关闭加载动画
    return Promise.reject(err);
  }
);

export default instance
