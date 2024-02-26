<template>
  <div class="containerbox">
    <div class="login-wrapper">
      <div class="header">管理员登录</div>
      <div class="form-wrapper">
        <div class="input-container">
          <input type="text" name="username" v-model="form.username" @focus="onInputFocus('username')"
            @blur="onInputBlur('username')" ref="usernameInput">
          <label class="input-label" :class="{ 'active': usernameActive }">账号</label>
        </div>
        <div class="input-container">
          <input type="password" name="password" v-model="form.password" @focus="onInputFocus('password')"
            @blur="onInputBlur('password')" ref="passwordInput">
            <span class="yanjin" @click="togglePasswordVisibility" v-show="passwordActive">
            <i v-if="!passwordVisible" class="bi bi-eye-fill"></i>
            <i v-else class="bi bi-eye-slash-fill"></i>
          </span>
          <label class="input-label" :class="{ 'active': passwordActive }">密码</label>
        </div>
        <p class="pi" v-show="msg !== ''">{{ msg }}</p>
        <el-button class="btn1" @click="login" type="primary" :loading="loading">登录</el-button>
        <!-- <el-button class="btn1" @click="showForgetPasswordDialog = true" type="text">忘记密码</el-button> -->
      </div>
    </div>
    <!-- 忘记密码弹出层 -->
    <!-- <el-dialog title="忘记密码" :visible.sync="showForgetPasswordDialog">
      <el-form :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPassword" type="primary">重置密码</el-button>
        <el-button @click="showForgetPasswordDialog = false">取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
  
<script>
import { Login } from '@/api';
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      usernameActive: false,
      passwordActive: false,
      loading: false,
      msg: '',
      showForgetPasswordDialog: false,
      passwordVisible: true // 控制密码是否可见的状态
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible; // 切换密码可见状态
      if (this.passwordVisible) {
        this.$refs.passwordInput.type = 'password'
      } else {
        this.$refs.passwordInput.type = 'text'
      }
    },
    // resetPassword() {
    //   // 重置密码逻辑
    //   console.log('重置密码');
    //   const message = JSON.stringify(this.form.username);
    //   const encryptedData = this.aesEncrypt(message, this.aesKey, this.aesIV);
    //   const escapedEncryptedString = encodeURIComponent(encryptedData);
    //   this.$fetchApi(ResetPwd.url, ResetPwd.method, { param: escapedEncryptedString }, (res) => {
    //     if (res.Code == 0) {
    //       this.$message({
    //         showClose: true,
    //         type: 'success',
    //         message: '重置成功',
    //         center: true
    //       });
    //       this.showForgetPasswordDialog = false; // 关闭忘记密码弹出层
    //     } else {
    //       this.$message({
    //         showClose: true,
    //         message: res.Msg,
    //         type: 'error',
    //         center: true
    //       });
    //     }
    //   });
    // },
    login() {
      const username = this.form.username;
      const password = this.form.password;
      this.loading = true; // 显示Loading组件
      if (username !== '' && password !== '') {
        const userinfo = {
          name: username,
          pwd: password,
          client: 1
        };
        const message = JSON.stringify(userinfo);
        const encryptedData = this.aesEncrypt(message, this.aesKey, this.aesIV);
        const escapedEncryptedString = encodeURIComponent(encryptedData);
        var t = this;
        this.$fetchApi(Login.url, Login.method, { param: escapedEncryptedString }, (res) => {
          if (res.Code == 0) {
            this.loading = false
            this.msg = ''
            console.log('登录成功', t === this);
            const decodedURL = decodeURIComponent(res.Data.result)
            console.log(decodedURL);
            const decryptedText = t.aesDecrypt(decodedURL, t.aesKey, t.aesIV)
            console.log(decryptedText);
            // 将解密后的数据对象转换为JSON格式
            const jsonData = JSON.parse(decryptedText);
            console.log('登录成功数据jsonData', jsonData)
            const user = {
              username: jsonData.name,
              result: jsonData,
              cookie: res.Data.result
            };
            this.$store.commit('setUser', user);
            this.$message({
              showClose: true,
              type: 'success',
              message: '登录成功',
              center: true
            });
            this.$router.push('/'); // 登录成功后跳转到指定页面
          } else {
            // this.$message({
            //   showClose: true,
            //   message: res.Msg,
            //   type: 'error',
            //   center: true
            // });
            this.msg = res.Msg
            this.loading = false
          }
        });
      } else {
        // this.$message({
        //   message: '账号或密码不能为空',
        //   type: 'warning',
        //   center: true
        // });
        this.msg = '账号或密码不能为空'
        this.loading = false
      }
    },

    onInputFocus(inputType) {
      if (inputType === 'username') {
        this.usernameActive = true;
      } else if (inputType === 'password') {
        this.passwordActive = true;
      }
    },
    onInputBlur(inputType) {
      if (inputType === 'username') {
        if (!this.form.username) {
          this.usernameActive = false;
        }
      } else if (inputType === 'password') {
        if (!this.form.password) {
          this.passwordActive = false;
        }
      }
    },
    checkInitialValues() {
      if (this.form.username) {
        this.usernameActive = true;
      }
      if (this.form.password) {
        this.passwordActive = true;
      }
    }
  },
  mounted() {
    this.checkInitialValues();
  }
};
</script>
  
  
<style scoped>
* {
  margin: 0;
  padding: 0;
}

.containerbox {
  height: 100vh;
  width: 100%;
  background-image: linear-gradient(to right, #a8edea 0%, #fed6e3 100%);
  color: black;
}

.login-wrapper {
  background-color: #fff;
  width: 500px;
  height: 440px;
  border-radius: 15px;
  padding: 0 50px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 150px;
}

.btn1 {
  text-align: center;
  padding: 10px;
  width: 100%;
  margin-top: 40px;
}

a {
  text-decoration-line: none;
  color: #abc1ee;
}

.input-container {
  position: relative;
  margin-bottom: 20px;
}

.input-container input {
  width: 100%;
  padding: 10px;
  border: 0;
  border-bottom: 1px solid rgb(128, 125, 125);
  font-size: 15px;
  outline: none;
}

.input-label {
  position: absolute;
  left: 10px;
  top: 10px;
  transition: 0.3s;
  pointer-events: none;
}

.input-label.active {
  top: -15px;
  font-size: 12px;
  color: #aaa;
}

.yanjin {
  opacity: 0.7;
  position: absolute;
  right: 0;
  top: 24%;
}

.pi {
  position: absolute;
  left: 35%;
  margin-top: 10px;
  color: red;
}
</style>
  