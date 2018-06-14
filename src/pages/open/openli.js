import React, { Component} from 'react'
import {Link } from 'react-router';
import LotteryNum from './lotteryNum';

import CountdownTimer  from './countdown';
export default class OpenLi extends Component {
    constructor(props) {
        super(props);

    }
    componentWillMount(){

    }
    componentWillUpdate(){
    }
    render() {
        let issue = this.props.item.issue.split("-");
        if(issue[1]!==undefined){
            issue= issue[1]
        }else if(issue[0].indexOf("2017") !==-1){
            issue= issue[0].replace("2017","")
        }

        let count_down=0;
        if(this.props.item.kTime>0){
            count_down =this.props.item.kTime;
        }else{
            count_down = this.props.item.count_down>0?this.props.item.count_down*1000:0
        }

        return (
            <div className="openli">
                <Link to={"open/history/"+this.props.item.lottery_id}>
                    <i className={"lt-icon lt-icon-"+this.props.item.lottery_id}></i>
                    <div>
                        <h3>{this.props.item.cname}</h3>
                        <p className="time">
                           第{issue}期&nbsp;&nbsp;
                            <CountdownTimer initialTimeRemaining={count_down}   completeCallback ={this.props.getLotteryHistory} />
                        </p>
                        <div className="prize-num">
                            {/*彩球样式*/}
                            <LotteryNum data={this.props.item}  />
                        </div>
                        <i className="anticon anticon-right"></i>
                    </div>
                </Link>
            </div>
        )
    }

}
