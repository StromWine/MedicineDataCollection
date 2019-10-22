import React, {PureComponent} from 'react';
import dva, { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Steps,
  Row,
  Icon,
  Descriptions,
  Modal,
  Divider,
  Typography,
} from 'antd';

const {Option} = Select;
const {Step} = Steps;
const { Title } = Typography;

const pastHistoryItem = [
  '高热惊厥', '癫痫', '鼻炎', '扁桃体炎', '头颅外伤', '食物、药物过敏史',
];

const personHistoryItem = [
  "父母高龄孕产", "早产", "产伤", "产时缺氧", "黄疸", "走路、说话等发育不良",
];

const ADHDItem = [
  {label: '注意缺陷型（ADHD-I）', value: 1},
  {label: '多动冲动型（ADHD-HI）', value: 2},
  {label: '混合型（ADHD-C）', value: 3},
  {label: '正常', value: 0}
];

@connect(({viewModel}) => ({
  viewModel,
}))
@Form.create()
class LabelForm extends PureComponent {

  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    formData: {
      personInfo:{
        age:'',
        gender: 0,
        weight: '',
        height: '',
        name:'',
        adhdType: undefined , 
      },
      missionFormData:{
        reySiScore: -1,
        reyDiScore: -1,
        reySdScore: -1,
        reyDdScore: -1,
        aWordTime: -1,
        aWordMis: -1,
        bWordTime: -1,
        bWordMis: -1,
        stroopTimeA: -1,
        stroopMisA: -1,
        stroopTimeB: -1,
        stroopMisB: -1,
        stroopTimeC: -1,
        stroopMisC: -1,
        stroopTimeD: -1,
        stroopMisD: -1,
        snapParentScore: -1,
        snapTeacherScore: -1,
      },
      clinicalInfo:{
        symptomTime:'',
        presentIllnessHistory:'',
        chiefComplaint:'',
        treatmentHistory:'unused',
        pastHistory:undefined,
        personalHistory: undefined,
        familyHistory: '',
      },
    },
    currentStep: 0,
  };

  componentDidMount(){
    const {viewModel: {allInfoData}, currentRecordId, edit} = this.props;
    const { formData } = this.state;
    if(edit){
      // 如果是编辑进来的，则进行赋值
      const item = allInfoData.find(v => v.personalInfo.id === currentRecordId);
      console.log('test item', item);
      if (item){
        this.setState({
          formData:{
            ...formData,
            personInfo: {... item.personalInfo},
            missionFormData: {...item.missionTest},
            clinicalInfo: {...item.clinicalInfo},
          }
        });
      }
    }
  }

  //返回上一步的表单
  handleLastStep = e => {
    const {currentStep }= this.state;
    this.setState({
      currentStep: currentStep - 1,
    })
  }

  //提交个人信息表单 第一步
  handlePersonSubmit = e => {
    e.preventDefault();
    const {formData} = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          formData:{
            ...formData,
            personInfo:{...values},
          },
        });
        this.state.currentStep += 1;
      }
    });
  };

  //提交任务测试结果表单 第二步
  handleMissionSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(err) return;
      const { formData }= this.state;
      this.setState({
        formData:{
          ...formData,
          missionFormData: {...values},
        },
      });
      this.state.currentStep += 1;
    })
  }

  
  //填写临床信息 第三步
  handleClinicalSubmit = e => {
    e.preventDefault();
    const {formData} = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          formData:{
            ...formData,
            clinicalInfo: {...values},
          },
        });
        this.state.currentStep += 1;
      }
    });
  }

  //将标注数据系统进行发送
  handleSend = e => {
    console.log('发送数据至后端进行添加！')
  }

  handleFinalSubmit = () => {
    const { dispatch, handleModalVisible, edit, currentRecordId } = this.props;
    const { formData } = this.state;
    if (!edit){
      console.log("++++++++++++开始请求后端数据+++++++++++++++")
      dispatch({
        type: 'viewModel/addLabelData',
        payload: formData,
        callback: res => {
          //返回之后重新获取一下页面数据
          dispatch({
            type: 'viewModel/fetchLineData',
          });
          dispatch({
            type: 'viewModel/fetchAllAndTableData',
          });
        }
      });
    }else{
      dispatch({
        type: 'viewModel/updateLabelData',
        payload: {formData: formData, userId: currentRecordId},
        callback: res => {
          //返回之后重新获取一下页面数据
          dispatch({
            type: 'viewModel/fetchLineData',
          });
          dispatch({
            type: 'viewModel/fetchAllAndTableData',
          });
        }
      });
    }
    
    handleModalVisible(false);
  }

  //填写个人信息
  renderFirstForm(){
    const { getFieldDecorator } = this.props.form;
    const { formData } = this.state;
    const personInfo = formData.personInfo;

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
    const adhdType = personInfo.adhdType;
    const currentAdhdItem = ADHDItem.find(v => v.value === adhdType)

    //这里根据用户的姓名去获取数据
    return(
      <Form {...formItemLayout} onSubmit={this.handlePersonSubmit}>
        <Form.Item label="患者姓名">
          {getFieldDecorator('name', {
            initialValue: personInfo.name ,
            rules: [
              {
                required: true,
                message: '请选择一个用户',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="患者性别">
          {getFieldDecorator('gender', {
            initialValue:personInfo.gender,
          })(<Select >
              <Option value={1}>男</Option>
              <Option value={0}>女</Option>
          </Select>)}
        </Form.Item>
        <Form.Item label="患者年龄">
          {getFieldDecorator('age', {
            initialValue:personInfo.age,
          })(<Input/>)}
        </Form.Item>
        <Form.Item label="患者体重">
          {getFieldDecorator('weight', {
            initialValue:personInfo.weight,
          })(<Input/>)}
        </Form.Item>
        <Form.Item label="患者身高">
          {getFieldDecorator('height', {
            initialValue:personInfo.height,
          })(<Input/>)}
        </Form.Item>
        <Form.Item label="患者患病类型">
          {getFieldDecorator('adhdType', {
            initialValue: personInfo.adhdType,
            rules: [
              {
                required: true,
                message: '请选择患者患病类型',
              },
            ],
          })(<Select placeholder="请选择患者患病类型">
            {ADHDItem.map(item => (
              <Option key={item.value}>{item.label}</Option>
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

  //填写任务测试结果 第二步
  renderSecondForm(){
    const { getFieldDecorator } = this.props.form;
    const { formData:{ missionFormData } } = this.state;

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
        <Form.Item label="患者姓名">
          {getFieldDecorator('name', {
            initialValue: this.state.formData.personInfo.name ,
            rules: [
              {
                required: true,
                message: '请选择一个用户',
              },
            ],
          })(<Input />)}
        </Form.Item>
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
          <Button type="primary" onClick={e => {this.handleLastStep(e)}} >
            <Icon type="left" />
            上一步
          </Button>
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  }

  //第三步骤 用于临床信息填写
  renderThirdForm() {
    const { getFieldDecorator } = this.props.form;
    const { formData:{clinicalInfo} } = this.state;

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
        <Form.Item label="患者姓名">
          {getFieldDecorator('name', {
            initialValue: this.state.formData.personInfo.name,
            rules: [
              {
                required: true,
                message: '请选择患者Id',
              },
            ],
          })(<Input />)}
        </Form.Item>
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
            initialValue:clinicalInfo. chiefComplaint,
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
          {getFieldDecorator(' personalHistory', {
            initialValue:clinicalInfo. personalHistory,
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
  renderDescription(){
      const { formData } = this.state;
      const personInfo = formData.personInfo;
      const missionFormData = formData.missionFormData;
      const clinicalInfo = formData.clinicalInfo;
      let ADHDDes = '';
      if(personInfo.ADHD === "ADHDI"){
        ADHDDes = "注意缺陷型（ADHD_I）";
      }
      if(personInfo.ADHD === "ADHDHI"){
        ADHDDes = "多动冲动型（ADHD_HI）";
      }
      if(personInfo.ADHD === "ADHDC"){
        ADHDDes = "混合型（ADHD_C）";
      }
      if(personInfo.ADHD === "normal"){
        ADHDDes = "正常"
      }
      //最后一步显示一下标注数据详细信息
      return(
        <div>
          <Descriptions title="患者信息">
            <Descriptions.Item label="患者姓名">{personInfo.name}</Descriptions.Item>
            <Descriptions.Item label="患者标注">{ADHDDes}</Descriptions.Item>
            <Descriptions.Item label="患者姓名">{personInfo.name}</Descriptions.Item>
            <Descriptions.Item label="患者性别">{personInfo.gender}</Descriptions.Item>
            <Descriptions.Item label="患者年龄">{personInfo.age}</Descriptions.Item>
            <Descriptions.Item label="患者体重">{personInfo.weight}</Descriptions.Item>
            <Descriptions.Item label="患者身高">{personInfo.height}</Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions title="任务测试得分">
            <Descriptions.Item label="rey图形得分">{missionFormData.reyScore}</Descriptions.Item>
            <Descriptions.Item label="A式连接时间">{missionFormData.aWordTime}</Descriptions.Item>
            <Descriptions.Item label="A式连接错误数">{missionFormData.aWordMis}</Descriptions.Item>
            <Descriptions.Item label="B式连接时间">{missionFormData.bWordTime}</Descriptions.Item>
            <Descriptions.Item label="B式连接错误数">{missionFormData.bWordMis}</Descriptions.Item>
            <Descriptions.Item label="1部分stroops时间">{missionFormData.stroopTimeA}</Descriptions.Item>
            <Descriptions.Item label="1部分stroops错误数">{missionFormData.stroopMisA}</Descriptions.Item>
            <Descriptions.Item label="2部分stroops时间">{missionFormData.stroopTimeB}</Descriptions.Item>
            <Descriptions.Item label="2部分stroops错误数">{missionFormData.stroopMisB}</Descriptions.Item>
            <Descriptions.Item label="3部分stroops时间">{missionFormData.stroopTimeC}</Descriptions.Item>
            <Descriptions.Item label="3部分stroops错误数">{missionFormData.stroopMisC}</Descriptions.Item>
            <Descriptions.Item label="4部分stroops时间">{missionFormData.stroopTimeD}</Descriptions.Item>
            <Descriptions.Item label="4部分stroops错误数">{missionFormData.stroopMisD}</Descriptions.Item>
            <Descriptions.Item label="斯诺佩评估量表得分">{missionFormData.SnapScore}</Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions title="临床信息">
            <Descriptions.Item label="症状持续时间">{clinicalInfo.symptomTime}</Descriptions.Item>
            <Descriptions.Item label="现病史">{clinicalInfo.presentIllnessHistory}</Descriptions.Item>
            <Descriptions.Item label="主诉">{clinicalInfo.chiefComplaint}</Descriptions.Item>
            <Descriptions.Item label="用药疗效">{clinicalInfo.treatmentHistory}</Descriptions.Item>
            <Descriptions.Item label="既往史">{clinicalInfo.pastHistory}</Descriptions.Item>
            <Descriptions.Item label="个人史">{clinicalInfo.personalHistory}</Descriptions.Item>
            <Descriptions.Item label="家族史">{clinicalInfo.familyHistory}</Descriptions.Item>
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
            width="40%"
            onOk={() => handleModalVisible(true)}
            onCancel={() => handleModalVisible(false)}
            destroyOnClose
            
        >
            <Row type="flex" justify="center">
              <Steps current={currentStep}>
                <Step title="个人信息" />
                <Step title="任务测试" />
                <Step title="临床信息" />
                <Step title="汇总展示" />
              </Steps>
          </Row>
            {currentStep === 0 && this.renderFirstForm()} 
            {currentStep === 1 && this.renderSecondForm()} 
            {currentStep === 2 && this.renderThirdForm()} 
            {currentStep === 3 && this.renderDescription()}
        </Modal>
    );
    }
}

export default LabelForm;