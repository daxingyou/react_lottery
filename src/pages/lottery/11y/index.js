import React, { Component, PropTypes } from "react"
import { connect } from 'react-redux'
import { message, Button, Select, Checkbox, Spin, Slider } from 'antd';
const Option = Select.Option;
import GameSSC from './game_ssc.js'
import Navbar from '../../common/navbar';
import Api from '../../api';
import LotteryNameMap from '../../lottery_name_map';

// Object.assign polyfill
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

export default class LottoSSC extends Component {
	constructor(props) {
		super(props);
        this.state = {
            lottery_id: 0,
            showTab: false,
            tabActive: 5,
            subTabActive: 0,
            md: null,
            game_key: localStorage.getItem('game_key') || 'x', //官方g 信用x

            beishu: 1,
            numList: this.get_default_num_list(5),
            mode: 1,
            loading: false, // 异步加载
            tableList: [],
            total_zhushu: 0,
            total_money: 0,
            showcart: false,
            issue: '-',
            last_number: ['-', '-', '-', '-', '-'],
            seconds: 0, // 当期剩余时间
            opentime: '00:00:00', // 当前期开奖时间
            intervalId: null, // 定时器
            ltPause: false,  // 已封盘
            ltStop: false,  // 休市中...
            lotterys: [],
            methods: [],
            prizeRate: 0.9,
            maxCombPrize: 0,
            minRebateGaps: null,
            rebate: 0,
            gamePrize: 0,
            showSlider: false,
            sliderValue: 0.0,

            // 以下追号相关
            showTrace: false,
            traceIssues: [],    // 追号期数
            traceBeishu: 1,     // 追号倍数
            traceQishu: 1,      // 追号期数
            stopOnWin: 2,       // 中奖即停
            traceStart: 0,      // 追号起始期序号
            traceAllChecked: true,   // 追号全选 反选
            traceList: [],      // 追号数据
        }
        this.tabClick = this.tabClick.bind(this);  // 玩法一级菜单点击
        this.subTabClick = this.subTabClick.bind(this);  // 玩法二级菜单点击
        this.navBarClick = this.navBarClick.bind(this);    // 显示隐藏玩法菜单
        this.sliderOnChange = this.sliderOnChange.bind(this);  // 赔率滑杆
        this.beishuChange = this.beishuChange.bind(this);
        this.modeChange = this.modeChange.bind(this);
        this.updateTableList = this.updateTableList.bind(this);
        this.ballClick = this.ballClick.bind(this);  // 点击选号盘数字
        this.btnFilter = this.btnFilter.bind(this);  // 全大小奇偶清
        this.confirm_touzhu = this.confirm_touzhu.bind(this); // 确认投注
        this.keepPlaying = this.keepPlaying.bind(this); // 继续投注
        this.addNumber = this.addNumber.bind(this); //添加号码
        this.submitbuy = this.submitbuy.bind(this); //直接投注所有结果
        this.clearCart = this.clearCart.bind(this); // 清空购彩篮

        this.initCaiZhong = this.initCaiZhong.bind(this); // 更新剩余时间
        this.getIssueInfo = this.getIssueInfo.bind(this); // 获取档期奖期&时间
        this.gameKeyChange = this.gameKeyChange.bind(this);  // 信用 官方 切换

        // 追号相关
        this.startTrace = this.startTrace.bind(this);   // 开始追号
        this.cancelTrace = this.cancelTrace.bind(this); // 取消追号
        this.stopOnWinChange = this.stopOnWinChange.bind(this); // 中奖即停
        this.traceBeishuChange = this.traceBeishuChange.bind(this); // 倍数更改
        this.traceQishuChange = this.traceQishuChange.bind(this); // 期数更改
        this.traceStartChange = this.traceStartChange.bind(this); // 起始期数更改
        this.traceSelectChange = this.traceSelectChange.bind(this); // 追号列表 选中/取消 当前期
        this.traceSelectAllChange = this.traceSelectAllChange.bind(this); // 追号列表 选中/取消 当前期
        this.traceSingleBeishuChange = this.traceSingleBeishuChange.bind(this); // 追号列表 单条倍数更改
        this.traceListUpdate = this.traceListUpdate.bind(this); // 追号列表更新
        this.traceSubmit = this.traceSubmit.bind(this); // 确认追号
	}


