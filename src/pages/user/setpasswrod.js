import React, {Component} from 'react';
import Navbar from '../common/navbar';
import Api from '../api';
import {hashHistory} from 'react-router';
import {Form, Input, Icon,message} from 'antd';

const FormItem = Form.Item;
//提现密码

class SetpasswordForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      confirmDirty: false,
      isset_secpwd:JSON.parse(sessionStorage.getItem("user")).isset_secpwd,
    };
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let user=JSON.parse(sessionStorage.getItem("user"));
        Api("c=user&a=editSecPwd&sid="+user.sid+"&user_id="+user.user_id,{
          secpassword:values.password,
          user_id:user.user_id,
          old_secpwd:values.oldpassword,
          is_wap:1
        },function(res){
          if(res.errno !==0){
            setTimeout(()=>{
              // hashHistory.goBack();
            })
          }else{
            message.success('设置成功',2);
            let user=JSON.parse(window.sessionStorage.user);
            user.isset_secpwd=1;
            sessionStorage.user=JSON.stringify(user);
            hashHistory.goBack();
          }
        });

      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  };
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('2次密码不一致');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  };
  passwordvalid = (rule, value, callback) => {
    if(!/^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/.test(value)) {
      callback("密码不能为纯数字或纯字母");
    }else if(!/^[a-zA-Z0-9]{6,16}$/.test(value)){
      callback("密码为6-16位字母数字混合");
    }
    callback();
  };
  render() {
    const {getFieldDecorator} = this.props.form;
    // console.log(this.state.isset_secpwd)
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.state.isset_secpwd===1?<div className="input-wrap">
            <FormItem
              label="旧资金密码"
              hasFeedback
            >
              {getFieldDecorator('oldpassword', {
                rules: [{
                  required: true, message: '请输入旧密码!',
                }, {
                  validator: this.checkConfirm,
                },{
                  validator:''
                }
                ],
              })(
                <Input type="password"/>
              )}
            </FormItem>
        </div>:null}
          <div className="input-wrap">
              <FormItem
                label={this.state.isset_secpwd===1?"新资金密码":'提现密码'}
                hasFeedback
              >
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: '请输入密码!',
                  }, {
                    validator: this.checkConfirm,
                  },{
                    validator:this.passwordvalid
                  }
                  ],
                })(
                  <Input type="password"/>
                )}
              </FormItem>
          </div>
          <div className="input-wrap">
              <FormItem

                label="&nbsp;&nbsp;确认密码"
                hasFeedback
              >
                {getFieldDecorator('confirm', {
                  rules: [{
                    required: true, message: '请输入确认密码',
                  }, {
                    validator: this.checkPassword,
                  }],
                })(
                  <Input type="password" onBlur={this.handleConfirmBlur}/>
                )}
              </FormItem>
          </div>
          <FormItem>
              <div className="warning-wrap">
                  <Icon type="exclamation-circle" className="warning"/>
                  <span>为了您的账户安全，如需更改银行卡信息，请联系我们的客服</span>
              </div>
              <button className="submit-btn" type="submit">确认</button>
          </FormItem>
      </Form>
    );
  }
}


export default class Setpassword extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  render() {
    const WrappedSetpasswordForm = Form.create()(SetpasswordForm);
    return (
      <div>
          <Navbar back='back' title="设置资金密码"/>
          <div className="setpassword-warp">
              <WrappedSetpasswordForm/>
          </div>
      </div>
    );
  }
}
