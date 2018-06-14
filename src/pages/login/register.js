import React, { Component } from 'react';
import {hashHistory} from 'react-router';
import { Form, Input, Select, Button, AutoComplete,message,Modal } from 'antd';
import Navbar from '../common/navbar';
import MaskLoading from '../common/maskLoading';// 防止重复点击
import Api from '../api';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    checkCode:false,
    checkOtherCode:true,
    result:"",
    captchaId:"",
    code:"",
      className:["","","","","","","",""],
        rname:false,
        mobile:false,
        qq:false,
      arr:"",//邀请码
  };
  haveCode(e){
    this.setState({
      checkCode:!this.state.checkCode,
      checkOtherCode:!this.state.checkOtherCode,
    })
  }

    myFunction(index) {
        let className=JSON.parse(JSON.stringify(this.state.className));
        className[index]=!this.state.className[index];
        this.setState({className:className});
    }
    getConf(){
      let sets = this;
        let host = window.location.href;
        if(host.indexOf("var")!==-1){
            var arrUrl = host.split("var=");
            let n=arrUrl[1].indexOf("#");
            let arr=arrUrl[1].slice(0,n);
            this.haveCode();
            this.setState({
                arr:arr
            })

        }
      Api("c=user&a=regconf",null,function(e){
       if(e.errno==0){
           sets.setState({
             rname:e.data.real_name==0?false:true,
             mobile:e.data.reg_need_mobile==0?false:true,
             qq:e.data.reg_need_qq==0?false:true
           });
       }else{
         //实现不累加显示，重复点击只显示一个
         message.config({
           top: 20,
           duration: 1,
         });
         message.warning('注册配置接口调用失败，请重试');
         return;
       }
     })

    }
    lose(index){
        let className=JSON.parse(JSON.stringify(this.state.className));
        className[index]=!this.state.className[index];
        this.setState({className:className});
    }
  handleSubmit = (e) => {
    e.preventDefault();
        let getcode =  this.getCode();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const Chinese = /^[\u0391-\uFFE5]+$/;
			const phone=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			const Username=/^[a-z]\w{5,11}$/;
			const PSW=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
			const QQ=/^\d+$/;
      if (!err) {


				//手机
        if(this.state.mobile ){
				      if(phone.test(values.mobile)){
					//用户名
              }else{
                //实现不累加显示，重复点击只显示一个
                message.config({
                  top: 20,
                  duration: 1,
                });
                  message.warning('手机号码有误');
              return;
              }
        }else{
          values.mobile="";
        }
					if(Username.test(values.username)&&values.username){
          }else{
                //实现不累加显示，重复点击只显示一个
                message.config({
                  top: 20,
                  duration: 1,
                });
                message.warning('用户名长度为6-12个字母或数字，必须以字母开头');
          return;
          }
							//真实姓名
              if(this.state.rname){
							if(Chinese.test(values.realname)){
                }else{
                      //实现不累加显示，重复点击只显示一个
                      message.config({
                        top: 20,
                        duration: 1,
                      });
                      message.warning('真实姓名必须为中文');
                return;
                  }
                }else{
                  values.realname="";
                }
									//密码
									if(PSW.test(values.password)&&values.password){}
                  else{
                        //实现不累加显示，重复点击只显示一个
                        message.config({
                          top: 20,
                          duration: 1,
                        });
                      message.warning('密码长度为6-15位字母数字混合，不能为纯数字或纯字母');
								return;
      									}
                        if(this.state.qq){
										  if(QQ.test(values.qq)){
                      }else{
                            //实现不累加显示，重复点击只显示一个
                            message.config({
                              top: 20,
                              duration: 1,
                            });
                            message.warning('QQ格式有误');
                      }
                      }else{
                        values.qq="";
                      }
                      if(typeof(values.verifyCode) != "undefined"){
                      }else{
                            //实现不累加显示，重复点击只显示一个
                            message.config({
                              top: 20,
                              duration: 1,
                            });
                            message.warning('验证码不能为空');
                            return;

                      }

                        if(values.password==values.repassword){
                        }else{
                          //实现不累加显示，重复点击只显示一个
                          message.config({
                            top: 20,
                            duration: 1,
                          });
                          message.warning('两次输入密码不相同 ');
                          return;

                        }
                        if(typeof(values.haveCode) == "undefined"){
                          values.haveCode="";
                        }
          								 MaskLoading(5);
												 Api("c=user&a=register",{register_from:"wap",mobile:values.mobile,username:values.username,var:values.haveCode,realname:values.realname,password:values.password,qq:values.qq,is_wap:1,captcha_id:this.state.captchaId,verifyCode:values.verifyCode},function(e){
           								 MaskLoading(false);
                        if(e.errno>0){
                              getcode ;
                          return;
                        }
                        Modal.success({
                          title: '注册成功',
                          content: ( <div>
                                      <p>用户名：{values.username}</p>
                                      <p>密码：{values.password}</p>
                                    </div>),
                                     onOk() {
                                       sessionStorage.user = JSON.stringify(e.data);
                                      hashHistory.push("home");
                                     },
                        });

												})

      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  getCode(e){
    Api("c=default&a=verifyCode&type=2",null,(res)=>{

      let  data = res.data;


      //后台异常信息
      let error = res.errstr;

     //服务状态(0/成功)
      let status = res.errno;
      if(status>0){

      }else{
    this.setState({result:data.codeArr,captchaId:data.captcha_id,code:data.code})
      }
      this.drawPic();
    })

  }
  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }
    componentWillMount(){
        this.getConf();
    }
  componentDidMount(){
    this.drawPic();
    this.getCode();

  }

   randomNum(min,max){
   return Math.floor( Math.random()*(max-min)+min);
 }
 /**生成一个随机色**/
  randomColor(min,max){
   var r = this.randomNum(min,max);
   var g = this.randomNum(min,max);
   var b = this.randomNum(min,max);
   return "rgb("+r+","+g+","+b+")";
 }


 /**绘制验证码图片**/
  drawPic(){
   var canvas=document.getElementById("canvas");
   var width=canvas.width;
   var height=canvas.height;
   var ctx = canvas.getContext('2d');
   ctx.textBaseline = 'bottom';

   /**绘制背景色**/
   ctx.fillStyle ="#cccccc"; //颜色若太深可能导致看不清
   ctx.fillRect(0,0,width,height);
   /**绘制文字**/
   var str = this.state.result;
     if(str!=""){
   for(var i=0; i<4; i++){
     var txt = str[i];
     ctx.fillStyle = "#000000";  //随机生成字体颜色

     ctx.font = this.randomNum(30,40)+'px SimHei'; //随机生成字体大小
     var x = 10+i*25;
     var y = this.randomNum(40,40);
     var deg = this.randomNum(-10, 10);
     //修改坐标原点和旋转角度
     ctx.translate(x,y);
     ctx.rotate(deg*Math.PI/180);
     ctx.fillText(txt, 0,0);
     //恢复坐标原点和旋转角度
     ctx.rotate(-deg*Math.PI/180);
     ctx.translate(-x,-y);
   }
 }
   /**绘制干扰线**/
   for(var i=0; i<4; i++){
     ctx.strokeStyle = this.randomColor(40,180);
     ctx.beginPath();
     ctx.moveTo( this.randomNum(0,width), this.randomNum(0,height) );
     ctx.lineTo( this.randomNum(0,width), this.randomNum(0,height) );
     ctx.stroke();
   }
   /**绘制干扰点**/
   for(var i=0; i<100; i++){
     ctx.fillStyle = this.randomColor(0,255);
     ctx.beginPath();
     ctx.arc(this.randomNum(0,width),this.randomNum(0,height), 1, 0, 2*Math.PI);
     ctx.fill();
   }
 }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };


    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));
    let checkCode=this.state.checkCode?"block":"none";
    let checkOtherCode=this.state.checkOtherCode?"block":"none";
      let rname= [],mobile= [],qq = [],mobile1=[] ;
      if(this.state.rname){
        rname.push(<li className="bottom_border" key={1}>
              <FormItem {...formItemLayout} label="">
                  <i className="icon_realname fl"></i>
                    {getFieldDecorator('realname', {
                      rules: [{

                      }],
                        getValueFromEvent:(e)=>{ return e.target.value.replace(/^[" "]$/g,"")}
                    })(
                      <Input style={{paddingLeft:"0.5rem"}} size="large" className="input " placeholder="请输入真实姓名（必须是中文）" ref={(input)=>this.input=input} onFocus={()=>this.myFunction(2)}  onBlur={()=>this.lose(2)}/>
                    )}
                    <div className={this.state.className[2]===""?"":this.state.className[2]?"div1":"div2"}></div>
              </FormItem>
        </li>);
      };
        if(this.state.mobile){
          mobile1.push(
            <li className="bottom_border" key={2}>

               <FormItem {...formItemLayout} label="">
              <i className="icon_global"></i><span style={{paddingLeft:"0.5rem"}}>中国86</span>

               </FormItem>
            </li>
          )
          mobile.push(
            <li className="bottom_border" key={3}>
                <FormItem {...formItemLayout} label=""><i className="icon_phone fl"></i>
                  {getFieldDecorator('mobile', {
                    rules: [{
                    }],
                      getValueFromEvent:(e)=>{ return e.target.value.replace(/[" "]/g,"")}
                  })(
                    <Input style={{paddingLeft:"0.5rem"}} className="input " maxLength="11"  placeholder="请输入手机号码" ref={(input)=>this.input=input} onFocus={()=>this.myFunction(0)}  onBlur={()=>this.lose(0)}/>
                  )}
                  <div className={this.state.className[0]===""?"":this.state.className[0]?"div3":"div4"}></div>
                </FormItem>
          </li>);
        }
          if(this.state.qq){
            qq.push(<li className="bottom_border" key={4}>
                  <FormItem {...formItemLayout} label="" hasFeedback  >
                  <i className="icon_qq fl"></i>
                    {getFieldDecorator('qq', {
                      rules: [{
                      }, {
                        validator: this.checkConfirm,
                      }],
                        getValueFromEvent:(e)=>{ return e.target.value.replace(/[" "]/g,"")}
                    })(
                      <Input style={{paddingLeft:"0.5rem"}} placeholder="输入你的QQ号，此项必填" className="input "  ref={(input)=>this.input=input} onFocus={()=>this.myFunction(5)}  onBlur={()=>this.lose(5)}/>
                    )}
                                            <div className={this.state.className[5]===""?"":this.state.className[5]?"div3":"div4"}></div>
                  </FormItem>
            </li>);
          }
    return (
      <Form className="register" onSubmit={this.handleSubmit}>

			<div className="register_top">
					    <ul>


                  {mobile}
									<li className="bottom_border">
												<FormItem {...formItemLayout} label="">
														<i className="icon_username fl"></i>
															{getFieldDecorator('username', {
																rules: [{

																}],
                                                                getValueFromEvent:(e)=>{ return e.target.value.replace(/[" "]/g,"")}
															})(
																<Input style={{paddingLeft:"0.5rem",width:"6.5rem"}} size="large" className="input " placeholder="请输入会员账号（6-15个英文字符）" ref={(input)=>this.input=input} onFocus={()=>this.myFunction(1)}  onBlur={()=>this.lose(1)}/>
															)}
															<div className={this.state.className[1]===""?"":this.state.className[1]?"div3":"div4"}></div>
												</FormItem>
									</li>
									{rname}
									<li className="bottom_border">
							        <FormItem {...formItemLayout} label="" hasFeedback  >
											<i className="icon_password fl"></i>
							          {getFieldDecorator('password', {
							            rules: [{
							            }, {
							              validator: this.checkConfirm,
							            }],

							          })(
							            <Input style={{paddingLeft:"0.5rem"}} type="password" className="input "  placeholder="设定密码，6-15位字母或数字" ref={(input)=>this.input=input} onFocus={()=>this.myFunction(3)}  onBlur={()=>this.lose(3)}/>
							          )}
							          <div className={this.state.className[3]===""?"":this.state.className[3]?"div3":"div4"}></div>
							        </FormItem>
								</li>
                <li className="bottom_border">
                    <FormItem {...formItemLayout} label="" hasFeedback  >
                    <i className="icon_password fl"></i>
                      {getFieldDecorator('repassword', {
                        rules: [{
                        }, {
                          validator: this.checkConfirm,
                        }],

                      })(
                        <Input style={{paddingLeft:"0.5rem"}} type="password" className="input "  placeholder="确认密码，6-15位字母或数字" ref={(input)=>this.input=input} onFocus={()=>this.myFunction(4)}  onBlur={()=>this.lose(4)}/>
                      )}
                      <div className={this.state.className[4]===""?"":this.state.className[4]?"div3":"div4"}></div>
                    </FormItem>
              </li>
								{     qq}
                <li className="bottom_border">
											<FormItem {...formItemLayout} label="" hasFeedback  >
                        <i  style={{width:"1.3rem",lineHeight: "0.6rem",paddingLeft:"0.15rem",fontStyle:"normal",fontSize:"0.35rem"}}>验证码</i>
												{getFieldDecorator('verifyCode', {
													rules: [{
													}, {
														validator: this.checkConfirm,
													}],
                                                    getValueFromEvent:(e)=>{ return e.target.value.replace(/[" "]/g,"")}
												})(
													<Input  placeholder="输入验证码" style={{width:"4.5rem"}} className="input " type="tel" ref={(input)=>this.input=input} onFocus={()=>this.myFunction(6)}  onBlur={()=>this.lose(6)}/>
												)}
                        {/* <img  className="rgyzm" src={this.state.result} onClick={this.getCode.bind(this)}   alt="验证码"/> */}
                         <canvas className="rgyzm" id="canvas" width="140" onClick={this.getCode.bind(this)} height="40"></canvas>
                                                <div className={this.state.className[6]===""?"":this.state.className[6]?"div3":"div4"}></div>
											</FormItem>
								</li>
				    </ul>
            <ul>
                <li className="haveCode_li" style={{display:checkCode}}>
                      <FormItem {...formItemLayout} label="" hasFeedback  >
                        {getFieldDecorator('haveCode', {
                            initialValue:this.state.arr,
                          rules: [{
                          }, {
                            validator: this.checkConfirm,
                          }],
                            getValueFromEvent:(e)=>{ return e.target.value.replace(/[" "]/g,"")}
                        })(
                          <Input   style={{paddingLeft:"1.8rem"}} placeholder="输入你的邀请码" className="input " ref={(input)=>this.input=input} onFocus={()=>this.myFunction(7)}  onBlur={()=>this.lose(7)} />
                        )}
                        <div className={this.state.className[7]===""?"":this.state.className[7]?"div3":"div4"}></div>
                      </FormItem>
                </li>
            </ul>
				</div>
        <div className="register_button">
						  	<p className="red" onClick={(e)=>{this.haveCode(e)}} style={{display:checkOtherCode,paddingTop:"0.3rem",zIndex:"99"}} >我有注册邀请码</p>

        <p  className="register_p"><Button type="primary" onClick={this.showModal} htmlType="submit">注册并登录</Button></p>
        	</div>
        </Form>

    );
  }
}
const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default class Register extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
         <Navbar  title="注册" back="/login"/>
         <div className="register">
            <WrappedRegistrationForm />
         </div>
		</div>
		);
	}
}
