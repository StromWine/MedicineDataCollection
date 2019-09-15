import { request } from '@utils';

export function fetch(payload) {
    const { time, key } = payload;
    return request(`/view/${key}`, {
        method: 'POST',
        body: JSON.stringify({
            time
        }),
    });
}
/* ~~~~~~~~~~~~~~~~~~~~~p1~~~~~~~~~~~~~~~~~~~~ */
export function fetchLineData(){
    //GET请求形式，数据格式为 时间， 当天的总数据量 当天的未标注数据量 参照model
    return request(`///`);
}

//返回所有的数据
export function fetchTableData(){
    return request(`/api/nir/total`);
}

//添加用户个人信息的表单
export function addFirstStepData(params){
    //POST请求形式，发送标注的表单数据至后端
    const json = JSON.stringify(params);
    return request(`/api/nir/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        body: json,
    });
}

//更新用户个人信息的表单
export function updateFirstStepData(params){
    //POST请求形式，发送标注的表单数据至后端
    const json = JSON.stringify(params);
    console.log('--------------test updateFirstStepData----------------', json);
    return request(`/api/nir/user/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        body: json,
    });
}

//添加任务得分信息的表单
export function addSecondStepData(params){
    //POST请求形式，发送标注的表单数据至后端
    return request(`/api/nir/task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        data: JSON.stringify(params),
    });
}

//更新任务得分信息的表单
export function updateSecondStepData(params){
    //POST请求形式，发送标注的表单数据至后端
    return request(`/api/nir/task/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        data: JSON.stringify(params),
    });
}

//添加临床信息的表单
export function addThirdStepData(params){
    //POST请求形式，发送标注的表单数据至后端
    return request(`/api/nir/clinical`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        data: JSON.stringify(params),
    });
}

//更新临床信息的表单
export function updateThirdStepData(params){
    //POST请求形式，发送标注的表单数据至后端
    return request(`/api/nir/clinical/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        data: JSON.stringify(params),
    });
}

/* ~~~~~~~~~~~~~~~~~~~~~p2~~~~~~~~~~~~~~~~~~~~ */
export function fetchBarData(){
    //GET请求形式，数据格式为columns既定格式
    return request(`/api/nir/type/daily/count`);
}

export function fetchP2TableData(){
    //GET请求形式
    return request(`///`);
}

export function fetchP2TableDataByCondition(params){
    //POST请求形式，发送标注的表单数据至后端
    return request(`/view/...`, {
        method: 'POST',
        body: JSON.stringify({params}),
    });
}