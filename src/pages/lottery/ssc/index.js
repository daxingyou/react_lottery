import React, { Component } from "react"
import './ssc.scss';
import {LotteryCommon} from '../components/common';

import GameSSC from './game_ssc';

class LtSSC extends Component {
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
        const game = new GameSSC(this.props);
        let zhushu = 0;
        let content=[];
        cart.map((item,i)=>{
            if(item){
                item.sort()//排序
            }
        });
        if(md.name === 'WXDW' || md.name === 'SSC-LMDXDS') {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data =cart[i].join('')
                }
                content.push(data);
            });
        } else if(md.cname.indexOf("和值") !== -1) {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data += cart[i].join("_")
                }
                content.push(data);
            });
        } else {
            md.field_def.map((num,i)=>{
                let data="";
                if(cart[i]){
                    data += cart[i].join("")
                }
                content.push(data);
            });
        }


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
        let methodId=this.props.menu_foucsed[1];//玩法id
        let touzhu=[];
        if(methodId===24){//玩法id===24 定单双
            touzhu=<Lt11x5DingDanshuang
                md={this.props.md}//当前玩法数据
                cart={this.props.cart}//当前购物车
                handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                buttonType={this.props.buttonType}
                prize={this.props.md.prize}//赔率
                gamePrize={this.props.gamePrize}//拉杆赔率

            />
        }else{
            touzhu=<LtSSCNumList
                md={this.props.md}//当前玩法数据
                handlechooseNum={(i,num,arr,type)=>{this.setCart(i,num,arr,type)}}
                cart={this.props.cart}//当前购物车
                buttonType={this.props.buttonType}
                prize={this.props.md.prize}//赔率
                gamePrize={this.props.gamePrize}//拉杆赔率
            />
        }





        return (
            <div className="ltssc-wrapper">
                {touzhu}
            </div>
        )
    }
}
//选数字
class LtSSCNumList extends Component{
    constructor(props) {
        super(props);
    }


    // 全大小奇偶清，渲染按钮
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
                num = ["0","1","2","3","4","5","6","7","8","9"];
                break;
            case 1:
                num = ["5","6","7","8","9"];
                break;
            case 2:
                num = ["0","1","2","3","4"];
                break;
            case 3:
                num = ["1","3","5","7","9"];
                break;
            case 4:
                num = ["0","2","4","6","8"];
                break;
            case 5:
                num = [];
                break;
        }
        this.props.handlechooseNum(i,"",num,type);
    }

    render(){
        let field_def = this.props.md.field_def;
        let cart = this.props.cart;
        let renderNumList=[];
        let levels=this.props.md.levels>1;
        let simple;
        let specific;
        if(levels){
            simple=this.props.md.num_level.simple.split(" ");
            specific=this.props.md.num_level.specific;
        }
        let centerClassName="";
        if (["SSC-LMDXDS"].indexOf(this.props.md.name) === -1) {
            centerClassName = ""
        } else {
            centerClassName = "textcenter"
        }
        field_def.map((item,i)=>{
            let codeArr = item.nums.split(" ");
            renderNumList.push(
                <div className="ch_chart" key={i}>
                    <div className="ch_num_w">
                        {item.prompt}
                        {levels?"":<span>赔率：{(parseFloat(this.props.prize[1])*this.props.gamePrize).toFixed(3)}</span>}
                    </div>
                    <div className="ch_num_box">
                        {item.has_filter_btn==1?<div className="ch_num_btns">
                            {this.renderTypeButton(i)} {/*//渲染按钮*/}
                        </div>:null
                        }
                        <ul className={"ch_num_show "+centerClassName}>
                            {codeArr.map((num,j)=>{
                                let level ;
                                if(levels){
                                    level  = specific[simple[j]-1].level;
                                }
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num}
                                    </button>
                                    {levels?<label>{(this.props.gamePrize*parseFloat(this.props.prize[level])).toFixed(3)}</label>:""}

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
//定单双
class Lt11x5DingDanshuang extends Component{
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
                <div className="ch_chart lt11x5-dingdanshuang" key={i}>
                    <div className="ch_num_w">
                        {item.prompt}
                    </div>
                    <div className="ch_num_box">
                        <ul className="ch_num_show">
                            {codeArr.map((num,j)=>{
                                let level = specific[simple[j]-1].level;
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ant-btn-primary":"ant-btn off ant-btn-primary"}>
                                        {num.substr(0,2)}
                                        <br/>
                                        {num.substr(2)}
                                    </button>
                                    <label>{(this.props.gamePrize*parseFloat(this.props.prize[level])).toFixed(3)}</label>
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


export default LotteryCommon(LtSSC);