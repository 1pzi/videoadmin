
//导入创建好的axios实例
// import request from '@/utlis/request';

// // 管理员登录
// export function Login(param) {
//   return request({
//     url: '/api/sfu/login_code',
//     method: 'post',
//     data: {
//       param: param
//     }
//   })
// }
// // 添加用户
// export function AddClient(param) {
//   return request({
//     url: '/api/sfu/add_client',
//     method: 'post',
//     data: {
//       param: param
//     }
//   })
// }
// // 拉取用户信息
// export function GetClientlist(page, size) {
//   return request({
//     url: `/api/sfu/get_client_list?page=${page}&size=${size}`,
//     method: 'get',
//   })
// }
// // 修改用户信息
// export function ModifyClient(param) {
//   return request({
//     url: '/api/sfu/modify_client',
//     method: 'post',
//     data: {
//       param: param
//     }
//   })
// }

export const Login = { url: '/api/adminnn/login', method: 'post' }//登录
export const AddClient = { url: '/api/adminnn/add_client', method: 'post' }//web客户端拉取当前流数据
export const GetClientlist = { url: '/api/adminnn/get_client_list', method: 'post' }//注册
export const ModifyClient = { url: '/api/adminnn/modify_client', method: 'post' }// 修改用户信息
export const ResetPwd = { url: '/api/adminnn/reset_client_pwd', method: 'post' }// 修改用户信息

