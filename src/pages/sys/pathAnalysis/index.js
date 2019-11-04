import React, {PureComponent} from 'react';
import {connect} from "dva";
import {
  Row,
  Card,
  Col,
  Typography, 
} from 'antd';
import { Pie } from '@components/Echarts';
import PageHeader from '@components/PageWrapper';

const { Title, Paragraph, Text } = Typography;

@connect(({pathAnalysis}) => ({
    pathAnalysis,
}))
class Introduce extends PureComponent{

    //页面开始渲染时拿取统计数据
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type: 'pathAnalysis/fetchTotalData',
        })
    }

    render(){
        //这个数据仅用于测试
        const pie_data =  {
            "columns": [
                {
                    "field": "name",
                    "name": "分类",
                    "type": "string"
                },
                {
                    "field": "value",
                    "name": "2015",
                    "type": "number"
                }
            ],
            "rows": [
                {
                    "name": "正常患者",
                    "value": 43.3
                },
                {
                    "name": "失眠患者",
                    "value": 83.1
                },
                {
                    "name": "未标注数据",
                    "value": 186.4
                },
                
            ]
        }

        // //实际获取数据
        // const pieDataList = [
        //     {
        //         "field": "name",
        //         "name": "分类",
        //         "type": "string"
        //     },
        //     {
        //         "field": "value",
        //         "name": "2015",
        //         "type": "number"
        //     }
        // ];
    
        // const {pathAnalysis:{ pathAnalysis }} = this.props;
        // const pie_data = {"columns": pieDataList, "rows": pathAnalysis};

        return(
            <div>
                <PageHeader
                    title={'标注现状统计'}
                    pathtitles={['Echarts', 'Pie']}
                    description={"统计信息来源于近红外数据与数据库标注数据统计"}
                >
                <Pie data={pie_data} height={400} />
                
                <Typography>
                    <Title>数据采集系统介绍</Title>
                    <Paragraph>
                    近红外标注系统用于对失眠症患者的近红外数据进行标注，这些信息将为辅助诊断系统提供数据来源。
                    </Paragraph>
                    <Paragraph>
                    随着商业化的趋势，越来越多的企业级产品对更好的用户体验有了进一步的要求。带着这样的一个终极目标，我们经过大量的项目实践和总结，逐步打磨出一个服务于企业级产品的设计体系
                    Ant Design。基于<Text mark>『确定』和『自然』</Text>
                    的设计价值观，通过模块化的解决方案，降低冗余的生产成本，让设计者专注于
                    <Text strong>更好的用户体验</Text>。
                    </Paragraph>
                    <Title level={2}>标注步骤介绍</Title>
                    <Paragraph>
                    我们提供完善的设计原则、最佳实践和设计资源文件（<Text code>Sketch</Text> 和{' '}
                    <Text code>Axure</Text>），来帮助业务快速设计出高质量的产品原型。
                    </Paragraph>
                    <Paragraph>
                        <ul>
                            <li>
                            <span>选择标注数据，从标注数据的存储路径中进行选择</span>
                            </li>
                            <li>
                            <span>填写患者信息，并确定样本标注</span>
                            </li>
                            <li>
                            <span>确认标注信息并进行提交</span>
                            </li>
                        </ul>
                    </Paragraph>
                </Typography>
                </PageHeader>
            </div>
        );
    }
}

export default Introduce;