


import React, { Component } from "react"
import './ssq.scss';
import Game_ssq from '../ssq/game_ssq.js';
import {LotteryCommon} from '../components/common';

class LtSSQ extends Component {
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
        const game = new Game_ssq(this.props);
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
                if(cart[i]&&cart.length>0){
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
        return (
            <div>
                <NumList
                    cur_method={this.props.cur_method}//当前玩法数据
                    cart={this.props.cart}//当前购物车
                    handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                    prize={(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(1)}//赔率
                    buttonType={this.props.buttonType}
                />
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
                        <span>赔率：{this.props.prize}</span>
                    </div>
                    <div className="ch_num_box">
                        <ul className="ch_num_show">
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
export default LotteryCommon(LtSSQ)