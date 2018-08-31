// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import { LoginUsers, Users } from './data/user';
// let _Users = Users;

// export default {
//   /**
//    * mock bootstrap
//    */
//   bootstrap() {
//     let mock = new MockAdapter(axios);

//     // mock success request
//     mock.onGet('/success').reply(200, {
//       msg: 'success'
//     });

//     // mock error request
//     mock.onGet('/error').reply(500, {
//       msg: 'failure'
//     });

//     // 登录
//     mock.onPost('/login').reply(config => {
//       let { username, password } = JSON.parse(config.data);
//       return new Promise((resolve, reject) => {
//         let user = null;

//         setTimeout(() => {
//           let hasUser = LoginUsers.some(u => {
//             if (u.username === username && u.password === password) {
//               user = JSON.parse(JSON.stringify(u));
//               user.password = undefined;
//               return true;
//             }
//           });
//           if (hasUser) {
//             resolve([200, { code: 200, msg: '请求成功', user }]);
//           }
//           else {
//             resolve([200, { code: 500, msg: '账号或密码错误' }]);
//           }
//         }, 1000);
//       });
//     });
    
//     // 获取停车场信息
//     mock.onGet('/parklist').reply(config => {
//       let { name } = config.params;
//       let mockParks = _Users.filter(user => {
//         if (name && user.name.indexOf(name) == -1) return false;
//         return true;
//       });
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve([200, {
//             users: mockUsers
//           }]);
//         }, 1000);
//       });
//     });
//   }
// };