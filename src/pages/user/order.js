import React, {Component} from 'react';
import {hashHistory, Link} from 'react-router';
import {DatePicker, List, PullToRefresh, Tabs, Badge} from 'antd-mobile';
import Navbar from '../common/navbar';
import ReactDOM from 'react-dom';
import {message} from 'antd';

import Api from '../api';

//日期
const tabs = [
    {title: <Badge>全部</Badge>},
    {title: <Badge>已中奖</Badge>},
    {title: <Badge>待开奖</Badge>},
    {title: <Badge>追号</Badge>},
];
export default class Order extends Component {
    constructor(props) {
        super(props);
        let orderIndex =sessionStorage.getItem("orderIndex");
        this.state = {
            renderList: [],
            dpValue: null,
            customChildValue: null,
            myDate: "",//拿到日期,
            nowDate: null,
            maxData: null,
            index:orderIndex?parseInt(orderIndex):0,
            hasContent: true,
            page:0,
            betamount:0,
            curPage: 1,
            totalPages:1,
            refreshing: false,
            down: true,
            height: document.documentElement.clientHeight,
            tzdata:0,

            //新数据
            selfWinReport:{},
            showDatas:""
        }
    };

    componentDidMount() {
        this.getOrdersList();
        this.handlechange(this.state.index);
        this.getDown();
        const hei = ReactDOM.findDOMNode(document.getElementsByClassName("orderlist-content")[0]).offsetHeight;
        setTimeout(() => this.setState({
            height: hei,
        }), 0);

    }

    componentWillUnmount() {
        document.getElementsByClassName('orderlist-content')[0].removeEventListener('touchstart', (ev) => {
            startY = ev.changedTouches[0].pageY;
        }, true);
        document.getElementsByClassName('orderlist-content')[0].removeEventListener('touchend', (ev) => {
            let endY = ev.changedTouches[0].pageY;
            let direction = endY - startY;
            if (direction == 0) {
                return;
            } else if (direction > 10) {
                this.setState({
                    down: true
                })
            } else if (direction < -10){
                this.setState({
                    down: false
                })
            }
        }, true);
    }

    getDown() {
        //滑动处理

        document.getElementsByClassName('orderlist-content')[0].addEventListener('touchstart', (ev) => {
            let startY = ev.changedTouches[0].pageY;
            this.setState({
                startY:startY
            })
        }, true);

        document.getElementsByClassName('orderlist-content')[0].addEventListener('touchend', (ev) => {
            let endY = ev.changedTouches[0].pageY;

            let direction = endY - this.state.startY;
            this.setState({
                startY:endY
            })

            if (direction == 0) {
                return;
            } else if (direction > 10) {
                this.setState({
                    down: true
                })
            } else if (direction < -10){
                this.setState({
                    down: false
                })
            }
        }, true);
    }

    loadMore() {

        let totalPages=this.state.totalPages;
        let curPage=this.state.curPage;

        if(this.state.curPage==totalPages){
          message.warn('亲,已经没有数据了', 2)
        }else{
          curPage++;
          this.setState({
              curPage: curPage
          },()=>{
              this.getOrdersList();
          });

        }
   console.log(curPage)
    }

    reLoad() {
        this.setState({
            curPage:1,
        },()=>{
            this.getOrdersList();
        });

    }


    check(str) {
        str = str.toString();
        if (str.length < 2) {
            str = '0' + str;
        }
        return str;
    }

    format(date, str) {
        var mat = {};
        mat.M = date.getMonth() + 1;//月份记得加1
        mat.H = date.getHours();
        mat.s = date.getSeconds();
        mat.m = date.getMinutes();
        mat.Y = date.getFullYear();
        mat.D = date.getDate();
        mat.d = date.getDay();//星期几
        mat.d = this.check(mat.d);
        mat.H = this.check(mat.H);
        mat.M = this.check(mat.M);
        mat.D = this.check(mat.D);
        mat.s = this.check(mat.s);
        mat.m = this.check(mat.m);
        if (str.indexOf(":") > -1) {
            mat.Y = mat.Y.toString().substr(2, 2);
            return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + ":" + mat.m + ":" + mat.s;
        }
        if (str.indexOf("/") > -1) {
            return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + "/" + mat.m + "/" + mat.s;
        }
        if (str.indexOf("-") > -1) {
            return mat.Y + "-" + mat.M + "-" + mat.D;
        }
    }

