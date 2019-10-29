import React, {PureComponent} from 'react';
import dva, { connect } from 'dva';
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import { Table } from 'antd';
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Card,
  Typography,
  Divider,
  Icon,
  Select,
} from 'antd';
import Column from 'antd/lib/table/Column';

const { Title } = Typography;
const {Option} = Select;

const pastHistoryItem = [
    '高热惊厥', '癫痫', '鼻炎', '扁桃体炎', '头颅外伤', '食物、药物过敏史',
  ];
  
  const personHistoryItem = [
    "父母高龄孕产", "早产", "产伤", "产时缺氧", "黄疸", "走路、说话等发育不良",
  ];
  
//临床信息采集表单
@connect(({viewModel}) => ({
    viewModel,
    }))
@Form.create()
class AnalysisForm extends PureComponent {

    state={
        ayalysisInfo:{
            symptomTime:undefined,
            presentIllnessHistory:'',
            chiefComplaint:'',
            treatmentHistory:undefined,
            pastHistory:undefined,
            personalHistory: undefined,
            familyHistory: '',
          },
    }

    //在载入时要从后端拿取数据
    componentDidMount(){
      const { dispatch, edit, currentRecordId } = this.props;
      if(edit){
        dispatch({
          type: 'viewModel/selectClinicalData',
          payload: currentRecordId,
          callback: res => {
            this.setState({
              analysisInfo:{
                ...res,
              },
            });
          }
        });
      }
    }


