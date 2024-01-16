<template>
  <div class="admin-panel">
    <!-- 弹出层 -->
    <el-dialog :visible.sync="dialogVisible" title="修改参数" top="0">
      <el-form :model="options" label-width="120px">
        <el-form-item label="宽高比例">
          <el-select v-model="aspectRatio" placeholder="请选择宽高比例" @change="bili" style="width: 100%;">
            <el-option label="4:3" value="4:3"></el-option>
            <el-option label="16:9" value="16:9"></el-option>
            <!-- 添加其他比例选项 -->
          </el-select>
        </el-form-item>
        <el-form-item label="采样宽度">
          <el-select v-model="options.width" placeholder="请选择采样宽度" @change="updateHeight" style="width: 100%;">
            <el-option label="1024" value="1024"></el-option>
            <el-option label="640" value="640"></el-option>
            <el-option label="1920" value="1920"></el-option>
            <el-option label="1280" value="1280"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采样高度">
          <el-input v-model="options.height" disabled></el-input>
        </el-form-item>
        <el-form-item label="推流输出宽度">
          <el-input v-model="options.output_w" @change="updateOpHeight"></el-input>
        </el-form-item>
        <el-form-item label="推流输出高度">
          <el-input v-model="options.output_h" disabled></el-input>
        </el-form-item>
        <el-form-item label="最大码率">
          <el-input v-model="options.max" placeholder="请选择最大码率0为不限制" @change="handleMaxChange"></el-input>
        </el-form-item>
        <el-form-item label="最低码率">
          <el-input v-model="options.min" placeholder="请选择最小码率0为不限制" @change="handleMinChange"></el-input>
        </el-form-item>
        <el-form-item label="当前码率">
          <el-input v-model="options.cur" placeholder="请选择当前码率0为不限制" @change="handleCurChange"></el-input>
        </el-form-item>
        <el-form-item label="帧率">
          <el-input v-model="options.fps" @change="validateFps" placeholder="帧率输入在15到40之间"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="saveChanges">修改</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="5">
        <el-menu default-active="userList" class="side-menu" @select="handleMenuSelect">
          <el-menu-item index="addUser">
            <i class="el-icon-plus"></i>
            <span>添加用户</span>
          </el-menu-item>
          <el-menu-item index="userList">
            <i class="el-icon-menu"></i>
            <span>用户列表</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18">
        <div class="content">
          <div v-show="activeTab === 'addUser'">
            <h3>添加用户</h3>
            <el-form label-width="80px">
              <el-form-item label="账号">
                <el-input v-model="form.username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addUser">添加</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="activeTab === 'userList'">
            <h3>用户列表</h3>
            <template v-if="indexedUserList.length > 0">
              <el-table :data="indexedUserList" style="width: 100%">
                <el-table-column label="id" width="60" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.index }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="账号" width="100" header-align="center"
                  align="center"></el-table-column>
                <el-table-column prop="pwd" label="密码" width="60" header-align="center" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-lock"></i>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="60" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.status === 1 ? '正常' : '冻结' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="time" label="添加时间" header-align="center" align="center">
                  <template slot-scope="scope">
                    {{ formatTimestamp(scope.row.time) }}
                  </template>
                </el-table-column>
                <el-table-column prop="update" label="修改时间" header-align="center" align="center">
                  <template slot-scope="scope">
                    {{ formatTimestamp(scope.row.update) }}
                  </template>
                </el-table-column>
                <el-table-column label="帧数" width="60" header-align="center" align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.config.fps">
                      <span>{{ scope.row.config.fps }}</span>
                    </template>
                    <template v-else>
                      <i class="el-icon-loading"></i>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="身份" width="100" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span :style="{ color: scope.row.pixel === 1 ? '#606266' : '#ff0000' }">{{ scope.row.pixel === 1 ?
                      '普通用户' : 'VIP用户' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="300" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="upgradeUser(scope.row)"
                      v-show="scope.row.pixel === 1">升级</el-button>
                    <el-button type="success" size="mini" disabled v-show="scope.row.pixel === 2">升级</el-button>
                    <el-button type="danger" size="mini" v-show="scope.row.status === 1"
                      @click="banUser(scope.row)">封号</el-button>
                    <el-button type="success" size="mini" v-show="scope.row.status === 2"
                      @click="banUser(scope.row)">解封</el-button>
                    <el-button type="primary" size="mini" @click="Modifyparameter(scope.row)">修改参数</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total"></el-pagination>
            </template>
            <template v-else>
              <el-empty description="暂无数据"></el-empty>
            </template>
          </div>
        </div>
      </el-col>

    </el-row>
    <!-- 下拉菜单 -->
    <div style="position: absolute;right: 40px;top: 20px;">
      <el-dropdown @command="handleCommand">
        <span class="welcome-text">欢迎,Admin</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
  
<script>
import { GetClientlist, AddClient, ModifyClient } from '@/api/index'
export default {
  data() {
    return {
      activeTab: 'userList',
      form: {
        username: '',
        password: ''
      },
      userList: [
        {
          id: 11,
          name: "user2",
          pwd: "e10adc3949ba59abbe56e057f20f883e",
          avatar: "",
          status: 1,
          time: 1702652521963,
          update: 1702652521963,
          device: "",
          web_ss: "",
          ios_ss: "",
          ad_ss: "",
          pixel: 23,
          fps: 4,
          config: ""
        },
        {
          id: 10,
          name: "user1",
          pwd: "e10adc3949ba59abbe56e057f20f883e",
          avatar: "",
          status: 1,
          time: 1702652521963,
          update: 1702652521963,
          device: "",
          web_ss: "a943c8488ntcqlrlegg3b6rdt8",
          ios_ss: "6rkdmfcc70lkooperf8e3f8gai",
          ad_ss: "",
          pixel: 4,
          fps: 2,
          config: ""
        },
      ],
      currentPage: 1,
      pageSize: 10,
      total: 10,
      options: {
        width: "1024",//采样宽度
        height: "768",//采样高度
        output_w: "1024",//推流输出宽度
        output_h: "768",//推流输出高度
        max: "0",//最大码率 0为不限制
        min: "0",//最低码率 0为不限制
        cur: "0",//当前码率 0为不限制
        fps: "30",//帧率
      },
      aspectRatio: '4:3',
      dialogVisible: false,
      userid: 1,
    };
  },
  mounted() {
    // 进入页面先获取数据默认从第一页每一页获取10条开始
    // this.getuserlist()
  },
  computed: {
    // 计算用户列表信息
    indexedUserList() {
      return this.userList.map((item, index) => {
        return {
          ...item,
          index: (this.currentPage - 1) * this.pageSize + index + 1
        };
      });
    },
    // 计算属性来格式化时间戳
    formatTimestamp() {
      return (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = this.padZero(date.getMonth() + 1); // 调用padZero方法补零
        const day = this.padZero(date.getDate());
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        const seconds = this.padZero(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };
  },
},
  methods: {
    // 辅助方法，用于在个位数前添加零
    padZero(num) {
      return num < 10 ? `0${num}` : num;
    },
    // 监听比例
    bili() {
      this.updateHeight()
      this.updateOpHeight()
    },
    // 监听采样宽
    updateHeight() {
      const [widthRatio, heightRatio] = this.aspectRatio.split(':').map(Number);
      this.options.height = Math.round((this.options.width / widthRatio) * heightRatio);
    },
    // 监听推流宽度
    updateOpHeight() {
      const [widthRatio, heightRatio] = this.aspectRatio.split(':').map(Number);
      let outputWidth = parseInt(this.options.output_w, 10);
      if (outputWidth % 2 === 0 && outputWidth % 8 === 0) {
        this.options.output_h = Math.round((outputWidth / widthRatio) * heightRatio);
      } else {
        this.$message({
          message: '输出宽度必须为偶数且是8的倍数息',
          type: 'warning'
        });
        this.options.output_w = '1024'
      }
    },
    // 监听最大码率
    handleMaxChange(value) {
      if (value === '') {
        this.options.max = '0';
      }
    },
    // 监听最小码率
    handleMinChange(value) {
      if (value === '') {
        this.options.min = '0';
      }
    },
    // 监听当前码率
    handleCurChange(value) {
      if (value === '') {
        this.options.cur = '0';
      }
    },
    // 监听帧率
    validateFps() {
      const fps = parseInt(this.options.fps, 10);
      if (isNaN(fps) || fps < 15 || fps > 40) {
        this.$message({
          message: '帧率必须在15到40之间',
          type: 'warning'
        });
        // 将输入的值变回原来的值
        this.options.fps = '30'; // 或者将其设置为原始的值
      }
    },
    // 获取用户列表
    getuserlist() {
      console.log('当前页数', this.currentPage, '一页一共', this.pageSize);
      const Key = 'MNaa59WfNLaoTiLM+aERckO5ksE4-0xw'
      GetClientlist(this.currentPage, this.pageSize)
        .then(response => {
          console.log('获取用户列表后端返回数据', response);
          const decodedURL = decodeURIComponent(response.data.data.result)
          const decryptedText = GibberishAES.aesDecrypt(decodedURL, Key)
          // 将解密后的数据对象转换为JSON格式
          const jsondata = JSON.parse(decryptedText)
          this.userList = jsondata.list
          this.total = jsondata.count
          // console.log('jsondata.list.config', jsondata.list.config);
          // this.options = jsondata.list.config === '' ? this.options : JSON.parse(jsondata.list.config)
          // console.log('options:', this.options);
          console.log('拉取所有用户的信息：', this.userList)
          console.log('jsondata:', jsondata);
        })
        .catch(error => {
          console.error('错误:', error);
          if (error.status === 1113) {
            this.$message({
              showClose: true,
              message: '登录账号失效，请重新登录',
              type: 'error',
              center: true
            });
            localStorage.clear(); // 清除本地缓存
            location.reload(); // 刷新页面
          }
        });
    },
    // 添加用户的逻辑
    addUser() {
      if (this.validatePassword(this.form.password)) {
        this.$confirm(`确定添加用户：${this.form.username}？是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            const from = {
              name: this.form.username,
              pwd: this.form.password,
              pixel: 1,//默认为普通用户
              fps: 2,//没有用
              config: JSON.stringify(this.options)
            };
            const Key = 'MNaa59WfNLaoTiLM+aERckO5ksE4-0xw'
            // 使用AES加密用户信息
            const AESjiami = GibberishAES.aesEncrypt(JSON.stringify(from), Key);
            console.log('加密后', AESjiami);
            var AESzy = encodeURIComponent(AESjiami); // 对字符串进行转义
            console.log('转义传给后端的数据是', AESzy);
            AddClient(AESzy)
              .then(res => {
                console.log('成功返回的数据', res.data);
                if (res.data.status === 0) {
                  this.$message({
                    type: 'success',
                    center: true,
                    message: '添加用户成功!'
                  });
                  this.form.username = '';
                  this.form.password = '';
                  this.getuserlist()
                  this.activeTab = 'userList'
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'error',
                    center: true
                  });
                }
              })
              .catch(error => {
                console.error('错误:', error);
              });

          })
          .catch(() => { });
      } else {
        this.$message({
          message: '密码至少包含大小写字母+数字且长度至少为8-16个字符',
          type: 'warning',
          center: true
        });
      }
    },
    // 退出登录
    tuichu() {
      this.$confirm('确定退出登录？是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$store.commit('logout')
      })
        .catch(() => { });
    },
    // 添加密码校验函数
    validatePassword(password) {
      // 密码校验逻辑：密码至少包含大小写字母+数字
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
      return regex.test(password);
    },
    // 切换标签
    handleMenuSelect(index) {
      // 切换显示内容
      this.activeTab = index;
    },
    // 分页
    handleCurrentChange(val) {
      // 处理分页变化
      this.currentPage = val;
      this.getuserlist()

    },
    handleCommand(command) {
      if (command === 'a') {
        this.tuichu()
      }
    },
    // 封号和解封逻辑
    banUser(row) {
      const status = row.status === 1 ? 2 : 1
      console.log(status);
      this.$confirm(`确定${row.status === 1 ? '冻结' : '解冻'}？是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const Key = 'MNaa59WfNLaoTiLM+aERckO5ksE4-0xw'
        const data = {
          id: row.id,
          status: status
        }
        // 使用AES加密用户信息
        const AESjiami = GibberishAES.aesEncrypt(JSON.stringify(data), Key);
        var AESzy = encodeURIComponent(AESjiami); // 对字符串进行转义
        console.log('要修改的数据：', data);
        ModifyClient(AESzy)
          .then(res => {
            console.log('修改成功返回的数据', res.data);
            if (res.data.status === 0) {
              this.$message({
                type: 'success',
                center: true,
                message: `${row.status === 1 ? '冻结' : '解冻'}成功`
              });
              this.getuserlist()

            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error',
                center: true
              });
            }
          })
          .catch(error => {
            console.error('错误:', error);
          });
      })
        .catch(() => { });

    },
    // 升级用户逻辑
    upgradeUser(row) {
      console.log(row);
      this.$confirm(`确定升级${row.name}？是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const Key = 'MNaa59WfNLaoTiLM+aERckO5ksE4-0xw'
        const data = {
          id: row.id,
          status: 2
        }
        // 使用AES加密用户信息
        const AESjiami = GibberishAES.aesEncrypt(JSON.stringify(data), Key);
        var AESzy = encodeURIComponent(AESjiami); // 对字符串进行转义
        console.log('要修改的数据：', data);
        ModifyClient(AESzy)
          .then(res => {
            console.log('修改成功返回的数据', res.data);
            if (res.data.status === 0) {
              this.$message({
                type: 'success',
                center: true,
                message: `${row.name}身份升级成功`
              });
              this.getuserlist()

            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error',
                center: true
              });
            }
          })
          .catch(error => {
            console.error('错误:', error);
          });
      })
        .catch(() => { });
    },
    // 点击修改参数
    Modifyparameter(row) {
      this.userid = row.id
      for (let user of this.userList) {
        if (user.id === row.id) {
          console.log(user.config);
          // this.options = JSON.parse(user.config);
          if (user.config.length > 15) {
            this.options = JSON.parse(user.config);
          } else {
            this.options = {
              width: "1024",//采样宽度
              height: "768",//采样高度
              output_w: "1024",//推流输出宽度
              output_h: "768",//推流输出高度
              max: "0",//最大码率 0为不限制
              min: "0",//最低码率 0为不限制
              cur: "0",//当前码率 0为不限制
              fps: "30",//帧率
            }
          }
          // // 使用 typeof 来判断 parsedConfig 是否为对象
          // if (typeof this.options === 'object' && this.options !== null) {
          //   this.options = JSON.parse(user.config);
          //   console.log('是一个对象');
          // } else {

          // }
          break; // 找到匹配的配置后退出循环
        }
      }
      this.dialogVisible = true;
      console.log(this.options);
    },
    // 取消按钮
    cancelDialog() {
      this.dialogVisible = false;
    },
    // 提交修改
    saveChanges() {
      const Key = 'MNaa59WfNLaoTiLM+aERckO5ksE4-0xw'
      const data = {
        id: this.userid,
        config: this.options
      }
      // 使用AES加密用户信息
      const AESjiami = GibberishAES.aesEncrypt(JSON.stringify(data), Key);
      var AESzy = encodeURIComponent(AESjiami); // 对字符串进行转义
      console.log('要修改的数据：', data);
      ModifyClient(AESzy)
        .then(res => {
          console.log('修改成功返回的数据', res.data);
          if (res.data.status === 0) {
            this.$message({
              type: 'success',
              center: true,
              message: '修改参数成功!'
            });
            this.dialogVisible = false;
            this.getuserlist()
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error',
              center: true
            });
          }
        })
        .catch(error => {
          console.error('错误:', error);
        });
    },

  }
};
</script>
  
<style scoped>
.welcome-text {
  cursor: pointer;
}

.admin-panel {
  margin: 20px;
}

.side-menu {
  height: 100%;
}

.content {
  padding: 20px;
}
</style>
  