    getDate() {
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.setState({
            nowDate: now,
            maxDate: now,
        })
    }


// 得到选择的日期
    onChange(date) {
        let myDate = this.format(date, 'YYYY-MM-DD');
        this.setState({
            myDate: myDate,
            nowDate:date
        }, () => {
            this.getOrdersList();
        });
    };

    //在render()之前渲染
    componentWillMount() {
        this.getDate();

    };

//请求后台得到的下注记录
    getOrdersList() {
        let param = "";
        if (this.state.myDate) {
            param = "&date=" + this.state.myDate
        };
        let curPage = this.state.curPage;
        let index = this.state.index;
        let num = -1;
        if (index === 0) {
            num = -1
        } else if (index === 1) {
            num = 1
        } else if (index === 2) {
            num = 0
        } else if (index === 3) {
            num = 3
        }
        Api("c=game&a=packageList&type=" + num + param + "&page=" + curPage, null, (res) => {
            let showDatas = res.data.show_datas ? res.data.show_datas : [];
            if(!res.errno){

                if(curPage!==1){
                    let oldData=JSON.parse(JSON.stringify(this.state.showDatas));
                    showDatas.map((item,i)=>{
                        oldData.push(item)
                    });
                    this.setState({
                        selfWinReport:res.data.selfWinReport,
                        totalPages:res.data.pageTool.totalPages,
                        showDatas:oldData
                    });
                }else{
                    this.setState({
                        totalPages:res.data.pageTool.totalPages,
                        selfWinReport:res.data.selfWinReport,
                        showDatas:showDatas,
                    });
                }

            }
            return;
            let data = res.data.show_datas ? res.data.show_datas : [];
            let tzdata=res.data.selfWinReport;
            let betList = [];
            let betamount = parseFloat(this.state.betamount);

            if (data.length == 0) {
                this.setState({
                    renderList: [],
                    hasContent: false
                })
            } else {
                data.map(function (item, i) {
                    betList.push(item.amount);
                });
                this.setState({
                    hasContent: true
                })
            }


            //计算总和
            if (betList.length == 0) {
                return;
            } else {
                for (var i = 0; i < betList.length; i++) {
                    let item = betList[i].replace(/,/g, "");
                    betamount += parseFloat(item);
                }
                betamount = betamount.toFixed(2);
            }
            let render = [];
            data.map(function (item, i) {
                let data = item.amount.replace(/,/g, "");
                render.push(
                    <li className="bottom_border" key={i}>
                        <Link to={{
                            pathname: "order_deatil",
                            query: {query: JSON.stringify(item), page: num}
                        }}><span>{item.show_name}</span><span>{item.issue}</span>
                            <span>{parseFloat(data).toFixed(3)}</span><span
                                className={item.status === 1 ? 'win' : ""}>{item.show_status}</span>
                        </Link>
                    </li>
                )
            });
            //订单个数
            if(res.data.pageTool.page<3){
                this.setState({
                    renderList: render,
                    betamount: betamount,
                    ordercounting: data.length,
                    curPage:1,
                    totalPages:res.data.pageTool.totalPages,
                    tzdata:tzdata,
                })
            }else{
                this.setState({
                    renderList: [...this.state.renderList, render],
                    betamount:betamount,
                    ordercounting:this.state.ordercounting+data.length,
                    curPage:res.data.pageTool.page,
                    totalPages:res.data.pageTool.totalPages,
                    tzdata:tzdata,
                })
            }
        })
    };

    //未中奖  无开奖  追号
    handlechange(index) {
        sessionStorage.setItem("orderIndex",index);
        this.setState({
            index: index,
            curPage: 1,
        }, () => {
            this.getOrdersList();
        })
    };


