import { 
    fetchLineData,
    fetchP1TableData,
    addLabelData,
    fetchBarData,
    fetchP2TableData,
    fetchP2TableDataByCondition,
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
const dd = {
    columns: [
        {
            field: 'date',
            name: '日期',
        },
        {
            field: 'range1',
            name: '疑似患者',
        },
        {
            field: 'range2',
            name: '正常患者',
        },
    ],
    rows: [
        {
            date: '20181212',
            range1: "123",
            range2: "223",
        },
        {
            date: '20181213',
            range1: "101",
            range2: "201",
            
        },
        {
            date: '20181214',
            range1: "181",
            range2: "281",

        }
    ]
};
export default {

    namespace: 'viewModel',

    state: {
        p1: {},//line的数据 总数据量和未标注的数据量
        p2: {},

        p1TableData: [],
        p2TableData: [],

    },

    effects: {

        //测试用
        *getData({ payload }, { call, put }) {//eslint-disable-line
            console.log("~~~~~~~~~~~~~~~", payload)
            // const { data = {} } = yield call(api.fetch, { ...payload });
            yield put({
                type: 'saveP1Data',
                payload: data,
            });
        },
        
        *getP2Data({ payload }, { call, put }) {//eslint-disable-line
            console.log("~~~~~~~~~~~~~~~", payload)
            // const { data = {} } = yield call(api.fetch, { ...payload });
            yield put({
                type: 'saveP2Data',
                payload: dd,
            });
        },


        /* ~~~~~~~~~~~~~~~~~~~p1~~~~~~~~~~~~~~~~~~~~~~ */
        //获取画图数据
        *fetchLineData(_ ,{ call, put}){
            const response = yield call(fetchLineData);
            //既定数据格式
            const LineColumns = [
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
                    "name": "标注数据量",
                    "type": "string"
                },
                
            ];
            if(response){
                const data = [];
                response.map(item => {
                    let dataElement = {"xAxis": response.date, "total":response.total, "unlabel": response.unlabel};
                    data.push(dataElement);
                });
                //将其存储至p1中
                yield put({
                    type: 'saveP1Data',
                    payload: {'columns': LineColumns, 'rows': data},
                })

            }
        },

        //获取表格数据
        *fetchP1TableData(_, { call, put }){
            const response = yield call(fetchP1TableData);
            if(response){
                yield put({
                    type: 'saveP1TableData',
                    payload: response,
                })
            }
        },

        //提交表单数据
        *addLabelData( {payload, callback}, {call}){
            const response = yield call(addLabelData, payload);
            if(response){
                console.log('test response', response);
                message.success('标注数据提交成功，感谢您的标注')
                if(callback) callback();
            }else{
                message.error('标注数据添加失败,请您重试')
            }
        },

        /* ~~~~~~~~~~~~~~~~~~~~p1~~~~~~~~~~~~~~~~~~~~~ */
        /* ~~~~~~~~~~~~~~~~~~~~p2~~~~~~~~~~~~~~~~~~~~~ */
        *fetchBarData(_, {call, put}){
            const response = yield call(fetchBarData);
            const barColumns =  [
                {
                    field: 'date',
                    name: '日期',
                },
                {
                    field: 'range1',
                    name: '疑似患者',
                },
                {
                    field: 'range2',
                    name: '正常患者',
                },
            ];

            if(response){
                const data=[];
                response.map(item => {
                    let dataElement = {
                        "date": item.date, 
                        "range1": item.suspected,
                        "range2": item.normal,
                    };
                    data.push(dataElement);
                });
                yield put({
                    type:'saveP2Data',
                    payload: {"columns": barColumns, "rows": data}, 
                });

            }
        },

        *fetchP2TableData(_, {call, put}){
            const response = yield call(fetchP2TableData);
            if(response){
                yield put({
                    type:'saveP2TableData',
                    payload: response,
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
        }
        /* ~~~~~~~~~~~~~~~~~~~~p2~~~~~~~~~~~~~~~~~~~~~ */

    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },

        saveP1Data(state, action) {
            return { ...state, 
                p1: action.payload,
             }
        },

        saveP1TableData(state, action){
            return{
                ...state,
                p1TableData: action.payload,
            }
        },

        saveP2Data(state, action) {
            return { ...state, 
                p2: action.payload,
             }
        },

        saveP2TableData(state, action){
            return{
                ...state,
                p2TableData: action.payload,
            }
        },
    }

};
