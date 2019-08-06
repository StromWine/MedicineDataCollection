import { Fragment, PureComponent } from 'react';
import { DataTable } from '@components';
import { connect } from 'dva';
import { Line } from '@components/Echarts';
import { Row, Col, DatePicker, Button, Card, Table, Icon } from 'antd';
import moment from 'moment';
import LabelForm from './BasicForms';

const dateFormat = 'YYYY/MM/DD';
const initTime = [moment().subtract(7, 'days'), moment().subtract(1, 'days')];

//mock 数据
const tableData = [
    {dataPath: "/home/data/sjahduu", testDate: "7/24"},
    {dataPath: "/home/data/sdajidq", testDate: "7/25"},
    {dataPath: "/home/data/sdaqidq", testDate: "7/26"},
    {dataPath: "/home/data/uitwoev", testDate: "7/27"},
];

@connect(({viewModel}) => ({
    viewModel,
}))
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            date: initTime,
            modalVisible: false,
            currentDataPath: '',//当前记录行的标注数据路径
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
        //页面渲染时获取图像数据
        dispatch({
            type: 'viewModel/getData',
            payload: 'p1',
        });
        //获取表格数据
        dispatch({
            type: 'viewModel/fetchP1TableData',
        })

    }

    //用于显示新建标注页面
    handleModalVisible = flag => {
        console.log("页面触发可视化")
        this.setState({
            modalVisible: !!flag,
        });
    }

    //表格上点击操作编辑按钮是直接将路径数据传送
    handleClick = (flag, record) => {
        this.setState({
            currentDataPath: record.dataPath,
            modalVisible: !!flag,
        });
        
    }

    render() {
        const columns = [
            {
                title: '未标注数据',
                dataIndex: 'dataPath',
                width: '60%',
            },
            {
                title: '采集日期',
                dataIndex: 'testDate',
                width: '20%',
            },
            {
                title: '操作',
                width: '20%',
                render: (text, record) => {
                    return(
                        <Fragment>
                                <a onClick={() => {this.handleClick(true, record)}}><Icon type="edit" /></a>
                        </Fragment>
                    );
                }
            }
        ];

        const { 
            viewModel: {p1, p1TableData }, 
            showY2, 
            Y2Name, 
            YName, 
            loading,
        } = this.props;

        
        const { modalVisible, currentDataPath } = this.state;
        const handleModalVisible = this.handleModalVisible;

        return (
            <Fragment>
                <Row style={{ width: 400 }}>
                    <Col span={5} style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.handleModalVisible(true)}>新建标注</Button>
                    </Col>
                </Row>
                <Card
                    // title="Card title"
                    style={{ marginTop: 15 }}
                >
                    <Line seriesLayoutBy={"column"} data={p1} showY2={showY2} Y2SeriesIndex={[1]} YName={YName} Y2Name={Y2Name} loading={loading} />
                </Card>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    // onChange={this.handleTableChange}
                />
                {modalVisible && (<LabelForm 
                    modalVisible={modalVisible}
                    handleModalVisible={handleModalVisible}
                    currentDataPath = {currentDataPath}
                />)}
            </Fragment>
        );
    }
}
export default Index;