import React, { Component } from 'react'
import {Link,hashHistory} from 'react-router';
import { Form, message,Select, Input, Button,Modal,} from 'antd';
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import MaskLoading from '../common/maskLoading';// 防止重复点击
import Api from '../api';
const FormItem = Form.Item;
const Option = Select.Option;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      result:"",
      captchaId:"",
      code:"",
      checkCode:"",
      className:["","",""],
        userName:""
    };
    // this.myFunction=this.myFunction.bind(this);
    // this.my=this.my.bind(this);
  }
  getCode(e){
    Api("c=default&a=verifyCode&type=2",null,(res)=>{

      let  data = res.data;


      //后台异常信息
      let error = res.errstr;

     //服务状态(0/成功)
      let status = res.errno;
      if(status>0){
            message.warning("网络异常，请刷新页面");
      }else{
          if(data.codeArr.length!==0){
              this.setState({result:data.codeArr,captchaId:data.captcha_id,code:data.code},()=>{
                  this.drawPic();
              });
          }else{
              // message.config({
              //         top: 20,
              //         duration: 1,
              //     });
              //     message.warning("获取验证码失败，请点击验证码处获取验证码");
              let result=["点","击","刷","新"];
              this.setState({result:result,captchaId:data.captcha_id,code:data.code},()=>{
                  this.drawPic();
              });
              }
      }
    })
  }
  backPassWord(){
    Modal.error({
      content: '找回密码，请联系客服',
    });
    setTimeout(function() {
        hashHistory.push("https://daw.duokebo.com/mchat/mchat.aspx?siteid=978059");
    }, 2000);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let getcode =  this.getCode();
    this.props.form.validateFields((err, values) => {
      const Username=/^[a-z]\w{5,11}$/;
			const PSW=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
      let VerifyCode="";
      for(let i=0;i<this.state.result.length;i++){
          VerifyCode+=this.state.result[i]
      }

      if (!err) {
        // 验证用户名
        //   if (Username.test(values.username) && values.username) {
        //   } else {
        //       message.config({
        //           top: 20,
        //           duration: 1,
        //       });
        //       message.warning('用户名长度为6-12个字母或数字，必须以字母开头');
        //       return;
        //
        //   }
           //验证密码
       //    if (PSW.test(values.password) && values.password) {
       //    } else {
       //        message.config({
       //            top: 20,
       //            duration: 1,
       //        });
       //        message.warning('密码长度为6-15位字母数字混合，不能为纯数字或纯字母');
       //
       // return;
       //
       //     }
             //验证码不能为空
             if(values.verifyCode ==""){
                 message.config({
                     top: 20,
                     duration: 1,
                 });
                 message.warning('验证码不能为空');
                 return;
             }else if(values.verifyCode!==VerifyCode){
               message.config({
                 top: 20,
                 duration: 1,
               });
               message.warning('验证码输入错误');
         return;

             }
                MaskLoading(5);
             let userName=values.username.replace(/\s/ig,'');
                 Api("c=user&a=login",{username:userName,password:values.password,str:1,is_wap:1,captcha_id:this.state.captchaId,verifyCode:values.verifyCode},function(e){
   								 MaskLoading(false);
                   if(e.errno>0){
                          getcode;
                   }
                   else{
                     //存入
                     sessionStorage.user = JSON.stringify(e.data);
                       hashHistory.push("home");
                     }
                })




     }
    });
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

 myFunction(index) {
      let className=JSON.parse(JSON.stringify(this.state.className));
     className[index]=!this.state.className[index];
            this.setState({className:className});
    }
    lose(index){
     let className=JSON.parse(JSON.stringify(this.state.className));
     className[index]=!this.state.className[index];
     this.setState({className:className});
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
    let VerifyCode=this.state.result;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} className="login-form login">
      <div className="login_top">
           <ul>
               <li className="bottom_border">
                   <FormItem>
                     <i className="icon_username fl"></i>
                     {getFieldDecorator('username', {
                       rules: [{
                        }],
                         getValueFromEvent:(e)=>{ return e.target.value.replace(/[" "]/g,"")}
                     })(
                       <Input className="input fl" name="username" style={{marginLeft:"0.1rem"}} placeholder="用户名"  ref={(input)=>this.input=input} onFocus={()=>this.myFunction(0)}  onBlur={()=>this.lose(0)}/>
                     )}
                     <div className={this.state.className[0]===""?"":this.state.className[0]?"div1":"div2"}></div>
                   </FormItem>
               </li>
               <li className="bottom_border">
                   <FormItem>
                   <i className="icon_password fl"></i>
                     {getFieldDecorator('password', {
                       rules: [{
                        }],
                     })(
                       <Input  className="input fl" style={{marginLeft:"0.1rem"}} type="password" placeholder="密码"  ref={(input)=>this.input=input} onFocus={()=>this.myFunction(1)}  onBlur={()=>this.lose(1)} />
                     )}
                       <div className={this.state.className[1]===""?"":this.state.className[1]?"div1":"div2"}></div>
                   </FormItem>
               </li>
               <li className="bottom_border">
                   <FormItem>
                   <span className="fl span" style={{paddingLeft:"0.5rem"}}>验证码</span>
                     {getFieldDecorator('verifyCode', {
                       rules: [{
                        }],
                         getValueFromEvent:(e)=>{ return e.target.value.replace(/[" "]/g,"")}
                     })(
                       <Input  className="input fl verifyCode"  type="tel" placeholder="点击获取"  ref={(input)=>this.input=input} onFocus={()=>this.myFunction(2)}  onBlur={()=>this.lose(2)}/>
                     )}
                     {/* <img  className="yzm" src={this.state.result} onClick={this.getCode.bind(this)}  alt="验证码"/> */}
                     <canvas className="yzm" id="canvas" width="140" onClick={this.getCode.bind(this)} height="40"></canvas>
                       <div className={this.state.className[2]===""?"":this.state.className[2]?"div1":"div2"}></div>
                   </FormItem>
               </li>
         </ul>
      </div>
        <div className="login_button">
            <FormItem>
              <p><Button type="primary" htmlType="submit" className="login-form-button">登录</Button></p>
              <p><Link to="register" ><Button onClick={this.showModal} type="primary"  className="login-form-button login_gary">注册</Button></Link></p>
              <a className="login-form-forgot login_tp "  onClick={this.backPassWord}>找回密码</a>
            </FormItem>
        </div>
      </Form>
    );
  }
}
const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default class Login extends Component {
    render() {
        return (
            <div>
                <Navbar title="登录" back="/user"/>
                <WrappedNormalLoginForm />
                <Footer />
            </div>
        )
    }
}
