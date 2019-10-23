
import {
    sendWcstTaskData,
    selectWcstTaskData,
} from './service';
import { message } from 'antd';

export default {
    namespace: 'wcstModel',
    state: {
        path: undefined,
        list: [],
        total: null,
        page: null,
    },
    subscriptions: {
        setupHistory({ dispatch, history }) {
            history.listen(({ pathname, query, state }) => { // eslint-disable-line
                if (pathname === '/sys/users') {
                    dispatch({ type: 'fetch', payload: query });
                }
            });
        },
    },

    effects: {
        //发送数据至后端进行添加或者更新
        *sendWcstTaskData({ payload }, { call }){
            console.log("*****test", payload);
            const response = yield call(sendWcstTaskData, payload);
            if(response.code === "true"){
                message.success("数据更新成功！");
            }else{
                message.error("数据更新失败！");
            }
        },

        //从数据库获取测试任务采集信息数据
        *selectWcstTaskData( { payload, callback }, { call }){
            console.log("******选取数据", payload);
            const response = yield call(selectWcstTaskData, payload);
            if(response.code === "true"){
                if(response.msg === "success"){
                    if(callback) callback(response.data);
                }else{
                    message.info("新建用户任务采集信息")
                }
            }else{
                message.error("数据库错误!")
            }
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
