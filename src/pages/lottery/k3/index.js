import React, { Component } from "react"
import '../../../css/k3.scss';
import {LotteryCommon} from '../components/common';
import GameK3 from '../k3/k3';


class LtK3 extends Component {
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
        const game = new GameK3(this.props);
        let zhushu = 0;
        let content=[];
        cart.map((item,i)=>{
            if(item){
                item.sort()//排序
            }
        });
        let data="";
        if(['JSETDX'].indexOf(md.name)===-1){
            md.field_def.map((num,i)=>{
                if(cart[i]){
                    if(['JSETFX','JSHZ','JSSTTX','JSSTDX','KS-HZDXDS'].indexOf(md.name) !== -1){
                        data += cart[i].join("_")
                    }else if(['JSSTTX','JSSLTX','JSSBT','JSEBT'].indexOf(md.name) !== -1){
                        data += cart[i].join("")
                    }
                }
                content.push(data);
            });
        }else{
            if(cart[0]&&cart[1]){
                content.push(cart[0].join("_"));
                content.push(cart[1].join(""));
            }
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
    //参数cart
    setCart(i,num,arr,type){
        let cart = this.props.cart;
        cart = JSON.parse(JSON.stringify(cart));
            if([361,694,369].indexOf(this.props.md.method_id)!==-1){//单独判断2同号
                if(cart[i]&&cart.length>0){
                    if(cart[i].indexOf(num)===-1){
                        cart[i].push(num)
                        if(i===0){
                            if(cart[1]&&cart[1].indexOf(num.substr(1))!=-1){
                                cart[1].splice(cart[1].indexOf(num.substr(1)),1)
                            }
                        }else{
                            if(cart[0]&&cart[0].indexOf(num+""+num)!==-1){
                                cart[0].splice(cart[0].indexOf(num+""+num),1)
                            }
                        }
                    }else{
                        cart[i].splice(cart[i].indexOf(num),1)
                    }
                }else{
                    cart[i]=[num];
                    if(i===0){
                        if(cart[1]&&cart[1].indexOf(num.substr(1))!=-1){
                            cart[1].splice(cart[1].indexOf(num.substr(1)),1)
                        }
                    }else{
                        if(cart[0]&&cart[0].indexOf(num+""+num)!==-1){
                            cart[0].splice(cart[0].indexOf(num+""+num),1)
                        }
                    }
                }

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
        let item = this.calcItem(cart);
        let cartItem ={
            zhushu:item.zhushu,//注数
            content:item.content,//content
            cart:cart//购物车
        };
        this.props.setCartItem(cartItem);
    }

    render(){
        let cart = this.props.cart;//购物车
        let md = this.props.md;
        if(!md) {
            return null;
        }
        let methodId=this.props.md.name;
        let touzhu=[];
        if('KS-HZDXDS'==methodId||'JSHZ'==methodId){
            touzhu=<NumList
                gamePrize={this.props.gamePrize}
                md={this.props.md}//当前玩法数据
                handlechooseNum={(e,num)=>{this.setCart(e,num)}}
                cart={this.props.cart}//当前购物车
                prize={this.props.md.prize}//赔率
            />
        }else if('JSETDX'==methodId){
            let prize=(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3);
            md.field_def.map((item,i)=>{
                let numArr=item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className={i===1?"one_num1":""}></div>
                        <div className="nav">
                            <span>{md.field_def[i].prompt}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i===0?"two_num":"one_num"}>
                            <ul>
                                {numArr.map((num,j)=>{
                                    return <li key={j} className={cart[i]&&cart[i].indexOf(num) !==-1?"k3-0"+num:"k3-"+num} onClick={()=>{this.setCart(i,num)}}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        }else if('JSETFX'==methodId){
            let prize=(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3);
            md.field_def.map((item,i)=>{
                let numArr=item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <span>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i===0?"two_num":"one_num"}>
                            <ul>
                                {numArr.map((num,j)=>{
                                    return <li key={j} className={cart[i]&&cart[i].indexOf(num) !==-1?"k3-0"+num:"k3-"+num} onClick={()=>{this.setCart(i,num)}}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        }else if('JSEBT'==methodId){
            let prize=(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3);
            md.field_def.map((item,i)=>{
                let numArr=item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <span>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i===0?"one_num":"two_num"}>
                            <ul>
                                {numArr.map((num,j)=>{
                                    return <li key={j} className={cart[i]&&cart[i].indexOf(num) !==-1?"k3-0"+num:"k3-"+num} onClick={()=>{this.setCart(i,num)}}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        }else if('JSSTDX'==methodId){
            let prize=(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3);
            md.field_def.map((item,i)=>{
                let numArr=item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <span>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i===0?"three_num":"null"}>
                            <ul>
                                {numArr.map((num,j)=>{
                                    return <li key={j} className={cart[i]&&cart[i].indexOf(num) !==-1?"k3-0"+num:"k3-"+num} onClick={()=>{this.setCart(i,num)}}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        }else if('JSSTTX'==methodId){
            let prize=(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3);
            md.field_def.map((item,i)=>{
                let numArr=item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <span>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i===0?"three_all":"null"}>
                            <ul>
                                {numArr.map((num,j)=>{
                                    return <li key={j} className={cart[i]&&cart[i].indexOf(num) !==-1?"san":"san1"} onClick={()=>{this.setCart(i,num)}}>{md.cname}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        }else if('JSSBT'==methodId){
            let prize=(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3);
            md.field_def.map((item,i)=>{
                let numArr=item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <span>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i===0?"one_num":"null"}>
                            <ul>
                                {numArr.map((num,j)=>{
                                    return <li key={j} className={cart[i]&&cart[i].indexOf(num) !==-1?"k3-0"+num:"k3-"+num} onClick={()=>{this.setCart(i,num)}}></li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        }else if('JSSLTX'==methodId){
            let prize=(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3);
            md.field_def.map((item,i)=>{
                let numArr=item.nums.split(" ");
                touzhu.push(
                    <div key={i}>
                        <div className="nav">
                            <span>{md.cname}</span>
                            <span>赔率 :{prize}</span>
                            <hr/>
                        </div>
                        <div className={i===0?"three_all":"null"}>
                            <ul>
                                {numArr.map((num,j)=>{
                                    return <li key={j} className={cart[i]&&cart[i].indexOf(num) !==-1?"san":"san1"} onClick={()=>{this.setCart(i,num)}} >{md.cname}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })
        }
        return (
            <div className="lt-k3-wrapper">
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
    render(){
        let md = this.props.md;
        let simple=[];
        if(this.props.md.num_level.simple){
            simple=this.props.md.num_level.simple.split(" ");
        }
        if(!md) {
            return null;
        }
        let cart = this.props.cart;
        let renderNumList=[];
        md.field_def.map((item,i)=>{
            let codeArr = item.nums.split(" ");
            renderNumList.push(
                <div className="ch_chart" key={i}>
                    <div className="ch_num_w">
                        {item.prompt}
                    </div>
                    <div className="ch_num_box">
                        {item.has_filter_btn==1?<div className="ch_num_btns"></div>:null}
                        <ul className="ch_num_show">
                            {codeArr.map((num,j)=>{
                                return(<li key={j}>
                                    <button onClick={()=>{this.props.handlechooseNum(i,num)}} type="button" className={cart[i]&&cart[i].indexOf(num) !==-1?"ant-btn on ":"ant-btn off "}>
                                        {num}
                                    </button>
                                    <p>{this.props.md.num_level.simple?(parseFloat(this.props.md.prize[simple[j]])*this.props.gamePrize).toFixed(3):(parseFloat(this.props.md.prize[1])*this.props.gamePrize).toFixed(3)}</p>
                                </li>)
                            })
                            }
                        </ul>
                    </div>
                </div>
            )
        });
        return(
            <div >
                {renderNumList}
            </div>
        )
    }
}
export default LotteryCommon(LtK3);