
import $axios from 'axios';
import qs from 'qs';
let base = configs.base;
// reqLaunchPlan 查询
export const reqLaunchPlan = params => {
    return $axios.post(`${base}/advert/put/list`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
//reqRemovePlan  单行删除

export const reqRemovePlan = params => {
    return $axios.post(`${base}/advert/put/remove`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
//添加 reqAddPlanList
export const reqAddPlanList = params => {
    return $axios.post(`${base}/advert/put/save`,
        qs.parse(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/json", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
// 修改 reqEditPlanList
export const reqEditPlanList = params => {
    return $axios.post(`${base}/advert/put/update`,
        qs.parse(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/json", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
// reqadEle 请求广告元素列表
export const reqadEle = params => {
    return $axios.post(`${base}/advert/put/advertPositionNumAndAdvertEleNum`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};
// reqLPggwList,// 可投广告位集合
export const reqLPggwList = params => {
    return $axios.post(`${base}/advert/put/advertPositionInfoList`,
        qs.stringify(params, { indices: false }),
        {  // 这里是跨域写法  
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8", }  // 这里是跨域的写法  
        }).then(res => res.data);
};