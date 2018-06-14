
// application's entry
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import reducers from 'reducers/index';
import '../css/common.scss';


//个人中心
import Login from './login/index'; // 未登录
import Register from './login/register'; // 注册
import Home from './home/index' // 首页
import HomePromodetail from './home/home_promodetail'//首页轮播图详情页面
import User from './user/index' // 用户中心
import WithDrawMoney from './user/withdrawMoney' //  提现
import Order from './user/order' //  订单
import Information from './user/information' //  信息中心
import Account from './user/account' //  信息中心
import User_login from './user/user_login' //已登录
import User_state from './user/user_state' //个人信息
import SetUserInfo from './user/setUserInfo' //个人信息
import GetService from './user/getService'//在线客服
import Order_Deatil from './user/order_deatil'//订单详情
import TraceSingle from './lottery/components/traceSingle' // 追号单页面  从订单详情进入
import Setpassword from './user/setpasswrod'//提现密码
import BankCardBind from './user/bankcardbind'//绑定银行卡
import InformationList from './user/informationList'//今日热点
import InformationDetail from './user/informationDetail'//今日热点详情
import ReceiveBoxList from './user/receiveBoxList'//系统消息
import ReceiveBoxDetail from './user/receiveBoxDetail'//系统消息详情
import Guidance from './home/guidance' //引导页
import To_load from  './home/to_load'
import ResetLoginPsd from './user/resetLoginPsd' //个人信息




//开奖信息
import OpenList from './open/index' // 开奖信息
import HistoryList from './open/historyList' // 开奖信息
import WinDetail from './open/winDetail'
import LotteryTrend from './open/lotteryTrend'
// 大厅
import Hall from './hall/index'; // 大厅
// 各个彩种入口 START
// import ltSSC from './lottery/ssc/index';
import ltSSC from './lottery/ssc/index';
import Lt11x5 from './lottery/11x5/index';
import Ltpks from './lottery/pk10/index';//PK10
import Ltxyft from './lottery/xyft/index';
import LtFC3D from './lottery/fc3D/index';
import Ltlhc from './lottery/lhc/index'
import ltP3P5 from './lottery/p3p5/index';
import Ltklpk from './lottery/klpk/index';
import LtSSQ from './lottery/ssq/index';
import LtK3 from './lottery/K3/index';
import Ltxy28 from './lottery/lucky28/index'

import Mmc from './lottery/mmc/index'
// 各个彩种入口 END
//其他
import PromoDetailforuser from './promo/promoDetail-for-user'//个人中心和首页跳转优惠活动详情页面
import Promoforuser from './promo/indexForuser'//个人中心和首页跳转优惠活动页面
import Promo from './promo/index' // 优惠活动
import PromoDetail from './promo/promoDetail' //优惠活动详情
import MySetting from './mySetting/index' // 我的最爱设置
//充值
import Pay from './user/pay' //  充值
//电子钱包，电子游戏
import Wallet from './wallet/index';//电子钱包
import Inegame from './wallet/inegame';//转入
import Outegame from './wallet/outegame';//转出
//设置
import Setting from './user/setting';//我的设置
import Ours from './user/ours';//关于我们
// 帮助
import Help from './help/help';//帮助列表
import HelpDetail from './help/helpDetail';//帮助详情
import Feedback from './help/feedback'//意见反馈
//团队管理
import Group_add_custom1 from './group/group_add_custom1'//新增会员,更新
import Group_custom1 from './group/group_custom1'//会员管理，更新
import Group_profit_change1 from './group/group_profit_change1'//团队帐变报表,更新
import Group_profit1 from './group/group_profit1'//团队盈亏报表,更新
import Group_withdraw1 from './group/group_withdraw1'//团队提现明细，更新
import Group_recharge1 from './group/group_recharge1'//团队充值明细,更新
import Group from './user/group' //  团队管理
import Group_agent from './group/group_agent' //  团队管理

import Vindicate from './vindicate/vindicate' //维护


//test 用例 start
import PullDown from './example/pullDown' //  团队管理
import LongList from './example/longList' //  团队管理
import TestOpen from './example/testOpen' //  开奖球

