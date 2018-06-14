import React, { Component } from "react";
import { PopupConfirm, message,  Icon} from 'antd';
import CountdownTimer  from '../../open/countdown';
import LotteryNameMap from '../../lottery_name_map';
import LotteryNum from '../../open/lotteryNum';
import { Link } from 'react-router';
//头部信息展示
export default class LotteryHead extends Component {
    constructor(props) {
        super(props);

    }
    componentWillMount(){

    }
    formatTime(t){
        let sec_num = parseInt(t, 10);
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }
    render(){
        let game_key=this.props.game_key;
        let LotteryName = LotteryNameMap(this.props.lottery_id);
        let lottery_id= parseInt(this.props.lottery_id);

        //获得彩种数据
        let lotteryitem=this.props.lotterys;
        let lotteryitemarr=[];
        lotteryitem.map((item,i)=>{
            lotteryitemarr.push(

                  <li key={i} onClick={()=>{this.props.changeLottery(item.lottery_id)}} className={item.lottery_id===lottery_id?"active":null}>
                      <label>
                        {item.cname}
                      </label>
                      {item.lottery_id===lottery_id?<em><Icon type="check"/></em>:null}
                  </li>
            );

      });
        let buttonRender="";//信用官方按钮
        if ([15].indexOf(lottery_id) !== -1) {//mm彩只有官方
            buttonRender = <div>
                <button className="active">官方</button>
            </div>
        } else if ([26].indexOf(lottery_id) !== -1) {
            buttonRender = <div>
                <button className="active">信用</button>
            </div>
        }else if (game_key === "g") {

                buttonRender = <div>
                    <button onClick={() => {
                        this.props.handleChangeGameKey()
                    }}>信用
                    </button>
                    <button className="active">官方</button>
                </div>
        } else {
            buttonRender = <div>
                <button className="active">信用</button>
                <button onClick={() => {
                    this.props.handleChangeGameKey()
                }}>官方
                </button>
            </div>
        }
        let timeRender="";//时间渲染
        //普通倒计时 countDown
        //封盘倒计时 ltPause
        //休市倒计时 kTime
        if(this.props.kTime>0){
            timeRender=<div>
                <span>距离下次开市</span>
                <span className="time">
                    {this.formatTime(this.props.seconds)}
                </span>
            </div>
        }else if(this.props.ltPause>0){
            timeRender=<div>
                <span>正在封盘时间</span>
                <span className="time">
                    {this.formatTime(this.props.seconds)}
                </span>
            </div>
        }else {
            timeRender=<div>
                <span>距离封盘时间</span>
                <span className="time">
                    {this.formatTime(this.props.seconds)}
                </span>
            </div>
        }

        return (
            <div>
                <div className="lt-info">
                    <div className="col-left">
                        <p>第{this.props.issue}期</p>
                        <span onClick={(e)=>{this.props.showLotteryList(e);}} className="up">{LotteryName}</span>
                        {/*开奖时间: {this.props.opentime.substr(-8)}*/}
                        {this.props.showList?<div className="lottery-list">
                            <ul>
                                {lotteryitemarr}
                            </ul>
                        </div>:null}
                    </div>
                    <div className="col-middle">
                        {/*信用官方玩法*/}
                        {buttonRender}
                    </div>
                    <div className="col-right">
                        {/*时间*/}
                        {timeRender}
                    </div>
                </div>
                {lottery_id!==15?<div className="last-open">
                    {this.props.kTime===0?<span>第{this.props.lastOpenissue}期&nbsp;&nbsp;开奖号码</span>:null}
                       
                        <div className="prize-num">
                            {/*彩球样式*/}
                            <LotteryNum
                                data={{
                                    lottery_id:this.props.lottery_id,
                                    code:this.props.lastOpenCode,
                                    kTime:this.props.kTime
                                }}
                            />
                        </div>

                </div>:<div className="last-open">
                    即买即开
                </div>
                }
            </div>
        )
    }
}