    componentWillMount() {
        this.setState({'lottery_id': this.props.params.ltCode});
    }

    componentDidMount() {
        this._isMounted = true;
        this.initCaiZhong(this.state.game_key);
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
        this._isMounted = false;
    }

    initCaiZhong(key) {
        Api('c=game&a=initCaiZhong&game_key='+ key +'&lottery_id=' + this.state.lottery_id, null, (res) => {
            if (!this._isMounted) {
                return false;
            }
            if(res.data) {
                let data = res.data;

                const method = data['methods'][this.state.tabActive]['childs'][this.state.subTabActive];

                this.setState({'last_number': data['json_openedIssues'][0]['code'].split('')});
                this.setState({'maxCombPrize': data['maxCombPrize']});
                this.setState({'minRebateGaps': data['minRebateGaps'][0]});
                this.setState({'rebate': data['rebate']});
                this.setState({'gamePrize': data['maxCombPrize'] * (this.state.prizeRate * 1000 + data['minRebateGaps'][0].to * 1000) / 1000});
                this.setState({'lotterys': data['lotterys']});
                this.setState({'methods': data['methods']});
                this.setState({'md': method});


                this.getIssueInfo();
            }
        });
    }

    getIssueInfo() {
        if (!this._isMounted) {
            clearInterval(this.state.intervalId);
            return false;
        }
        clearInterval(this.state.intervalId);

        let intervalId = setInterval(() => {
            // timer = setTimeout(() => {
            let t = this.state.seconds - 1;
            if(t <= 0) {
                clearInterval(this.state.intervalId);
                this.setState({'seconds': 0});
                // this.getIssueInfo();
            } else {
                this.setState({'seconds': t})
            }
        }, 1000);

        this.setState({
            intervalId: intervalId
        });

        let getRemianTime = (end_time, server_time) => {
            let d1 = new Date(end_time).getTime();
            let d2 = new Date(server_time).getTime();

            return (d1 - d2) / 1000;
        }

        // 奖时间返回正确才拉取期号
        // 每期结束也会更新期号
        Api('c=game&a=play', {
            op: 'getCurIssue',
            lotteryId: this.state.lottery_id
        }, (res) => {
            if (!this._isMounted) {
                clearInterval(this.state.intervalId);
                return false;
            }
            let time = 0;
            if(res.data.kTime > 0) {
                time = res.data.kTime / 1000;
                this.setState({'ltStop': true});
            } else {
                time = getRemianTime(res.data.issueInfo.end_time, res.data.serverTime)
                this.setState({'ltStop': false});
            }
            if(time <= 0) {
                setTimeout(() => {
                    this.getIssueInfo();
                }, 10000)
                return false;
                // 10秒之后再去拉取一次剩余时间
            }
            this.setState({'seconds': time});
            this.setState({'opentime': res.data.issueInfo.end_time.split(' ')[1]});
            this.setState({'issue': res.data.issueInfo.issue});
        });
    }

    navBarClick() {
        this.setState({'showTab': !this.state.showTab});
    }

    gameKeyChange(key) {
        localStorage.setItem('game_key', key);
        this.setState({
            game_key: key,
            tabActive: 0,
            subTabActive: 0
        }, () => {
            this.initCaiZhong(key);
        });
    }

    confirm_touzhu(listData) {
        if(listData['zhushu'] == 0) {
            message.warning('注数不合法！');
            return false;
        }
        this.addNumber(listData);
        this.setState({"showcart": true});
    }