    renderForm(){
        const { getFieldDecorator } = this.props.form;
        const { clinicalInfo } = this.state;
    
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
        };
        const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          },
        };
        
        const pieOption = {
            title : {
                text: '失眠症智能辅助诊断结果',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['慢性失眠','短期性失眠','其他类型','健康']
            },
            series : [
                {
                    name: '诊断结果',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'慢性失眠'},
                        {value:310, name:'短期性失眠'},
                        {value:234, name:'其他类型'},
                        {value:135, name:'健康'},
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        const lineOption1 =  {
            title: {
                text: 'delta oxygenated hemoglobin(HbO)'
            },
            tooltip: {
                trigger: 'axis'
            },
            // legend: {
            //     data:['channel1','channel2','channel3','channel4','channel5','channel6','channel7','channel8']
            // },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',]
            },
            yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} umol/L '
                        },
                        axisPointer: {
                            snap: true
                        }
                    },
            series: [
                {
                    name:'channel1',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:[-2, -1.5, 0, 0.35, 2.5,5.2 , 5.7, 3.5, 0.6, -1],
                },
                {
                    name:'channel2',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:  [-1.4, 0, 1.2, -2, 3.4, 1.9 , 0.6, 3.7, 2.5, -1.3],
                },
                {
                    name:'channel3',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:[-2, -1.6, -1, 0.4, -1, 3 , 1.2, 0.2, -0.6, 1.1],
                },
                {
                    name:'channel4',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:[-1.2, -1.6, 1.2, 0.4, -1.6, 3.1 , 1.12, 0.52, -1.6, 2.1],
                },
                {
                    name:'channel5',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data: [-0.2, 1.6, 0.2, 1.4, -0.6, 1.1 , 1.12, 1.52, -1.6, 3.1],
                },
                {
                    name:'channel6',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data: [0.3, 1.3, 0.5, 2.4, 0.6, 3.1 , 1.12, 3.52, 0.96, 4.2],
                },
                {
                    name:'channel7',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:  [1.6, 2.3, 1.5, 3.4, 1.3, 1.1 , 2.12, 3.1, 2.96, 5.2],
                },
                {
                    name:'channel8',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data: [2.6, 4.3, 2.5, 4.4, 2.3, 5.1 , 2.12, 4.1, 1.96, 3.2],
                }
            ]
        };

        const lineOption2 =  {
            title: {
                text: 'delta deoxygenated hemoglobin(HbR)'
            },
            tooltip: {
                trigger: 'axis'
            },
            // legend: {
            //     data:['channel1','channel2','channel3','channel4','channel5','channel6','channel7','channel8']
            // },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',]
            },
            yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} umol/L '
                        },
                        axisPointer: {
                            snap: true
                        }
                    },
            series: [
                {
                    name:'channel1',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:[-2, -1.5, 0, 0.35, 2.5,5.2 , 5.7, 3.5, 0.6, -1],
                },
                {
                    name:'channel2',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:  [-1.4, 0, 1.2, -2, 3.4, 1.9 , 0.6, 3.7, 2.5, -1.3],
                },
                {
                    name:'channel3',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:[-2, -1.6, -1, 0.4, -1, 3 , 1.2, 0.2, -0.6, 1.1],
                },
                {
                    name:'channel4',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:[-1.2, -1.6, 1.2, 0.4, -1.6, 3.1 , 1.12, 0.52, -1.6, 2.1],
                },
                {
                    name:'channel5',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data: [-0.2, 1.6, 0.2, 1.4, -0.6, 1.1 , 1.12, 1.52, -1.6, 3.1],
                },
                {
                    name:'channel6',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data: [0.3, 1.3, 0.5, 2.4, 0.6, 3.1 , 1.12, 3.52, 0.96, 4.2],
                },
                {
                    name:'channel7',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data:  [1.6, 2.3, 1.5, 3.4, 1.3, 1.1 , 2.12, 3.1, 2.96, 5.2],
                },
                {
                    name:'channel8',
                    type:'line',
                    stack: '总量',
                    smooth: true,
                    data: [2.6, 4.3, 2.5, 4.4, 2.3, 5.1 , 2.12, 4.1, 1.96, 3.2],
                }
            ]
        };
        
        const columns = [
            {
                title:'通道',
                dataIndex: 'channel',
                key: 'channel'
            },
            {
              title: 'HbO平均值',
              dataIndex: 'HbO_mean',
              key: 'HbO_mean',
            },
            {
                title: 'HbR平均值',
                dataIndex: 'HbR_mean',
                key: 'HbR_mean',
            },{
                title: 'HbO方差',
                dataIndex: 'HbO_var',
                key: 'HbO_var',
            },
            {
                title: 'HbR方差',
                dataIndex: 'HbR_var',
                key: 'HbR_var',
            },
            {
                title: 'HbO最大值',
                dataIndex: 'HbO_max',
                key: 'HbO_max',
            },
            {
                title: 'HbR最大值',
                dataIndex: 'HbR_max',
                key: 'HbR_max',
            },{
                title: 'HbO最小值',
                dataIndex: 'HbO_min',
                key: 'HbO_min',
            },
            {
                title: 'HbR最小值',
                dataIndex: 'HbR_min',
                key: 'HbR_min',
            },
          ];

          const dataSource = [
            { 
              key: '1',
              channel: 'channel1',
              HbO_mean: '1.2',
              HbR_mean: '1.4',
              HbO_var: '0.5',
              HbR_var: '0.3',
              HbO_max: '5.3',
              HbR_max: '4.6',
              HbO_min: '-1.2',
              HbR_min: '-2'
            },
            {
                key: '2',
                channel: 'channel2',
                HbO_mean: '2.2',
                HbR_mean: '2.4',
                HbO_var: '0.5',
                HbR_var: '0.3',
                HbO_max: '5.5',
                HbR_max: '3.6',
                HbO_min: '-1.2',
               HbR_min: '-2'
            },
            {
                key: '3',
                channel: 'channel3',
                HbO_mean: '2.2',
                HbR_mean: '2.4',
                HbO_var: '0.5',
                HbR_var: '0.3',
                HbO_max: '5.5',
                HbR_max: '3.6',
                HbO_min: '-1.2',
               HbR_min: '-2'
            },
            {
                key: '4',
                channel: 'channel4',
                HbO_mean: '2.2',
                HbR_mean: '2.4',
                HbO_var: '0.5',
                HbR_var: '0.3',
                HbO_max: '5.5',
                HbR_max: '3.6',
                HbO_min: '-1.2',
               HbR_min: '-2'
            },
            {
                key: '5',
                channel: 'channel5',
                HbO_mean: '2.2',
                HbR_mean: '2.4',
                HbO_var: '0.5',
                HbR_var: '0.3',
                HbO_max: '5.5',
                HbR_max: '3.6',
                HbO_min: '-1.2',
               HbR_min: '-2'
            },
            {
                key: '6',
                channel: 'channel6',
                HbO_mean: '2.2',
                HbR_mean: '2.4',
                HbO_var: '0.5',
                HbR_var: '0.3',
                HbO_max: '5.5',
                HbR_max: '3.6',
                HbO_min: '-1.2',
               HbR_min: '-2'
            },
            {
                key: '7',
                channel: 'channel7',
                HbO_mean: '2.2',
                HbR_mean: '2.4',
                HbO_var: '0.5',
                HbR_var: '0.3',
                HbO_max: '5.5',
                HbR_max: '3.6',
                HbO_min: '-1.2',
               HbR_min: '-2'
            },
            {
                key: '8',
                channel: 'channel8',
                HbO_mean: '2.2',
                HbR_mean: '2.4',
                HbO_var: '0.5',
                HbR_var: '0.3',
                HbO_max: '5.5',
                HbR_max: '3.6',
                HbO_min: '-1.2',
               HbR_min: '-2'
            },
          ];
        
        return (
          <Form {...formItemLayout}>
            <Row justify="start" type="flex">
              <Title level={4}>近红外数据展示</Title>
            </Row>
            <Card className="line_a">
            <ReactEcharts option={lineOption1}/>
            </Card>
            <Card className="line_b">
            <ReactEcharts option={lineOption2}/>
            </Card>
            <Divider />
            <Row justify="start" type="flex">
              <Title level={4}>统计量</Title>
            </Row>
            <Table dataSource={dataSource} columns={columns} />
            <Divider />
            
            <Row justify="start" type="flex">
              <Title level={4}>智能诊断结果</Title>
            </Row>
            <Card className="pie_a">
                <ReactEcharts option={pieOption}/>
            </Card>
            <Divider />
            <Row justify="start" type="flex">
              <Title level={4}>治疗建议</Title>
            </Row>
            <div>
                <p><Input value={"心理辅导消除对失眠症状的关注和恐惧"} /></p>
            </div>
            <Divider />
          </Form>
        );
    }

    render(){
        const { 
            currentRecordId, 
            userName, 
            modalVisible, 
            handleModalVisible, 
        } = this.props;

        const title = "智能辅助诊断——" + currentRecordId + "_" + userName;
        return(
        <Modal
        visible={modalVisible}
        title={title}
        width='40%'
        onCancel={() => handleModalVisible(false, "analysisInfo")}
        destroyOnClose
        >
            {this.renderForm()}
        </Modal>)

    }
}

export default AnalysisForm;
