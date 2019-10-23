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
  Icon,
  Select,
} from 'antd';

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
class ClinicalForm extends PureComponent {

    state={
        clinicalInfo:{
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
              clinicalInfo:{
                ...res,
              },
            });
          }
        });
      }
    }


    handleClinicalSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if(err) return;
        const { dispatch, currentRecordId, handleModalVisible } = this.props;
        dispatch({
          type: 'viewModel/sendClinicalData',
          payload: {params: values, userId: currentRecordId},
        }); 
        handleModalVisible(false, "clinicalInfo");
      });
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
    
        return (
          <Form {...formItemLayout} onSubmit={this.handleClinicalSubmit}>
            <Row justify="start" type="flex">
              <Title level={4}>现病史</Title>
            </Row>
            <Divider />
            <Form.Item label="症状持续时间（月）">
              {getFieldDecorator('symptomTime', {
                initialValue:clinicalInfo.symptomTime,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="现病史">
              {getFieldDecorator('presentIllnessHistory', {
                initialValue:clinicalInfo.presentIllnessHistory,
              })(<Input/>)}
            </Form.Item>
            <Row justify="start" type="flex">
              <Title level={4}>主诉/治疗史</Title>
            </Row>
            <Divider />
            <Form.Item label="主诉">
              {getFieldDecorator('chiefComplaint', {
                initialValue:clinicalInfo.chiefComplaint,
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="用药疗效">
              {getFieldDecorator('treatmentHistory', {
                initialValue:clinicalInfo.treatmentHistory,
              })(<Select>
                  <Option value="unused">未用药</Option>
                  <Option value="noEffect">无疗效</Option>
                  <Option value="lowEffect">低疗效</Option>
                  <Option value="highEffect">高疗效</Option>
              </Select>)}
            </Form.Item>
            <Row justify="start" type="flex">
              <Title level={4}>既往史/个人史/家族史</Title>
            </Row>
            <Divider />
            <Form.Item label="既往史">
              {getFieldDecorator('pastHistory', {
                initialValue:clinicalInfo.pastHistory,
              })(<Select >
                  {
                    pastHistoryItem.map((v, index) => (
                      <Option value={v}>{v}</Option>
                    ))
                  }
              </Select>)}
            </Form.Item>
            <Form.Item label="个人史">
              {getFieldDecorator('personalHistory', {
                initialValue:clinicalInfo.personalHistory,
              })(<Select >
                  {
                    personHistoryItem.map((v, index) => (
                      <Option value={v}>{v}</Option>
                    ))
                  }
              </Select>)}
            </Form.Item>
            <Form.Item label="家族史">
              {getFieldDecorator('familyHistory', {
                initialValue:clinicalInfo.familyHistory,
              })(<Input/>)}
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

        const title = "临床信息采集——" + currentRecordId + "_" + userName;
        return(
        <Modal
        visible={modalVisible}
        title={title}
        width='40%'
        onCancel={() => handleModalVisible(false, "clinicalInfo")}
        destroyOnClose
        >
            {this.renderForm()}
        </Modal>)

    }
}

export default ClinicalForm;
