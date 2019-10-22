import { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Line, Bar } from '@components/Echarts';
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
} from 'antd';
import moment from 'moment';
import PersonnalForm from './PersonnalForm';
import MissionForm from './MissionForm';
import ClinicalForm from './ClinicalForm';
import DescriptionForm from './DescriptionForm';
import DataPathForm from './DataPathForm';

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

const ADHDItem = [
    {label: '注意缺陷型（ADHD-I）', value: 1},
    {label: '多动冲动型（ADHD-HI）', value: 2},
    {label: '混合型（ADHD-C）', value: 3},
    {label: '正常', value: 0}
  ];

const gender = [{label:0, value: '女'}, {label:1, value: '男'}];

@connect(({viewModel, loading}) => ({
    viewModel,
    loading: loading.models.viewModel,
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
            type: 'viewModel/fetchAllAndTableData',
        });
        //获取柱状图数据
        dispatch({
            type:'viewModel/fetchBarData'
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
                    type:'viewModel/fetchP2TableDataByCondition',
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
                    <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="医生姓名"
                    />,
                )}
                </Form.Item>
                <Form.Item >
                {getFieldDecorator('date', {})(
                    <DatePicker onChange={(date, dateString) => this.handleDateSearch(date, dateString)} />
                )}
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit">
                    查询
                </Button>
                <Button onClick={this.handleReset}>
                    重置
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
        if(msg === 'description') {
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
        if(msg === "description") {
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
            dataIndex: 'adhdType',
            width: '20%',
            render:text => {
                const item = ADHDItem.find(v => v.value === text)
                return(
                    <Tag color="#2db7f5">{item.label}</Tag>
                );
            }
          },
          {
              title: '采集信息汇总展示',
              width: '10%',
              render:(text, record) => {
                  return(
                    <Fragment>
                        <Row type="flex" justify="center">
                            <Tooltip title="采集信息展示">
                                <Icon type="edit" onClick={ ()=> this.handleClick(true, record, 'description')} />
                            </Tooltip>
                        </Row>
                    </Fragment>
                );
              }
          },
          {
              title: '添加/修改采集信息',
              width: '30%',
              render: (text, record) => {
                  return(
                    <Fragment>
                        <Tooltip title="个人采集信息">
                            <Icon type="edit" onClick={ () =>this.handleClick(true, record, 'personalInfo')}/>
                        </Tooltip>
                        <Divider type='vertical' />
                        <Tooltip title="数据存储关联">
                            <Icon type="dropbox" onClick={ () =>this.handleClick(true, record, 'dataPath')}/>
                        </Tooltip>
                        <Divider type='vertical' />
                        <Tooltip title="任务测试信息">
                            <Icon type="apple" onClick={ () =>this.handleClick(true, record, 'missionInfo')}/>
                        </Tooltip>
                        <Divider type='vertical' />
                        <Tooltip title="临床信息采集">
                            <Icon type="codepen-circle" onClick={ () =>this.handleClick(true, record, 'clinicalInfo')}/>
                        </Tooltip>
                    </Fragment>
                  );
              }
          }
    ];
    
    render() {
        const { 
            viewModel: { tableData, barData }, 
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
                 <Row style={{ width: 400 }}>
                    <Col span={5} style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.handleModalVisible(true, 'personalInfo')}>新建个人采集信息</Button>
                    </Col>
                </Row>
                <Card
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
                </Card>
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
                {modalVisible4 && (<DescriptionForm
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