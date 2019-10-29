import { request } from '@utils';

export function fetch({ page }) {
  return request(`/api/users?_page=${page}&_limit=${10}`, {
    method: 'GET',
  });
}
export function remove(id) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}
export function patch(id, values) {
  return request(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}
export function create(values) {
  return request('/api/users', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

//发送添加或者更新数据至后端 策略在后端进行判断
export function sendWcstTaskData(params){
    return request(`/api/nir/wcst/addOrUpdate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
            data: JSON.stringify(params),
        });
}

export function fetchInfoWithWcstById(params){
    return request(`api/nir/fetchWcstInfoById?id=${params}`);
}

export function fetchBarData(){
  //GET请求形式，数据格式为columns既定格式
  return request(`/api/nir/type/daily/count`);
}

//返回所有的数据
export function fetchTableData(){
  return request(`/api/nir/total`);
}

export function fetchP2TableDataByCondition(params){
  //POST请求形式，发送标注的表单数据至后端
  return request(`/users/...`, {
      method: 'POST',
      body: JSON.stringify({params}),
  });
}
//根据id获取数据库信息
export function selectUserById(params){
  return request(`/api/nir/selectUser?id=${params}`);
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
  return request(`/api/nir/user/update`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      body: json,
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