    submitbuy() {
        let data = this.state.tableList;
        let zhushu = this.state.total_zhushu;
        let money = this.state.total_money;
        // 玩法 : 内容
        this.setState({loading: true})
        if(data.length < 1 && zhushu < 1) {
            message.warning('选号格式错误！');
            return false;
        }
        const getRandChar = (len) => {
            len = len || 36;
            const timestamp = new Date().getTime();
            const x = "0123456789qwertyuiopasdfghjklzxcvbnm";
            let random = '';
            for (let i = 0; i < len; i++) {
                random += x.charAt(Math.floor(Math.random() * x.length));
            }

            return timestamp + random;
        }

        let postObj = {
            op: 'buy',
            lotteryId: this.state.lottery_id,
            issue: this.state.issue,
            curRebate: 0,
            codes: this.state.md['method_id'] + ':' + data[0]['content'],
            modes: this.state.mode,
            multiple: this.state.beishu,
            token: getRandChar(32)
        }


        Api('c=game&a=play', postObj, (res) => {
            if(res.errno === 0) {
                message.success('购买成功', 2);
                this.setState({
                    ...this.state,
                    tableList: [],
                    total_zhushu: 0,
                    total_money: 0,
                    showcart: false
                })
            } else {
                message.errstr(res.msg);
            }
            this.setState({loading: false})
        });
    }

    getContent(arr0,arr1,arr2,arr3,arr4) {
        let result="";

        const one = arr0.join('').replace(/,/g, '')
        const two = arr1.join('').replace(/,/g, '')
        const three = arr2.join('').replace(/,/g, '')
        const four = arr3.join('').replace(/,/g, '')
        const five = arr4.join('').replace(/,/g, '')

        if(this.state.md['method_id'] === 13) {
            result = one + ',' + two + ',' + three + ',' + four + ',' + five;
        } else {
            result += one
            if(two) {
                result += "," + two;
            }
            if(three) {
                result += "," + three;
            }
            if(four) {
                result += "," + four;
            }
            if(five) {
                result += "," + five;
            }
        }
        return result.split(',');
    }

    keepPlaying() {
        this.setState({"showcart": false});
    }

    get_default_num_list(num=5, default_num=10) {
        const arr = {};
        const num_list_obj = {};
        for(let i=0;i<default_num;i++) {
            arr[i] =  false
        }
        for(let i=0;i<num;i++) {
            num_list_obj[i] = arr;
        }
        return num_list_obj;
    }
    ballClick(row, n) {
        let newState = Object.assign({}, this.state.numList[row]);
        newState[n] = !newState[n];
        this.state.numList[row] = newState
        this.setState(this.state.numList);
    }
    btnFilter(type, row) {
        const newState = Object.assign({}, this.state.numList[row]);
        const length = Object.keys(newState).length;

        for(let i = 0; i < length; i++) {
            newState[i] = false;
        }

        if(type === 0) {
            // 全
            for(let i=0; i<length; i++) {
                newState[i] = !newState[i];
                if(i > 9) {
                    delete newState[i]
                }
            }
        } else if(type === 1) {
            // 大
            for(let i=5; i<length; i++) {
                newState[i] = !newState[i];
                if(i > 9) {
                    delete newState[i]
                }
            }
        } else if(type === 2) {
            // 小
            for(let i=0; i<length/2; i++) {
                newState[i] = !newState[i];
                if(i > 9) {
                    delete newState[i]
                }
            }
        } else if(type === 3) {
            // 奇
            for(let i=0; i<length; i++) {
                if(i%2 !== 0) {
                    newState[i] = !newState[i];
                    if(i > 9) {
                        delete newState[i]
                    }
                }
            }
        } else if(type === 4) {
            // 偶
            for(let i=0; i<length; i++) {
                if(i%2 === 0) {
                    newState[i] = !newState[i];
                    if(i > 9) {
                        delete newState[i]
                    }
                }
            }
        }

        this.state.numList[row] = newState
        this.setState(this.state.numList);
    }

