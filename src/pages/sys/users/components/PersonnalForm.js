import React, {PureComponent} from 'react';
import dva, { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  DatePicker, 
  TimePicker
} from 'antd';

const {Option} = Select;
const dateFormat = 'YYYY/MM/DD';
const format = 'HH:mm';
const ADHDItem = [
    {label: '单纯性失眠', value: 1},
    {label: '伴过度觉醒', value: 2},
    {label: '伴焦虑', value: 3},
    {label: '伴抑郁', value: 4},
    {label: '正常', value: 0},
  ];

//个人信息添加的表单
@connect(({wcstModel}) => ({
wcstModel,
}))
@Form.create()
class PersonnalForm extends PureComponent {

    state = {
        personInfo:{
            age:'',
            gender: undefined,
            weight: '',
            height: '',
            name:'',
            adhdType: undefined , 
            doctorId: '',
        }
    }

    //编辑进来时从数据库中进行加载
    componentDidMount(){
        const { edit, currentRecordId} = this.props;
        const { dispatch } = this.props;
        //根据后台获取相应的结果
        if(edit){
            dispatch({
                type: 'wcstModel/selectUserById',
                payload: currentRecordId,
                callback: res => {
                    this.setState({
                        personInfo:{
                            ...res,
                        }
                    });
                }
            });
        }
    }

    //提交个人信息表单到数据库中
    handlePersonSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            if (!err) {
              this.setState({
                personInfo:{
                    ...values,
                }
              });
              const {dispatch } = this.props;
              const { handleModalVisible, edit, currentRecordId } = this.props;
              if(!edit){
                dispatch({
                    type: 'wcstModel/addPersonalInfo',
                    payload: values, 
                });
              }else{
                dispatch({
                    type: 'wcstModel/updatePersonalInfo',
                    payload: {params:values, userId: currentRecordId},
                });
              }
             
              handleModalVisible(false, "personalInfo");
            }
          });
    }

     //填写个人信息
    renderFirstForm(){
        const { getFieldDecorator } = this.props.form;
        const { personInfo } = this.state;

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
            <Form.Item label="患者体重(kg)">
            {getFieldDecorator('weight', {
                initialValue:personInfo.weight,
            })(<Input/>)}
            </Form.Item>
            <Form.Item label="患者身高(cm)">
            {getFieldDecorator('height', {
                initialValue:personInfo.height,
            })(<Input/>)}
            </Form.Item>
            <Form.Item label="患者患病类型">
            {getFieldDecorator('adhdType', {
                initialValue: personInfo.adhdType,
            })(<Select placeholder="请选择患者患病类型">
                {ADHDItem.map(item => (
                <Option value={item.value}>{item.label}</Option>
                ))}
            </Select>)}
            </Form.Item>
            <Form.Item label="主治医生">
            {getFieldDecorator('doctorId', {
                initialValue:personInfo.doctorId,
            })(<Input/>)}
            </Form.Item>
            
            {/* <Form.Item label="患者测试时间">
            <div style={{display:'flex',justifyContent:'space-around'}}>
            <DatePicker defaultValue={moment('2019/11/01', dateFormat)} format={dateFormat} />
            <TimePicker defaultValue={moment('12:08', format)} format={format} />
            </div>
             </Form.Item>
             <Form.Item label="患者药物干预">
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="选择药物"
                        // onChange={onChange}
                        // onFocus={onFocus}
                        // onBlur={onBlur}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                    <Option value="medicine1">药物1</Option>
                    <Option value="medicine2">药物2</Option>
                    <Option value="medicine3">药物3</Option>
                    <Option value="No">无</Option>
                </Select>,
             </Form.Item>
             <Form.Item label="服药后多久时间">
            <TimePicker defaultValue={moment('1', "hh")} format={"hh"} style={{ width: 100} }/> h
             </Form.Item>

             <Form.Item label="患者心理干预">
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="选择心理干预手段"
                        // onChange={onChange}
                        // onFocus={onFocus}
                        // onBlur={onBlur}
                        // onSearch={onSearch}
                        filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                    <Option value="physical1">干预1</Option>
                    <Option value="physical2">干预2</Option>
                    <Option value="physical3">干预3</Option>
                    <Option value="No">无</Option>
                </Select>,
             </Form.Item> */}
            <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
                    添加/更新采集个人信息
            </Button>
            </Form.Item>
        </Form>
        );
    }

    render(){
        const {
            modalVisible, 
            handleModalVisible, 
        } = this.props;
        return(
            <Modal
            visible={modalVisible}
            title="个人采集信息"
            width="40%"
            onCancel={() => handleModalVisible(false, 'personalInfo')}
            destroyOnClose
        >
        {this.renderFirstForm()}
        </Modal>
        )
    }
}
  
  export default PersonnalForm;
