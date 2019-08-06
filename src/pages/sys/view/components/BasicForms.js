import React, {PureComponent} from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Steps,
  Row,
  Card,
  Icon,
  Descriptions,
  Modal,
} from 'antd';
import { dispatch } from 'C:/Users/StormWine/AppData/Local/Microsoft/TypeScript/3.5/node_modules/rxjs/internal/observable/pairs';

const {Option} = Select;
const {Step} = Steps;

@connect(({viewModel}) => ({
  viewModel,
}))
@Form.create()
class LabelForm extends PureComponent {

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    formData: {
      dataPath:'',
      patientName:'',
      patientAge:'',
      patientSex: 0,
      missionType: '',
      adChecked: false,
      medicine: "否",
      medicineTime: "0.0",
    },
    currentStep: 0,
  };


  handleSubmit = e => {
    e.preventDefault();
    const {formData} = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          formData:{
            ...formData,
            patientName: values.patientName,
            patientAge: values.patientAge,
            patientSex: values.patientSex,
            missionType: values.missionType,
            adChecked: values.adChecked,
            medicine: values.medicine,
            medicineTime: values.medicineTime,
          },
        });
        this.state.currentStep += 1;
      }
    });
  };

  //第一步提交后下一步选择
  handleNextSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(err) return;
      this.setState({
        formData:{
          dataPath: values.DataPath,
        },
      });
      this.state.currentStep += 1;
    })
  }

  //返回上一步的表单
  handleLastStep = e => {
    const {currentStep }= this.state;
    this.setState({
      currentStep: currentStep - 1,
    })
  }

  //将标注数据系统进行发送
  handleSend = e => {
    console.log('发送数据至后端进行添加！')
  }

  handleFinalSubmit = () => {
    const { dispatch, handleModalVisible } = this.props;
    const { formData } = this.state;
    dispatch({
      type: 'viewModel/addLabelData',
      payload: formData,
      callback: res => {
        //返回之后重新获取一下页面数据
        dispatch({
          type: 'viewModel/fetchLineData',
        });
        dispatch({
          type: 'viewModel/fetchP1TableData',
        });
      }
    });
    handleModalVisible(false);
  }

  //选择标注数据
  renderFirstForm(){
    const { getFieldDecorator } = this.props.form;
    const { formData } = this.state;
    const {currentDataPath} = this.props;//点击进入的标注数据

    //mock模拟数据
    const pathData = ["/1/ddasd", "/2/fadawdad", "/3/ojiikijd", "/4/2134123"];

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
    //先从后端获取有多少需要进行标注的数据
    return(
      <Form {...formItemLayout} onSubmit={this.handleNextSubmit}>
        <Form.Item label="选择数据存储路径">
          {getFieldDecorator('DataPath', {
            initialValue: formData.dataPath || currentDataPath,
            rules: [
              {
                required: true,
                message: '请选择数据存储路径',
              },
            ],
          })(<Select>
            {pathData.map(item => (
              <Option key={item}>{item}</Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  }

  //第二个步骤 用于填写患者的信息和标注信息
  renderSecondForm() {
    const { getFieldDecorator } = this.props.form;
    const { formData } = this.state;

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
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="患者姓名">
          {getFieldDecorator('patientName', {
            initialValue: formData.patientName,
            rules: [
              {
                required: true,
                message: '请选择患者Id',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="患者性别">
          {getFieldDecorator('patientSex', {
            initialValue:formData.patientSex,
          })(<Select >
              <Option value={0}>男</Option>
              <Option value={1}>女</Option>
          </Select>)}
        </Form.Item>
        <Form.Item label="患者年龄">
          {getFieldDecorator('patientAge', {
          })(<Input/>)}
        </Form.Item>
        <Form.Item label="是否服药">
          {getFieldDecorator('medicine', {
            rules: [{
                required: true,
                message:"请选择是否服用过药物"
            }],
          })(<Select >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>)}
        </Form.Item>
        <Form.Item label="服药时间">
          {getFieldDecorator('medicineTime', {
            rules: [{
                required: true,
                message:"请选择服药距离时间"
            }],
          })(<Select >
            <Option value='0.0'>未服用</Option>
            <Option value='0.5'>半小时</Option>
            <Option value='1.0'>一小时</Option>
            <Option value='2.0'>两小时</Option>
          </Select>)}
        </Form.Item>
        <Form.Item label="行为干涉类型" hasFeedback>
          {getFieldDecorator('missionType', {
            initialValue:formData.missionType,
            rules: [
              {
                required: true,
                message: '请选择行为干涉类型',
              },
            ],
          })(<Select>
            <Option key="反应任务">反应任务</Option>
            <Option key="观察任务">观察任务</Option>
          </Select>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="疑似患有多动症">
          {getFieldDecorator('adChecked', {
          })(
            <Checkbox />
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={e => {this.handleLastStep(e)}} >
            <Icon type="left" />
            上一步
          </Button>
          <Button type="primary" htmlType="submit">
            下一步
            <Icon type="right" />
          </Button>
        </Form.Item>
      </Form>
    );
  }

  //显示标注数据信息
  renderThirdForm(){
      const { formData } = this.state;

      //最后一步显示一下标注数据详细信息
      return(
        <div>
          <Descriptions title="数据标注信息">
            <Descriptions.Item label="患者姓名">{formData.patientName}</Descriptions.Item>
            <Descriptions.Item label="患者性别">{formData.patientSex}</Descriptions.Item>
            <Descriptions.Item label="患者年龄">{formData.patientSex}</Descriptions.Item>
            <Descriptions.Item label="标注数据路径">{formData.dataPath}</Descriptions.Item>
            <Descriptions.Item label="疑似多动症">{formData.adChecked ? "是" : "否"}</Descriptions.Item>
          </Descriptions>
          <Row type="flex" justify="center">
            <Button type="primary" onClick={e => {this.handleLastStep(e)}} >
              <Icon type="left" />
              上一步
            </Button>
            <Button type="primary" onClick={() => {this.handleFinalSubmit()}}>
              提交标注
              <Icon type="right" />
            </Button>
          </Row>
        </div>
      )
  }


  //渲染主函数
  render(){
    const { modalVisible, handleModalVisible, } = this.props;
    const { currentStep } = this.state;
    console.log("test modalVisible", modalVisible);
    return(
        <Modal
            visible={modalVisible}
            title="新建标注信息"
            onOk={() => handleModalVisible()}
            onCancel={() => handleModalVisible()}
            destroyOnClose
            
        >
            <Row type="flex" justify="center">
              <Steps current={currentStep}>
                <Step title="选择标注数据" />
                <Step title="标注信息填写" />
                <Step title="确认标注" />
              </Steps>
          </Row>
            {currentStep === 0 && this.renderFirstForm()} 
            {currentStep === 1 && this.renderSecondForm()} 
            {currentStep === 2 && this.renderThirdForm()}
        </Modal>
    );
    }
}

export default LabelForm;