    updateTableList() {
        let list = this.state.tableList;
        let mode = this.state.mode * 1000;
        let beishu = this.state.beishu;
        let total_money = 0;
        for (let i = 0; i < list.length; i++) {
            let money = list[i]['zhushu'] * mode * beishu * 2 / 1000
            list[i]['money'] = money;
            total_money += money * 1000;
        }

        this.setState({tableList: list, total_money: total_money / 1000});
    }
    beishuChange(e) {
        let val = Number(e.target.value);
        val = val < 1 ? 1 : val;
        this.setState({ "beishu" :  val}, () => {
            this.updateTableList();
        });
    }

    modeChange(mode) {
        mode = Number(mode);
        this.setState({ "mode" : mode}, () => {
            this.updateTableList();
        });
    }

    clearNum() {
        this.btnFilter(5, 0)
        this.btnFilter(5, 1)
        this.btnFilter(5, 2)
        this.btnFilter(5, 3)
        this.btnFilter(5, 4)
    }

    addNumber(listData) {
        if(!listData.zhushu) {
            message.warning('所投注数不正确，无法投注');
            return false;
        }

        this.clearNum()
        this.setState({"total_zhushu": this.state.total_zhushu + listData.zhushu})
        this.setState({"total_money": this.state.total_money + listData.money})
        this.setState({"tableList": [...this.state.tableList, listData]})
    }

    clearCart() {
        this.setState({"tableList": []});
        this.setState({"total_zhushu": 0});
        this.setState({"total_money": 0});
        setTimeout(() => {
            this.setState({"showcart": false})
        }, 1000);
    }

    tabClick(tab) {
        this.clearNum();
        this.setState({tabActive: tab});
    }
    subTabClick(md) {
        this.setState({subTabActive: md.index, md: md});

        let prize = md["prize"]["1"];
        const getPrecision = (n) => {
            let decimal = (n + "").split('.')[1];
            return decimal ? decimal.length : 0;
        }
        let maxCombPrize = prize / this.state.prizeRate;
        let precision = getPrecision(maxCombPrize);
        precision = precision > 4 ? 4 : precision;
        maxCombPrize = maxCombPrize.toFixed(precision) * 1;

        this.setState({maxCombPrize: maxCombPrize}, () => { this.sliderOnChange(this.state.minRebateGaps.to) })
        this.setState({'showTab': false});

        this.clearNum()
    }

    sliderOnChange(value) {
        let sliderValue = Math.round(this.state.minRebateGaps.to * 10000 - value * 10000) / 10000;
        let gamePrize = this.state.gamePrize;
        gamePrize = this.state.maxCombPrize * (this.state.prizeRate * 1 + value * 1);
        gamePrize = parseInt(gamePrize * 10000 + "") / 10000;
        this.setState({sliderValue: sliderValue, gamePrize: gamePrize});
    }

