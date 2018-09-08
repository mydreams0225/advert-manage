import $axios from 'axios';
import qs from 'qs';
let base = configs.base;
// 1、添加
export const reqAddggw = params => {
    return $axios.post(`${base}/partner/ad/save`,
        qs.parse(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/json", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
// 2.修改 reqEditggw
export const reqEditggw = params => {
    return $axios.post(`${base}/partner/ad/update`,
        qs.parse(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/json", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
// 3.查询 reqGGWList
export const reqGGWList = params => {
    return $axios.post(`${base}/partner/ad/list`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
//reqQRcode 
export const reqQRcode = params => {
    return $axios.post(`${base}/partner/ad/adContent`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};