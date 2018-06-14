import React, { Component, PropTypes } from 'react';
import {LotteryCommon} from '../components/common';
import Game_xyft from '../xyft/Game_xyft';
import Api from '../../api';
import './xyft.scss';
class Xyft extends Component {


  constructor(props) {
      super(props);
      this.state = {
      }
  }
  //计算注数，参数cart： 购物车数组
  calcItem(cart){
      //=============计算注数 start=============
      let md = this.props.md;
      if(!md) {
          return null;
      }


      const game = new Game_xyft(this.props);
      let zhushu = 0;
      let content=[];
      cart.map((item,i)=>{
          if(item){
              item.sort()//排序
          }
      });
      md.field_def.map((num,i)=>{
          let data="";
          if(cart[i]){
              data += cart[i].join("_")
          }
          content.push(data);
      });
      if(content.length === md.field_def.length) {
          zhushu = game.isLegalCode(content, md.name)['singleNum'];
      }
      return {
          content:content,
          zhushu:zhushu,
      };
      //=============计算注数end=============
  }

  //设置购物车
  setCart(i,num,arr,type){
      let cart = this.props.cart;
      let buttonType = this.props.buttonType;
      cart = JSON.parse(JSON.stringify(cart));

      if(num===""){//点击 全单双大小
          cart[i]=arr;
          buttonType = JSON.parse(JSON.stringify(buttonType));
          buttonType[i]=type;
      }else{//点击 单个球
          if([24,25].indexOf(this.props.md.method_id)!==-1){//单独判断点击球
              cart[i]=[num]
          }else{
              if(cart[i]&&cart.length>0&&this.props.md.method_id!=817&&this.props.md.method_id!=818&&this.props.md.method_id!=819&&this.props.md.method_id!=820&&this.props.md.method_id!=821){
                  if(cart[i].indexOf(num)===-1){
                      cart[i].push(num)
                  }else{
                      cart[i].splice(cart[i].indexOf(num),1)
                  }
              }else{
                  cart[i]=[num];
              }
          }

      }
      let item = this.calcItem(cart);
      let cartItem ={
          buttonType:buttonType,//记录按钮大小单双
          zhushu:item.zhushu,//注数
          content:item.content,//content
          cart:cart//购物车
      };
      this.props.setCartItem(cartItem);
  }


