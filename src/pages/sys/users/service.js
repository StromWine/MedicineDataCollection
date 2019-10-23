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
    return request(`api/nir/fetchAllInfoById?id=${params}`);
}