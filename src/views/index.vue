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
            <el-option label="1600" value="1600"></el-option>
            <el-option label="1400" value="1400"></el-option>
            <el-option label="720" value="720"></el-option>
            <el-option label="700" value="700"></el-option>
            <el-option label="800" value="800"></el-option>
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
          <el-input v-model="options.fps" @change="validateFps" placeholder="请输入帧数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="saveChanges">修改</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="3" style="height:94vh;">
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
      <el-col :span="21">
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
            <div style="display: flex; justify-content: center;">
              <el-input v-model="searchAccount" placeholder="请输入用户账号进行搜索" @change="getuserlist"
                class="custom-input"></el-input>
              <el-button type="primary" @click="getuserlist"
                style="width: 80px;border-radius: 0px 4px 4px 0;background-color: #0099ff;">搜索</el-button>
            </div>
            <template v-if="indexedUserList.length > 0">
              <el-table :data="indexedUserList" style="width: 100%" :row-class-name="rowClass">
                <el-table-column label="id" width="60" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.index }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="账号" width="160" header-align="center" align="center">
                  <template slot-scope="scope">
                    <i v-if="scope.row.member_type !== 1" class="icon-vip" style="color: red;"></i>
                    <span :style="{ color: scope.row.member_type !== 1 ? 'red' : '' }">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="pwd" label="密码" width="80" header-align="center" align="center">
                  <template slot-scope="scope">
                    <i class="el-icon-lock"></i>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="80" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span :style="{ color: scope.row.status === 1 ? '#08ae08' : '#ff0000' }">{{ scope.row.status === 1 ?
                      '正常' : '冻结' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="time" label="添加时间" width="170" header-align="center" align="center">
                  <template slot-scope="scope">
                    {{ formatTimestamp(scope.row.time) }}
                  </template>
                </el-table-column>
                <el-table-column prop="update" label="修改时间" width="170" header-align="center" align="center">
                  <template slot-scope="scope">
                    {{ formatTimestamp(scope.row.update) }}
                  </template>
                </el-table-column>
                <el-table-column label="帧数" width="60" header-align="center" align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.config !== ''">
                      <span>{{ scope.row.config | getfps }}</span>
                    </template>
                    <template v-else>
                      <i class="el-icon-warning-outline"></i>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="身份" width="80" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.member_type === 1"> 普通用户</span>
                    <i v-else class="icon-VIP" style="color: red;">会员</i>
                  </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="upgradeUser(scope.row)"
                      v-show="scope.row.member_type === 1" style="margin-left: 10px;">升级</el-button>
                    <el-button type="success" size="mini" disabled v-show="scope.row.member_type !== 1">升级</el-button>
                    <el-button type="danger" size="mini" v-show="scope.row.status === 1"
                      @click="banUser(scope.row)">冻结</el-button>
                    <el-button type="info" size="mini" v-show="scope.row.status === 2"
                      @click="banUser(scope.row)">解冻</el-button>
                    <el-button type="primary" size="mini" @click="Modifyparameter(scope.row)">修改参数</el-button>
                    <el-button type="primary" size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
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
        <span class="welcome-text"><i class="icon-xitongguanliyuan"></i>欢迎!{{ $store.state.user.username }}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="忘记密码" :visible.sync="showForgetPasswordDialog">
      <el-form :model="form" label-width="80px">
        <!-- <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号"></el-input>
        </el-form-item> -->
      <el-form-item label="密码">
        <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPassword" type="primary">重置密码</el-button>
        <el-button @click="showForgetPasswordDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import { GetClientlist, AddClient, ModifyClient, ResetPwd } from '@/api/index'
export default {
  data() {
    return {
      activeTab: 'userList',
      form: {
        username: '',
        password: ''
      },
      userList: [
        // {
        //     id: 11,
        //     name: "user2",
        //     pwd: "e10adc3949ba59abbe56e057f20f883e",
        //     avatar: "",
        //     status: 1,
        //     time: 1702652521963,
        //     update: 1702652521963,
        //     device: "",
        //     web_ss: "",
        //     ios_ss: "",
        //     ad_ss: "",
        //     pixel: 1,
        //     fps: 4,
        //     config: "{\"width\":\"1024\",\"height\":\"768\",\"output_w\":\"1024\",\"output_h\":\"768\",\"max\":\"0\",\"min\":\"0\",\"cur\":\"0\",\"fps\":\"30\"}"
        //   },
        //   {
        //     id: 10,
        //     name: "user1",
        //     pwd: "e10adc3949ba59abbe56e057f20f883e",
        //     avatar: "",
        //     status: 1,
        //     time: 1702652521963,
        //     update: 1702652521963,
        //     device: "",
        //     web_ss: "a943c8488ntcqlrlegg3b6rdt8",
        //     ios_ss: "6rkdmfcc70lkooperf8e3f8gai",
        //     ad_ss: "",
        //     pixel: 4,
        //     fps: 2,
        //     config: ""
        //   },
      ],
      currentPage: 1,
      showForgetPasswordDialog: false,
      ispost: false,
      pageSize: 10,
      total: 10,
      searchAccount: '',//用户输入的账号
      options: {
        width: "640",//采样宽度
        height: "480",//采样高度
        output_w: "640",//推流输出宽度
        output_h: "480",//推流输出高度
        max: "1200",//最大码率 0为不限制
        min: "100",//最低码率 0为不限制
        cur: "1200",//当前码率 0为不限制
        fps: "30",//帧率
      },
      Key: 'MNaa59WfNLaoTiLM+aERckO5ksE4-0xw',
      aspectRatio: '4:3',
      dialogVisible: false,
      userid: 1,
    };
  },
  mounted() {
    // 进入页面先获取数据默认从第一页每一页获取10条开始
    this.getuserlist()
  },
  filters: {
    getfps(val) {
      const config = val === '' ? '' : JSON.parse(val)
      return config.fps || ''
    }
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
    resetPassword(row) {
      // 重置密码逻辑
      console.log('重置密码', row.id);
      const message = JSON.stringify(row.name);
      const encryptedData = this.aesEncrypt(message, this.aesKey, this.aesIV);
      const escapedEncryptedString = encodeURIComponent(encryptedData);
      this.$fetchApi(ResetPwd.url, ResetPwd.method, { param: escapedEncryptedString }, (res) => {
        if (res.Code == 0) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '重置成功',
            center: true
          });
        } else {
          this.$message({
            showClose: true,
            message: res.Msg,
            type: 'error',
            center: true
          });
        }
      });
    },
    rowClass({ row }) {
      // console.log('rowclss', row);
      return row.member_type !== 1 ? 'vip' : 'novip';
    },
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
        this.options.output_w = '640'
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
      console.log(fps);
      if (isNaN(fps) || fps <= 15) {
        this.$message({
          message: '帧率必须大于等于15',
          type: 'warning'
        });
        // 将输入的值变回原来的值
        this.options.fps = '30'; // 或者将其设置为原始的值
      }
    },
    // 获取用户列表
    getuserlist() {
      console.log('当前页数', this.currentPage, '一页一共', this.pageSize);
      const list = this.searchAccount === '' ?
        { page: this.currentPage, size: this.pageSize } :
        { page: this.currentPage, size: this.pageSize, name: this.searchAccount };
      console.log(list);
      const message = JSON.stringify(list);
      const encryptedData = this.aesEncrypt(message, this.aesKey, this.aesIV);
      const escapedEncryptedString = encodeURIComponent(encryptedData);
      var t = this;
      try {
        this.$fetchApi(GetClientlist.url, GetClientlist.method, { param: escapedEncryptedString, sfu_cookie: this.$store.state.user.cookie }, (res) => {
          console.log(res);
          if (res.Code === 0) {
            const decodedURL = decodeURIComponent(res.Data.result)
            console.log(decodedURL);
            const decryptedText = t.aesDecrypt(decodedURL, t.aesKey, t.aesIV)
            console.log(decryptedText);
            // 将解密后的数据对象转换为JSON格式
            const clientlist = JSON.parse(decryptedText);
            console.log('clientlist:', clientlist);
            this.userList = clientlist.list
            console.log('拉取所有用户的信息：', this.userList)
            this.total = clientlist.count
            this.options = clientlist.list.config === '' ? this.options : JSON.parse(clientlist.list.config)
            console.log('options:', this.options);
            this.currentPage = clientlist.page
            this.pageSize = clientlist.size
          } else {
            this.$message({
              showClose: true,
              message: '登录账号失效，请重新登录',
              type: 'error',
              center: true
            });
            localStorage.clear(); // 清除本地缓存
            location.reload(); // 刷新页面
          }

        })
      } catch (error) {
        console.log(error);
      }
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

            // 使用AES加密用户信息
            const AESjiami = GibberishAES.aesEncrypt(JSON.stringify(from), this.Key);
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
      this.$confirm(`确定${row.status === 1 ? '冻结' : '解冻'}用户${row.name}？是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        const status = row.status === 1 ? 2 : 1
        console.log(status);
        const data = {
          id: row.id,
          status: status
        }
        const message = JSON.stringify(data);
        const encryptedData = this.aesEncrypt(message, this.aesKey, this.aesIV);
        const escapedEncryptedString = encodeURIComponent(encryptedData);
        this.$fetchApi(ModifyClient.url, ModifyClient.method, { param: escapedEncryptedString, sfu_cookie: this.$store.state.user.cookie }, (res) => {
          console.log('修改成功返回的数据', res);
          if (res.Code === 0) {
            this.$message({
              type: 'success',
              center: true,
              message: `${row.status === 1 ? '冻结' : '解冻'}成功`
            });
            this.getuserlist()
          } else {
            this.$message({
              showClose: true,
              message: res.Msg,
              type: 'error',
              center: true
            });
          }

        })
      })
        .catch(() => { });

    },
    // 升级用户逻辑
    upgradeUser(row) {
      console.log(row);
      this.$confirm(`确定升级用户${row.name}？是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {

        const data = {
          id: row.id,
          member_type: 2
        }
        console.log(data);
        const message = JSON.stringify(data);
        const encryptedData = this.aesEncrypt(message, this.aesKey, this.aesIV);
        const escapedEncryptedString = encodeURIComponent(encryptedData);
        this.$fetchApi(ModifyClient.url, ModifyClient.method, { param: escapedEncryptedString, sfu_cookie: this.$store.state.user.cookie }, (res) => {
          console.log('修改成功返回的数据', res);
          if (res.Code === 0) {
            this.$message({
              type: 'success',
              center: true,
              message: `${row.name}身份升级成功`
            });
            this.getuserlist()

          } else {
            this.$message({
              showClose: true,
              message: res.Msg,
              type: 'error',
              center: true
            });
          }
        })
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
              width: "640",//采样宽度
              height: "480",//采样高度
              output_w: "640",//推流输出宽度
              output_h: "480",//推流输出高度
              max: "1200",//最大码率 0为不限制
              min: "100",//最低码率 0为不限制
              cur: "1200",//当前码率 0为不限制
              fps: "30",//帧率
            }
          }

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
      const data = {
        id: this.userid,
        config: this.options
      }
      console.log(data);
      const message = JSON.stringify(data);
      const encryptedData = this.aesEncrypt(message, this.aesKey, this.aesIV);
      const escapedEncryptedString = encodeURIComponent(encryptedData);
      this.$fetchApi(ModifyClient.url, ModifyClient.method, { param: escapedEncryptedString, sfu_cookie: this.$store.state.user.cookie }, (res) => {
        if (res.Code === 0) {
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
            message: res.Msg,
            type: 'error',
            center: true
          });
        }
      })
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
<style>
.vip {
  background-color: #f5f5f5 !important
}

.novip {
  background-color: #ffffff !important
}

.custom-input {
  width: 40% !important
}

.custom-input input {
  border-radius: 4px 0 0 4px;
}
</style>
  