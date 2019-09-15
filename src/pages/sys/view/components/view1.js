import { Fragment, PureComponent } from 'react';
import { DataTable } from '@components';
import { connect } from 'dva';
import { Line, Bar } from '@components/Echarts';
import { Row, Col, DatePicker, Button, Card, Table, Icon, Form,  Input, Tabs, Tag} from 'antd';
import moment from 'moment';
import LabelForm from './BasicForms';

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
            modalVisible: false,
            edit: false,
            currentRecordId: -1,
        };
    }
    
    
    // //表格分页显示出现问题
    // handleTableChange = e => {
    //     console.log("触发分页 test e ", e);
    //     const { dispatch } = this.props;
    
    //     dispatch({
    //         type: 'datatables/queryTableData',
    //         payload: e.current,
    //     });
    
    //     this.setState({
    //         pagination: e.cuurent,
    //     });
    
    // }

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
    handleModalVisible = flag => {
        console.log("页面触发可视化")
        this.setState({
            edit: false,
            modalVisible: !!flag,
        });
    }

    //表格上点击操作编辑按钮是直接将路径数据传送
    handleClick = (flag, record) => {
        this.setState({
            currentRecordId: record.id,
            edit: true,
            modalVisible: !!flag,
        });
        
    }

    columns=[
        {
            title: '患者姓名',
            dataIndex: 'name',
            width: '20%',
          },
          {
            title: '患者性别',
            dataIndex: 'gender',
            width: '20%',
          },
          {
            title: '患者年龄',
            dataIndex: 'age',
          },
          {
            title: '患病类型',
            dataIndex: 'adhdType',
            render:text => {
                const item = ADHDItem.find(v => v.value === text)
                return(
                    <Tag color="#2db7f5">{item.label}</Tag>
                );
            }
          },
          {
            title: '标注医生',
            dataIndex: 'doctorNmae',
          },
          {
              title: '查看更新',
              width: '100px',
              render: (text, record) => {
                  return(
                    <Fragment>
                        <Icon type="edit" onClick={ () =>this.handleClick(true, record)}/>
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
        const { modalVisible, currentRecordId, edit } = this.state;
        const handleModalVisible = this.handleModalVisible;

        return (
            <Fragment>
                {this.renderSearch()}
                <Row style={{ width: 400 }}>
                    <Col span={5} style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.handleModalVisible(true)}>新建标注</Button>
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
                {modalVisible && (<LabelForm 
                    modalVisible={modalVisible}
                    handleModalVisible={handleModalVisible}
                    edit={edit}
                    currentRecordId={currentRecordId}
                />)}
            </Fragment>
        );
    }
}
export default Index;