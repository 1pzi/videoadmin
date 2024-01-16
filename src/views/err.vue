<template>
  <div class="error-page">
    <el-card class="error-card">
      <div class="error-icon">
        <i class="el-icon-error"></i>
      </div>
      <div class="error-content">
        <h2 class="error-title">{{ errorMessage }}</h2>
        <p class="error-description">很抱歉，页面暂时正在开发.....</p>
        <el-button type="primary" @click="reloadPage">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  props: {
    errorMessage: {
      type: String,
      required: true,
      default:'错误'
    }
  },
  methods: {
    reloadPage() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.error-card {
  width: 400px;
  padding: 20px;
  text-align: center;
}

.error-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.error-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.error-description {
  font-size: 16px;
  color: #909399;
  margin-bottom: 20px;
}

.el-button {
  margin-top: 10px;
}
</style>
