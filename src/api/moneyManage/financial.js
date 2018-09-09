import $axios from 'axios';
import qs from 'qs';
let base = configs.base;
// 1.查询 reqRechargeList 报表
export const reqfinaState = params => {
    return $axios.post(`${base}/tm/finance/loadChart`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
//reqfsTable  顶部请求
export const reqfsTable = params => {
    return $axios.post(`${base}/tm/finance/getFinanceInfo`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};