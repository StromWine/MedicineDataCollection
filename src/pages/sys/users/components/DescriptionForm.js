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
class DescriptionForm extends PureComponent {
    state = {
        formData: {
          personInfo:{
            age:undefined,
            gender: undefined,
            weight: undefined,
            height: undefined,
            name:undefined,
            wcstType: undefined , 
            medicine: undefined,
            timeAfterMed : undefined,
            otherInter: undefined,
            testTime: undefined,
          },
          missionFormData:{
            ta: undefined,
            cr: undefined,
            pcr: undefined,
            te: undefined,
            pe: undefined,
            pr: undefined,
            ppr: undefined,
            pse: undefined,
            ppe: undefined,
            npe: undefined,
            pnpe: undefined,
            clr: undefined,
            pclr: undefined,
            cc: undefined,
            tcfc: undefined,
            fm: undefined,
            l2l: undefined,
            time: undefined,
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
                <Descriptions.Item label="患者标注">{wcstItem ? wcstItem.label : ''}</Descriptions.Item>
                <Descriptions.Item label="患者编号">{number}</Descriptions.Item>
                <Descriptions.Item label="患者性别">{personInfo.gender === 1 ? '男' : '女'}</Descriptions.Item>
                <Descriptions.Item label="患者年龄">{personInfo.age}</Descriptions.Item>
                <Descriptions.Item label="患者体重">{personInfo.weight}</Descriptions.Item>
                <Descriptions.Item label="患者身高">{personInfo.height}</Descriptions.Item>
                <Descriptions.Item label="测试前服用药物">{personInfo.medicine}</Descriptions.Item>
                <Descriptions.Item label="服药后多久进行测试">{personInfo.timeAfterMed}</Descriptions.Item>
                <Descriptions.Item label="非药物干预">{personInfo.otherInter}</Descriptions.Item>
                <Descriptions.Item label="测试近红外时间">{personInfo.testTime}</Descriptions.Item>
              
              </Descriptions>
              <Divider />
              <Descriptions title="任务测试得分">
                <Descriptions.Item label="总应答数">{missionFormData.ta}</Descriptions.Item>
                <Descriptions.Item label="正确应答数">{missionFormData.cr}</Descriptions.Item>
                <Descriptions.Item label="正确应答百分比">{missionFormData.pcr}</Descriptions.Item>
                <Descriptions.Item label="错误应答数">{missionFormData.te}</Descriptions.Item>
                <Descriptions.Item label="错误应答数百分比">{missionFormData.pe}</Descriptions.Item>
                <Descriptions.Item label="持续性应答数">{missionFormData.pr}</Descriptions.Item>
                <Descriptions.Item label="持续性应答数百分比">{missionFormData.ppr}</Descriptions.Item>
                <Descriptions.Item label="持续性错误数">{missionFormData.pse}</Descriptions.Item>
                <Descriptions.Item label="持续性错误的百分数">{missionFormData.ppe}</Descriptions.Item>
                <Descriptions.Item label="非持续性错误">{missionFormData.npe}</Descriptions.Item>
                <Descriptions.Item label="非持续性错误百分比">{missionFormData.pnpe}</Descriptions.Item>
                <Descriptions.Item label="概念化水平应答数">{missionFormData.clr}</Descriptions.Item>
                <Descriptions.Item label="概念化水平百分数">{missionFormData.pclr}</Descriptions.Item>
                <Descriptions.Item label="完成分类数">{missionFormData.cc}</Descriptions.Item>
                <Descriptions.Item label="完成第一个分类所需应答数">{missionFormData.tcfc}</Descriptions.Item>
                <Descriptions.Item label="不能维持完整分类">{missionFormData.fm}</Descriptions.Item>
                <Descriptions.Item label="学习到学会">{missionFormData.l2l}</Descriptions.Item>
                <Descriptions.Item label="用时">{missionFormData.time}</Descriptions.Item>
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