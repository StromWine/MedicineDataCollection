import { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Line, Bar } from '@components/Echarts';
import { BrowserRouter as Router,Route} from 'react-router-dom';
import { 
    Row, 
    Col, 
    DatePicker, 
    Button, 
    Card, 
    Table, 
    Icon, 
    Form,  
    Input, 
    Tabs, 
    Tag, 
    Divider, 
    Tooltip,
    Select,
} from 'antd';
import moment from 'moment';
import PersonnalForm from './PersonnalForm';
import MissionForm from './MissionForm';
import ClinicalForm from './ClinicalForm';
import PatientsDescriptionForm from './patientsDescription'
import DataPathForm from './DataPathForm';

const {Option} = Select;
const { TabPane } = Tabs;
const dateFormat = 'YYYY/MM/DD';
const initTime = [moment().subtract(7, 'days'), moment().subtract(1, 'days')];

//mock 数据
const tableData = [
    {dataPath: "/home/data/sjahduu", testDate: "7/24"},
    {dataPath: "/home/data/sdajidq", testDate: "7/25"},
    {dataPath: "/home/data/sdaqidq", testDate: "7/26"},
    {dataPath: "/home/data/uitwoev", testDate: "7/27"},
];

const wcstItem = [
    {label: '单纯性失眠', value: 1},
    {label: '伴过度觉醒', value: 2},
    {label: '伴焦虑', value: 3},
    {label: '伴抑郁', value: 4},
    {label: '正常', value: 0},
  ];

const gender = [{label:0, value: '女'}, {label:1, value: '男'}];