    // 开始追号
    startTrace() {
        let mids = [];
        const tableList = this.state.tableList;
        tableList.forEach((t) => {
            mids.push(t.mid);
        });
        Api('c=game&a=play', {
            op: 'getTracePage',
            lotteryId: this.state.lottery_id,
            mids: mids.join(','),
        }, (res) => {
            if (!this._isMounted) {
                return false;
            }
            if(res.data) {
                this.setState({
                    traceIssues: res.data.issues,
                    traceList: [{
                        checked: true,
                        issue: res.data.issues[0],
                        beishu: 1,
                        money: this.state.total_money,
                        amount: this.state.total_money,
                    }]
                }, () => {
                  this.setState({showTrace: true});
                });
            }
        });
    }
    cancelTrace() {
        this.setState({
            showTrace: false,
            traceBeishu: 1,
            traceQishu: 1,
            traceStart: 0,
            traceList: []
        });
    }
    stopOnWinChange(e) {
        this.setState({stopOnWin: e.target.checked ? 1 : 2});
    }
    traceBeishuChange(e) {
        const beishu = Number(e.target.value || 1);
        const traceList = this.state.traceList;
        const baseMoney = this.state.total_money;

        traceList.forEach((t, i) => {
            this.state.traceList[i]['beishu'] = beishu;
            this.state.traceList[i]['money'] = baseMoney * beishu;
            this.state.traceList[i]['amount'] = baseMoney * beishu * (i + 1);
        });

        this.setState({traceBeishu: beishu});
    }
    traceQishuChange(e) {
        const qishu = Number(e.target.value || 1);
        const issues = this.state.traceIssues;
        const traceStart = Number(this.state.traceStart);
        const baseMoney = this.state.total_money;
        const beishu = this.state.traceBeishu;
        let list = [];
        let flag = 0;

        for (let i = traceStart; i < qishu + traceStart; i++) {
            if(issues[i] === undefined) {
                break;
            }
            list.push({
                checked: true,
                issue: issues[i],
                beishu: beishu,
                money: baseMoney * beishu,
                amount: baseMoney * beishu * (flag + 1),
            });
            flag++;
        }
        this.setState({traceQishu: qishu > list.length ? list.length : qishu, traceList: list});
    }
    traceStartChange(val) {
        this.setState({traceStart: val}, () => {
            this.traceQishuChange({
                target: {value: this.state.traceQishu}
            });
        });
    }
    traceSelectChange(i) {
        this.state.traceList[i]['checked'] = !this.state.traceList[i]['checked'];
        this.traceListUpdate();
    }
    traceSelectAllChange() {
        const list = this.state.traceList;
        const checked = !this.state.traceAllChecked;
        list.forEach((l) => {
            l['checked'] = checked;
        });
        this.setState({traceAllChecked: checked}, () => {
            this.traceListUpdate();
        });
    }
    traceSingleBeishuChange(i, evt) {
        this.state.traceList[i]['beishu'] = evt.target.value || 1;
        this.traceListUpdate();
    }
    traceListUpdate() {
        const list = this.state.traceList;
        const baseMoney = this.state.total_money;
        let sum = 0;
        list.forEach((l, i) => {
            if(l['checked']) {
                sum += Number(l['beishu']);
                l['money'] = l['beishu'] * baseMoney;
                l['amount'] = sum * baseMoney;
            } else {
                l['money'] = 0;
                l['amount'] = 0;
            }
        });
    }
    traceSubmit() {
        let data = this.state.tableList;
        let traceList = this.state.traceList;

        this.setState({showTrace: false, showcart: false});

        const getRandChar = (len) => {
            len = len || 36;
            const timestamp = new Date().getTime();
            const x = "0123456789qwertyuiopasdfghjklzxcvbnm";
            let random = '';
            for (let i = 0; i < len; i++) {
                random += x.charAt(Math.floor(Math.random() * x.length));
            }

            return timestamp + random;
        }

        let postObj = {
            op: 'buy',
            lotteryId: this.state.lottery_id,
            issue: this.state.issue,
            curRebate: 0,
            codes: this.state.md['method_id'] + ':' + data[0]['content'],
            modes: this.state.mode,
            stopOnWin: this.state.stopOnWin,
            token: getRandChar(32)
        };

        for (let i = 0; i < traceList.length; i++) {
            let t = traceList[i];
            if(t.checked) {
                postObj['traceData[' + i + '][issue]'] = t.issue;
                postObj['traceData[' + i + '][multiple]'] = t.beishu;
            }
        }

        Api('c=game&a=play', postObj, (res) => {
            if(res.errno === 0) {
                message.success('购买成功', 2);
                this.setState({
                    ...this.state,
                    tableList: [],
                    traceList: [],
                    total_zhushu: 0,
                    total_money: 0,
                    showcart: false
                })
            } else {
                message.errstr(res.msg);
            }
        });
    }

