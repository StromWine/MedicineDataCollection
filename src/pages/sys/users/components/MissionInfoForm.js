import React, {PureComponent} from 'react';
import dva, { connect } from 'dva';
import moment from 'moment';
import {Link} from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Typography,
  Divider,
  DatePicker,
  TimePicker,
  Select,
} from 'antd';

const { Title } = Typography;
const {Option} = Select;
//任务信息采集添加的表单
@connect(({viewModel}) => ({
    viewModel,
    }))
@Form.create()
class MissionInfoForm extends PureComponent {

    state = {
        missionFormData:{
            testTime: undefined, //测试时间
            testType: undefined, //测试类型，一共两类：WCST或者整晚
            medicine: undefined, //测试前服用的药物
            timeAfterMed: undefined, //吃完药之后多久进行测试
            otherInter: undefined, //非药物干预
          },
    }

    //在载入时要从后端拿取数据
    // componentDidMount(){
    //   const { dispatch, edit, currentRecordId } = this.props;
    //   if(edit){
    //     dispatch({
    //       type: 'wcstModel/selectWcstTaskData',
    //       payload: currentRecordId,
    //       callback: res => {
    //         this.setState({
    //           missionFormData:{
    //             ...res,
    //           },
    //         });
    //       }
    //     });
    //   }
    // }

    handleSubmit = e => {
      this.props.history.push("/sys/users/p2")
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
        handleModalVisible(false, "missionBasicInfo");
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
        function handleChange(value) {
          console.log(`selected ${value}`);
        }

        //填写测试任务结果
        return(
          <Form {...formItemLayout} onSubmit={this.handleMissionSubmit}>
            <Row justify="start" type="flex">
              <Title level={4}>测试基本信息填写</Title>
            </Row>
            <Divider />
            <Form.Item label="测试时间">
              {getFieldDecorator('testTime', {
                initialValue: missionFormData.testTime ,
              })(<DatePicker 
                //onChange={(date, dateString) => this.handleDateSearch(date, dateString)} 
                />,
              )}
            <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
            </Form.Item>
            <Form.Item label="选择测试类型">
              {getFieldDecorator('testType', {
                initialValue: missionFormData.testType ,
              })(<Select
                showSearch
                style={{ width: 200 }}
                placeholder="选择测试类型"
                // onChange={onChange}
                // onFocus={onFocus}
                // onBlur={onBlur}
                // onSearch={onSearch}
                filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            >
            <Option value="type1">WCST</Option>
            <Option value="type2">测量整晚</Option> 
        </Select>)}
            </Form.Item>
            <Form.Item label="测试前服用药物">
              {getFieldDecorator('medicine', {
                initialValue: missionFormData.medicine,
              })(<Select
                showSearch
                style={{ width: 200 }}
                mode="multiple"
                placeholder="选择药物"
                defaultValue={['SSRI', 'SNRI']}
                onChange={handleChange}
               >
            <Option value="medicine1">SSRI</Option>
            <Option value="medicine2">SNRI</Option> 
            <Option value="medicine3">NaSSA</Option>
            <Option value="medicine4">TCA</Option> 
            <Option value="medicine5">SARI</Option>
            <Option value="medicine6">BZ</Option> 
            <Option value="medicine7">PAM</Option>
            <Option value="medicine8">Li</Option> 
            <Option value="medicine9">SDA</Option>
            <Option value="medicine10">DPA</Option>
            <Option value="medicine11">无</Option>
        </Select>,)}
            </Form.Item>
            <Form.Item label="服药后多久进行测试（h）">
              {getFieldDecorator('timeAfterMed', {
                initialValue: missionFormData.timeAfterMed,
              })(<TimePicker defaultValue={moment('1', "hh")} format={"hh"} style={{ width: 100} }/>)}           
            </Form.Item>
            <Form.Item label="其他干预方式">
              {getFieldDecorator('otherInter', {
                initialValue: missionFormData.otherInter,
              })(<Select
                mode="multiple"
                style={{ width: 200 }}
                placeholder="选择其他干预方式"
                defaultValue={['SSRI', 'SNRI']}
                onChange={handleChange}
               >
                 <Option value="inter1">rTMs</Option>
                <Option value="inter2">CBT-I</Option> 
                <Option value="inter0">无</Option>
                </Select>
                 )}           
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" >
                 添加任务
              </Button>   
              <Link to="/sys/users/p2">
              <Button  htmlType="submit" style={{marginLeft: '20px'}} >
                 查看任务
              </Button>
              </Link>
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
        const title = "任务基本信息填写——" + currentRecordId + "_" + userName;
        return(
            <Modal
            visible={modalVisible}
            title={title}
            width="30%"
            onCancel={()=> handleModalVisible(false, "missionBasicInfo")}
            destroyOnClose
            >
            {this.renderForm()}
            </Modal>
        )
    }

}

export default MissionInfoForm;