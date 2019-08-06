import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Card,
  Modal,
  Icon,
  Tooltip,
  Select,
  Checkbox,
  Button
} from 'antd';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({datatables}) => ({
    datatables,
}))
@Form.create()
class BasicForms extends PureComponent {

    handleSubmit = e => {
        const { dispatch, currentRecord, form, handleModalVisible } = this.props;
        e.preventDefault();
        form.validateFields((err, values) => {
            if(!err){
                const doctorName = currentRecord.doctorName;
                dispatch({
                    type: 'datatables/updateDataById',
                    payload: { ...values, doctorName},
                });
            }
        });
        handleModalVisible(false);
    }

    handleSubmit = e => {
        
    }

    render(){

        
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
        //mock模拟数据
        const pathData = ["/1/ddasd", "/2/fadawdad", "/3/ojiikijd", "/4/2134123"];

        const {currentRecord, modalVisible, handleModalVisible} = this.props;
        const { getFieldDecorator } =this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 7 },
              md: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 12 },
              md: { offset: 1, span: 16 },
            },
          };
        return(
            <Modal 
                destroyOnClose
                title="更新标注数据"
                width="80%"
                visible={modalVisible}
                onOk={e => this.handleSubmit(e)}
                onCancel={() => handleModalVisible()}
                >
                    <Card bordered={false}>
                    <Form style={{ marginTop: 8 }} {...formItemLayout} >
                        
                        <Form.Item label="选择数据存储路径">
                        {getFieldDecorator('DataPath', {
                            initialValue: currentRecord.dataPath || '',
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
                        <FormItem  label="患者姓名">
                        {getFieldDecorator('patientName', {
                            initialValue: currentRecord ? currentRecord.patientName : '',
                            rules: [
                            {
                                required: true,
                                message: '请输入患者姓名',
                            },
                            ],
                        })(<Input />)}
                        </FormItem>
                        <Form.Item label="患者性别">
                        {getFieldDecorator('patientSex', {
                            initialValue:currentRecord ? currentRecord.patientGender : '',
                        })(<Select >
                            <Option value={0}>男</Option>
                            <Option value={1}>女</Option>
                        </Select>)}
                        </Form.Item>
                        <Form.Item label="患者年龄">
                        {getFieldDecorator('patientAge', {
                            initialValue: currentRecord ? currentRecord.patientAge : '',
                        })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="是否服药">
                        {getFieldDecorator('medicine', {
                            initialValue: currentRecord? currentRecord.medicine: '',
                            rules: [{
                                required: true,
                                message:"请选择是否服用过药物"
                            }],
                        })(<Select >
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>)}
                        </Form.Item>
                        <Form.Item label="行为干涉">
                        {getFieldDecorator('medicine', {
                            initialValue: currentRecord? currentRecord.action: '',
                            rules: [{
                                required: true,
                                message:"请输入是否行为干涉"
                            }],
                        })(<Input placeholder="请输入行为干涉" />)}
                        </Form.Item>
                        <Form.Item label="测试任务类型" hasFeedback>
                        {getFieldDecorator('missionType', {
                            initialValue:currentRecord? currentRecord.missionType: '',
                            rules: [
                            {
                                required: true,
                                message: '请选择测试任务类型',
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
                            <Checkbox checked={currentRecord.illness}/>
                        )}
                        </Form.Item>
                        <Form.Item label="医生">
                        {getFieldDecorator('doctorName', {
                            initialValue: currentRecord? currentRecord.doctorName: '',
                            rules: [{
                                required: true,
                                message:"请输入标注医生姓名"
                            }],
                        })(<Input placeholder="请输入标注医生姓名" />)}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            提交标注
                            <Icon type="right" />
                        </Button>
                        </Form.Item>
                    </Form>
                    </Card>
                </Modal>
        );
    }
}
export default BasicForms;
