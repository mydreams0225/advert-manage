import $axios from 'axios';
import qs from 'qs';
let base = configs.base;
// 1、查询  
export const reqAdEleList = params => {
    return $axios.post(`${base}/advert/ad/list`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
//reqEditadEle
export const reqEditadEle = params => {
    return $axios.post(`${base}/advert/ad/update`,
    qs.parse(params, { indices: false }),
    {  // 这里是跨域写法  
        headers: { "Content-Type": "application/json", }  // 这里是跨域的写法  
    }).then(res => res.data);
};

//reqEditadEle
export const reqAddadEle = params => {
    return $axios.post(`${base}/advert/ad/save`,
    qs.parse(params, { indices: false }),
    {  // 这里是跨域写法  
        headers: { "Content-Type": "application/json", }  // 这里是跨域的写法  
    }).then(res => res.data);
};
//reqRemoveELe
export const reqRemoveELe = params => {
    return $axios.post(`${base}/advert/ad/remove`,
    qs.stringify(params, { indices: false }),
    {  // 这里是跨域写法  
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
    }).then(res => res.data);
};