import React, {PureComponent} from 'react';
import dva, { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
} from 'antd';

const {Option} = Select;

const ADHDItem = [
    {label: '注意缺陷型（ADHD-I）', value: 1},
    {label: '多动冲动型（ADHD-HI）', value: 2},
    {label: '混合型（ADHD-C）', value: 3},
    {label: '正常', value: 0}
  ];

//个人信息添加的表单
@connect(({viewModel}) => ({
viewModel,
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
        }
    }

    //编辑进来时从数据库中进行加载
    componentDidMount(){
        const { edit, currentRecordId} = this.props;
        const { dispatch } = this.props;
        //根据后台获取相应的结果
        if(edit){
            dispatch({
                type: 'viewModel/selectUserById',
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
                    type: 'viewModel/addPersonalInfo',
                    payload: values, 
                });
              }else{
                dispatch({
                    type: 'viewModel/updatePersonalInfo',
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