//test 用例 end
class Application extends Component {
  constructor(props) {
    super(props);
    if(!(sessionStorage.getItem("key")&&sessionStorage.getItem("token"))){

    }
  }
  render() {
    let now = document.location.hash;
    let hash  = sessionStorage.getItem("hash")?sessionStorage.getItem("hash"):"";
    if(now.substr(0,2)==="#/") {
        let arr  = ['ssc', '11x5', 'fc3d', 'k3', 'lhc', 'klpk', 'p3p5', 'ssq', 'xy28', 'pk10', 'xyft', 'mmc'];
        if (now !== hash) {
            let nowCount=0;
            let hashCount=0;
            arr.map((name,i)=>{
                if (now.indexOf(name) !== -1) {
                    nowCount++;
                }
            });
            arr.map((name,i)=>{
                if (hash.indexOf(name) !== -1) {
                    hashCount++;
                }
            });
             if(nowCount===1&&hashCount===1){
                sessionStorage.setItem("hash", now);
            }else if(nowCount===0&&hashCount===1){
                sessionStorage.setItem("hash", sessionStorage.getItem("back"));
            }else{
                 sessionStorage.setItem("hash", now);
                 sessionStorage.setItem("back", hash);
            }
        }

    }


    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

const store = createStore(reducers, {}, applyMiddleware(thunk));

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Application}>
        <IndexRoute component={To_load} />
        <Route path="receiveBoxDetail" component={ReceiveBoxDetail}></Route>
        <Route path="receiveBoxList" component={ReceiveBoxList}></Route>
        <Route path="informationDetail" component={InformationDetail}></Route>
        <Route path="informationList" component={InformationList}></Route>
        <Route path="setpasswrod" component={Setpassword}></Route>
        <Route path="order_deatil" component={Order_Deatil}></Route>
        <Route path="tracesingle" component={TraceSingle}></Route>{/* 追号单页面  从订单详情进入*/}
        <Route path="bankCardBind" component={BankCardBind}></Route>
        <Route path="getService" component={GetService}></Route>
        <Route path="login" component={Login}></Route>
        <Route path="user_login" component={User_login}></Route>
        <Route path="user_state" component={User_state}></Route>
        <Route path="setUserInfo" component={SetUserInfo}></Route>
        <Route path="resetLoginPsd" component={ResetLoginPsd}></Route>



        <Route path="group_agent" component={Group_agent}></Route>
        <Route path="feedback" component={Feedback}></Route>
        <Route path="helpDetail" component={HelpDetail}></Route>
        <Route path="wallet" component={Wallet}></Route>
        <Route path="ours" component={Ours}></Route>
        <Route path="help" component={Help}></Route>
        <Route path="inegame" component={Inegame}></Route>
        <Route path="setting" component={Setting}></Route>
        <Route path="outegame" component={Outegame}></Route>
        <Route path="register" component={Register}></Route>
        <Route path="home" component={Home}></Route>
        <Route path="home/promodetail/:id" component={HomePromodetail}></Route>
        <Route path="user" component={User}></Route>
        <Route path="guidance" component={Guidance}></Route>

        {/* 购彩 */}
        <Route path="hall" component={Hall}></Route>
        <Route path="ssc/:ltCode" component={ltSSC}></Route>
        <Route path="11x5/:ltCode" component={Lt11x5}></Route>
        <Route path="pk10/:ltCode" component={Ltpks}></Route>
        <Route path="xyft/:ltCode" component={Ltxyft}></Route>
        <Route path="fc3D/:ltCode" component={LtFC3D}></Route>
        <Route path="ssq/:ltCode" component={LtSSQ}></Route>
        <Route path="p3p5/:ltCode" component={ltP3P5}></Route>
        <Route path='lhc/:ltCode' component={Ltlhc}></Route>

        <Route path="klpk/:ltCode" component={Ltklpk}></Route>
        <Route path="xy28/:ltCode" component={Ltxy28}></Route>
        <Route path='K3/:ltCode' component={LtK3}></Route>
        <Route path="mmc/:ltCode" component={Mmc}></Route>
          {/*开奖  start*/}
        <Route path="open" component={OpenList}></Route>
        <Route path="open/history/:name" component={HistoryList}></Route>
        <Route path="open/winDetail" component={WinDetail}></Route>
        <Route path="lotteryTrend" component={LotteryTrend}></Route>
        <Route path="promo/userimg/:id" component={PromoDetailforuser}></Route>
        <Route path="promo/user" component={Promoforuser}></Route>
        <Route path="promo/id/:name" component={Promo}></Route>
        <Route path="promo/img/:id" component={PromoDetail}></Route>
        <Route path="promo" component={Promo}></Route>
        <Route path="mySetting" component={MySetting}></Route>
        <Route path="pay" component={Pay}></Route>
        <Route path="withdrawMoney" component={WithDrawMoney}></Route>
        <Route path="order" component={Order}></Route>information
        <Route path="group" component={Group}></Route>
        <Route path="information" component={Information}></Route>
        <Route path="account" component={Account}></Route>
        <Route path="group_recharge1" component={Group_recharge1}></Route>
        <Route path='group_withdraw1' component={Group_withdraw1}></Route>
        <Route path='group_profit1' component={Group_profit1}></Route>
        <Route path='group_profit_change1' component={Group_profit_change1}></Route>
        <Route path='group_custom1' component={Group_custom1}></Route>
        <Route path='group_add_custom1' component={Group_add_custom1}></Route>
        <Route path="setpassword" component={Setpassword}></Route>{/*//设置资金密码*/}


        {/*//test 用例 start*/}
        <Route path="pullDown" component={PullDown}></Route>{/* 无限滚动*/}
        <Route path="longList" component={LongList}></Route>{/* 长列表*/}
        <Route path="testOpen" component={TestOpen}></Route>{/* 滚动球开奖*/}

          {/*//test 用例 end*/}
          {/*维护*/}
        <Route path="/vindicate" component={Vindicate}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