	render() {
        const game = new GameSSC(this.state);
        let rebate = this.state.minRebateGaps;
        let md = this.state.md;
        let zhushu = 0;

        if(!md) {
            return null
        }


        let content;
        if(md.name === 'WXDW' || md.name === 'SSC-LMDXDS') {
            content = [game.fetchList(0).join(''), game.fetchList(1).join(''), game.fetchList(2).join(''), game.fetchList(3).join(''), game.fetchList(4).join('')]
        } else if(md.cname.indexOf("和值") !== -1) {
            content = [game.fetchList(0).join('_')]
        } else {
            content = this.getContent(game.fetchList(0), game.fetchList(1), game.fetchList(2), game.fetchList(3), game.fetchList(4))
        }

        if(content.length === md.field_def.length) {
            zhushu = game.isLegalCode(content, md.name)['singleNum']
        }


        let listData = {
            'title': md.cname,
            'content': content,
            'zhushu': zhushu,
            'money': zhushu * this.state.mode * 2,
            'mode': this.state.mode,
            'mid': md.method_id
        }
        let lNum = this.state.last_number;
        const formatTime = (t) => {
            let sec_num = parseInt(t, 10);
            let hours   = Math.floor(sec_num / 3600);
            let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            let seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
        };

		return (
            <div>
                {this.state.showTrace ?
                    <div className="navbar">
                        <a className="fl" href="javascript:;" onClick={this.cancelTrace}><i className="arrow-left"></i></a>
                        <span className="title">追号设置</span>
                    </div>
                : this.state.showcart ?
                    <div className="navbar">
                        <a className="fl" href="javascript:;" onClick={this.keepPlaying}><i className="arrow-left"></i></a>
                        <span className="title">{md['cname']} <i className="anticon anticon-caret-down"></i></span>
                    </div>
                : <Navbar back="hall" title={md['cname']} navBarClick={this.navBarClick} />}
                <div className="lottery" style={{
                    display: this.state.showcart ? 'none' : 'block'
                }}>
                    <div className="lt-info">
                        <div className="col-left">
                            <span>重庆时时彩</span>
                            开奖时间: {this.state.opentime}
                        </div>
                        <div className="col-middle">
                            <span>第{this.state.issue}期</span>
                            <button onClick={this.gameKeyChange.bind(this, 'x')} className={this.state.game_key === 'x' ? 'active' : ''}>信用</button>
                            <button onClick={this.gameKeyChange.bind(this, 'g')} className={this.state.game_key === 'g' ? 'active' : ''}>官方</button>
                        </div>
                        <div className="col-right">
                            <span>距离下次开奖</span>
                            <span className="time">{formatTime(this.state.seconds)}</span>
                        </div>
                    </div>
                    <div className="last-open">
                        <span>上期开奖号码</span>
                        {this.state.ltStop ? <div className="lt-stop">休市中...</div> :
                        <div className="codes">
                            <i>{lNum[0]}</i>
                            <i>{lNum[1]}</i>
                            <i>{lNum[2]}</i>
                            <i>{lNum[3]}</i>
                            <i>{lNum[4]}</i>
                        </div>}

                    </div>

                    {this.state.showTab ? <MethodTab
                        methods={this.state.methods}
                        tabClick={this.tabClick}
                        tabActive={this.state.tabActive}
                        subTabClick={this.subTabClick}
                        subTabActive={this.state.subTabActive} /> : null}

                    <NumRender
                        md={md}
                        ballClick={this.ballClick}
                        btnFilter={this.btnFilter}
                        numList={this.state.numList}
                        gamePrize={this.state.gamePrize} />

                    <div className="touzhu">
                        { rebate !== null && this.state.game_key === 'g' ?
                        <div className={this.state.showSlider ? "slider-wrap show" : "slider-wrap"}>
                            <Slider defaultValue={rebate.to * 1} min={rebate.from * 1} max={rebate.to * 1} step={rebate.gap * 1} onChange={this.sliderOnChange} />
                            <span>{(this.state.sliderValue * 100).toFixed(1)}%</span>
                        </div> : null}
                        <button onClick={this.clearNum.bind(this)}>清空</button>
                        <button>机选5注</button>
                        { this.state.game_key === 'g' ?
                        <button onClick={() => {this.setState({showSlider: !this.state.showSlider})}}>赔率/返点</button>
                        : <input type="number" placeholder="输入金额" ref="inputMoney" />}
                        <button className="active" onClick={this.confirm_touzhu.bind(this, listData)}>下注<span ref="nums"> 共{zhushu}注</span></button>
                    </div>
            	</div>
                {this.state.showcart ? <TouzhuCart
                    loading={this.state.loading}
                    tableList={this.state.tableList}
                    beishu={this.state.beishu}
                    beishuChange={this.beishuChange}
                    modeChange={this.modeChange}
                    startTrace={this.startTrace}
                    total_zhushu={this.state.total_zhushu}
                    total_money={this.state.total_money}
                    clearCart = {this.clearCart}
                    submitbuy={this.submitbuy} />
                : null}

                {this.state.showTrace ? <Trace
                    zhushu={this.state.total_zhushu}
                    baseMoney={this.state.total_money}
                    traceIssues={this.state.traceIssues}
                    traceBeishu={this.state.traceBeishu}
                    traceQishu={this.state.traceQishu}
                    stopOnWinChange={this.stopOnWinChange}
                    traceBeishuChange={this.traceBeishuChange}
                    traceQishuChange={this.traceQishuChange}
                    traceStartChange={this.traceStartChange}
                    traceSelectChange={this.traceSelectChange}
                    traceSelectAllChange={this.traceSelectAllChange}
                    traceAllChecked={this.state.traceAllChecked}
                    traceSingleBeishuChange={this.traceSingleBeishuChange}
                    traceList={this.state.traceList}
                    traceSubmit={this.traceSubmit} />
                : null}
            </div>
		)
	}
}


