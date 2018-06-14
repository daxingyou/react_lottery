import React, { Component } from 'react';
import Navbar from '../common/navbar';
import "../../css/vindicate.scss"
import config from '../config';
export default class Vindicate extends Component {
    constructor(props){
        super(props);
        this.state={
            data:this.props.location.state
        }

        // //获取路由对象参数
        // var data =this.props.location.state;
        // //组件中只需要把路由的参数赋值即可
    }


    render(){
        return(
            <div  className="vindicate">
                <Navbar title={config.title} />
                <h1>系统维护中</h1>
                <p>为了您更好的游戏体验，我们将对网站系统升级维护，不便之处深表歉意!</p>
                <p>维护时间11月7日22:00至04:00</p>
                <p><b><a href="">在线客服</a></b></p>
                <i className="img"></i>
            </div>

        )
    }
}
//此段代码千万别删  用于后台真实数据
{/*<div  className="vindicate">*/}
{/*<Navbar title='幸运彩票'/>*/}
    {/*<h1>系统维护中</h1>*/}
    {/*<p>{this.state.data.info}</p>*/}
    {/*<p>{this.state.data.show_time}</p>*/}
    {/*<p><b><a href={this.state.data.ser_addr}>在线客服</a></b></p>*/}
    {/*<i className="img"></i>*/}
{/*</div>*/}