  render(){
    let md = this.props.md;
    if(!md) {
        return null;
    }
    let methodId=this.props.menu_foucsed[1];
    let touzhu=[];
    if(methodId===871||methodId===838){//玩法id===24 定单双
        touzhu=<UnderBall
            md={this.props.md}//当前玩法数据
            cart={this.props.cart}//当前购物车
            handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
            buttonType={this.props.buttonType}
            prize={this.props.md.prize}//赔率
            gamePrize={this.props.gamePrize}//拉杆赔率

        />
    } else if(methodId===823){//玩法id===24 定单双
          touzhu=<Under5Ball
              md={this.props.md}//当前玩法数据
              cart={this.props.cart}//当前购物车
              handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
              buttonType={this.props.buttonType}
              prize={this.props.md.prize}//赔率
              gamePrize={this.props.gamePrize}//拉杆赔率

          />
      }else if(methodId===836||methodId===839||methodId===837||methodId===821||methodId===820||methodId===819||methodId===817||methodId===818||methodId===872||methodId===870||methodId===813||methodId===814||methodId===816||methodId===822){
        touzhu=
              <NumList
                  cur_method={this.props.cur_method}//当前玩法数据
                    handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                  cart={this.props.cart}//当前购物车
                  prize={this.props.prize}//赔率
                    gamePrize={(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(2)}//赔率
                  // gamePrize={this.props.gamePrize}
                   buttonType={this.props.buttonType}
              />

    }else{  touzhu=
            <NumList
                cur_method={this.props.cur_method}//当前玩法数据
                  handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                cart={this.props.cart}//当前购物车
                prize={this.props.prize}//赔率
                  gamePrize={(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(1)}//赔率
                // gamePrize={this.props.gamePrize}
                 buttonType={this.props.buttonType}
            />

    }
      return (
         <div className="pk10-wrapper">
            {touzhu}
                </div>
      )
  }
}

class NumList extends Component{
  constructor(props) {
      super(props);
      this.state={

      }
  }
  renderTypeButton(index){
      let typeArr=["全","大","小","奇","偶","清"];
      let renderArr=[];
      let buttonType=this.props.buttonType;
      typeArr.map((item,i)=>{
          renderArr.push(<button key={i} onClick={()=>{this.handleFilter(index,i)}} className={buttonType&&buttonType[index]===i?"on":""}>{item}</button>)
      });
      return renderArr;
  }
  //点击筛选
  handleFilter(i,type){//选号
      let num;
      // "全","大","小","奇","偶","清"
      switch (type){
          case 0:
              num = ["01","02","03","04","05","06","07","08","09","10"];
              break;
          case 1:
              num = ["06","07","08","09","10"];
              break;
          case 2:
              num = ["01","02","03","04","05"];
              break;
          case 3:
              num = ["01","03","05","07","09"];
              break;
          case 4:
              num = ["02","04","06","08","10"];
              break;
          case 5:
              num = [];
              break;
      }
      this.props.handlechooseNum(i,"",num,type);
  }
  render(){

      let cur_method = this.props.cur_method;
      let cart = this.props.cart;
      let renderNumList=[];
      cur_method.map((item,i)=>{
          let codeArr = item.nums.split(" ");
          renderNumList.push(
              <div className="ch_chart" key={i}>
                  <div className="ch_num_w">
                      {item.prompt}
                      <span>赔率：{parseFloat(this.props.gamePrize).toFixed(3)}</span>
                  </div>
                  <div className="ch_num_box">
                      {item.has_filter_btn==1?<div className="ch_num_btns">
                        {this.renderTypeButton(i)}
                      </div>:null
                      }

                      <ul className="ch_num_show" style={{textAlign:"center"}} >
                          {codeArr.map((num,j)=>{
                              return(<li key={j}>
                                  <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                      {num}
                                  </button>
                              </li>)
                          })
                          }
                      </ul>
                  </div>
              </div>
          )
      });
      return(
          <div>
              {renderNumList}
          </div>
      )
  }

}
class UnderBall extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        let field_def = this.props.md.field_def;
        let cart = this.props.cart;
        let renderNumList=[];
        let simple=this.props.md.num_level.simple.split(" ");
        let specific=this.props.md.num_level.specific;

        field_def.map((item,i)=>{
            let codeArr = item.nums.split(" ");
            renderNumList.push(
                <div className="ch_chart pk10-UnderBall" key={i}>
                    <div className="ch_num_w">
                        {item.prompt}
                    </div>
                    <div className="ch_num_box">
                        <ul className="ch_num_show" style={{textAlign:"center"}} >
                            {codeArr.map((num,j)=>{
                                let level = specific[simple[j]-1].level;
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num.substr(0,2)}
                                        <br/>
                                        {num.substr(2)}
                                    </button>
                                    <label>{parseFloat((this.props.gamePrize*parseFloat(this.props.prize[level])).toFixed(4))}</label>
                                </li>)
                            })
                            }
                        </ul>
                    </div>
                </div>
            )
        });
        return(
            <div>
                {renderNumList}
            </div>
        )
    }
}
class Under5Ball extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        let field_def = this.props.md.field_def;
        let cart = this.props.cart;
        let renderNumList=[];
        let simple=this.props.md.num_level.simple.split(" ");
        let specific=this.props.md.num_level.specific;

        field_def.map((item,i)=>{
            let codeArr = item.nums.split(" ");
            renderNumList.push(
                <div className="ch_chart pk10-UnderBall" key={i} >
                    <div className="ch_num_w">
                        {item.prompt}
                    </div>
                    <div className="ch_num_box" >
                        <ul className="ch_num_show" style={{textAlign:"left"}} >
                            {codeArr.map((num,j)=>{
                                let level = specific[simple[j]-1].level;
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num.substr(0,2)}
                                        <br/>
                                        {num.substr(2)}
                                    </button>
                                    <label>{parseFloat((this.props.gamePrize*parseFloat(this.props.prize[level])).toFixed(4))}</label>
                                </li>)
                            })
                            }
                        </ul>
                    </div>
                </div>
            )
        });
        return(
            <div>
                {renderNumList}
            </div>
        )
    }
}
export default LotteryCommon(Xyft);
