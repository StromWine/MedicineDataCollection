
import {fetchTotalData}  from './service';

export default {

    namespace: 'pathAnalysis',

    state : {
        analysisData: [],
    },
    // subscriptions: {
    //     setupHistory({ dispatch, history }) {
    //         history.listen(({ pathname, query, state }) => { // eslint-disable-line
    //             if (pathname.indexOf('sys/pathAnalysis') > -1) {
    //                 dispatch({ type: 'getDict', payload: { timeType: 'day' } });
    //             }
    //         });
    //     },
    // },

    effects: {

        //从后端拿取未标注 确诊病例 和正常病例的数据
        //todo service中的fetchTotalData
        *fetchData( _, {call, put} ){
            const response = yield call(fetchTotalData);
            if(response){
                const unlabelData = response.unlabelData;
                const diagnosisData = response.diagnosisData;
                const normalData = response.normalData;

                const data = [];
                data.push({name: "未标注样例", value: unlabelData});
                data.push({name: "确诊样例", value: diagnosisData });
                data.push({name: "正常样例", value: normalData});

                //将数据状态保存下来
                yield put({  
                    type: "saveTotalData",
                    payload: data,
                });
            }
        }
    },

    reducers: {
        saveTotalData(state, action) {
            return { 
                ...state, 
                analysisData: action.payload };
        },
    },

};