class Trace extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        const issues = this.props.traceIssues;
        let elIssues = issues.map((issue, i) => {
            return (
                <Option key={i} value={String(i)}>{issue}</Option>
            );
        });

        return (
            <div className="lt-trace">
                <div className="trace-filter">
                    <div className="row">
                        倍数：<input type="number" value={this.props.traceBeishu} onChange={this.props.traceBeishuChange.bind(this)} />
                        期数：<input type="number" value={this.props.traceQishu} onChange={this.props.traceQishuChange.bind(this)} />
                        <Checkbox onChange={this.props.stopOnWinChange.bind(this)}>中奖即停：</Checkbox>
                    </div>
                    <div className="row">起始：
                        <Select defaultValue={issues[0]} onChange={this.props.traceStartChange.bind(this)}>
                            {elIssues}
                        </Select>   
                    </div>
                </div>
                <div className="trace-issues">
                    <dl>
                        <dt><span className={this.props.traceAllChecked ? '' : 'unselect'} onClick={this.props.traceSelectAllChange.bind(this)}><i>&#10003;</i>期号</span><span>倍数</span><span>当前投入</span><span>累计投入</span></dt>
                        {this.props.traceList.map((t, i) => {
                            return (
                                <dd key={i} className={t.checked ? '' : 'unselect'}>
                                    <span onClick={this.props.traceSelectChange.bind(this, i)}><i>&#10003;</i>{t.issue}</span>
                                    <span><input type="number" value={t.beishu} onChange={this.props.traceSingleBeishuChange.bind(this, i)} /></span>
                                    <span><em>{t.money.toFixed(1)}</em></span>
                                    <span><em>{t.amount.toFixed(1)}</em></span>
                                </dd>
                            );
                        })}
                    </dl>
                    <p>包含当前期最多追加 {issues.length} 期</p>
                </div>
                <div className="trace-amount">
                    单倍注数：{this.props.zhushu}注<br/>
                    购买：{this.props.traceList.length}期<br/>
                    合计：{this.props.traceList[this.props.traceList.length-1]['amount'].toFixed(1)}元
                </div>
                <button onClick={this.props.traceSubmit.bind(this)}>确认追号</button>
            </div>
        );
    }
}

