import $axios from 'axios';
import qs from 'qs';
let base = configs.base;
// 查询充值信息
export const reqRechargeList = params => {
    return $axios.post(`${base}/tm/rechargeList`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
// 充值金额 
export const reqAddRecharge = params => {
    return $axios.post(`${base}/tm/recharge`,
        qs.parse(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/json", }  // 这里是跨域的写法  
        }).then(res => res.data);
};