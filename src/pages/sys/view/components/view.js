import { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Bar, Line } from '@components/Echarts';
import { Icon, Tabs, Table, Row, Col,  DatePicker, Input, Button } from 'antd';
import BasicForm2 from './BasicForms2';


const TabPane = Tabs.TabPane;
const defalutPagination = 1;

@connect(({viewModel}) => ({
    viewModel,
}))
class Index extends PureComponent {

    state={
        modalVisible:false,
        currentRecord: {},
        pagination: defalutPagination,
        date: '', //标注日期
        patientName: '', //患者姓名
        doctorName: '', //标注医生
    }

    componentDidMount(){
        const { dispatch } = this.props;
        //页面渲染时获取图像数据
        dispatch({
            type: 'viewModel/getP2Data',
            payload: 'p2',
        });
        
    }

    editDetail = (record) => {
        this.setState({
            currentRecord: record,
        })
        this.handleModalVisible(true);
    }

    //用于显示新建标注页面
    handleModalVisible = flag => {
        console.log("页面触发可视化")
        this.setState({
            modalVisible: !!flag,
        });
    }


    //表格变动时的变化
    handleTableChange = e => {
        
    }
    //处理搜索框变化
    handleDateSearch = (date, dateString) => {
        this.setState({
            date: dateString,
        });
    }

    handlePatientNameSearch = e => {
        this.setState({
            patientName: e.target.value,
        });
    }

    handleDoctorNameSearch = e => {
        this.setState({
            doctorName: e.target.value,
        });
    }

    onSearch = () => {
        const {dispatch} = this.props;
        const {date, patientName, doctorName} = this.state;

        dispatch({
            type:'viewModel/fetchP2TableDataByCondition',
            payload: {date: date, patientName: patientName, doctorName: doctorName},
        });
        //重新刷新一下表格数据
        dispatch({
            type:'viewModel/fetchP1TableData',
        });
    }

    renderSearch() {
        return(
            <Row>
                <Input
                size="small"
                placeholder="请输入患者姓名" 
                onChange={e => this.handlePatientNameSearch(e)} />

                <Input 
                size="small"
                placeholder="请输入医生姓名"
                onChange={e => this.handleDoctorNameSearch(e)} />

                <DatePicker 
                placeholder="请选择标注日期"
                onChange={(date, dateString) => this.handleDateSearch(date, dateString)} />
                <Button type="primary" onClick={() => this.onSearch()}>查询</Button>
            </Row>
        );
    }


    render() {
        //未定数据字段
        const columns=[
            {
                title: '患者姓名',
                dataIndex: 'patientName',
                width: '20%',
              },
              {
                title: '患者性别',
                dataIndex: 'patientGender',
                width: '20%',
              },
              {
                title: '患者年龄',
                dataIndex: 'patientAge',
              },
              {
                title: '服药记录',
                dataIndex: 'medicine',
              },
              {
                title: '行为干涉',
                dataIndex: 'action',
              },
              {
                title: '测试任务类型',
                dataIndex: 'missionType',
              },
              {
                title: '多动症确认',
                dataIndex: 'illness',
              },
              {
                title: '标注医生',
                dataIndex: 'doctorName',
              },
              {
                title: '标注日期',
                dataIndex: 'date',
              },
              {
                  title: '更改',
                  width: '100px',
                  render: (text, record) => {
                      return(
                        <Fragment>
                            <a onClick={() => {this.editDetail(record)}}><Icon type="edit" /></a>
                        </Fragment>
                      );
                  }
              }
        ];

        //mock 数据
        const tableData = [];
        for(let i=0; i<24; i++ ){
            let record = {
                dataPath: '/home/data/sdas',
                patientName: `patien${i}`,
                patientGender: '男',
                patientAge: `${i}`,
                medicine: '是',
                action: '运动',
                missionType: '反应任务',
                illness:  true,
                doctorName: '胡传华',
                date: '2019/7/29',
            }
            tableData.push(record);
        }

        const { data, loading,} = this.props;

        const { modalVisible, currentRecord } = this.state;
        const handleModalVisible = this.handleModalVisible;

        return (
            <Fragment>
                {this.renderSearch()}
                <Tabs
                    animated={false}
                    style={{ textAlign: 'right' }}
                >
                    <TabPane tab={<Icon type="bar-chart" />} key="1" style={{ textAlign: 'left' }}>
                        <Bar seriesLayoutBy={"column"} data={data} loading={loading} />
                    </TabPane>
                    <TabPane tab={<Icon type="pie-chart" />} key="2" style={{ textAlign: 'left' }}>
                        <Line seriesLayoutBy={"column"} data={data} loading={loading} />
                    </TabPane>
                </Tabs>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    onChange={this.handleTableChange}
                />
                <BasicForm2 
                    modalVisible={modalVisible}
                    handleModalVisible={handleModalVisible}
                    currentRecord={currentRecord}
                />
            </Fragment>
        );
    }
}
export default Index;