@connect(({wcstModel, loading}) => ({
    wcstModel,
    loading: loading.models.wcstModel,
}))
@Form.create()
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            date: initTime,
            modalVisible1: false, // 个人采集信息表单的视觉信息
            modalVisible2: false, // 任务采集信息表单
            modalVisible3: false, // 临床信息采集表单
            modalVisible4: false, // 采集信息总体描述
            modalVisible5: false, // 采集数据存储关联
            edit: false,
            currentRecordId: -1,
            currentUserName: 'undefined',
        };
    }
    
    onChange = (v) => {
        this.setState({
            date: v
        });
    }
    submit = () => {
        const { handleSubmit = () => { } } = this.props;
        const { date } = this.state;
        const times = date.map(time => moment(time).format(dateFormat));
        handleSubmit(times);
    }

    //加载渲染
    componentDidMount(){
        const { dispatch } = this.props;
        // //页面渲染时获取图像数据
        // dispatch({
        //     type: 'viewModel/getData',
        //     payload: 'p1',
        // });
        //获取表格数据
        dispatch({
            type: 'wcstModel/fetchAllAndTableData',
        });
        //获取柱状图数据
        dispatch({
            type: 'wcstModel/fetchBarData'
        });

    }

    //查询表单提交
    handleSearchSubmit = e =>{
        const {dispatch} = this.props;
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values.date)
                const { date } = this.state;
                dispatch({
                    type:'wcstModel/fetchP2TableDataByCondition',
                    payload: {date: date, patientName: values.patientName, doctorName: values.doctorName},
                });
            }
          });

    }

    //重置查询条件
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            date: '',
        })
    }

    //查询表单
    renderSearch() {
        const { form } = this.props;
        const {getFieldDecorator} = form;
        return(
            <Form layout="inline" onSubmit={this.handleSearchSubmit}>
                <Form.Item >
                {getFieldDecorator('patientID', {})(
                     <Input
                     prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                     placeholder="患者编号"
                     />,
                )}
                </Form.Item>
                <Form.Item >
                {getFieldDecorator('patientName', {}
                )(
                    <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="患者姓名"
                    />,
                )}
                </Form.Item>
                
                <Form.Item >
                {getFieldDecorator('doctorName', {})(
                     <Select
                     showSearch
                     style={{ width: 200 }}
                     placeholder="选择医生"
                     // onChange={onChange}
                     // onFocus={onFocus}
                     // onBlur={onBlur}
                     // onSearch={onSearch}
                     filterOption={(input, option) =>
                             option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                 }
                 >
                 <Option value="doctor1">医生1</Option>
                 <Option value="doctor2">医生2</Option>
                 <Option value="doctor3">医生3</Option>
                 <Option value="doctor4">医生4</Option>
             </Select>,
                )}
                </Form.Item>
                <Form.Item >
                {getFieldDecorator('wcstType', {})(
                    <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="选择失眠类型"
                    // onChange={onChange}
                    // onFocus={onFocus}
                    // onBlur={onBlur}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                >
                <Option value="type1">类型1</Option>
                <Option value="type2">类型2</Option>
                <Option value="type3">类型3</Option>
                <Option value="type4">类型4</Option>
            </Select>,
                )}
                </Form.Item>
                {/* <Form.Item >
                {getFieldDecorator('date', {})(
                    <DatePicker onChange={(date, dateString) => this.handleDateSearch(date, dateString)} />
                )}
                </Form.Item> */}
                <Form.Item>
                <Button type="primary" htmlType="submit">
                    查询
                </Button>
                <Button onClick={this.handleReset}>
                    重置
                </Button>
                <Button type="primary" onClick={() => this.handleModalVisible(true, 'personalInfo')}>
                    新建患者个人信息
                </Button>
                </Form.Item>
            </Form>
        );
    }

    //用于显示新建标注页面
    handleModalVisible = (flag, msg) => {
        if(msg === 'personalInfo') {
            this.setState({
                edit: false,
                modalVisible1: !!flag,
            });
        }
        if(msg === 'missionInfo') {
            this.setState({
                edit: false,
                modalVisible2: !!flag,
            });
        }
        if(msg === 'clinicalInfo') {
            this.setState({
                edit: false,
                modalVisible3: !!flag,
            });
        }
        if(msg === 'patientsDescription') {
            this.setState({
                edit: false,
                modalVisible4: !!flag,
            });
        }
        if(msg === 'dataPath') {
            this.setState({
                edit: false,
                modalVisible5: !!flag,
            });
        }
    }

    //表格上点击操作编辑按钮是直接将id数据传送
    handleClick = (flag, record, msg) => {
        if(msg === "personalInfo") {
            this.setState({
                edit:true,
                modalVisible1:!!flag,
                currentRecordId: record.id,
                currentUserName: record.name,
            });
        }
        if(msg === "missionInfo") {
            this.setState({
                edit: true,
                modalVisible2:!!flag,
                currentUserName: record.name,
                currentRecordId: record.id,
            });
        }
        if(msg === "clinicalInfo") {
            this.setState({
                edit: true,
                modalVisible3:!!flag,
                currentUserName: record.name,
                currentRecordId: record.id,
            });
        }
        if(msg === "patientsDescription") {
            this.setState({
                edit: true,
                modalVisible4:!!flag,
                currentUserName: record.name,
                currentRecordId: record.id,
            });
        }
        if(msg === "dataPath") {
            this.setState({
                edit: true,
                modalVisible5:!!flag,
                currentUserName: record.name,
                currentRecordId: record.id,
            });
        }
    }

    columns=[
        {
            title: '患者姓名',
            dataIndex: 'name',
            width: '10%',
          },
          {
            title: '唯一编号',
            width: '10%',
            render:record =>{
                const number = record.id + '_' + record.name;
                return(
                    <span>{number}</span>
                );
            }
          },
          {
            title: '患者性别',
            dataIndex: 'gender',
            width: '10%',
            render:text => {
                const item = gender.find(v => v.label === text);
                if(item){
                    return(
                        <Tag color="red">{item.value}</Tag>
                    );
                }
                
            }
          },
          {
            title: '患者年龄',
            dataIndex: 'age',
            width: '10%',
          },
          {
            title: '患病类型',
            dataIndex: 'wcstType',
            width: '10%',
            render:text => {
                const item = wcstItem.find(v => v.value === text)
                if (!item){
                    return  <Tag color="#2db7f5">{"未诊断"}</Tag>
                }
                else{
                return(
                    <Tag color="#2db7f5">{item.label}</Tag>
                  );
                }
            }
          },
          {
            title: '主治医生',
            dataIndex: 'doctor',
            width: '10%',
          },
         
          {
              title: '患者信息展示',
              width: '7%',
              render:(text, record) => {
                  return(
                    <Fragment>
                        <Row type="flex" justify="center">
                            <Tooltip title="患者信息展示">
                                <Icon type="book" onClick={()=> this.handleClick(true, record, 'patientsDescription')} />
                            </Tooltip>
                        </Row>
                    </Fragment>
                );
              }
          },
          {
              title: '添加/修改患者信息',
              width: '40%',
              render: (text, record) => {
                  return(
                    <Fragment>
                        <Tooltip title="个人采集信息" >
                            <Icon type="edit" style={{justifyContent:'center'}}  onClick={ () =>this.handleClick(true, record, 'personalInfo')}/>
                        </Tooltip>
                        <Divider type='vertical' />
                        {/* <Tooltip title="数据存储关联">
                            <Icon type="dropbox" onClick={ () =>this.handleClick(true, record, 'dataPath')}/>
                        </Tooltip>
                        <Divider type='vertical' />
                        <Tooltip title="任务测试信息">
                            <Icon type="apple" onClick={ () =>this.handleClick(true, record, 'missionInfo')}/>
                        </Tooltip>
                        <Divider type='vertical' /> */}
                        <Tooltip title="临床信息采集">
                            <Icon type="codepen-circle" style={{justifyContent:'center'}} onClick={ () =>this.handleClick(true, record, 'clinicalInfo')}/>
                        </Tooltip>
                        <Divider type='vertical' />
                        <Tooltip title="查看量表信息">
                            <Icon type="copy" style={{justifyContent:'center'}} onClick={ () =>this.handleClick(true, record, 'clinicalInfo')}/>
                        </Tooltip>
                        <Divider type='vertical' />
                        <Tooltip title="新建近红外采集信息" >
                            <Icon type="arrow-right" style={{justifyContent:'center'}}  onClick={ () =>this.handleClick(true, record, 'personalInfo')}/>
                        </Tooltip>
                    </Fragment>
                  );
              }
          }
    ];
    
    render() {
        const { 
            wcstModel: { tableData, barData }, 
            loading,
        } = this.props;

        //传入表单的数据
        const { 
            modalVisible1, 
            modalVisible2,
            modalVisible3,
            modalVisible4,
            modalVisible5,
            currentRecordId, 
            edit, 
            currentUserName,
         } = this.state;
        const handleModalVisible = this.handleModalVisible;

        return (
            <Fragment>
                {this.renderSearch()}
                {/* <Row style={{ width: 400 }}>
                    <Col span={5} style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.handleModalVisible(true)}>新建标注</Button>
                    </Col>
                </Row> */}
                {/**
                 修改添加策略
                 */}
                 
                {/* <Card
                    // title="Card title"
                    style={{ marginTop: 15 }}
                >
                    <Tabs
                        animated={false}
                        style={{ textAlign: 'right' }}
                    >
                        <TabPane tab={<Icon type="bar-chart" />} key="1" style={{ textAlign: 'left' }}>
                            <Bar seriesLayoutBy={"column"} data={barData} loading={loading} />
                        </TabPane>
                        <TabPane tab={<Icon type="pie-chart" />} key="2" style={{ textAlign: 'left' }}>
                            <Line seriesLayoutBy={"column"} data={barData} loading={loading} />
                        </TabPane>
                    </Tabs>
                </Card> */}
                <Table
                    columns={this.columns}
                    dataSource={tableData}
                    // onChange={this.handleTableChange}
                />
                {/* {modalVisible && (<LabelForm 
                    modalVisible={modalVisible}
                    handleModalVisible={handleModalVisible}
                    edit={edit}
                    currentRecordId={currentRecordId}
                />)} */}
                {modalVisible1 && (<PersonnalForm
                    modalVisible={modalVisible1}
                    handleModalVisible={handleModalVisible}
                    edit={edit}
                    currentRecordId={currentRecordId}
                    userName={currentUserName}
                />)}
                {modalVisible2 && (<MissionForm
                    modalVisible={modalVisible2}
                    handleModalVisible={handleModalVisible}
                    edit={edit}
                    currentRecordId={currentRecordId}
                    userName={currentUserName}
                />)}
                {modalVisible3 && (<ClinicalForm
                    modalVisible={modalVisible3}
                    handleModalVisible={handleModalVisible}
                    edit={edit}
                    currentRecordId={currentRecordId}
                    userName={currentUserName}
                />)}
                {modalVisible4 && (<PatientsDescriptionForm
                    modalVisible={modalVisible4}
                    handleModalVisible={handleModalVisible}
                    edit={edit}
                    currentRecordId={currentRecordId}
                    userName={currentUserName}
                />)}
                {modalVisible5 && (<DataPathForm
                    modalVisible={modalVisible5}
                    handleModalVisible={handleModalVisible}
                    edit={edit}
                    currentRecordId={currentRecordId}
                    userName={currentUserName}
                />)}
            </Fragment>
        );
    }
}
export default Index;