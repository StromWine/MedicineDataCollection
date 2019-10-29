
import {
    sendWcstTaskData,
    selectWcstTaskData,
    fetchInfoWithWcstById,
    fetchBarData,
    fetchTableData,
    fetchP2TableDataByCondition,
    selectUserById,
    addFirstStepData,
    updateFirstStepData,
    updateSecondStepData,
    updateThirdStepData,
} from './service';
import { message } from 'antd';

const data =  {
    "columns": [
        {
            "field": "xAxis",
            "name": "时间",
            "type": "string"
        },
        {
            "field": "total",
            "name": "总数据量",
            "type": "string"
        },
        {
            "field": "unlabel",
            "name": "未标注数据量",
            "type": "string"
        },
        
    ],
    "rows": [
        {
            "xAxis": "周一",
            "total": 120,
            "unlabel": 22,
           
        },
        {
            "xAxis": "周二",
            "total": 132,
            "unlabel": 56,
        },
        {
            "xAxis": "周三",
            "total": 101,
            "unlabel": 46,
        },
        {
            "xAxis": "周四",
            "total": 134,
            "unlabel": 64,
        },
        {
            "xAxis": "周五",
            "total": 90,
            "unlabel": 37,
        },
        {
            "xAxis": "周六",
            "total": 37,
            "unlabel": 46,
        },
        {
            "xAxis": "周日",
            "total": 24,
            "unlabel": 78,
        }
    ]
};

export default {
    namespace: 'wcstModel',
    state: {
        path: undefined,
        list: [],
        total: null,
        page: null,
        tableData: [], //表格显示数据
        barData: [],
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

        *fetchInfoWithWcstById( { payload, callback}, { call}){
            const response = yield call(fetchInfoWithWcstById, payload);
            if(response.code === "true"){
                if(callback) callback(response.data);
            }else{
                message.error("数据库错误!");
            }
        },
        //获取表格数据
        *fetchAllAndTableData( _ , {call, put}){
            const response = yield call(fetchTableData);
            if(response.code === 'true'){
                yield put({
                    type: 'saveAllInfoData',
                    payload: response.data,
                });
                //处理数据组装成表格显示数据
                const tableData = [];
                response.data.map((ele, index) => {
                    let personalInfo = ele.personalInfo;
                    let tableEle = {
                        "id": personalInfo.id,
                        "name": personalInfo.name,
                        "gender": personalInfo.gender,
                        "age": personalInfo.age,
                        "adhdType": personalInfo.adhdType,
                        "doctorName": personalInfo.doctorName,
                    };
                    tableData.push(tableEle);
                    return index;
                });
                yield put({
                    type: 'saveTableData',
                    payload: tableData,
                });
            }
        },

        //获取柱状图数据
        *fetchBarData(_, {call, put}){
            const barColumns =  [
                {
                    field: 'date',
                    name: '日期',
                },
                {
                    field: 'range1',
                    name: '短期性失眠',
                },
                {
                    field: 'range2',
                    name: '慢性失眠',
                },
                {
                    field: 'range3',
                    name: '其他类型',
                },
                {
                    field: 'range4',
                    name: 'normal',
                },
            ];

            const response = yield call(fetchBarData);
            
            if(response.code === 'true'){
                const data=[];
                response.data.map(item => {
                    let dataElement = {
                        "date": item.date || " ", 
                        "range1": item.ADHD_I || " ",
                        "range2": item.ADHD_HI || " ",
                        "range3": item.ADHD_C || " ",
                        "range4":item.normal || " ",
                    };
                    data.push(dataElement);
                });
                yield put({
                    type:'saveBarData',
                    payload: {"columns": barColumns, "rows": data}, 
                });

            }
        },

        //按照条件进行查询
        *fetchP2TableDataByCondition({payload}, {call, put}){
            const response = yield call(fetchP2TableDataByCondition, payload);
            if(response){
                yield put({
                    type:'saveP2TableData',
                    payload: response,
                });
                
            }
        },
        //测试用
        *getData({ payload }, { call, put }) {//eslint-disable-line
            // const { data = {} } = yield call(api.fetch, { ...payload });
            yield put({
                type: 'saveP1Data',
                payload: data,
            });
        },
        //根据id获取个人采集信息
        *selectUserById({ payload, callback }, { call }){
            const response = yield call(selectUserById, payload);
            if(response.code === "true"){
                if(callback) callback(response.data);
            }else{
                message.error('获取当前信息失败！')
            }
        },
        //单独添加个人数据至后端数据库
        *addPersonalInfo( { payload }, { call }){
            const response = yield call(addFirstStepData, payload);
            if(response.code === "true"){
                message.info("新建个人采集信息成功！");
            }else{
                message.error("新建个人采集信息失败！");
            }
        },
        //单独更新个人采集信息
        *updatePersonalInfo({ payload }, { call } ){
            const response = yield call(updateFirstStepData, payload);
            if(response.code === "true"){
                message.info("个人采集信息更新成功");
            }else{
                message.error('个人采集信息更新失败，请您重试');
            }
        },
        *updateLabelData({payload}, {call, put}){
            console.log('test payload', payload)
            const personalInfo = payload.formData.personInfo;
            const missionInfo = payload.formData.missionFormData;
            const clinicalInfo = payload.formData.clinicalInfo;
            const userId = payload.userId;

            console.log('test addLabelData', personalInfo);
            //发送个人信息表单
            const personParam = {params: personalInfo, userId: userId};
            const personResponse = yield call(updateFirstStepData, personParam);
            if(personResponse.code === "true"){
                message.info("个人信息更新标注成功");
            }else{
                message.error('个人信息更新标注失败,请您重试')
            }
            //发送任务更新信息
            const missionParam = {params: missionInfo, userId: userId};
            const missionResponse = yield call(updateSecondStepData, missionParam);
            if(missionResponse.code==="true"){
                message.info("任务信息更新标注成功");
            }else{
                message.error('任务信息更新标注失败,请您重试')
            }
            const clinicalParam = {params: clinicalInfo, userId: userId};
            const clinicalRes = yield call(updateThirdStepData, clinicalParam);
            if(clinicalRes.code==="true"){
                message.info("临床信息更新标注成功");
            }else{
                message.error('临床信息更新标注失败,请您重试')
            }
        },
        
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },

        saveAllInfoData(state, action) {
            return {
                ...state,
                allInfoData: action.payload
            }
        },

        saveTableData(state, action) {
            return {
                ...state,
                tableData: action.payload
            }
        },

        saveBarData(state, action) {
            return { ...state, 
                barData: action.payload,
             }
        },
    },

};
