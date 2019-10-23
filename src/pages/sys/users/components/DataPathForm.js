import { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { 
    Button, 
    Form,  
    Input, 
    Modal,
} from 'antd';

@connect(({viewModel, loading}) => ({
    viewModel,
    loading: loading.models.viewModel,
}))
@Form.create()
class DataPathForm extends PureComponent{

    state = {
        pathData:{
            path1: "51_杨岸_path1",
        }
    }

    renderForm(){
        const { getFieldDecorator } = this.props.form;
        const { pathData } = this.state;

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

        return(
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="采集数据一存储名">
            {getFieldDecorator('path1', {
                initialValue: pathData.path1 ,
            })(<Input />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
                    更新数据关联信息
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
        title="采集数据存储关联"
        width="40%"
        onCancel={() => handleModalVisible(false, 'dataPath')}
        destroyOnClose
        >
        {this.renderForm()}
        </Modal>
        );
    }

}

export default DataPathForm;