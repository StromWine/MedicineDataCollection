import React, {PureComponent} from 'react';
import dva, { connect } from 'dva';
import {
  Form,
  Modal,
  Divider,
  Descriptions,
} from 'antd';

const WCSTItem = [
  {label: '短期性失眠', value: 1},
  {label: '慢性失眠', value: 2},
  {label: '混合型', value: 3},
  {label: '正常', value: 0}
];

const gender = [{label:0, value: '女'}, {label:1, value: '男'}];

//临床信息采集表单
@connect(({viewModel}) => ({
    viewModel,
    }))
@Form.create()
class PatientsDescriptionForm extends PureComponent {
    state = {
        formData: {
          personInfo:{
            age:undefined,
            gender: undefined,
            weight: undefined,
            height: undefined,
            name:undefined,
            wcstType: undefined , 
          },
          clinicalInfo:{
            symptomTime:undefined,
            presentIllnessHistory:undefined,
            chiefComplaint:undefined,
            treatmentHistory:undefined,
            pastHistory:undefined,
            personalHistory: undefined,
            familyHistory: undefined,
          },
        },
      }

    componentDidMount(){
        const { dispatch, edit, currentRecordId } = this.props;
        const { formData } = this.state;
        if(edit){
            dispatch({
                type: 'wcstModel/fetchInfoWithWcstById',
                payload: currentRecordId,
                callback: res => {
                  console.log("***************", res);
                    this.setState({
                        formData:{
                            ...formData,
                            personInfo:{
                                ...res.personalInfo,
                            },
                            missionFormData:{
                                ...res.wcstTaskInfo,
                            },
                            clinicalInfo:{
                                ...res.clinicalInfo,
                            },
                        },
                    });
                }
            });
        }
    }

    renderDescription(){
        const { formData } = this.state;
        const personInfo = formData.personInfo;
        const missionFormData = formData.missionFormData;
        const clinicalInfo = formData.clinicalInfo;
        const wcstItem = WCSTItem.find(v => v.value === personInfo.wcstType);
        const {currentRecordId} = this.props;
        const number = currentRecordId + "_" + personInfo.name;
        
        return(
            <div>
              <Descriptions title="患者信息">
                <Descriptions.Item label="患者姓名">{personInfo.name}</Descriptions.Item>
                <Descriptions.Item label="患病类型">{wcstItem ? wcstItem.label : ''}</Descriptions.Item>
                <Descriptions.Item label="患者编号">{number}</Descriptions.Item>
                <Descriptions.Item label="患者性别">{personInfo.gender === 1 ? '男' : '女'}</Descriptions.Item>
                <Descriptions.Item label="患者年龄">{personInfo.age}</Descriptions.Item>
                <Descriptions.Item label="患者体重">{personInfo.weight}</Descriptions.Item>
                <Descriptions.Item label="患者身高">{personInfo.height}</Descriptions.Item>              
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
            </div>
          );
    }


    render(){
        const { 
            currentRecordId, 
            userName, 
            modalVisible, 
            handleModalVisible, 
        } = this.props;

        const title = "患者信息展示——" + currentRecordId + "_" + userName;

        return(
            <Modal
                visible={modalVisible}
                title={title}
                width='60%'
                onCancel={()=> handleModalVisible(false, "patientsDescription")}
                destroyOnClose
            >
                {this.renderDescription()}
            </Modal>
        )
    }
}
export default PatientsDescriptionForm;