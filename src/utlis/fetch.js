
var CryptoJS = require("crypto-js");
import { Loading } from 'element-ui';
let loadingInstance; // 用于保存Loading实例

const config = {
  // 根据需要设置不同的开发和本地测试地址
  development: 'http://8.137.88.72:8612',
  localTest: 'http://8.137.88.72:8612'
};

const requestUrl = process.env.NODE_ENV === 'development' ? config.development : config.localTest;
console.log('地址选项', process.env);
export default {
  install: Vue => {
    // 请求函数
    // url：请求接口
    // methods: 请求方法 默认为post
    // isToken：是否验证Token
    // paramse：请求参数 JSON格式
    // call：请求成功后处理函数
    // errCall：请求失败后处理函数
    Vue.prototype.aesKey = '4d4e6161353957664e4c616f54694c4d2b614552636b4f356b7345342d307877';
    // Vue.prototype.aesIV = CryptoJS.enc.Hex.parse('30303030303030303030303030303030'); // 16 bytes for AES
    Vue.prototype.aesIV = CryptoJS.enc.Hex.parse('00000000000000000'); // 16 bytes for AES

    //AES加密
    Vue.prototype.aesEncrypt = function (message, aesKey, aesIV) {
      var key = CryptoJS.enc.Hex.parse(aesKey); // 32 bytes for AES-256
      var encrypted = CryptoJS.AES.encrypt(message, key, { iv: aesIV, mode: CryptoJS.mode.CBC });
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }

    //AES解密
    Vue.prototype.aesDecrypt = function (encrypted, aesKey, aesIV) {
      var key = CryptoJS.enc.Hex.parse(aesKey); // 32 bytes for AES-256
      var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: aesIV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }

    Vue.prototype.$fetchApi = function (url, methods, params, call, errCall = false) {
      loadingInstance = Loading.service(); // 开启加载动画

      var headers = {
        'Content-Type': 'application/json',
      }
      fetch(requestUrl + url, {
        method: methods,
        body: JSON.stringify(params),
        headers: headers,
        // mode: 'cors',
        // credentials: 'include'
      }).then(function (data) {
        console.log('请求成功', data);
        return data.json();
      }).then(function (data) {
        call(data);
        loadingInstance && loadingInstance.close(); // 关闭加载动画
      }).catch(function (res) {
        //Toast('请求错误');
        if (errCall) {
          errCall(res)
        }
        loadingInstance && loadingInstance.close(); // 关闭加载动画


      });
    }



  }
}
