import React, {PureComponent} from 'react';
import dva, { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Typography,
  Divider,
} from 'antd';

const { Title } = Typography;

//任务信息采集添加的表单
@connect(({viewModel}) => ({
    viewModel,
    }))
@Form.create()
class MissionForm extends PureComponent {

    state = {
        missionFormData:{
            reySiScore: undefined,
            reyDiScore: undefined,
            reySdScore: undefined,
            reyDdScore: undefined,
            aWordTime: undefined,
            aWordMis: undefined,
            bWordTime: undefined,
            bWordMis: undefined,
            stroopTimeA: undefined,
            stroopMisA: undefined,
            stroopTimeB: undefined,
            stroopMisB: undefined,
            stroopTimeC: undefined,
            stroopMisC: undefined,
            stroopTimeD: undefined,
            stroopMisD: undefined,
            snapParentScore: undefined,
            snapTeacherScore: undefined,
          },
    }

    //在载入时要从后端拿取数据
    componentDidMount(){
      const { dispatch, edit, currentRecordId } = this.props;
      if(edit){
        dispatch({
          type: 'viewModel/selectTaskData',
          payload: currentRecordId,
          callback: res => {
            this.setState({
              missionFormData:{
                ...res,
              },
            });
          }
        });
      }
    }

    handleMissionSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if(err) return;
        const { dispatch, currentRecordId, handleModalVisible } = this.props;
        dispatch({
          type: 'viewModel/sendTaskData',
          payload: {params: values, userId: currentRecordId},
        }); 
        handleModalVisible(false, "missionInfo");
      });
    }

    //加载任务表单数据
    renderForm(){
        const { missionFormData } = this.state;
        const { getFieldDecorator } = this.props.form;
        
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
        //填写测试任务结果
        return(
          <Form {...formItemLayout} onSubmit={this.handleMissionSubmit}>
            <Row justify="start" type="flex">
              <Title level={4}>Rey图形任务测试</Title>
            </Row>
            <Divider />
            <Form.Item label="rey复杂图形即时结构得分">
              {getFieldDecorator('reySiScore', {
                initialValue: missionFormData.reySiScore ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="rey复杂图形即时细节得分">
              {getFieldDecorator('reyDiScore', {
                initialValue: missionFormData.reyDiScore ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="rey复杂图形延迟结构得分">
              {getFieldDecorator('reySdScore', {
                initialValue: missionFormData.reySdScore ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="rey复杂图形延迟细节得分">
              {getFieldDecorator('reyDdScore', {
                initialValue: missionFormData.reyDdScore ,
              })(<Input />)}
            </Form.Item>
            <Row justify="start" type="flex">
              <Title level={4}>数字字母连线测试</Title>
            </Row>
            <Divider />
            <Form.Item label="A式完成时间（秒）">
              {getFieldDecorator('aWordTime', {
                initialValue: missionFormData.aWordTime ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="A式完成错误数">
              {getFieldDecorator('aWordMis', {
                initialValue: missionFormData.aWordMis ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="B式完成时间（秒）">
              {getFieldDecorator('bWordTime', {
                initialValue: missionFormData.bWordTime ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="B式完成错误数">
              {getFieldDecorator('bWordMis', {
                initialValue: missionFormData.bWordMis ,
              })(<Input />)}
            </Form.Item>
            <Row justify="start" type="flex">
              <Title level={4}>Stroop色词命名任务</Title>
            </Row>
            <Divider />
            <Form.Item label="1部分完成时间（秒）">
              {getFieldDecorator('stroopTimeA', {
                initialValue: missionFormData.stroopTimeA ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="1部分完成错误数">
              {getFieldDecorator('stroopMisA', {
                initialValue: missionFormData.stroopMisA ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="2部分完成时间（秒）">
              {getFieldDecorator('stroopTimeB', {
                initialValue: missionFormData.stroopTimeB ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="2部分完成错误数">
              {getFieldDecorator('stroopMisB', {
                initialValue: missionFormData.stroopMisB ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="3部分完成时间（秒）">
              {getFieldDecorator('stroopTimeC', {
                initialValue: missionFormData.stroopTimeC ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="3部分完成错误数">
              {getFieldDecorator('stroopMisC', {
                initialValue: missionFormData.stroopMisC ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="4部分完成时间（秒）">
              {getFieldDecorator('stroopTimeD', {
                initialValue: missionFormData.stroopTimeD ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="4部分完成错误数">
              {getFieldDecorator('stroopMisD', {
                initialValue: missionFormData.stroopMisD ,
              })(<Input />)}
            </Form.Item>
            <Row justify="start" type="flex">
              <Title level={4}>斯诺佩评估量表得分</Title>
            </Row>
            <Form.Item label="SNAP-IV家长评分">
              {getFieldDecorator('snapParentScore', {
                initialValue: missionFormData.snapParentScore ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="SNAP-IV老师评分">
              {getFieldDecorator('snapTeacherScore', {
                initialValue: missionFormData.snapTeacherScore ,
              })(<Input />)}
            </Form.Item>
            <Divider />
            <Divider />
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
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
        const title = "任务信息采集——" + currentRecordId + "_" + userName;
        return(
            <Modal
            visible={modalVisible}
            title={title}
            width="30%"
            onCancel={()=> handleModalVisible(false, "missionInfo")}
            destroyOnClose
            >
            {this.renderForm()}
            </Modal>
        )
    }

}

export default MissionForm;