    render() {
        let selfWinReport=this.state.selfWinReport;
        let showDatas=this.state.showDatas;
        let listRender=[];
        let index = this.state.index;
        let num = -1;
        if (index === 0) {
            num = -1
        } else if (index === 1) {
            num = 1
        } else if (index === 2) {
            num = 0
        } else if (index === 3) {
            num = 3
        }
        let totalMoney= 0;
        let winMoney= 0;
        if(showDatas !==""){
            showDatas.map(function (item, i) {
                let data = item.amount.replace(/,/g, "");
                listRender.push(
                    <li className="bottom_border" key={i}>
                        <Link to={{
                            pathname: "order_deatil",
                            query: {query: JSON.stringify(item), page: num}
                        }}><span>{item.show_name}</span><span>{item.issue}</span>
                            <span>{parseFloat(data).toFixed(3)}</span><span
                                className={item.status === 1 ? 'win' : ""}>{item.show_status}</span>
                        </Link>
                    </li>
                );
                totalMoney +=parseFloat(data);
                winMoney +=parseFloat(item.prize)-parseFloat(data);
            //计算总计

            });
        }

        return (
            <div>
                <Navbar title="注单中心" back="back"/>
                {/*查询日期*/}
                <div className="eziDay">
                    <div className="pickUpDate">
                        <DatePicker
                            mode="date"
                            title="请选择查询日期"
                            extra="选择日期"
                            onChange={this.onChange.bind(this)}
                            value={this.state.nowDate}
                            maxDate={this.state.maxDate}
                        >
                            <List.Item arrow="horizontal">查询日期</List.Item>
                        </DatePicker>
                    </div>
                </div>
                <div className="order">
                    <Tabs tabs={tabs}
                          initialPage={this.state.index}
                          onChange={(tab, index) => {
                              this.handlechange(index)
                          }}>

                    </Tabs>
                    <div className="orderlist">
                        <div className="table-head">
                            <span>游戏类别</span><span>投注期号</span><span>金额（元）</span><span>状态</span>
                        </div>
                        <div className="orderlist-content">
                            <PullToRefresh
                                ref={el => this.ptr = el}
                                style={{
                                    height: this.state.height,
                                    overflow: 'auto',
                                }}
                                indicator={this.state.down ? {
                                    activate: '松开立即刷新',
                                    deactivate: '下拉刷新',
                                    finish:" "
                                } : {activate: '松开立即加载', deactivate: '上拉加载更多',finish:" "}}
                                direction={this.state.down ? 'down' : 'up'}
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.state.down ? this.reLoad() : this.loadMore();
                                    this.setState({refreshing: true});
                                    setTimeout(() => {
                                        this.setState({refreshing: false});
                                    }, 1000);

                                }}
                            >
                                <ul className="table-body">
                                    {listRender}
                                </ul>
                            </PullToRefresh>
                        </div>
                    </div>
                    {/*{this.state.showDatas.length>0&&this.state.index===0 ? <div className="zhudanyinkui">*/}
                        {/*<ul className="yinkui">*/}
                            {/*<p>今日</p>*/}
                            {/*<li>投注金额：￥{selfWinReport.today.total_amount}</li>*/}
                            {/*<li>盈亏:￥{selfWinReport.today.total_win}</li>*/}
                        {/*</ul>*/}
                        {/*<div></div>*/}
                        {/*<ul className="yinkui">*/}
                            {/*<p>总计</p>*/}
                            {/*<li>投注金额：￥{totalMoney}</li>*/}
                            {/*<li>盈亏:￥{winMoney.toFixed(3)}</li>*/}
                        {/*</ul>*/}
                    {/*</div> : null}*/}
                    {!this.state.showDatas.length>0 ?  <div className="data2_block">
                        <p>
                            <img src={require("../../img/global/data_block.png")}/>
                        </p>
                        <h2>您暂时没有下注订单</h2>
                        <span>请给梦想一个机会</span><br/>
                        <Link to="hall">
                            立即下注
                        </Link>
                    </div> :null}
                </div>
            </div>
        );
    }
}
