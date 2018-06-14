import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Navbar from '../common/navbar';
import ShowMoney from '../common/showmoney';
import OpenLi from './openli';//列表组件
import Footer from '../common/footer';
import { Tabs,PullToRefresh } from 'antd-mobile';
import Api from '../api';
export default class OpenList extends Component {
    constructor(props) {
        super(props);
        this.state={
            lotteryHistory:[],
            index:0,
            tabs : [
                { title: '信用彩', index: 0 },
                { title: '时时彩', index: 1 },
                { title: '11选5', index: 2 },
                { title: '低频彩', index: 3 },
                { title: '高频彩', index: 4 }
            ],
            data:[],
            timeout:"",
            refreshing: false,
            height: document.documentElement.clientHeight,//下拉刷新判断
        }
    }
    getLotteryHistory(index){
        Api("c=default&a=lobby&index="+index,null,(res)=>{
            let data = res.data;

            // let count =0;
            // data.map(function (item,i) {
            //     if(item.code===""){
            //         count++
            //     }
            // });
            // // count为有彩种处于正在开奖状态，10s后再刷新
            // if(count>0){
            //     if(this.state.timeout){
            //         clearTimeout(this.state.timeout);
            //     }
            //     this.setState({
            //         timeout:setTimeout(()=>{
            //             this.getLotteryHistory(this.state.index);
            //         },10000)
            //     });
            // }
            this.setState({
                index: index,
                data:data,
                refreshing: false
            },function () {
                this.renderFunc();
            });
        })
    }

    componentWillMount(){
        this.getLotteryHistory();
    }
    componentDidMount() {
        setTimeout(() => this.setState({
            height: ReactDOM.findDOMNode(document.getElementsByClassName("am-tabs-content-wrap")[0]).offsetHeight
        }), 0);
    }
    componentWillUnmount(){
        clearTimeout(this.state.timeout);
    }

    renderFunc(){
        let randerHistory =[];
        let _this =this;
        this.state.data.map(function (item,i) {
            if(item.lottery_id!==15){
                randerHistory.push(
                    <OpenLi getLotteryHistory={()=>{_this.getLotteryHistory(_this.state.index)}} key={i} item={item} />
                )
            }

        });
        return randerHistory;
    }


    render() {
        return (
            <div>
                <Navbar className="" title="开奖信息" />

                <div className="open-wrap open-wrap1">
                    <div className="open-award-wrap">
                        <ShowMoney />
                    </div>
                    <div className="open-tab" >
                        <Tabs ref = "tabs" tabs={this.state.tabs} animated={false} className="tabs" onChange={(tab, index) => { this.getLotteryHistory(index)}}>
                            <div className="open-index-list" >
                                <div>
                                    <PullToRefresh

                                        style={{
                                            height: this.state.height,
                                            overflow: 'auto',
                                        }}
                                        direction='down'
                                        refreshing={this.state.refreshing}
                                        onRefresh={() => {
                                            this.setState({ refreshing: true });
                                            this.getLotteryHistory(this.state.index)
                                        }}
                                        indicator={{ activate: "下拉刷新", deactivate: " ",  finish: " " }}
                                    >
                                    {this.renderFunc()}

                                    </PullToRefresh>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}
