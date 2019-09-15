import { 
    fetchBarData,
    fetchP2TableDataByCondition,
    addFirstStepData,
    addSecondStepData,
    addThirdStepData,
    updateFirstStepData,
    updateSecondStepData,
    updateThirdStepData,
    fetchTableData,
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

    namespace: 'viewModel',

    state: {
        allInfoData: [], //全量数据
        tableData: [], //表格显示数据
        barData: [],
        
        p1: {},//line的数据 总数据量和未标注的数据量
        p2: {},

        p1TableData: [],
        p2TableData: [],

    },

    effects: {
        //提交表单数据 (保留)
        *addLabelData( {payload, callback}, {call}){
            console.log('test payload', payload)
            const personalInfo = payload.personInfo;
            const missionInfo = payload.missionFormData;
            const clinicalInfo = payload.clinicalInfo;

            console.log('test addLabelData', personalInfo);
            //发送个人信息表单
            const response = yield call(addFirstStepData, personalInfo);
            console.log("***************test response*****************", response);
            if(response.code === "true"){
                //返回插入的id
                const id = response.data;
                //发送第二步和第三步的数据
                const missionData = {taskDO: missionInfo, userId: id};
                const clinicalData = {clinicalInfoDO: clinicalInfo, userId: id};
                const missionRes = yield call(addSecondStepData, missionData);
                const clinicalRes = yield call(addThirdStepData, clinicalData);
                if (missionRes.code === "true" && clinicalRes.code === "true"){
                    message.info("新建标注成功");
                    if(callback) callback();
                }
            }else{
                message.error('标注数据添加失败,请您重试')
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

        //获取表格数据
        *fetchAllAndTableData( _ , {call, put}){
            console.log('正在获取table数据')
            const response = yield call(fetchTableData);
            if(response.code === 'true'){
                console.log('test response table ------', response);
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
                    name: 'adI',
                },
                {
                    field: 'range2',
                    name: 'adHI',
                },
                {
                    field: 'range3',
                    name: 'adC',
                },
                {
                    field: 'range4',
                    name: 'normal',
                },
            ];

            const response = yield call(fetchBarData);
            
            if(response.code === 'true'){
                console.log('test response', response.data)
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
            console.log('test payload', payload)
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
            console.log("~~~~~~~~~~~~~~~", payload)
            // const { data = {} } = yield call(api.fetch, { ...payload });
            yield put({
                type: 'saveP1Data',
                payload: data,
            });
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

        // saveP1TableData(state, action){
        //     return{
        //         ...state,
        //         p1TableData: action.payload,
        //     }
        // },

        // saveP2Data(state, action) {
        //     return { ...state, 
        //         p2: action.payload,
        //      }
        // },

        // saveP2TableData(state, action){
        //     return{
        //         ...state,
        //         p2TableData: action.payload,
        //     }
        // },
    }

};
