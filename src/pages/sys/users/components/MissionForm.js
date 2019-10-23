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
            ta: undefined,
            cr: undefined,
            pcr: undefined,
            te: undefined,
            pe: undefined,
            pr: undefined,
            ppr: undefined,
            pse: undefined,
            ppe: undefined,
            npe: undefined,
            pnpe: undefined,
            clr: undefined,
            pclr: undefined,
            cc: undefined,
            tcfc: undefined,
            fm: undefined,
            l2l: undefined,
            time: undefined,
          },
    }

    //在载入时要从后端拿取数据
    componentDidMount(){
      const { dispatch, edit, currentRecordId } = this.props;
      if(edit){
        dispatch({
          type: 'wcstModel/selectWcstTaskData',
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
        values["userId"] = currentRecordId;
        dispatch({
          type: 'wcstModel/sendWcstTaskData',
          payload: values,
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
              <Title level={4}>WCST认知测试</Title>
            </Row>
            <Divider />
            <Form.Item label="总应答数">
              {getFieldDecorator('ta', {
                initialValue: missionFormData.ta ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="正确应答数">
              {getFieldDecorator('cr', {
                initialValue: missionFormData.cr ,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="正确应答百分比">
              {getFieldDecorator('pcr', {
                initialValue: missionFormData.pcr,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="错误应答数">
              {getFieldDecorator('te', {
                initialValue: missionFormData.te,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="错误应答数百分比">
              {getFieldDecorator('pe', {
                initialValue: missionFormData.pe,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="持续性应答数">
              {getFieldDecorator('pr', {
                initialValue: missionFormData.pr,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="持持续性应答数百分比">
              {getFieldDecorator('ppr', {
                initialValue: missionFormData.ppr,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="持续性错误数">
              {getFieldDecorator('pse', {
                initialValue: missionFormData.pse,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="持续性错误数百分比">
              {getFieldDecorator('ppe', {
                initialValue: missionFormData.ppe,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="非持续性错误">
              {getFieldDecorator('npe', {
                initialValue: missionFormData.npe,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="非持续性错误百分比">
              {getFieldDecorator('pnpe', {
                initialValue: missionFormData.pnpe,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="概念化水平应答数">
              {getFieldDecorator('clr', {
                initialValue: missionFormData.clr,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="概念化水平百分数">
              {getFieldDecorator('pclr', {
                initialValue: missionFormData.pclr,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="完成分类数">
              {getFieldDecorator('cc', {
                initialValue: missionFormData.cc,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="完成第一个分类所需应答数">
              {getFieldDecorator('tcfc', {
                initialValue: missionFormData.tcfc,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="不能维持完整分类">
              {getFieldDecorator('fm', {
                initialValue: missionFormData.fm,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="学习到学会">
              {getFieldDecorator('l2l', {
                initialValue: missionFormData.l2l,
              })(<Input />)}           
            </Form.Item>
            <Form.Item label="用时">
              {getFieldDecorator('time', {
                initialValue: missionFormData.time,
              })(<Input />)}           
            </Form.Item>
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