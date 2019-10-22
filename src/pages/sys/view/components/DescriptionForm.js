import React, {PureComponent} from 'react';
import dva, { connect } from 'dva';
import {
  Form,
  Modal,
  Divider,
  Descriptions,
} from 'antd';

const ADHDItem = [
  {label: '注意缺陷型（ADHD-I）', value: 1},
  {label: '多动冲动型（ADHD-HI）', value: 2},
  {label: '混合型（ADHD-C）', value: 3},
  {label: '正常', value: 0}
];

const gender = [{label:0, value: '女'}, {label:1, value: '男'}];

//临床信息采集表单
@connect(({viewModel}) => ({
    viewModel,
    }))
@Form.create()
class DescriptionForm extends PureComponent {
    state = {
        formData: {
          personInfo:{
            age:undefined,
            gender: undefined,
            weight: undefined,
            height: undefined,
            name:undefined,
            adhdType: undefined , 
          },
          missionFormData:{
            reySiScore: undefined,
            reyDiScore: undefined,
            reySdScore: undefined,
            reyDdScore: undefined,
            aWordTime: undefined,
            aWordMis: undefined,
            bWordTime: undefined,
            bWordMis: undefined,
            stroopTimeA: undefined,
            stroopMisA: undefined,
            stroopTimeB: undefined,
            stroopMisB: undefined,
            stroopTimeC: undefined,
            stroopMisC: undefined,
            stroopTimeD: undefined,
            stroopMisD: undefined,
            snapParentScore: undefined,
            snapTeacherScore: undefined,
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
                type: 'viewModel/fetchAllInfoDataById',
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
                                ...res.missionTest,
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
        const adhdItem = ADHDItem.find(v => v.value === personInfo.adhdType);
        const {currentRecordId} = this.props;
        const number = currentRecordId + "_" + personInfo.name;
        
        return(
            <div>
              <Descriptions title="患者信息">
                <Descriptions.Item label="患者姓名">{personInfo.name}</Descriptions.Item>
                <Descriptions.Item label="患者标注">{adhdItem ? adhdItem.label : ''}</Descriptions.Item>
                <Descriptions.Item label="患者编号">{number}</Descriptions.Item>
                <Descriptions.Item label="患者性别">{personInfo.gender === 1 ? '男' : '女'}</Descriptions.Item>
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

        const title = "采集信息展示——" + currentRecordId + "_" + userName;

        return(
            <Modal
                visible={modalVisible}
                title={title}
                width='60%'
                onCancel={()=> handleModalVisible(false, "description")}
                destroyOnClose
            >
                {this.renderDescription()}
            </Modal>
        )
    }
}

export default DescriptionForm;