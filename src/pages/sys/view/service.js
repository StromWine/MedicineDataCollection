import { request } from '@utils';
import { func } from 'prop-types';

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

export function fetchP1TableData(){
    //GET请求形式，数据格式为 dataPath, date两个参数
    return request(`///`);
}

export function addLabelData(params){
    //POST请求形式，发送标注的表单数据至后端
    return request(`/view/...`, {
        method: 'POST',
        body: JSON.stringify({params}),
    });
}

/* ~~~~~~~~~~~~~~~~~~~~~p2~~~~~~~~~~~~~~~~~~~~ */
export function fetchBarData(){
    //GET请求形式，数据格式为columns既定格式
    return request(`///`);
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