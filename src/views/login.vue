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
          <label class="input-label" :class="{ 'active': passwordActive }">密码</label>
        </div>
        <el-button class="btn1" @click="login" type="primary" :loading="loading">登录</el-button>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      usernameActive: false,
      passwordActive: false,
      loading: false
    };
  },
  methods: {
    login() {
      const username = this.form.username;
      const password = this.form.password;
      this.loading = true; // 显示Loading组件
      if (username !== '' && password !== '') {
        this.$store.dispatch('login', { username, password }).then((success) => {
          this.loading = false; // 隐藏Loading组件
          console.log('数据为', success);
          if (success.state === 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '登录成功',
              center: true
            });
            this.$router.push('/'); // 登录成功后跳转到指定页面
          } else {
            // 处理登录失败的情况，例如显示错误消息
            this.$message({
              showClose: true,
              message: success.msg,
              type: 'error',
              center: true
            });
          }
        });
      } else {
        this.$message({
          message: '账号或密码不能为空',
          type: 'warning',
          center: true
        });
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
</style>
  