class TouzhuCart extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const mapMode = ['元', '角', '分', '厘'];
        return (
            <div className="lotto-cart">
                <Spin tip="正在加载，请稍候..." spinning={this.props.loading}>
                    <ul className="tzlist">
                        <li><span>玩法</span><span>号码</span><span>注数</span><span>倍数/元</span></li>
                        {this.props.tableList.map((list, index) =>
                        <li key={index}>
                            <span>{list.title}</span>
                            <span>{list.content}</span>
                            <span>{list.zhushu}</span>
                            <span>{list.money}</span>
                        </li>
                        )}
                    </ul>
                    <div className="beishu-wrap">
                        <div className="beishu">倍数：<input type="number" onChange={this.props.beishuChange.bind(this)} value={this.props.beishu} /></div>
                        <button onClick={this.props.startTrace.bind(this)}>追号</button>
                        <button onClick={this.props.clearCart.bind(this)}>清空</button>
                    </div>
                    <div className="modes-wrap">
                        <button onClick={() => {this.props.modeChange(1)}}>2元</button>
                        <button onClick={() => {this.props.modeChange(0.1)}}>2角</button>
                        <button onClick={() => {this.props.modeChange(0.01)}}>2分</button>
                    </div>
                    <p>注数：<span ref="nums">{this.props.total_zhushu}注</span></p>
                    <p>总计：<span ref="money">{this.props.total_money}元</span></p>
                    <p>最高盈利：<span ref="profit">{this.props.max_profit}元</span></p>
                    <p>余额：<span ref="balance">{this.props.balance}元</span></p>

                    <div className="row-cart">
                        <button onClick={this.props.submitbuy.bind(this)}>确认投注</button>
                    </div>
                </Spin>
            </div>
        )
    }
}

class MethodTab extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const methods = this.props.methods;
        const tabActive = this.props.tabActive;
        const subTabActive = this.props.subTabActive;
        const typeMap = ['无属性', '直选', '组选', '趣味', '特殊', '定位', '不定位', '任二', '任三', '任四'];
        let tabList = null;
        let subTabList = null;
        let subTabData = [];
        if(methods.length > 0) {
            tabList = methods.map((t, i) => {
                return <li key={i} className={tabActive === i ? 'cur' : ''} onClick={this.props.tabClick.bind(this, i)}>{ t['mg_name'] }</li>
            });

            let _method = methods[tabActive]['childs'];

            for (var i = 0; i < _method.length; i++) {
                _method[i]['index'] = i;
                let _p = _method[i]['method_property'];
                if(subTabData[_p] === undefined) {
                    subTabData[_p] = {name: typeMap[_p], md: [_method[i]]}
                } else {
                    subTabData[_p]['md'].push(_method[i])
                }
            }
            subTabList = subTabData.map((t, i) => {
                if(!t) {
                    return null;
                }
                return (
                    <div key={i} className="sub-row">
                        <span>{t.name}</span>
                        {t.md.map((st, j) => {
                            return (
                                <a key={j} href="javascript:void(0)" onClick={this.props.subTabClick.bind(this, st)}>{st.cname}</a>
                            )
                        })}
                    </div>
                )
            })
        } else {
            return null;
        }
        return (
            <div className="tabOverlay">
                <div className="tabWrap">
                    <div className="lt-tab">
                        <ul>{ tabList }</ul>
                    </div>
                    <div className="sub-tab">
                        { subTabList }
                    </div>
                </div>
            </div>
        )
    }
}


class NumRender extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const numRows = this.props.md.field_def;
        const btns = ['全', '大', '小', '单', '双', '清'];
        let rows = numRows.map((row, i) => {
            let nums = row.nums.split(' ');
            return (
                <div className="num-row" key={i}>
                    <div className="tit">{row.prompt}<span>赔率：{this.props.gamePrize}</span></div>
                    {row.has_filter_btn === '1' ? <div className="btns">
                        {btns.map((btn, k) => {
                            return (
                                <button key={k} onClick={this.props.btnFilter.bind(this, k, i)}>{btn}</button>
                            );
                        })}
                    </div> : null}
                    <ul>
                        { nums.map((num, j) => {
                            return (
                                <li key={j}><i onClick={this.props.ballClick.bind(this, i, num)} className={this.props.numList[i][num] ? 'active' : ''}>{num}</i></li>
                            );
                        }) }
                    </ul>
                </div>
            );
        })
        return (
            <div className="num-wrap">
                { rows }
            </div>
        )
    }
}
